# ADR-0006 — cloudflare-workers-hosting

- **Status**: accepted
- **Date**: 2026-09-26
- **Deciders**: Baptiste Dupuis

## Context

The V0 site is static: the grades live in `src/data/` as JSON, Vite bundles them,
and GitHub Pages serves the result. That arrangement has two consequences we now
want to end.

The first is that the published bundle contains every grade of every student,
downloadable by anyone. Masking the names in the interface (BDD-19) changed what
the screens display, not what the bundle carries.

The second is that a static host cannot talk to a database. The schema, the
migrations and the import built in BDD-29 are unusable in production until
something server-side sits between the browser and PostgreSQL.

So the hosting decision and the "stop shipping the data to the browser" decision
are the same decision, and it has to be taken before the API is written.

Constraints:

- The audience is ~300 students at Chang'an University, in Xi'an. They consult
  their grades a handful of times per semester — on the order of 300 visits per
  month. Whatever we pick has to be reachable from mainland China.
- No budget.
- Three contributors, no operations team, no one on call.
- The grades are real student data. They carry no names — the database schema
  stores none (ADR-0003) — but a grade tied to a student number is still
  personal data.

## Options considered

### Option A — Cloudflare Workers serving the built site, with managed PostgreSQL behind Hyperdrive (chosen)

One Worker serves the static build and answers `/api/*`. Cloudflare has no
PostgreSQL of its own, so the database is managed elsewhere — Neon, in the
Singapore region — and Hyperdrive pools the connections at the edge so that a
Worker does not open a fresh TCP connection per request.

At 300 visits per month the free tiers are not a squeeze: the Workers free plan
allows 100,000 requests per day and serves static assets at no cost, Hyperdrive
is included in it, and Neon's free plan covers 0.5 GB of storage and 100
CU-hours per month against a dataset of roughly 2 MB. Total cost: the domain
renewal, which we already pay.

The deciding argument is empirical rather than theoretical. Cloudflare's free
plan has a reputation for being throttled from mainland China, but we have
already run a Cloudflare-hosted site that was accessible from there without
trouble. A measured precedent beats a reported one.

### Option B — stay on GitHub Pages

Rejected, because it is the problem. A static host cannot reach a database, so
the grades would stay in the bundle and the work of BDD-29 would stay unused.

### Option C — a VPS in Hong Kong or Singapore, Postgres in Docker

Seriously considered: ~5 USD per month, the `docker-compose.yml` of BDD-30
reused as-is, the data on a machine we control, and a plain IP address rather
than Cloudflare's anycast range. It was rejected on operational cost, not on
price: backups, security updates and availability would fall on a teacher
working alone, against a managed platform that does all three. It remains the
fallback if Cloudflare turns out to be degraded from Xi'an.

### Option D — Cloudflare D1

Rejected. D1 is SQLite. It would mean rewriting the six migrations of BDD-29 and
giving up the `grade_audit` trigger, the `JSONB` column holding each exam body,
and the `student_grades_v` view — the three mechanisms that make the database,
rather than the application, responsible for what a student may read.

### Option E — hosting inside mainland China (Alibaba Cloud, Tencent Cloud)

Rejected as unavailable. Serving a domain from mainland China requires an ICP
filing, which requires a registered Chinese entity. A partner university could
in principle sponsor one; that is a matter of months of administrative work, not
a V1 decision.

## Decision

Production runs on Cloudflare Workers: one Worker serves the Vite build as
static assets and handles `/api/*` route by route. PostgreSQL is hosted by Neon
in Singapore and reached through a Hyperdrive binding with the `pg` driver
already used by the migration and import scripts.

`master` stays deployable to GitHub Pages for the whole transition. It is the
rollback: if the students cannot reach Cloudflare, the DNS goes back and the site
that works today works again.

The migration happens in two steps, deliberately separated. First the Worker,
the database and a read endpoint go live while the front end still reads the
bundled JSON — this proves the whole chain without touching the screens. Then
the front end switches to the API (BDD-31), and the JSON files leave the bundle.
Until that second step lands, the grades remain publicly downloadable; the
hosting move alone does not fix that.

## Measured afterwards — 2026-09-26

The decision above was taken on the strength of a Cloudflare-hosted site that had
been reachable from China. It has since been measured from a Chinese network, and
the result corrects one assumption rather than the decision.

- A `*.workers.dev` URL does not load at all. Not slowly: a 44-byte JSON
  response never arrives, so the whole shared domain is unreachable rather than
  throttled.
- The same 1.8 MB bundle served by GitHub Pages does load, slowly. Payload size
  is therefore not the cause.
- The site that worked ran for a year on its own domain, on Cloudflare.

**A custom domain is a requirement, not a convenience.** `workers.dev` is
unusable in production and unusable even for a test: a negative result on it says
nothing about the decision. Any measurement from China has to be taken on a
domain we own.

The site was then deployed on a domain we own, behind the same Worker, and
measured twice from the same Chinese network, hours apart:

| Measured | Good moment | Bad moment | Ratio |
| --- | --- | --- | --- |
| connection + 2 bytes | 348 ms | 1 504 ms | ×4.3 |
| home page, 730 bytes | 477 ms | 2 002 ms | ×4.2 |
| the site bundle, 1.8 MB | 1 860 ms | **21 250 ms** | **×11.4** |

The whole journey works in both: login, course tabs, an exam paper, a project
report. **The decision holds, and this is the measurement BDD-36 asked for.**

The two runs say more together than either does alone. When the network degrades,
everything slows by about four — except the 1.8 MB transfer, which collapses by
eleven. Small responses take the hit proportionally; a large one falls off a
cliff. The API endpoints, a few hundred bytes each, stayed fast during the bad
run.

So the case for serving grades from the API rather than from the bundle is not
an average saved per load. It is the removal of a 21-second worst case that a
student meets on a bad day. Measuring once would have hidden this: the first run
alone suggested the bundle cost about a second, and that reading was wrong.

## Consequences

- **Student data leaves our machines.** ADR-0004 rejected a hosted database for
  local development on exactly this ground. The reasoning that was right for a
  development database does not survive contact with production: there is no
  machine of ours that 300 students in China can reach. Neon in Singapore is the
  compromise, and it is a real one, not a detail — the retention and deletion
  rules (BDD-44) now govern a third party's servers as well as ours.
- Deployment stops being "push to master". It becomes a Wrangler deploy, which
  has to be wired into the CI before anyone deploys from a laptop.
- The DNS for `chu-epita.xyz` moves from its current nameservers to Cloudflare.
  That is the one irreversible-feeling step; it is also the last one.
- `/api/students/:id` will expose one student's grades to anyone who knows the
  student number, which is a predictable eight-digit number. This is strictly
  better than today, where the entire dataset is one download away, and strictly
  worse than an authenticated endpoint. It is acceptable only as an intermediate
  state, and it is what makes BDD-42 (magic-link login) a V2 item we should not
  let slide.
- If the free tiers change, the exposure is bounded: Workers paid is 5 USD per
  month and Neon's paid plan is usage-based with no monthly minimum.

Refs: BDD-36
