# Operating Systems — Exam 1 (3&4)

\*\*40 Questions | 100 points

**★** Choose the ONE best answer. (2.5 pts) **★★** One or more answers may be correct. Select all that apply. (2.5 pts total)

---

## Part 1 — History

**Q1. ★** In the 1950s, the OS was just a library. What was the biggest danger?

- A) Programs ran too slowly with no scheduler
- B) Library functions were incompatible across machines
- C) Any program could read or write any memory
- D) Programs could not share the CPU at all

---

**Q2. ★** In batch processing, an operator ran jobs one by one. What was the main problem?

- A) Programs could not be longer than one punch card
- B) Users had to wait hours or days for results
- C) Only one user account existed per computer
- D) The operator had to check every result manually

---

**Q3. ★★** Which statements about multiprogramming are correct?

- A) The CPU runs another job while one waits for disk
- B) Multiple programs run in parallel inside one CPU core
- C) Programs in memory can read each other's data directly
- D) CPU utilization improves because idle time is reduced

---

**Q4. ★** What was the main design idea of UNIX?

- A) One large program that manages all hardware
- B) Small tools that each do one task well
- C) A graphical window system for all users
- D) Separate code written for each type of machine

---

## Part 2 — OS Responsibilities

**Q5. ★** `counter = 5`. Thread A loads 5. Before A stores, Thread B also loads 5. Both add 1 and store. What is the final value of `counter`?

- A) 6 — one increment was lost in the overlap
- B) 7 — each thread worked on its own separate copy
- C) 5 — the two stores cancelled each other out
- D) 11 — both threads each counted their own addition twice

---

**Q6. ★** Which is an example of a **mechanism**, not a policy?

- A) Saving and restoring CPU registers during a switch
- B) Choosing the job with the shortest remaining time
- C) Running the job that has waited the longest first
- D) Deciding which process gets the CPU next

---

**Q7. ★★** Which are main OS responsibilities?

- A) Compiling source code into binary programs
- B) Safely handling many operations at the same time
- C) Routing network packets between computers
- D) Keeping data safe after the computer loses power

---

**Q8. ★** A file is corrupted after a crash during writing. Which OS responsibility failed?

- A) Resource Management — CPU was not shared fairly
- B) Concurrency — two threads wrote to the same file
- C) Persistence — data was not safely stored on disk
- D) Virtualization — the memory mapping was incorrect

---

## Part 3 — Virtualization

**Q9. ★** Program A and B both use virtual address `0x1000`. Which statement is true?

- A) Both share the same physical memory cell at `0x1000`
- B) The OS copies data between them at each context switch
- C) Each `0x1000` maps to a different physical location
- D) Only one program at a time can use address `0x1000`

---

**Q10. ★** Three programs appear to run at the same time on one CPU. How?

- A) All three run together inside the OS kernel
- B) The CPU speed is split equally among all three
- C) Two run on the CPU; the third waits on disk
- D) The OS switches between them faster than humans notice

---

**Q11. ★★** Which statements about kernel mode and user mode are correct?

- A) In user mode, programs can directly access any hardware
- B) In kernel mode, the OS can access any memory or device
- C) In user mode, programs must use system calls for services
- D) In kernel mode, the OS runs slower due to extra checks

---

**Q12. ★** A user program makes a system call. What happens to the CPU mode?

- A) The CPU switches from user mode to kernel mode
- B) The CPU stays in user mode but runs the call faster
- C) The CPU queues the request and handles it later
- D) The CPU creates a second thread to handle the call

---

## Part 4 — The Process

**Q13. ★** What is a process?

- A) A program file stored on disk, waiting to run
- B) A running program loaded into memory and executing
- C) A hardware interrupt signal sent to the CPU
- D) A kernel thread running on behalf of a user

---

**Q14. ★** Firefox is opened three times. How many programs and processes are there?

- A) 1 program and 3 processes
- B) 3 programs and 3 processes
- C) 3 programs and 1 process
- D) 1 program and 1 process

---

**Q15. ★** A process runs `int* p = new int[100];`. Where is this memory in the address space?

```
HIGH ADDRESS
┌──────────────┐
│    Stack     │
│    (free)    │
│    Heap      │
├──────────────┤
│  Static Data │
├──────────────┤
│     Code     │
└──────────────┘
LOW ADDRESS
```

- A) Code — it is part of the program binary
- B) Stack — it is allocated inside a function call
- C) Static Data — it is a variable used globally
- D) Heap — `new` allocates dynamic memory at runtime

---

**Q16. ★** Why does P1 change from READY to RUNNING at time 4?

```
Time | P0        | P1
  1  | RUNNING   | READY
  2  | RUNNING   | READY
  3  | RUNNING   | READY   ← P0 calls read() from disk
  4  | BLOCKED   | RUNNING
```

- A) P0 finished all its work and exited at time 3
- B) P1 has a higher priority than P0 in this system
- C) P0 is blocked on disk, so the OS runs P1 instead
- D) A timer fired and the OS randomly selected P1

---

**Q17. ★★** Which items are stored in the Process Control Block (PCB)?

- A) The source code of the program before compilation
- B) The saved CPU registers when the process is not running
- C) A list of all users currently logged into the system
- D) The current process state such as READY or RUNNING

---

## Part 5 — Process API

**Q18. ★★** Which outputs are possible when this code runs? (fork() succeeds)

```cpp
int rc = fork();
if (rc == 0) {
    std::cout << "child" << std::endl;
} else {
    std::cout << "parent" << std::endl;
}
```

- A) "child" then "parent"
- B) "parent" then "child"
- C) only "child" — parent exits right after fork()
- D) only "parent" — child never reaches the output line

---

**Q19. ★** A parent calls fork(). The return value in the **parent** is 920. What does 920 represent?

- A) The time in ms that fork() needed to complete
- B) The amount of memory copied to the child process
- C) The process ID assigned to the new child process
- D) The number of total processes running right now

---

## Part 6 — Context Switching

**Q20. ★** Program A runs an infinite loop, never calls a system call. Cooperative scheduling only. What happens?

- A) The OS kills the program after about one second
- B) Program A runs forever — other programs cannot run
- C) A timer fires after 10ms and switches programs
- D) Program A yields the CPU when the loop counter overflows

---

**Q21. ★** A timer fires while Process A runs. Which sequence is correct?

```
P: OS decides to switch to Process B
Q: Timer fires
R: Hardware saves A's registers to kernel stack
S: OS loads B's registers and jumps to B
T: CPU jumps to the OS interrupt handler
```

- A) Q → R → T → P → S
- B) Q → T → R → P → S
- C) R → Q → T → P → S
- D) Q → P → R → T → S

---

**Q22. ★** During a context switch, who performs the second register save (kernel registers → PCB)?

- A) The OS software inside the context switch routine
- B) The hardware automatically when the interrupt fires
- C) The user program by calling a built-in save function
- D) The disk driver while finishing the current I/O job

---

**Q23. ★★** Which are hidden costs of a context switch?

- A) The process must reload its full code from disk
- B) The CPU cache now holds data from the old process
- C) The OS must recompile the program before it resumes
- D) The TLB must be refilled for the new process's addresses

---

**Q24. ★★** Why must only the OS kernel be allowed to control the hardware timer?

- A) Timer circuits require low-level assembly code to operate
- B) A user program that stops the timer could run forever uninterrupted
- C) The timer is the OS's only way to forcibly take back the CPU
- D) Two programs sharing timer control would cause hardware conflicts

---

## Part 7 — Scheduling

**Q25. ★** Turnaround time is:

- A) T_completion − T_arrival
- B) T_firstrun − T_arrival
- C) T_arrival − T_completion
- D) T_completion − T_firstrun

---

**Q26. ★** [Calculation] Three jobs arrive at time 0: A=10s, B=10s, C=10s. FIFO: A→B→C. Average turnaround time?

- A) 10s
- B) 15s
- C) 30s
- D) 20s

---

**Q27. ★** [Calculation] Three jobs arrive at time 0: A=100s, B=10s, C=10s. FIFO: A→B→C. Average turnaround time?

- A) 40s
- B) 110s
- C) 70s
- D) 130s

---

**Q28. ★** [Calculation] Three jobs arrive at time 0: A=10s, B=5s, C=15s. SJF (shortest first). What is the **response time** for job A?

- A) 0s
- B) 5s
- C) 10s
- D) 15s

---

**Q29. ★** [Calculation] Round Robin, time slice = 3s, 4 jobs all arriving at time 0. Worst-case response time?

- A) 3s
- B) 6s
- C) 12s
- D) 9s

---

**Q30. ★** Why can the OS not use SJF for real programs?

- A) SJF uses too much memory to sort all waiting jobs
- B) SJF only works when all jobs arrive at the same time
- C) SJF needs special hardware most computers do not have
- D) The OS cannot know in advance how long each job runs

---

**Q31. ★★** Which statements about Round Robin are correct?

- A) Round Robin gives very low average turnaround time
- B) Round Robin gives each job a fast first turn
- C) Round Robin must know each job's total length first
- D) Round Robin shares the CPU using a fixed time slice

---

## Part 8 — Multi-Level Feedback Queue

**Q32. ★** A job uses 2ms of CPU then does I/O. Allotment per level = 10ms. After I/O, what is its priority?

- A) Reduced — the job used some CPU at this level
- B) Moved to lowest — I/O jobs always go to the bottom
- C) Reset to top — finishing I/O counts as a new arrival
- D) Unchanged — the job did not use its full allotment

---

**Q33. ★** A CPU-bound job enters MLFQ. Q2 (high) → Q1 → Q0 (low). Allotment = 10ms. No I/O. After 30ms, which queue?

- A) Q2 — CPU use alone does not reduce priority
- B) Q1 — only demoted once after using Q2's allotment
- C) Q0 — demoted twice: Q2 → Q1, then Q1 → Q0
- D) Q1 — reaching Q0 requires more than 20ms total

---

**Q34. ★** Without priority boost, which problem occurs?

- A) New jobs always start at the bottom and wait too long
- B) Interactive jobs slowly sink by using too much CPU
- C) The scheduler switches queues too often and wastes time
- D) Long-running jobs at the bottom may never get CPU time

---

**Q35. ★** A long-running job has been sitting in Q0 for a long time. Then a priority boost fires. Where does the job go, and why?

- A) It stays in Q0 — priority boost only affects new jobs entering the system
- B) It moves to Q1 — each boost moves a job up exactly one level
- C) It moves to Q2 — all jobs are reset to the highest queue regardless of history
- D) It is terminated — the OS removes jobs that have been in Q0 too long

---

**Q36. ★★** Which statements about MLFQ are correct?

- A) New jobs enter at the lowest priority queue by default
- B) CPU-heavy jobs slowly move to lower priority queues
- C) A periodic boost moves all jobs back to the top queue
- D) All jobs stay in the same queue their entire run

---

**Q37. ★** A job at Q2 uses 6ms of CPU, then does I/O. Allotment per level = 10ms. When it comes back from I/O, how much allotment remains at Q2?

- A) 10ms — the allotment resets after every I/O call
- B) 4ms — the OS tracks total CPU used, even across I/O
- C) 0ms — doing I/O counts as using the remaining allotment
- D) 6ms — the previous usage is forgotten when I/O starts

---

**Q38. ★** Why does every new job start at the highest priority queue in MLFQ?

- A) New jobs are always more urgent than existing ones
- B) New jobs need more CPU time than jobs already running
- C) The OS assumes the job is short until it proves otherwise
- D) Starting high gives the user a chance to set the priority

---

**Q39. ★** Job A uses 1ms of CPU then does I/O, repeatedly. Job B uses CPU non-stop. After several rounds, which job stays at the highest priority?

- A) B — it uses more total CPU time overall
- B) Both — MLFQ keeps all active jobs at the same level
- C) A — it never uses its full allotment at any level
- D) Neither — both sink to the bottom after enough time

---

**Q40. ★★** MLFQ tries to achieve two goals at once. Which are they?

- A) Give all jobs exactly equal CPU time over any period
- B) Good turnaround time by running shorter jobs first
- C) Good response time for interactive and short jobs
- D) Maximum memory usage across all running processes

---

_End of Exam — Good luck!_

---

---

# Instructor Answer Key

| Q   | ★/★★ | Answer(s) | Concept                                                         |
| --- | ---- | --------- | --------------------------------------------------------------- |
| 1   | ★    | C         | No memory protection in early OS                                |
| 2   | ★    | B         | Batch processing: long wait times                               |
| 3   | ★★   | A, D      | Multiprogramming: I/O overlap + better CPU use                  |
| 4   | ★    | B         | UNIX: small tools connected together                            |
| 5   | ★    | A         | Race condition: interleaving → counter = 6                      |
| 6   | ★    | A         | Context switch = mechanism, not policy                          |
| 7   | ★★   | B, D      | OS responsibilities: Concurrency + Persistence                  |
| 8   | ★    | C         | Persistence: crash during write                                 |
| 9   | ★    | C         | Virtual addresses map to different physical locations           |
| 10  | ★    | D         | Time sharing illusion via fast switching                        |
| 11  | ★★   | B, C      | Kernel: full access; User: system calls required                |
| 12  | ★    | A         | System call: CPU switches to kernel mode                        |
| 13  | ★    | B         | Process = running program in memory                             |
| 14  | ★    | A         | 1 program file → 3 process instances                            |
| 15  | ★    | D         | `new` allocates on the heap                                     |
| 16  | ★    | C         | P0 blocked on I/O → OS runs P1                                  |
| 17  | ★★   | B, D      | PCB: saved registers + current state                            |
| 18  | ★★   | A, B      | fork(): both orderings are possible                             |
| 19  | ★    | C         | fork() return in parent = child's PID                           |
| 20  | ★    | B         | Cooperative + infinite loop → frozen until reboot               |
| 21  | ★    | A         | Timer interrupt order: Q→R→T→P→S                                |
| 22  | ★    | A         | Second save done by OS software                                 |
| 23  | ★★   | B, D      | Hidden costs: cache misses + TLB refill                         |
| 24  | ★★   | B, C      | Timer: stops it = runs forever; only OS mechanism to regain CPU |
| 25  | ★    | A         | Turnaround = T_completion − T_arrival                           |
| 26  | ★    | D         | FIFO equal: (10+20+30)/3 = 20s                                  |
| 27  | ★    | B         | FIFO convoy: (100+110+120)/3 = 110s                             |
| 28  | ★    | B         | SJF: B runs first (5s), A starts at t=5 → response = 5s         |
| 29  | ★    | D         | RR: (4−1) × 3 = 9s                                              |
| 30  | ★    | D         | SJF impossible: job length unknown in advance                   |
| 31  | ★★   | B, D      | RR: fast response time + uses time slices                       |
| 32  | ★    | D         | I/O job kept allotment → stays at same level                    |
| 33  | ★    | C         | CPU job: Q2→Q1→Q0 after 30ms                                    |
| 34  | ★    | D         | No boost → starvation at bottom queue                           |
| 35  | ★    | C         | Rule 5: priority boost moves ALL jobs to top queue              |
| 36  | ★★   | B, C      | CPU-heavy sink down; boost moves all up                         |
| 37  | ★    | B         | Allotment tracked across I/O: 10-6 = 4ms remaining              |
| 38  | ★    | C         | Rule 3: assume short until proven otherwise                     |
| 39  | ★    | C         | Interactive job never uses full allotment → stays high          |
| 40  | ★★   | B, C      | MLFQ goals: turnaround + response time                          |

---
