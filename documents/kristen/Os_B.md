\*\*40 Questions | 100 points

**★** Choose the ONE best answer. (2.5 pts) **★★** One or more answers may be correct. Select all that apply. (2.5 pts total)

---

## Part 1 — History

**Q1. ★** In the 1950s, two programs ran one after the other on the same machine. What stopped one program from reading the other's data?

- A) Nothing — there was no protection between programs at all
- B) The human operator removed each program from memory before the next ran
- C) Programs were each given separate physical sections of the machine
- D) Programs were not allowed to store data in memory at all

---

**Q2. ★** In batch processing, jobs were run one by one by a human operator. What was the main problem for users?

- A) Users had to wait hours or days to see their program results
- B) Programs could not be saved and had to be resubmitted every day
- C) The operator could only run programs written by the same company
- D) Only programs shorter than one punch card could be submitted

---

**Q3. ★★** Which statements about multiprogramming are correct?

- A) Each program in memory gets its own dedicated CPU permanently
- B) Programs run faster because they can share each other's variables
- C) When one program waits for I/O, another program can use the CPU
- D) Keeping several programs in memory reduces wasted CPU idle time

---

**Q4. ★** Linux became popular in the 1990s mainly because it was:

- A) faster than all other operating systems available at the time
- B) developed by a large company with strong legal protection
- C) free, open source, and built on proven UNIX design principles
- D) the only OS that could run on the new personal computers

---

## Part 2 — OS Responsibilities

**Q5. ★** `counter = 10`. Thread A loads 10. Before A stores, Thread B also loads 10. Both add 1. Both store. What is the final value of `counter`?

- A) 12 — both threads each added 1 successfully to the value
- B) 11 — one increment was lost because both threads read the same value
- C) 10 — the two stores overwrote each other and cancelled out
- D) 20 — each thread doubled the value before storing its result

---

**Q6. ★** Which is an example of a scheduling **policy**, not a mechanism?

- A) Saving all CPU registers into the process control block
- B) Switching the CPU from user mode to kernel mode on a trap
- C) Jumping to the OS interrupt handler when the timer fires
- D) Running the process that has been waiting the longest first

---

**Q7. ★★** Which are main OS responsibilities?

- A) Virtualization, making physical resources appear as many virtual ones
- B) Compilation, turning source code into executable binary files
- C) Persistence, keeping data safe even when power is lost
- D) Defragmentation, reorganizing disk files to improve read speed

---

**Q8. ★** A database writes records to disk. The computer crashes halfway through. On restart, some records are missing. Which OS responsibility failed?

- A) Concurrency — two threads wrote to the database at the same time
- B) Resource Management — the CPU was not shared correctly between tasks
- C) Persistence — the write was not completed and made safe on disk
- D) Virtualization — memory addresses were mapped to the wrong location

---

## Part 3 — Virtualization

**Q9. ★** Program X stores a value at virtual address `0x2000`. Program Y also has a variable at virtual address `0x2000`. Program X changes its value. What happens to Program Y's variable?

- A) Y still holds its original value — each address maps to a different physical location
- B) Y also changes — both programs share the same physical memory cell
- C) An error occurs — two programs cannot use the same virtual address
- D) Y is set to zero — the OS protects Y by zeroing the shared cell

---

**Q10. ★** What is the correct term for giving each process a small slice of CPU time, switching quickly between them?

- A) Space sharing
- B) Batch processing
- C) Time sharing
- D) Multiprogramming

---

**Q11. ★★** Which statements about kernel mode and user mode are correct?

- A) In kernel mode, the OS can access any memory or hardware device
- B) In user mode, programs must use system calls to request OS services
- C) In kernel mode, the OS executes with the same limits as user mode
- D) In user mode, programs run faster because fewer checks are performed

---

**Q12. ★** Why does the OS run in kernel mode while user programs run in user mode?

- A) Kernel mode makes the OS code execute at a faster clock speed
- B) User mode prevents programs from directly accessing hardware or other programs' memory
- C) Kernel mode allows the OS to use more RAM than user programs can
- D) User mode programs cannot create new processes without switching modes

---

## Part 4 — The Process

**Q13. ★** What is the difference between a **program** and a **process**?

- A) A program is temporary; a process is stored permanently on disk
- B) A program runs in kernel mode; a process runs only in user mode
- C) A program uses memory; a process is a file waiting to be loaded
- D) A program is a file on disk; a process is that program actively running

---

**Q14. ★** You run the same Python script 4 times at the same time. How many programs and processes are there?

- A) 1 program and 4 processes
- B) 4 programs and 4 processes
- C) 4 programs and 1 process
- D) 1 program and 1 process

---

**Q15. ★** A process has `int counter = 0;` declared at the top of the file, outside any function. Where is this stored in the address space?

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

- A) Stack — it is used inside function calls at runtime
- B) Heap — it can grow and shrink while the program runs
- C) Static Data — it is a global variable with a fixed location
- D) Code — it is part of the compiled binary instructions

---

**Q16. ★** Why does P0 change from READY to RUNNING at time 5?

```
Time | P0        | P1
  1  | READY     | RUNNING
  2  | READY     | RUNNING
  3  | READY     | RUNNING   ← P1 sends data over the network
  4  | READY     | BLOCKED
  5  | RUNNING   | BLOCKED
```

- A) P0 has a higher scheduling priority than P1 in this system
- B) A timer fired at time 4 and the OS randomly selected P0
- C) P0 requested more memory and was rewarded with CPU time
- D) P1 is waiting for network I/O, so the OS runs P0 instead

---

**Q17. ★★** Which items are stored in the Process Control Block (PCB)?

- A) The process ID (PID) and the ID of its parent process
- B) The complete program binary loaded from disk at startup
- C) A log of every system call the process has made so far
- D) Information about which files and devices the process has open

---

## Part 5 — Process API

**Q18. ★★** Which outputs are possible when this code runs? (fork() succeeds)

```cpp
int rc = fork();
if (rc == 0) {
    std::cout << "hello" << std::endl;
} else {
    std::cout << "world" << std::endl;
}
```

- A) only "hello" — the parent process exits right after fork()
- B) only "world" — the child process never reaches the output line
- C) "hello" then "world"
- D) "world" then "hello"

---

**Q19. ★** A child process was just created by fork(). What value does the **child** receive as the return value of fork()?

- A) 0 — the child always receives zero from fork()
- B) Its own PID — so it knows its own process identity
- C) The parent's PID — so it knows who created it
- D) -1 — the value that signals success in UNIX system calls

---

## Part 6 — Context Switching

**Q20. ★** What is the main weakness of cooperative scheduling?

- A) It switches between programs too often, causing too much overhead
- B) It requires a hardware timer that not all computers support
- C) A program that never calls a system call can run forever, blocking others
- D) Programs must be written in a special way to give up the CPU

---

**Q21. ★** A timer fires while Process A is running. Which sequence is correct?

```
1: CPU switches to kernel mode and jumps to the interrupt handler
2: OS saves A's kernel registers into A's process structure
3: Timer interrupt fires while A is running
4: OS loads B's registers from B's process structure and jumps to B
5: Hardware saves A's user-level registers onto the kernel stack
```

- A) 3 → 1 → 5 → 2 → 4
- B) 3 → 5 → 1 → 2 → 4
- C) 3 → 2 → 1 → 5 → 4
- D) 5 → 3 → 1 → 2 → 4

---

**Q22. ★** When a timer interrupt fires, the hardware saves the current process's registers. Where are they saved?

- A) Into the process control block (PCB) in main memory
- B) Into a special register file inside the CPU core
- C) Into the kernel stack for the current process
- D) Into a region of the user process's own stack memory

---

**Q23. ★★** Which are hidden costs of a context switch?

- A) The process must be recompiled before it can run again
- B) Memory used by the old process must be freed immediately
- C) The CPU pipeline is flushed, wasting partially processed instructions
- D) The CPU cache holds data from the old process, causing misses for the new one

---

**Q24. ★★** Why must only the OS kernel be allowed to control the hardware timer?

- A) Timer hardware requires kernel-level assembly code to program correctly
- B) Two programs sharing timer access would cause the timer to lose accuracy
- C) A program that stops the timer could take over the CPU and never be interrupted
- D) The timer is the only mechanism the OS has to forcibly regain control of the CPU

---

## Part 7 — Scheduling

**Q25. ★** Response time is defined as:

- A) T_completion − T_arrival
- B) T_firstrun − T_arrival
- C) T_completion − T_firstrun
- D) T_arrival − T_firstrun

---

**Q26. ★** [Calculation] Three jobs arrive at time 0: A=20s, B=20s, C=20s. FIFO: A→B→C. Average turnaround time?

- A) 20s
- B) 30s
- C) 60s
- D) 40s

---

**Q27. ★** [Calculation] Three jobs arrive at time 0: A=90s, B=5s, C=5s. FIFO: A→B→C. Average turnaround time?

- A) 40s
- B) 95s
- C) 70s
- D) 100s

---

**Q28. ★** [Calculation] Three jobs arrive at time 0: A=8s, B=3s, C=12s. SJF (shortest first). What is the **response time** for job A?

- A) 3s
- B) 8s
- C) 0s
- D) 11s

---

**Q29. ★** [Calculation] Round Robin, time slice = 2s, 5 jobs all arriving at time 0. Worst-case response time?

- A) 2s
- B) 4s
- C) 10s
- D) 8s

---

**Q30. ★** A student says: "SJF is the best scheduler so we should always use it." What is wrong with this?

- A) SJF requires too much memory to keep all jobs sorted by length
- B) SJF can only handle a maximum of 10 jobs at once
- C) The OS has no way of knowing in advance how long each job will run
- D) SJF only works correctly on computers with multiple CPU cores

---

**Q31. ★★** Which statements about Round Robin are correct?

- A) Round Robin gives each job a fast first turn, improving response time
- B) Round Robin gives very low average turnaround time for most workloads
- C) Round Robin shares the CPU fairly by giving each job a fixed time slice
- D) Round Robin must know each job's total run time before it can start

---

## Part 8 — Multi-Level Feedback Queue

**Q32. ★** A job uses 8ms of CPU, then does I/O. Allotment per level = 20ms. After I/O, what is its priority?

- A) Reduced — the job used some CPU time, even under the allotment
- B) Moved to lowest — all jobs that do I/O are moved to the bottom
- C) Reset to top — finishing I/O always triggers a full priority reset
- D) Unchanged — the job has not used up its full 20ms allotment yet

---

**Q33. ★** A CPU-bound job enters MLFQ. Q2 (high) → Q1 → Q0 (low). Allotment = 15ms. No I/O. After 45ms, which queue?

- A) Q0 — demoted twice: Q2→Q1, then Q1→Q0
- B) Q1 — demoted once after using Q2's allotment
- C) Q1 — reaching Q0 requires more than 30ms of CPU use
- D) Q2 — using the CPU alone does not change a job's priority

---

**Q34. ★** If MLFQ never uses priority boost, what happens to a CPU-bound job at Q0?

- A) It gets moved to a higher queue after it has waited long enough
- B) It keeps running but slower, since Q0 receives less CPU power
- C) It may never run again if interactive jobs keep arriving at Q2
- D) It receives CPU time each time a new job arrives to the system

---

**Q35. ★** Two jobs are both in Q1. Neither has a higher priority than the other. How does MLFQ decide which one runs?

- A) The one that arrived in the system first gets the CPU
- B) The one that has used less total CPU time so far gets the CPU
- C) They take turns using the CPU with a fixed time slice
- D) The one with the lower process ID number gets the CPU

---

**Q36. ★★** Which statements about MLFQ are correct?

- A) Jobs that do frequent I/O tend to stay at higher priority queues
- B) All jobs always stay in the same queue for their entire time in the system
- C) A periodic priority boost prevents long-running jobs from being starved
- D) New jobs always enter at the lowest priority queue to wait their turn

---

**Q37. ★** A job at Q2 uses 9ms of CPU, then does I/O. Allotment per level = 15ms. When it returns from I/O, how much allotment remains at Q2?

- A) 6ms — the OS tracks total CPU used, even across I/O
- B) 15ms — the allotment fully resets after every I/O call
- C) 9ms — previous CPU usage is forgotten when I/O starts
- D) 0ms — any I/O call uses up all remaining allotment

---

**Q38. ★** A new job arrives in MLFQ. It turns out to be very long and CPU-bound. What will MLFQ do with it over time?

- A) Keep it at the top queue so other jobs can plan around it
- B) Gradually demote it to lower queues as it uses up each level's allotment
- C) Move it immediately to the bottom queue since long jobs are not allowed at top
- D) Terminate it after a fixed time since long jobs are not allowed in MLFQ

---

**Q39. ★** Job X runs 1ms then does I/O, repeatedly. Job Y runs non-stop for a long time. After many rounds, where is each job in MLFQ?

- A) Both at Q0 — all jobs eventually sink to the bottom queue
- B) X at Q2, Y at Q0 — X never uses its full allotment, Y gets demoted
- C) Both at Q2 — priority boost keeps resetting everyone to the top
- D) X at Q0, Y at Q2 — I/O jobs are penalized and CPU jobs are rewarded

---

**Q40. ★★** MLFQ tries to achieve two goals at once. Which are they?

- A) Good response time for interactive jobs that do frequent I/O
- B) Give all jobs exactly equal CPU time over any time period
- C) Maximize the total number of processes that can run at once
- D) Good turnaround time by running shorter jobs before longer ones

---

_End of Exam — Good luck!_

---

---

# Instructor Answer Key — Version B

| Q   | ★/★★ | Answer(s) | Concept                                                                       |
| --- | ---- | --------- | ----------------------------------------------------------------------------- |
| 1   | ★    | A Or B    | No protection in early OS                                                     |
| 2   | ★    | A         | Batch processing: long wait times                                             |
| 3   | ★★   | C, D      | Multiprogramming: I/O overlap + less idle CPU                                 |
| 4   | ★    | C         | Linux: free, open source, UNIX-based                                          |
| 5   | ★    | B         | Race condition: specific interleaving → 11                                    |
| 6   | ★    | D         | Policy = what decision, not how                                               |
| 7   | ★★   | A, C      | OS responsibilities: Virtualization + Persistence                             |
| 8   | ★    | C         | Persistence: crash during write                                               |
| 9   | ★    | A         | Virtual addresses map to different physical locations                         |
| 10  | ★    | C         | Time sharing: fast switching between processes                                |
| 11  | ★★   | A, B      | Kernel: full access; User: system calls required                              |
| 12  | ★    | B         | User mode: protection from direct hardware access                             |
| 13  | ★    | D         | Program = disk file; Process = running in memory                              |
| 14  | ★    | A         | 1 program file → 4 process instances                                          |
| 15  | ★    | C         | Global variable → Static Data section                                         |
| 16  | ★    | D         | P1 blocked on network I/O → OS runs P0                                        |
| 17  | ★★   | A, D      | PCB: PID/parent PID + open files/devices                                      |
| 18  | ★★   | C, D      | fork(): both orderings are possible                                           |
| 19  | ★    | A         | fork() return value in child = 0                                              |
| 20  | ★    | C         | Cooperative: infinite loop → frozen until reboot                              |
| 21  | ★    | B         | Timer interrupt order: 3→5→1→2→4                                              |
| 22  | ★    | C         | Hardware saves to kernel stack on interrupt                                   |
| 23  | ★★   | C, D      | Hidden costs: pipeline flush + cache misses                                   |
| 24  | ★★   | C, D      | Timer: stops it = runs forever; only OS takeback mechanism                    |
| 25  | ★    | B         | Response time = T_firstrun − T_arrival                                        |
| 26  | ★    | D         | FIFO equal: (20+40+60)/3 = 40s                                                |
| 27  | ★    | B         | FIFO convoy: (90+95+100)/3 = 95s                                              |
| 28  | ★    | A         | SJF B→A→C: A first runs at t=3 → response = 3s                                |
| 29  | ★    | D         | RR: (5−1) × 2 = 8s                                                            |
| 30  | ★    | C         | SJF impossible: job length unknown in advance                                 |
| 31  | ★★   | A, C      | RR: fast response time + fixed time slices                                    |
| 32  | ★    | D         | I/O job: allotment not exhausted → stays at same level                        |
| 33  | ★    | A         | CPU job: 15ms@Q2→Q1, 15ms@Q1→Q0 → Q0 at 45ms                                  |
| 34  | ★    | C         | No boost → starvation at bottom queue                                         |
| 35  | ★    | c         | Rule 2: same priority queue -> Round Robin                                    |
| 36  | ★★   | A, C      | I/O jobs stay high; boost prevents starvation                                 |
| 37  | ★    | A         | Allotment tracked across I/O: 15−9 = 6ms remains                              |
| 38  | ★    | B         | Long job gradually demoted through queues                                     |
| 39  | ★    | B, or A   | X stays high (never uses full allotment); Y sinks ; or it sinks to the bottom |
| 40  | ★★   | A, D      | MLFQ goals: response time + turnaround time                                   |
