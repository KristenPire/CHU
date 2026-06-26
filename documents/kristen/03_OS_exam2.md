# Operating Systems — Exam 2

\*\*40 Questions | 100 points

Choose the ONE best answer. (2.5 pts) **(multi-select)** One or more answers may be correct. Select all that apply. (2.5 pts total)

---

## Part 1 — Address Spaces

**Q1.** In early systems, one program ran at a time using all of physical memory. Why did this become unacceptable?

- A) Programs were too large to fit in physical memory
- B) The OS needed half of memory for its own data structures
- C) Users could not save files between sessions on the machine
- D) The CPU sat idle during I/O, wasting expensive hardware

---

**Q2.** A C++ programmer prints the address of a local variable with `std::cout << &x` and gets `0x7fff5ac3`. What kind of address is this?

- A) A physical address showing the exact RAM chip location
- B) A virtual address that OS and hardware translate to a physical one
- C) A page frame number used internally by the TLB hardware
- D) A segment offset relative to the stack segment base

---

**Q3. (multi-select)** Which statements about a process's address space are true?

- A) Code starts at lower addresses and does not grow at runtime
- B) The heap grows toward higher addresses
- C) The stack grows toward higher addresses
- D) Free space between heap and stack needs no physical memory with paging

---

**Q4.** Virtual memory must achieve three goals. Which set correctly lists all three?

- A) Transparency, efficiency, and isolation
- B) Speed, simplicity, and portability
- C) Portability, compression, and persistence
- D) Concurrency, fairness, and security

---

**Q5.** Process A writes to an invalid address and the OS terminates it. Process B, running at the same time, is unaffected. Which design goal of virtual memory is responsible?

- A) Transparency — processes believe they have dedicated access to all of memory
- B) Efficiency — address translation adds minimal overhead with hardware support
- C) Isolation — each process can only access its own virtual address space
- D) Dynamic relocation — the hardware converts virtual addresses to physical ones

---

## Part 2 — Base and Bounds (Dynamic Relocation)

**Q6.** A process has BASE = 16KB and BOUNDS = 8KB. It accesses virtual address 5KB. What is the physical address?

- A) 5KB
- B) 24KB
- C) 11KB
- D) 21KB

---

**Q7.** A process has BASE = 32KB and BOUNDS = 16KB. It accesses virtual address 20KB. What happens?

- A) The hardware raises an exception because 20KB exceeds the bounds
- B) The hardware translates it to physical address 52KB and continues normally
- C) The OS moves the process to a larger region of physical memory first
- D) The hardware wraps the address around to physical address 4KB

---

**Q8.** Why must only the OS in kernel mode change the base and bounds registers?

- A) The registers are too slow for user-mode programs to read or write during execution
- B) Changing base or bounds registers requires a full CPU restart each time
- C) A user program could point base at another process's memory
- D) The registers are stored on disk and need I/O operations to modify

---

**Q9.** With base and bounds, a process has a 16KB address space but uses only 4KB (code, heap, stack). What happens to the other 12KB?

- A) The OS automatically shares it with other processes that need more memory
- B) It wastes physical memory — the full address space is allocated contiguously
- C) It is stored on disk until the process expands into it
- D) The hardware compresses the unused region to free physical memory

---

**Q10.** When the OS switches from Process A to Process B (context switch), what must it do with the base and bounds registers?

- A) Reset both registers to zero so Process B starts with a clean state
- B) Copy A's registers into B's address space so B can access A's data
- C) Leave them unchanged — all processes share the same physical region
- D) Save A's values to its PCB and load B's values from B's PCB

---

## Part 3 — Segmentation

**Q11.** What problem does segmentation solve that base and bounds cannot?

- A) Base and bounds cannot translate virtual addresses to physical ones
- B) Base and bounds cannot protect one process from reading another's data
- C) Free space between heap and stack wastes physical memory
- D) Base and bounds does not support more than one running process

---

**Q12.** The heap segment has base = 34KB and starts at virtual address 4096. A process accesses VA 4200. What is the correct first step to translate this address?

- A) Compute the offset: 4200 − 4096 = 104
- B) Add the full virtual address (4200) to the heap base (34KB) directly
- C) Subtract the base (34KB) from the virtual address to get a physical offset
- D) Divide the virtual address by the segment size to find which entry to use

---

**Q13.** What causes a "segmentation fault"?

- A) The program tried to load a segment from a missing or corrupted file
- B) Two programs tried to use the same segment number at the same time
- C) The program created more segments than the hardware supports
- D) The program accessed an offset beyond the segment's bounds

---

**Q14.** After running many processes, physical memory has scattered small holes. 15KB is free total, but no single hole fits a new 10KB segment. What is this called?

- A) Internal fragmentation
- B) External fragmentation
- C) Page fault
- D) Segmentation overflow

---

**Q15.** The stack grows toward lower addresses. What extra hardware support does segmentation need for this?

- A) A "grows positive" bit per segment to indicate growth direction
- B) A second base register that marks the stack's highest virtual address
- C) A separate MMU dedicated only to stack address translations
- D) The stack must always be placed at physical address 0 to simplify math

---

**Q16.** Two processes run the same program. With segmentation, both can share the same physical code segment. What protection bits must this shared segment have?

- A) Read-write — so both processes can modify the shared code as needed
- B) Write-execute — so the CPU can write compiled code and then run it
- C) Read-execute — code must be readable and executable but not writable
- D) No bits needed — shared segments have no access restrictions at all

---

## Part 4 — Paging: Introduction

**Q17.** What property of paging prevents external fragmentation?

- A) Pages are compressed before being stored in physical memory
- B) The OS sorts physical memory after each page allocation to close gaps
- C) Pages are stored on disk and loaded into memory on demand
- D) All pages and frames are the same fixed size

---

**Q18.** In paging, a virtual address is split into two parts. What are they?

- A) Virtual Page Number (VPN) and offset
- B) Segment number and base offset
- C) Physical Frame Number (PFN) and page size
- D) Page directory index and bounds register value

---

**Q19.** A process accesses a virtual page whose PTE has the valid bit set to 0. What does the hardware do?

- A) Returns zero-filled data since the page has not been written yet
- B) Uses the previous translation cached in the TLB instead
- C) Raises a page fault exception, trapping into the OS
- D) Maps the virtual address directly to physical frame 0

---

**Q20.** A system has 4KB pages and a 64KB address space. How many virtual pages does the process have?

- A) 4
- B) 16
- C) 256
- D) 64

---

**Q21. (multi-select)** Which control bits are found in a Page Table Entry (PTE)?

- A) Valid/present bit
- B) ASID
- C) Dirty bit
- D) Protection (read/write) bits

---

**Q22.** A student proposes storing the entire page table in hardware registers instead of memory. For a 32-bit address space with 4KB pages, why is this impractical?

- A) Page tables change too frequently during execution for static registers to track
- B) Registers are slower than memory for sequential lookups across large tables
- C) The OS cannot modify hardware registers during context switches
- D) The table has about 1 million entries — far too many for registers

---

**Q23.** A linear page table is stored as an array in physical memory. What makes looking up a PTE fast?

- A) The table is sorted by physical frame number for binary search
- B) The VPN is used directly as the array index — no searching needed
- C) The OS pre-loads frequently used PTEs into a special lookup cache
- D) Each PTE contains a pointer to the next entry, forming a linked list

---

## Part 5 — TLBs (Faster Translations)

**Q24.** A system uses a single-level (linear) page table and has no TLB. Every virtual memory access costs two physical memory accesses. What are they?

- A) One to read the PTE from the page table, one to access the actual data
- B) One to verify the page's permissions, one to read the data from memory
- C) One to read the page directory entry, one to read the page table entry
- D) One to flush the CPU cache line, one to load the new translation entry

---

**Q25.** A TLB has 64 entries and pages are 4KB. What is the TLB coverage?

- A) 64KB
- B) 4MB
- C) 256KB
- D) 16KB

---

**Q26.** A program loops over an array of 10 integers spanning 4 pages. The TLB starts empty. How many TLB misses occur on the first pass?

- A) 10
- B) 4
- C) 6
- D) 0

---

**Q27.** What type of locality causes the TLB to perform well when a program accesses array elements in order?

- A) Temporal locality — reusing the same data soon after
- B) Spatial locality — nearby data shares the same page
- C) Sequential locality — the CPU pre-fetches the next instruction automatically
- D) Random locality — accessing scattered addresses across the virtual space

---

**Q28.** A loop runs over the same pages a second time. All translations are still cached. Every access on the second pass is a TLB hit. What principle explains this?

- A) Spatial locality
- B) Random access optimization
- C) Temporal locality
- D) Hardware prefetching

---

**Q29.** After a context switch, the TLB contains stale translations from the old process. What is the simplest solution?

- A) Copy all TLB entries into the new process's page table to preserve them
- B) Lock the TLB so the new process cannot read any cached translations
- C) Double the TLB size so both processes fit at the same time
- D) Flush the entire TLB

---

**Q30.** What advantage does an ASID (Address Space Identifier) in each TLB entry provide during context switches?

- A) It doubles TLB lookup speed by halving the search space each time
- B) Entries from multiple processes coexist in the TLB at the same time
- C) The TLB can grow larger dynamically when more processes are running
- D) It removes the need for a page table entirely since the ASID is the full mapping

---

**Q31. (multi-select)** Which statements about hardware-managed vs software-managed TLBs are correct?

- A) In hardware-managed, the hardware walks the page table on a miss
- B) In software-managed, the OS trap handler finds the translation on a miss
- C) Software-managed TLBs are slower because the OS must handle every TLB hit
- D) Software-managed TLBs let the OS use any page table format it wants

---

**Q32.** A TLB has 32 entries. A program loops over 33 different pages with LRU replacement. What happens?

- A) The first 32 pages stay cached and only page 33 causes misses each iteration
- B) LRU evenly rotates entries so each page gets approximately equal cache time
- C) The OS detects the pathological pattern and increases the TLB size at runtime
- D) Every access is a TLB miss

---

## Part 6 — Multi-Level Page Tables

**Q33.** A student says: "A linear page table wastes no space because every entry maps a real page." What is wrong?

- A) Most entries map unused virtual pages but still consume physical memory
- B) The entries are too slow to search through sequentially on every memory access
- C) The entries are stored in CPU registers, not in physical memory
- D) Each entry at 4 bytes is too large for modern hardware to store efficiently

---

**Q34.** In a multi-level page table, a PDE has valid bit = 0. What does this mean?

- A) That virtual page has been swapped to disk for later retrieval by the OS
- B) The page directory itself is corrupt and must be rebuilt from scratch entirely
- C) All PTEs in that region are invalid, so the page table page is not allocated
- D) The PDE's physical frame number is zero, which maps to reserved OS memory

---

**Q35.** In a two-level page table, the VPN is split into PDIndex and PTIndex. What does the PDIndex select?

- A) The byte offset within the target data page in physical memory
- B) Which process currently owns this particular virtual address
- C) Which page directory entry to read, to find the correct PT page
- D) The physical frame number directly, without consulting any table structure

---

**Q36. (multi-select)** Which are advantages of multi-level page tables over linear page tables?

- A) Only allocates page table space for regions of the address space in use
- B) TLB misses are faster because fewer memory accesses are needed
- C) Each piece of the page table fits in one page — no contiguous allocation needed
- D) Multi-level tables eliminate internal fragmentation within the page table itself

---

**Q37.** In a two-level page table, a TLB miss requires how many memory accesses to find the translation (not counting the final data access)?

- A) 2 — one for the PDE, one for the PTE
- B) 1 — only the PTE is read from memory
- C) 3 — one to load the PTBR, one for the PDE, one for the PTE
- D) 0 — the page directory is cached in a CPU register

---

## Part 7 — More Than Two Levels

**Q38.** A system has a large address space. With a two-level page table, the page directory spans multiple pages and must be stored contiguously. Why does this defeat the purpose of multi-level page tables?

- A) Contiguous page directories waste TLB entries that could cache data translations
- B) Multi-level tables are designed so each piece fits in one page — a multi-page directory breaks this
- C) The OS cannot allocate contiguous physical memory for any structure larger than 4KB
- D) Page directories stored across multiple pages cause the hardware to stall during walks

---

**Q39.** In x86-64, the number of page table levels and the index size at each level are determined by a single constraint. What is it?

- A) The total number of levels must equal the number of CPU cache levels
- B) Each level must use at least 8 bits to ensure enough entries for any workload
- C) The sum of all index widths must be divisible by the CPU word size (64 bits)
- D) Each page table page must fit within a single physical page

---

**Q40.** Using larger pages (e.g., 2MB instead of 4KB) reduces the total number of virtual pages. How does this affect a multi-level page table?

- A) Fewer virtual pages means a smaller page table, potentially requiring fewer levels
- B) The page directory grows larger because each entry must store a bigger frame number
- C) Multi-level tables cannot support large pages — only linear tables can
- D) The number of levels stays the same, but each level uses wider index bits

---

_End of Exam — Good luck!_

---

---

# Instructor Answer Key

| Q   | Answer(s) | Concept                                                                     |
| --- | --------- | --------------------------------------------------------------------------- |
| 1   | D         | Multiprogramming: CPU idle during I/O wasted expensive HW                   |
| 2   | B         | All program addresses are virtual; OS+HW translate                          |
| 3   | A, B, D   | Address space: code at low addresses, heap up, stack down                   |
| 4   | A         | Three goals of VM: transparency, efficiency, isolation                      |
| 5   | C         | Isolation goal: each process confined to its own address space              |
| 6   | D         | Base+bounds: PA = VA + BASE = 5KB + 16KB = 21KB                             |
| 7   | A         | Bounds check: 20KB >= 16KB → exception                                      |
| 8   | C         | Only OS modifies base/bounds — prevents unauthorized access                 |
| 9   | B         | Internal fragmentation: unused space wastes physical memory                 |
| 10  | D         | Context switch: save base/bounds to PCB, load new values                    |
| 11  | C         | Segmentation: per-segment base/bounds saves wasted gap                      |
| 12  | A         | Segment translation: first compute offset = VA − segment start              |
| 13  | D         | Segfault: offset exceeded segment bounds                                    |
| 14  | B         | External fragmentation: scattered holes, can't fit segment                  |
| 15  | A         | Stack grows backward: needs growth direction bit                            |
| 16  | C         | Code sharing: read-execute bits protect shared code segment                 |
| 17  | D         | Paging: fixed-size pages/frames → no external fragmentation                 |
| 18  | A         | Virtual address = VPN + offset                                              |
| 19  | C         | Valid bit = 0: hardware raises page fault, traps to OS                      |
| 20  | B         | Pages = address_space ÷ page_size = 64KB ÷ 4KB = 16                         |
| 21  | A, C, D   | PTE bits: valid, dirty, protection (ASID is in TLB, not PTE)                |
| 22  | D         | Page table ~1M entries: too large for registers, stored in memory           |
| 23  | B         | Linear PT lookup: VPN used as direct array index — no search                |
| 24  | A         | Without TLB: 1 access for PT + 1 for data = 2 total                         |
| 25  | C         | TLB coverage = 64 × 4KB = 256KB                                             |
| 26  | B         | 4 misses (one per new page), rest hits from spatial locality                |
| 27  | B         | Spatial locality: nearby elements share a page                              |
| 28  | C         | Temporal locality: same pages reused on second pass                         |
| 29  | D         | Flush TLB on context switch removes stale translations                      |
| 30  | B         | ASID: multiple processes coexist in TLB without flushing                    |
| 31  | A, B, D   | HW walks PT; SW trap handler; SW allows flexible PT format                  |
| 32  | D         | LRU pathological: n+1 pages, n entries → miss every access                  |
| 33  | A         | Linear PT: most entries invalid but still waste memory                      |
| 34  | C         | PDE valid=0 → entire PT page empty, not allocated                           |
| 35  | C         | PDIndex selects PDE → finds which PT page to use                            |
| 36  | A, C, D   | ML-PT: saves space for sparse address spaces, no contiguous allocation      |
| 37  | A         | Two-level TLB miss: 2 accesses (PDE + PTE)                                  |
| 38  | B         | Multi-level PT: each piece must fit in one page; add levels if PD too large |
| 39  | D         | Index size constraint: each PT page must fit in one physical page           |
| 40  | A         | Larger pages → fewer virtual pages → smaller PT, fewer levels needed        |

---
