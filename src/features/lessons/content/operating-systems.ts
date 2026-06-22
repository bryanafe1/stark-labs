import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_os",
  slug: "operating-systems",
  title: "Operating Systems: The Invisible Bouncer Running Your Whole Computer",
  summary:
    "Right now your laptop is juggling a browser with 40 tabs, a music player, three background updaters, and you — all on a chip that can truly do only a handful of things at once. The thing pulling off that illusion is the operating system, a relentless bouncer deciding who gets the CPU, who waits, and who gets thrown out for misbehaving. You will learn how processes and threads differ, how the OS context-switches faster than you can blink, how schedulers pick winners, why deadlock is a four-way standoff, how virtual memory fakes infinite RAM, and the beautiful trick where keeping the CPU busy actually means running more programs at once.",
  discipline: "COMPUTER",
  difficulty: "MEDIUM",
  estMinutes: 24,
  tags: ["operating-systems", "scheduling", "concurrency"],
  objectives: [
    "Explain what an operating system actually does — the abstraction layer between hardware and your programs.",
    "Distinguish a process from a thread, and describe what a context switch costs and why.",
    "Compare the core CPU scheduling algorithms (FCFS, SJF, Round Robin, priority) and the trade-offs each makes.",
    "State the four necessary conditions for deadlock and recognize a concurrency hazard when you see one.",
    "Describe how virtual memory and paging let programs pretend they own more RAM than exists.",
    "Explain why multiprogramming raises CPU utilization and estimate utilization from I/O wait and process count.",
  ],
  prerequisites: [
    "A rough idea of what a CPU, RAM, and a program are",
    "Comfort reading a simple timeline or schedule",
    "Knowing that programs sometimes wait on disk or network (I/O)",
  ],
  interviewAngle:
    "Operating systems is the section of a systems interview where vague answers go to die. Interviewers use it to find out whether you understand what is happening *beneath* your code: when you say \"my program is slow,\" do you know whether it is CPU-bound or blocked on I/O? Strong candidates can crisply separate a process from a thread (and say why threads share memory but processes do not), explain why a context switch is not free, walk a Round Robin schedule by hand, and recite the four deadlock conditions on demand — then explain how breaking any one of them prevents it. They know virtual memory is not \"more RAM\" but an address-translation trick backed by paging, and they can explain the counterintuitive idea that running *more* programs can make a CPU *more* utilized, because while one waits on disk another computes. Weak candidates confuse concurrency with parallelism, think a deadlock is just \"the program froze,\" and cannot say what the OS is protecting them from.",
  blocks: [
    {
      id: "os-hook",
      kind: "PROSE",
      title: "The bouncer you never see",
      markdown:
        "Picture a nightclub with exactly one dance floor but a line of two hundred people, all convinced they should be dancing *right now*. Someone has to decide who gets on, for how long, and who gets shoved back into line when they overstay. That someone is the bouncer — invisible to the dancers, but the reason the night does not collapse into a brawl.\n\nYour computer is that club. The dance floor is the CPU, the line is every program you have open, and the bouncer is the **operating system**. You never *see* it doing its job — that is the whole point. When your video keeps playing while a download runs while you type in a doc, it *feels* like everything happens at once. It does not. The CPU is sprinting between tasks so fast that your slow human eyes stitch the flicker into smooth motion.\n\nThe OS is the program that runs all the other programs. It is the layer that turns \"one chip, one thing at a time\" into \"a hundred things, apparently at once\" — and it does it while also stopping any single program from hogging the machine, crashing its neighbors, or reading memory it has no business touching. By the end of this lesson, you will know exactly how the bouncer pulls it off.",
    },
    {
      id: "os-video",
      kind: "VIDEO",
      youtubeId: "9Xw8kSj3OME",
      title: "Watch: Process Scheduling Explained",
    },
    {
      id: "os-what-os-does",
      kind: "PROSE",
      title: "What an OS actually does all day",
      markdown:
        "Strip away the wallpaper and the settings menu and an operating system has one mission: be the **manager and middleman** between raw hardware and the programs that want to use it. It does this through a few jobs that never stop:\n\n- **Process management.** Start programs, pause them, schedule who runs on the CPU, and clean up when they exit.\n- **Memory management.** Hand out RAM, track who owns what, and stop one program from scribbling on another's memory.\n- **File and storage management.** Turn spinning platters and flash chips into tidy named files and folders.\n- **Device management.** Talk to the keyboard, screen, disk, and network through drivers, so your app does not have to know the wiring.\n- **Protection and isolation.** Keep programs in their own sandbox so a crash or a bug in one does not take down the others — or the OS itself.\n\nThe deep idea underneath all of it is **abstraction**. Your code says \"open this file\" or \"give me some memory,\" and the OS translates that wish into the gritty hardware reality. Programs run in a restricted **user mode**; only the OS **kernel** runs in privileged **kernel mode** with the keys to the hardware. When your program needs something only the kernel can do, it asks politely through a **system call** — the formal knock on the bouncer's door.",
    },
    {
      id: "os-process-vs-thread",
      kind: "PROSE",
      title: "Processes vs threads: apartments vs roommates",
      markdown:
        "A **process** is a running program with its *own* private address space — its own memory, its own file handles, its own little universe. Think of it as a self-contained apartment: what happens inside stays inside, and the OS makes sure neighbors cannot peek through the walls. If one process crashes, the others are unbothered, because they share nothing.\n\nA **thread** is a single line of execution *inside* a process. A process can have many threads, and here is the twist: threads in the same process **share the same memory**. They are roommates in one apartment. That makes them cheap to create and lightning-fast to communicate (they just read the same variables) — but it also means one careless roommate can trash the shared kitchen. Two threads writing the same variable at the same time is a **race condition**, the source of some of the nastiest bugs in computing.\n\nThe trade-off in one line: **processes give you isolation at the cost of communication; threads give you fast communication at the cost of safety.** A web browser often uses *both* — separate processes per tab (so one bad page cannot crash the whole browser) and multiple threads per tab (to render, fetch, and run scripts at once).\n\nOne more distinction interviewers love: **concurrency** is *dealing with* many things at once (interleaving them on one CPU), while **parallelism** is *doing* many things at once (literally, on multiple CPU cores). A single-core machine can be concurrent but never truly parallel.",
    },
    {
      id: "os-context-switch",
      kind: "PROSE",
      title: "Context switching: the bouncer's costly shuffle",
      markdown:
        "Since one CPU core can run only one thread at a time, the OS creates the illusion of \"many at once\" by rapidly swapping who is on the core. That swap is a **context switch**, and it goes like this: freeze the current task, save *everything* about its state (the program counter, the CPU registers, what line it was on) into memory, load the saved state of the next task, and let it rip. Do this hundreds or thousands of times a second and it looks seamless.\n\nBut a context switch is **not free**. Three costs lurk:\n\n- **Direct cost:** the time spent saving and restoring all that state — pure overhead, no useful work done.\n- **Cache pollution:** the new task's data is not in the CPU's fast cache yet, so it stalls fetching from slow RAM. This indirect cost often dwarfs the direct one.\n- **Opportunity cost:** every microsecond spent switching is a microsecond not spent computing.\n\nThis is the central tension of scheduling. Switch too rarely and one program hogs the CPU while others starve. Switch too often and you spend all your time shuffling and none of it working — a pathology called **thrashing** when it gets bad enough. The art of the scheduler is finding the sweet spot.",
    },
    {
      id: "os-scheduling",
      kind: "PROSE",
      title: "The scheduler's playbook: who goes next?",
      markdown:
        "When several processes are ready to run, the scheduler picks one. *How* it picks defines the personality of the system. The classics:\n\n- **FCFS (First-Come, First-Served).** A plain queue: whoever asked first runs to completion first. Dead simple and *fair* in arrival order — but suffers the **convoy effect**, where one giant job stuck at the front makes a dozen quick jobs wait forever, like one person with a full cart at the express lane.\n- **SJF (Shortest Job First).** Always run the job with the smallest burst time next. This is *provably optimal* for minimizing average waiting time — but it has two problems: you rarely know job lengths in advance, and long jobs can **starve** if short ones keep cutting in line.\n- **Round Robin (RR).** Give each process a fixed slice of time — a **time quantum** — then preempt it and send it to the back of the queue. This is the workhorse of interactive systems because it is *responsive*: nobody waits more than one full lap. The catch is tuning the quantum — too big and it degrades to FCFS; too small and context-switch overhead eats you alive.\n- **Priority scheduling.** Each process gets a priority; highest priority runs first. Flexible, but low-priority jobs can starve — fixed by **aging**, where a job's priority creeps up the longer it waits.\n\nThe recurring tension across all of these: **throughput vs. responsiveness vs. fairness vs. starvation.** No single algorithm wins on every axis, which is why real operating systems use clever hybrids (like multilevel feedback queues) that change a process's treatment based on how it behaves.",
    },
    {
      id: "os-deadlock",
      kind: "PROSE",
      title: "Deadlock: the four-way standoff",
      markdown:
        "Picture a four-way intersection with no traffic lights, and four cars arrive at once, each one nosing forward into the box. Now every car is blocking the car to its left, and *no one* can move. Nobody crashed. Nobody is broken. Everyone is simply waiting, forever, for someone else to go first. That is a **deadlock**.\n\nIn an OS, the \"cars\" are processes and the \"intersection space\" is shared resources — locks, files, memory. A deadlock needs **all four** of these conditions to be true at once (the Coffman conditions):\n\n1. **Mutual exclusion** — at least one resource can be held by only one process at a time.\n2. **Hold and wait** — a process holds one resource while waiting to grab another.\n3. **No preemption** — a resource cannot be forcibly taken away; the holder must release it voluntarily.\n4. **Circular wait** — a closed chain of processes, each waiting on a resource held by the next.\n\nThe powerful consequence: **break any single one of these four and deadlock becomes impossible.** Make resources shareable (kill mutual exclusion), require processes to grab everything up front (kill hold-and-wait), allow the OS to revoke resources (kill no-preemption), or impose a global ordering on resources so cycles cannot form (kill circular wait). Deadlock is not bad luck — it is a structural condition, and that is exactly why it can be engineered away.",
    },
    {
      id: "os-virtual-memory",
      kind: "PROSE",
      title: "Virtual memory: lying to every program for its own good",
      markdown:
        "Here is a magic trick the OS plays on every program: it tells each one that it owns a huge, private, contiguous block of memory starting at address zero. This is a **lie** — a beautiful, useful lie called **virtual memory**.\n\nIn reality, physical RAM is shared, fragmented, and far smaller than the sum of what all programs think they have. The OS bridges fantasy and reality with **paging**: it chops virtual memory into fixed-size chunks called **pages**, chops physical RAM into matching **frames**, and keeps a **page table** mapping each virtual page to wherever its frame actually lives. A hardware unit called the **MMU** translates virtual addresses to physical ones on every single memory access, fast enough that you never notice.\n\nThe payoffs are enormous:\n\n- **Isolation** — each program's addresses mean nothing in another's space, so they cannot touch each other's memory.\n- **Overcommitment** — programs can collectively \"use\" more memory than physically exists, because inactive pages get parked on disk (the **swap** file) and pulled back only when needed. Touching a page that is not in RAM triggers a **page fault**, and the OS fetches it.\n- **Flexibility** — a program's pages can be scattered all over physical RAM yet still *look* contiguous to the program.\n\nThe danger zone is **thrashing**: if too many programs are active and RAM is too small, the system spends more time swapping pages in and out of disk than actually computing, and everything grinds to a crawl. Disk is roughly a hundred thousand times slower than RAM, so a little swapping is fine and a lot is catastrophic.",
    },
    {
      id: "os-multiprogramming",
      kind: "PROSE",
      title: "The counterintuitive win: more programs, busier CPU",
      markdown:
        "Here is a fact that surprises people: keeping *more* programs in memory can make your CPU *more* utilized, not less. The reason is that programs spend a shocking amount of time doing *nothing* — specifically, waiting on slow I/O like disk reads or network responses. While one program is twiddling its thumbs waiting for the disk, the CPU sits idle... unless there is *another* program ready to run.\n\nThat is **multiprogramming**: keep several programs in memory so that whenever one blocks on I/O, the CPU can immediately switch to another that is ready to compute. The more programs you have queued up, the lower the chance that *all* of them are waiting at the same time, and the busier you keep that precious CPU.\n\nWe can even estimate it. Suppose each process spends a fraction `w` of its time waiting on I/O. With `n` independent processes in memory, the probability that *all n* are simultaneously waiting (and the CPU is therefore idle) is roughly `w^n`. So CPU utilization is about `1 − w^n`. Crank up `n` and that idle probability collapses toward zero. The next block lets you play with exactly this.",
    },
    {
      id: "os-formula",
      kind: "FORMULA",
      title: "CPU utilization under multiprogramming",
      display: "Utilization ≈ (1 − wⁿ) × 100%",
      latex: "\\text{Utilization} \\approx (1 - w^{n}) \\times 100\\%",
      variables: [
        { symbol: "w", name: "Fraction of time each process spends waiting on I/O", unit: "(0–1)" },
        { symbol: "n", name: "Number of processes kept in memory", unit: "processes" },
        { symbol: "wⁿ", name: "Probability all n processes wait at once (CPU idle)" },
      ],
      note:
        "This is a back-of-the-envelope model that assumes processes wait independently — real systems are messier (processes can contend for the same disk), but the shape is right and the intuition is gold. The key insight: idle probability is wⁿ, which shrinks *exponentially* as you add processes. Two processes each waiting 80% of the time still leave the CPU idle 0.8² = 64% of the time; ten such processes leave it idle only 0.8¹⁰ ≈ 11%. Adding processes has diminishing but real returns, and memory (not the model) is what eventually caps n.",
    },
    {
      id: "os-sandbox",
      kind: "SANDBOX",
      title: "Play: how busy can you keep the CPU?",
      description:
        "This computes CPU utilization = (1 − wⁿ) × 100% for n processes that each wait on I/O a fraction w of the time. The defaults (w = 0.5, n = 4) give 93.8% — four moderately I/O-bound processes already keep the CPU busy almost all the time. Now try the worst case: drag w up to 0.95 (very I/O-heavy processes) and watch utilization collapse — then add more processes (raise n) and watch it climb back. That is multiprogramming earning its keep, right in front of you.",
      variables: [
        { key: "w", label: "I/O wait fraction", unit: "", min: 0.1, max: 0.95, step: 0.05, default: 0.5 },
        { key: "n", label: "Processes in memory n", unit: "", min: 1, max: 16, step: 1, default: 4 },
      ],
      expression: "(1 - w ^ n) * 100",
      outputLabel: "CPU utilization",
      outputUnit: "%",
      precision: 1,
    },
    {
      id: "os-predict-quantum",
      kind: "PREDICT",
      question:
        "You are running Round Robin scheduling. You shrink the time quantum to an extremely tiny value — say, far smaller than the time it takes to do one context switch. What happens to overall performance? Lock in your guess.",
      options: [
        { id: "a", label: "It gets faster — smaller slices mean more responsiveness, which is always better." },
        { id: "b", label: "It gets much worse — the CPU spends most of its time context-switching instead of doing real work." },
        { id: "c", label: "Nothing changes — quantum size does not affect throughput." },
        { id: "d", label: "It behaves exactly like FCFS." },
      ],
      answerId: "b",
      reveal:
        "**It gets much worse.** Each context switch has a fixed cost (saving/restoring state, cache misses). If the quantum is smaller than that cost, you spend *more* time shuffling tasks than running them — overhead dominates and useful throughput craters. This is the responsiveness-vs-overhead trade-off at its extreme. (Option d is the *opposite* failure: a quantum that is *too large* degrades to FCFS, because each process basically runs to completion before being preempted. The sweet spot is a quantum big enough to amortize switch cost but small enough to keep the system responsive.)",
    },
    {
      id: "os-predict-deadlock",
      kind: "PREDICT",
      question:
        "Your system keeps deadlocking. You decide to fix it by requiring every process to request ALL the resources it will ever need up front, before it starts, or none at all. Which deadlock condition does this break?",
      options: [
        { id: "a", label: "Mutual exclusion." },
        { id: "b", label: "Hold and wait." },
        { id: "c", label: "No preemption." },
        { id: "d", label: "Circular wait." },
      ],
      answerId: "b",
      reveal:
        "**Hold and wait.** That condition says a process holds some resources *while waiting* to acquire more. If you force processes to grab everything at once before they begin, they never hold one resource while reaching for another — the condition simply cannot occur, so deadlock is prevented. (The cost is poor resource utilization: a process may lock resources long before it actually uses them, and may have to wait a long time to get *all* of them at once. Breaking circular wait via resource ordering is usually the more practical fix.)",
    },
    {
      id: "os-worked",
      kind: "WORKED_EXAMPLE",
      title: "Worked example: a Round Robin schedule, then a utilization check",
      problem:
        "PART 1 — SCHEDULING: Three processes all arrive at time 0 with these CPU burst times: P1 = 5, P2 = 3, P3 = 1 (time units). Run them with Round Robin and a time quantum of 2. What is the order of execution, and what is each process's completion time? PART 2 — UTILIZATION: Separately, suppose each process spends 60% of its time waiting on I/O. Estimate CPU utilization with 1 process in memory, then with 4 processes.",
      steps: [
        {
          label: "(1) Set up the ready queue",
          markdown:
            "All three arrive at t = 0, queued in order: **[P1, P2, P3]**. Each gets at most a quantum of 2 units, then goes to the back of the queue if it still has work left.",
        },
        {
          label: "(1) Run the rounds",
          markdown:
            "Round 1: P1 runs 2 (t=0→2, 3 left). P2 runs 2 (t=2→4, 1 left). P3 runs 1 — its whole burst — and *finishes* (t=4→5). Queue is now [P1, P2].\n\nRound 2: P1 runs 2 (t=5→7, 1 left). P2 runs its last 1 and *finishes* (t=7→8). Queue is now [P1].\n\nRound 3: P1 runs its last 1 and *finishes* (t=8→9).",
        },
        {
          label: "(1) Read off the answers",
          markdown:
            "**Execution order:** P1, P2, P3, P1, P2, P1.\n**Completion times:** P3 = 5, P2 = 8, P1 = 9.\nNotice the shortest job (P3) finished first even though it arrived last in line — that responsiveness is exactly why interactive systems love Round Robin.",
        },
        {
          label: "(2) Utilization with 1 process",
          markdown:
            "Use Utilization ≈ (1 − wⁿ) × 100% with w = 0.6. For n = 1: 1 − 0.6¹ = 1 − 0.6 = 0.4 → **40%**. A single I/O-heavy process leaves the CPU idle most of the time, waiting on the disk.",
        },
        {
          label: "(2) Utilization with 4 processes",
          markdown:
            "For n = 4: 0.6⁴ = 0.1296, so 1 − 0.1296 = 0.8704 → about **87%**. Same workload per process, but with four of them the CPU almost always has *something* ready to run. That jump from 40% to 87% is the entire business case for multiprogramming.",
        },
      ],
      answer:
        "PART 1: Execution order P1, P2, P3, P1, P2, P1; completion times P3 = 5, P2 = 8, P1 = 9. PART 2: ~40% utilization with 1 process, ~87% with 4 processes — multiprogramming more than doubles CPU usage on an I/O-bound workload.",
    },
    {
      id: "os-check-thread",
      kind: "CHECK",
      question:
        "Two threads in the same process both increment a shared counter at the same time, and the final value comes out wrong. What is the root cause, and why does this NOT happen with two separate processes each incrementing their own counter?",
      choices: [
        { id: "a", label: "A race condition — threads share the same memory, so their increments interleave; separate processes each have private memory, so there is nothing shared to corrupt." },
        { id: "b", label: "A deadlock — the threads are waiting on each other forever." },
        { id: "c", label: "A page fault — the counter was swapped out to disk." },
        { id: "d", label: "Nothing is wrong; thread counts are always exact." },
      ],
      answerId: "a",
      explanation:
        "This is a classic **race condition**. Incrementing a counter is really read-modify-write; if two threads read the same old value before either writes back, one increment is lost. It happens precisely *because* threads share memory — that is their superpower and their hazard. Two separate **processes** have isolated address spaces, so each owns a *different* counter and there is no shared state to corrupt (the trade-off is they would need explicit inter-process communication to coordinate). The fix for threads is a synchronization primitive like a mutex or lock to make the increment atomic. Option b is a different concurrency bug, and option c confuses memory management with synchronization.",
    },
    {
      id: "os-check-vm",
      kind: "CHECK",
      question:
        "Your machine has 8 GB of RAM, yet your open programs together believe they are using 20 GB of memory and everything still works. How is this possible?",
      choices: [
        { id: "a", label: "The programs are lying and actually use under 8 GB total." },
        { id: "b", label: "Virtual memory + paging: each program gets a virtual address space, and inactive pages are parked on disk (swap), pulled back into RAM on demand via page faults." },
        { id: "c", label: "RAM secretly doubles itself when full." },
        { id: "d", label: "The OS deletes programs to make room." },
      ],
      answerId: "b",
      explanation:
        "This is **virtual memory** doing its job. Each program gets its own virtual address space, divided into pages; only the *actively used* pages need to be in physical RAM at any moment. Inactive pages are stored on disk in the **swap** area, and when a program touches a page that is not currently in RAM, a **page fault** triggers the OS to fetch it. This **overcommitment** lets the total \"used\" memory exceed physical RAM. The danger is **thrashing** — if too many pages are active at once, the system spends all its time swapping to slow disk instead of computing. So it works beautifully until it suddenly does not, which is why adding RAM can dramatically speed up a memory-starved machine.",
    },
    {
      id: "os-callout-interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "What interviewers actually probe in the OS round",
      markdown:
        "These come up again and again — have crisp answers ready:\n\n1. **\"Process vs thread?\"** Processes have isolated memory; threads share memory within a process. Threads are cheaper and faster to communicate but unsafe (race conditions); processes are isolated but need IPC to talk. Bonus points for naming the trade-off out loud.\n2. **\"What are the four conditions for deadlock?\"** Mutual exclusion, hold-and-wait, no-preemption, circular wait — and the kicker: break *any one* and deadlock cannot occur. Be ready to give a prevention strategy for each.\n3. **\"Concurrency vs parallelism?\"** Concurrency is *dealing with* many tasks (interleaving on one core); parallelism is *doing* many at once (multiple cores). Single-core can be concurrent, never truly parallel.\n4. **\"Walk me through a Round Robin / SJF schedule.\"** Practice doing one by hand. Then explain the trade-off (responsiveness vs overhead, optimality vs starvation).\n5. **\"What is virtual memory?\"** Not \"more RAM\" — an address-translation abstraction backed by paging that gives isolation, overcommitment, and the illusion of contiguous space.\n\nThe meta-signal interviewers want: do you understand what the OS is *protecting you from* and *abstracting away*? Connect it to real symptoms — \"my service is slow\" → is it CPU-bound or blocked on I/O? — and you sound like someone who has actually debugged production.",
    },
    {
      id: "os-callout-warning",
      kind: "CALLOUT",
      variant: "warning",
      title: "Traps that quietly sink OS answers",
      markdown:
        "- **Concurrency ≠ parallelism.** Interleaving tasks on one core is concurrency; truly simultaneous execution needs multiple cores. Mixing these up is a classic tell.\n- **A frozen program is not automatically a deadlock.** Deadlock specifically requires the circular-wait standoff among held resources. An infinite loop or a slow I/O is *not* a deadlock — be precise.\n- **\"Virtual memory\" is not extra RAM.** It is an address-translation trick. Swap uses disk, which is ~100,000× slower than RAM, so leaning on it heavily means thrashing, not free memory.\n- **Context switches are not free.** Every switch costs direct save/restore time *plus* cache misses. \"Just add more threads\" can make things slower if switch overhead dominates.\n- **SJF is optimal but impractical.** It minimizes average wait time *only if* you know burst lengths in advance — which you usually do not — and it starves long jobs.\n- **A bigger Round Robin quantum is not always better.** Too large degrades to FCFS; too small drowns in context-switch overhead. The right answer is \"it depends on the switch cost.\"",
    },
    {
      id: "os-recap",
      kind: "CALLOUT",
      variant: "insight",
      title: "The one frame that ties it all together",
      markdown:
        "Every job of an operating system is really about **sharing one set of scarce resources among many greedy programs without letting them hurt each other.** The CPU is scarce, so the *scheduler* decides who runs and context-switches between them. RAM is scarce, so *virtual memory and paging* hand out the illusion of plenty while juggling pages to disk. Shared resources invite conflict, so *isolation* keeps processes apart and *synchronization* keeps threads from corrupting shared state — and when coordination goes wrong, you get *deadlock*. And because programs waste so much time waiting on I/O, *multiprogramming* keeps the expensive CPU busy by always having another program ready. Hold that single frame — scarce resources, many programs, no collateral damage — and every OS concept snaps into place.",
    },
  ],
  keyTakeaways: [
    "An OS is the abstraction layer and resource manager between hardware and programs, running in privileged kernel mode while your code runs in restricted user mode and asks for services via system calls.",
    "A process has isolated private memory; threads live inside a process and share its memory — so threads are fast to communicate but prone to race conditions, while processes are safe but need IPC.",
    "A context switch (save state, load next) creates the illusion of simultaneity but costs real time and cache misses, which is why switching too often causes thrashing and kills throughput.",
    "Scheduling algorithms trade off different goals: FCFS is simple but suffers the convoy effect, SJF minimizes average wait but starves long jobs, Round Robin is responsive but quantum-sensitive, and priority scheduling needs aging to avoid starvation.",
    "Deadlock requires all four Coffman conditions at once — mutual exclusion, hold-and-wait, no-preemption, circular wait — and breaking any single one prevents it.",
    "Virtual memory plus paging gives each program an isolated, seemingly contiguous, overcommittable address space backed by RAM and disk swap; lean on swap too hard and you thrash.",
    "Multiprogramming raises CPU utilization because while one I/O-bound process waits, another can compute — utilization ≈ (1 − wⁿ) × 100%, so adding processes shrinks idle time exponentially.",
  ],
};
