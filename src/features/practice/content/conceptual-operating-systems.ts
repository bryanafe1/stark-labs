import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  {
    id: "operating_systems_thread_vs_process_crash",
    slug: "concept-operating-systems-thread-vs-process-isolation",
    title: "Threads vs Processes for a Web Server",
    prompt: "You are designing a high-traffic web server that handles thousands of simultaneous client connections. A colleague proposes spawning one OS thread per connection inside a single process; another proposes one process per connection.",
    discipline: "COMPUTER",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["operating-systems", "conceptual"],
    skillAreas: ["operating-systems"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Compare the two designs in terms of memory footprint, creation cost, communication, and fault isolation. Why is the thread-per-connection model usually cheaper, and what is the key safety risk it introduces that the process-per-connection model avoids?",
        rubric: "Threads share the same address space (heap, globals, file descriptors) so they are cheaper to create and switch between, and inter-thread communication is just shared memory; processes have separate address spaces, so creation is heavier (page tables, copy/COW of memory), and they must use IPC (pipes, sockets, shared-memory segments). The decisive tradeoff: shared address space means one thread that corrupts memory or dereferences a bad pointer can crash or corrupt the WHOLE process and every other connection, whereas a crashing process only takes down its own connection (fault isolation). Should also note threads share fds/signals so a bug in one can leak resources for all. Key insight: threads trade isolation for cheap sharing — the same shared address space that makes them fast is exactly what removes the protection boundary that separate processes provide.",
      },
      {
        prompt: "Part 2: Now the constraints change — the connections must be served on a 32-core machine and the request handler is written in a language with a global interpreter lock (GIL) that allows only one thread to execute bytecode at a time. Does the thread-per-connection model still let you exploit all 32 cores? What would you change, and how does this expose the difference between concurrency and parallelism?",
        rubric: "With a GIL, many threads can exist and interleave (concurrency) but only one runs interpreter bytecode at any instant, so CPU-bound work does NOT scale across the 32 cores — threads serialize on the lock. Threads still help for I/O-bound work because the GIL is typically released during blocking I/O, so other threads run while one waits. To get true parallelism you switch to multiple processes (each with its own interpreter and GIL), e.g. a process pool sized to the cores, accepting the higher memory cost and IPC overhead. Should distinguish concurrency (tasks making progress by interleaving) from parallelism (tasks literally running at the same instant on multiple cores). Key insight: concurrency is a structuring tool and does not imply parallelism — a GIL caps interpreter parallelism at one core, so multiple processes, not more threads, are what unlock the 32 cores for CPU-bound work.",
      },
    ],
  },
  {
    id: "operating_systems_race_condition_counter",
    slug: "concept-operating-systems-race-condition-and-locking",
    title: "A Shared Counter That Loses Updates",
    prompt: "Two threads each increment a shared global counter one million times using the statement counter = counter + 1 with no synchronization. After both finish, the final value is often less than two million and varies from run to run.",
    discipline: "COMPUTER",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["operating-systems", "conceptual"],
    skillAreas: ["operating-systems"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain at the machine-instruction level why updates are lost. Define the critical section here, and explain why a mutex around the increment fixes the result. Why is declaring the counter volatile NOT sufficient?",
        rubric: "counter = counter + 1 is not atomic: it compiles to read (load counter into a register), modify (add 1), write (store back). A context switch or parallel execution can interleave these so both threads read the same old value, both add 1, both write back the same value — one increment is lost (a lost-update race). The critical section is the read-modify-write sequence on counter; correctness requires mutual exclusion so only one thread executes it at a time. A mutex enforces that, serializing access. volatile only forces reads/writes to go to memory and prevents certain compiler optimizations/reordering of that variable — it does NOT make the read-modify-write atomic, so the interleaving (and lost updates) still happens. Should mention an atomic increment instruction or atomic type as an alternative. Key insight: the bug is non-atomicity of read-modify-write, not stale caching, so the fix must provide mutual exclusion (mutex or atomic op); volatility guarantees visibility but not atomicity.",
      },
      {
        prompt: "Part 2: Now the constraints change — the counter is incremented inside a tight loop millions of times per second across many threads, and profiling shows the mutex is now the bottleneck because threads spend most of their time contending for it. What changes would you consider, and what are the tradeoffs of each?",
        rubric: "Options: (1) use a lock-free atomic increment / fetch-and-add instruction, which avoids blocking and context-switch overhead but still serializes on the cache line and causes cache-line bouncing/contention across cores. (2) Use per-thread (sharded) counters that each thread updates without synchronization, then sum them when a total is needed — removes contention entirely but the global total is only available on demand and is approximate during updates. (3) Reduce critical-section size or batch updates (accumulate locally, flush periodically) to cut lock acquisitions. (4) Spinlock vs mutex tradeoff: spin if the critical section is very short to avoid context-switch cost, but spinning wastes CPU under long holds. Should mention false sharing — padding per-thread counters to separate cache lines. Key insight: under heavy contention the lock itself becomes the shared resource being fought over; the highest-leverage fix is to stop sharing the hot data (per-thread sharding) rather than to make the lock faster.",
      },
    ],
  },
  {
    id: "operating_systems_deadlock_bank_transfer",
    slug: "concept-operating-systems-deadlock-conditions-and-prevention",
    title: "Deadlock in Concurrent Bank Transfers",
    prompt: "A banking service transfers money between accounts. Each transfer locks the source account, then locks the destination account, then moves the funds. Under load the service occasionally freezes completely with several threads stuck.",
    discipline: "COMPUTER",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["operating-systems", "conceptual"],
    skillAreas: ["operating-systems"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain the specific interleaving that causes the freeze, and map it onto the four Coffman conditions required for deadlock (mutual exclusion, hold-and-wait, no preemption, circular wait). Which condition is the easiest to eliminate here, and how?",
        rubric: "Interleaving: thread A transfers X to Y and locks X; thread B transfers Y to X and locks Y; now A waits for Y (held by B) and B waits for X (held by A) — a circular wait, so both block forever. Map to Coffman: mutual exclusion (each account lock is exclusive), hold-and-wait (each thread holds one lock while requesting another), no preemption (a held lock is not forcibly taken away), circular wait (A->Y->B->X->A cycle). Easiest fix: break circular wait by imposing a global lock ordering — always acquire the lower-numbered account id first regardless of transfer direction, so no cycle can form. Should note this directly attacks circular wait while keeping the other conditions. Key insight: deadlock needs all four conditions simultaneously, so breaking just one prevents it; a consistent global lock-acquisition order is the cheapest and most common way to eliminate circular wait.",
      },
      {
        prompt: "Part 2: Now the constraints change — accounts may live on different machines (distributed locks) where a global ordering is hard to enforce and a lock holder can crash mid-transfer. How would you prevent or recover from deadlock now, and what new tradeoffs (vs the single-machine ordering fix) appear?",
        rubric: "When a global order is impractical and holders can crash, shift from prevention to detection/recovery and to timeouts: (1) lock timeouts / try-lock with backoff — a thread that cannot acquire the second lock within a deadline releases the first and retries (attacks hold-and-wait / no-preemption by allowing release), with random backoff to avoid livelock. (2) Lock leases with expiry so a crashed holder's lock is reclaimed automatically (handles crash failures the single-machine mutex did not). (3) Deadlock detection via a wait-for graph and victim abort/rollback. (4) Avoid distributed two-lock transactions entirely with a higher-level protocol or single coordinator/serialization. Tradeoffs vs ordering: timeouts can abort and retry legitimate work (wasted effort, possible livelock), require idempotent/rollback-safe transfers, and leases trade off reclaim speed vs falsely revoking a slow-but-alive holder. Key insight: in a distributed setting with partial failures, prevention by global ordering breaks down, so you rely on timeouts, leases, and detection-with-rollback — accepting aborted/retried work and the risk of livelock in exchange for liveness under crashes.",
      },
    ],
  },
  {
    id: "operating_systems_scheduling_latency_throughput",
    slug: "concept-operating-systems-scheduling-tradeoffs",
    title: "Choosing a CPU Scheduler",
    prompt: "A server runs a mix of two job types: short, latency-sensitive interactive requests (a few milliseconds each) and long-running batch jobs (minutes each). Users complain the interactive requests feel sluggish whenever a batch job is running.",
    discipline: "COMPUTER",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["operating-systems", "conceptual"],
    skillAreas: ["operating-systems"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Compare First-Come-First-Served (FCFS) and Round-Robin (RR) for this workload. Explain the convoy effect and how the choice of RR time quantum trades off interactive responsiveness against context-switch overhead and throughput.",
        rubric: "FCFS is non-preemptive: a long batch job that arrives first runs to completion while short interactive jobs queue behind it — the convoy effect — causing terrible interactive latency and high average waiting time. RR preempts each job after a time quantum and cycles through the ready queue, so short jobs get the CPU quickly, bounding interactive response time. Quantum tradeoff: a small quantum improves responsiveness/fairness but increases the fraction of time lost to context switches (overhead, cache/TLB pollution), hurting throughput; a large quantum approaches FCFS behavior (less overhead, worse interactive latency). Should note the quantum should be large relative to context-switch cost but small relative to interactive job length. Key insight: FCFS optimizes simplicity/throughput at the cost of latency under mixed job sizes (convoy effect), while RR buys responsiveness by preempting — and the quantum is the dial that trades interactivity against switching overhead.",
      },
      {
        prompt: "Part 2: Now the constraints change — you adopt a priority scheduler giving interactive jobs high priority and batch jobs low priority. Interactive latency improves, but some batch jobs now never seem to finish. What is happening, and what mechanism fixes it without abandoning priorities?",
        rubric: "The problem is starvation: as long as high-priority interactive jobs keep arriving, low-priority batch jobs are perpetually preempted/skipped and may never get the CPU. The fix is aging: gradually raise the priority of jobs that have waited a long time so that an old batch job eventually outranks fresh interactive arrivals and gets scheduled, then resets. This preserves the benefit of priorities for the common case while guaranteeing eventual progress (bounded waiting) for low-priority work. Could also mention multilevel feedback queues that demote CPU-hogs and promote starved/interactive jobs, or reserving a CPU share for batch. Should note pure strict priority lacks any progress guarantee. Key insight: strict priority scheduling can starve low-priority jobs indefinitely; aging restores a liveness/fairness guarantee by making waiting time itself increase priority, so no job waits forever.",
      },
    ],
  },
  {
    id: "operating_systems_virtual_memory_paging",
    slug: "concept-operating-systems-virtual-memory-and-paging",
    title: "Virtual Memory and Page Faults",
    prompt: "A process allocates and touches an array far larger than the machine's physical RAM, yet it runs without an out-of-memory error — though it slows dramatically as the array grows. You are asked to explain the memory system behavior to a junior engineer.",
    discipline: "COMPUTER",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["operating-systems", "conceptual"],
    skillAreas: ["operating-systems"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain how virtual memory and demand paging let a process address more memory than physical RAM. Describe what happens on a page fault, the role of the page table and TLB, and why the program slows as it exceeds RAM.",
        rubric: "Each process has a virtual address space mapped to physical frames via a per-process page table; the MMU translates virtual to physical page numbers and the TLB caches recent translations to avoid walking the page table on every access. Demand paging means pages are loaded into RAM only when first accessed; with more virtual pages than physical frames, the OS keeps some pages on disk (swap/backing store). A page fault occurs when a referenced page is not resident: the MMU traps to the OS, which finds a free frame (or evicts one via a replacement policy such as LRU/clock, writing it back if dirty), reads the page from disk, updates the page table, and resumes the instruction. As the array exceeds RAM, accesses increasingly miss in physical memory, forcing disk I/O that is orders of magnitude slower than RAM, so the program slows. Key insight: virtual memory decouples the address space from physical RAM via page-table translation and demand paging, letting a process exceed RAM — but every miss that hits disk is enormously slower, which is why performance degrades as the working set outgrows physical memory.",
      },
      {
        prompt: "Part 2: Now the constraints change — the slowdown becomes catastrophic: CPU utilization collapses and the disk is saturated even though the program is doing little useful work. Name this phenomenon, explain the mechanism in terms of working sets, and give two ways to address it.",
        rubric: "This is thrashing: the combined working sets of the running process(es) exceed physical memory, so almost every memory access page-faults; the system spends nearly all its time paging in/out instead of executing, disk is saturated, and CPU sits idle waiting on I/O. Mechanism: a process needs its working set (the set of pages actively used in a time window) resident to make progress; if it cannot fit, a fault evicts a page that is needed again immediately, causing a self-reinforcing fault storm; if the scheduler responds to low CPU use by admitting MORE processes, it worsens. Fixes: (1) reduce memory pressure — admit fewer processes / use admission control or a working-set or page-fault-frequency model to suspend (swap out) whole processes until the rest fit; (2) add physical RAM or reduce the working set (improve locality, smaller data structures, algorithmic blocking/tiling); (3) prefetch or better replacement to respect locality. Key insight: thrashing happens when aggregate working sets exceed RAM, so the cure is to make the resident working sets fit — by reducing concurrency (suspending processes) or shrinking working sets — not by trying to schedule harder, which makes it worse.",
      },
    ],
  },
  {
    id: "operating_systems_context_switch_cost",
    slug: "concept-operating-systems-context-switch-cost",
    title: "The Hidden Cost of Context Switches",
    prompt: "An engineer splits a CPU-bound workload across many more threads than there are CPU cores, expecting it to finish faster. Instead total throughput drops compared with running roughly one thread per core.",
    discipline: "COMPUTER",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["operating-systems", "conceptual"],
    skillAreas: ["operating-systems"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain what a context switch actually does and why oversubscribing the cores with CPU-bound threads reduces throughput. Distinguish the direct cost of switching from the indirect cost, and explain which usually dominates.",
        rubric: "A context switch saves the current thread's CPU state (registers, program counter, stack pointer) and restores another thread's; if it switches to a thread in a different process it also switches the address space (page-table base register), which typically flushes or invalidates the TLB. Direct cost = the cycles to save/restore state and enter/exit the kernel/scheduler. Indirect cost = lost cache and TLB warmth: the new thread evicts the old thread's hot cache lines and TLB entries, so when a thread resumes it suffers cache/TLB misses (cold caches) — this indirect cost is usually much larger than the direct register save/restore for real workloads. With CPU-bound threads oversubscribing cores, there is no I/O to hide behind, so extra threads only add switching and cache-pollution overhead without exposing more usable parallelism (cores are already busy), lowering throughput. Key insight: a context switch costs far more than the visible register save/restore — the dominant penalty is destroyed cache/TLB locality — so for CPU-bound work, matching thread count to cores avoids paying that penalty for no parallelism gain.",
      },
      {
        prompt: "Part 2: Now the constraints change — the workload becomes I/O-bound: each thread spends most of its time blocked waiting on network or disk. Does oversubscribing the cores with many threads now help or hurt, and why? What lighter-weight alternative could achieve the same concurrency with far less switching overhead?",
        rubric: "For I/O-bound work, more threads than cores HELPS: when a thread blocks on I/O it is taken off the CPU and another runnable thread runs, so the CPU stays busy and I/O latency is overlapped with useful work — the switching overhead is small relative to the long I/O waits it hides. So oversubscription is beneficial here, the opposite of the CPU-bound case. Lighter-weight alternative: an event-driven / asynchronous model (event loop with non-blocking I/O, async-await) or user-space cooperative tasks / green threads / coroutines that multiplex many logical tasks onto a few OS threads. These switch in user space (just saving a little state, no kernel trap, no TLB flush, no address-space switch) and avoid the per-connection kernel-thread cost, achieving high I/O concurrency with far less overhead — at the cost of more complex code and the risk that one blocking call stalls the whole loop. Key insight: the value of many threads depends on the workload — for I/O-bound work they overlap waiting and improve utilization, but the cheapest way to get massive I/O concurrency is user-level async/coroutines that sidestep kernel context-switch and TLB costs entirely.",
      },
    ],
  },
];
