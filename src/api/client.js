/**
 * The only place the front end talks to the server.
 *
 * It replaces the build-time glob of src/data: the grades are no longer bundled
 * into the JavaScript every visitor downloads, they are fetched per student. A
 * student's own results weigh a few hundred bytes against the ~380 KB of
 * everyone's data that used to ship with the application.
 *
 * Every function throws ApiError on failure. Screens are expected to catch it:
 * unlike a bundled constant, a network call can fail, and a blank screen is not
 * an acceptable answer.
 */

export class ApiError extends Error {
  constructor(message, { status = 0, kind = "network" } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    // "notFound" lets the login screen tell an unknown number apart from an
    // unreachable server, which are two different things to say to a student.
    this.kind = kind;
  }
}

async function get(path, { signal } = {}) {
  let response;
  try {
    response = await fetch(path, { signal, headers: { accept: "application/json" } });
  } catch (cause) {
    if (cause?.name === "AbortError") throw cause;
    throw new ApiError("the server could not be reached", { kind: "network" });
  }

  if (response.status === 404) {
    throw new ApiError("not found", { status: 404, kind: "notFound" });
  }
  if (!response.ok) {
    throw new ApiError(`the server answered ${response.status}`, {
      status: response.status,
      kind: "server",
    });
  }

  try {
    return await response.json();
  } catch {
    // A JSON parse failure here usually means the SPA fallback answered with
    // index.html — an /api path that no route matched.
    throw new ApiError("the server answered something that is not JSON", {
      status: response.status,
      kind: "server",
    });
  }
}

/**
 * Everything a student's dashboard needs: their courses, and for each one the
 * assessments with their grade. Exam bodies and correction reports are left out
 * — they are fetched one at a time, when a screen actually opens one.
 */
export function fetchStudent(studentId, options) {
  return get(`/api/students/${encodeURIComponent(studentId)}`, options);
}

/** One assessment in full: its body for an exam, its report for a project. */
export function fetchAssessment(studentId, assessmentId, options) {
  return get(
    `/api/students/${encodeURIComponent(studentId)}/assessments/${encodeURIComponent(assessmentId)}`,
    options,
  );
}
