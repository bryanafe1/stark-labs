import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  {
    id: "computer_architecture_cache_locality_traversal",
    slug: "concept-computer-architecture-cache-locality-traversal",
    title: "Why the Same Loop Runs 10x Slower",
    prompt: "An engineer has a 2D array stored in row-major order. Looping over it row-by-row is fast, but a colleague's seemingly identical code that loops column-by-column runs roughly 10x slower on the same machine with the same total number of array accesses.",
    discipline: "COMPUTER",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["computer-architecture", "conceptual"],
    skillAreas: ["computer-architecture"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Explain mechanically why the column-major traversal is so much slower, even though both versions touch exactly the same data the same number of times.",
        rubric: "Should identify that caches load fixed-size lines (e.g. 64 bytes), so a row-major walk reads contiguous memory and gets many useful elements per line (high spatial locality, few misses). Column-major access strides through memory, touching one element per line, often evicting the line before reuse, causing a miss nearly every access. Should mention that a cache miss costs tens to hundreds of cycles versus a hit of a few cycles, and may note hardware prefetchers detect the sequential pattern and hide latency for the row case. Key insight: performance is dominated by the memory access PATTERN relative to cache line granularity, not the raw count of accesses.",
      },
      {
        prompt: "Now the constraints change - you genuinely must process the data in column order (the algorithm requires it) and the matrix is far larger than the last-level cache. What architectural or software techniques would you use to recover performance, and what is the limiting factor you cannot escape?",
        rubric: "Should propose cache blocking/tiling: process the matrix in small sub-blocks that fit in cache so each loaded line is fully reused before eviction, restoring spatial and temporal locality regardless of outer iteration order. May mention transposing the matrix once up front to convert the access pattern, loop interchange, or software prefetch hints. Should acknowledge the unavoidable limit: total data must move from DRAM at least once, so you are ultimately bounded by memory bandwidth, and tiling reduces redundant traffic but cannot beat the compulsory misses. Key insight: you cannot change the data layout's locality for free, but blocking restructures the computation to maximize reuse per cache line, leaving only the compulsory DRAM bandwidth as the floor.",
      },
    ],
  },
  {
    id: "computer_architecture_pipeline_hazards",
    slug: "concept-computer-architecture-pipeline-hazards",
    title: "Stalls in a Classic Five-Stage Pipeline",
    prompt: "Consider a classic five-stage in-order pipeline (fetch, decode, execute, memory, writeback). A new compiler emits code where the result of a load is used by the very next instruction, and the pipeline visibly stalls.",
    discipline: "COMPUTER",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["computer-architecture", "conceptual"],
    skillAreas: ["computer-architecture"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Explain what kind of hazard this is, why forwarding (bypassing) does not fully eliminate it for a load followed by a dependent instruction, and what the hardware must do.",
        rubric: "Should identify this as a data hazard, specifically a read-after-write (RAW) true dependency, and call out the load-use hazard. Should explain that forwarding routes results from later pipeline stages back to execute, but a load's data is not available until the end of the memory stage, which is too late to forward into the dependent instruction's execute stage in the immediately following cycle. Therefore the hardware must insert at least one stall/bubble (interlock) even with full forwarding. Should distinguish from structural and control hazards. Key insight: forwarding removes ALU-to-ALU dependency stalls, but the load-use case has an irreducible one-cycle gap because the data simply does not exist early enough.",
      },
      {
        prompt: "Now the constraints change - you are designing the ISA and microarchitecture together, and you want to avoid hardware interlocks entirely to simplify the control logic. What are your options, and what do you trade away with each?",
        rubric: "Should offer options such as: (a) exposing the delay to software so the compiler must schedule an independent instruction into the load-delay slot or insert a nop, trading hardware simplicity for code that is tied to a specific pipeline depth and harder to maintain (the classic delayed-load/branch-delay-slot approach, which became a liability as pipelines lengthened); (b) compiler instruction scheduling to fill the gap with useful independent work even on an interlocked design; (c) moving to out-of-order execution so independent instructions issue around the stall, at large hardware cost. Should note exposing microarchitecture in the ISA harms forward/backward compatibility. Key insight: you can push the hazard from hardware to software, but doing so leaks microarchitectural details into the ISA and ties binaries to one pipeline design, which is why modern designs keep interlocks and rely on scheduling or OoO instead.",
      },
    ],
  },
  {
    id: "computer_architecture_branch_prediction",
    slug: "concept-computer-architecture-branch-prediction",
    title: "When the Branch Predictor Gives Up",
    prompt: "A deeply pipelined out-of-order core relies heavily on branch prediction. A hot loop contains a data-dependent branch whose outcome looks essentially random with respect to any history, and profiling shows the core is spending most of its time recovering from mispredictions.",
    discipline: "COMPUTER",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["computer-architecture", "conceptual"],
    skillAreas: ["computer-architecture"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Explain why branch prediction matters so much in a deep, wide, out-of-order pipeline, and why a near-random branch is so costly relative to a highly predictable one.",
        rubric: "Should explain that the front end must speculatively fetch and execute down a predicted path because the branch outcome is not known until execute, many cycles after fetch. A correct prediction keeps the pipeline full; a misprediction means all speculatively executed work past the branch must be squashed and the pipeline refilled, incurring a penalty proportional to pipeline depth (the misprediction penalty, often 15-20+ cycles). In a wide OoO machine the wasted work scales with issue width too. A near-random branch defeats history-based predictors (around 50 percent accuracy), so the penalty is paid constantly. Key insight: the cost of a branch is not the branch itself but the speculative work thrown away on a miss, and that cost grows with pipeline depth and width, making unpredictable branches disproportionately expensive on aggressive cores.",
      },
      {
        prompt: "Now the constraints change - assume the branch truly cannot be predicted (the data is random). What techniques at the algorithm, compiler, or hardware level can reduce or eliminate the misprediction cost, and what is the downside of each?",
        rubric: "Should propose converting control dependence into data dependence: branchless code using conditional moves (cmov), predication, or arithmetic/bit tricks so both sides are computed and the result selected without a branch, eliminating the misprediction at the cost of always doing the work of both paths. May mention sorting or partitioning data so the branch becomes predictable, restructuring the algorithm to remove the branch, or SIMD/masking. May mention hardware predication or that cmov is not always a win (it serializes a dependency and is bad when the branch IS predictable). Key insight: when a branch is fundamentally unpredictable, the right move is to remove the branch by turning control flow into straight-line computation or selection, trading some redundant work for the elimination of a large, constant misprediction penalty.",
      },
    ],
  },
  {
    id: "computer_architecture_amdahl_scaling",
    slug: "concept-computer-architecture-amdahl-scaling",
    title: "Why 16 Cores Did Not Give 16x",
    prompt: "A team parallelizes a workload and is disappointed: moving from 1 to 8 cores gave roughly a 5x speedup, and going from 8 to 16 cores barely helped at all.",
    discipline: "COMPUTER",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["computer-architecture", "conceptual"],
    skillAreas: ["computer-architecture"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Using Amdahl's law reasoning, explain why adding cores gives diminishing returns. State the relationship plainly and identify what fundamentally caps the speedup.",
        rubric: "Should state Amdahl's law: if a fraction p of the work is parallelizable and (1 - p) is serial, then speedup with N cores is 1 / ((1 - p) + p/N). Should explain that as N grows, the parallel term p/N shrinks toward zero but the serial term (1 - p) does not, so speedup asymptotes to 1 / (1 - p) regardless of how many cores you add. Should connect this to the numbers: a 5x speedup at 8 cores implies a meaningful serial fraction, and the near-zero gain from 8 to 16 shows the parallel part is already small relative to the serial bottleneck. Key insight: the serial fraction sets a hard ceiling on speedup no matter how many cores you add, so optimizing the serial portion matters more than adding cores once you are near the limit.",
      },
      {
        prompt: "Now the constraints change - the customer says they will keep buying bigger machines but will also feed in proportionally larger datasets. Does that change the scaling story, and what other real-world overheads beyond the serial fraction limit multicore speedup in practice?",
        rubric: "Should invoke Gustafson's law / weak scaling: if the problem size grows with the number of cores, the parallel portion grows while the serial portion stays roughly fixed, so achievable speedup scales much better than fixed-size (strong-scaling) Amdahl predicts. This reframes the goal as doing more work in the same time rather than the same work faster. Should also cite practical limits beyond the serial fraction: synchronization and locking overhead, communication/coherence traffic, load imbalance, contention for shared memory bandwidth and last-level cache, and NUMA effects. Key insight: Amdahl assumes a fixed problem size; with scaled workloads (Gustafson) parallelism pays off far better, but real systems are further capped by communication, synchronization, and shared-resource contention, not just the serial code fraction.",
      },
    ],
  },
  {
    id: "computer_architecture_virtual_memory_tlb",
    slug: "concept-computer-architecture-virtual-memory-tlb",
    title: "The TLB and the Cost of Translation",
    prompt: "A server application that streams through a very large, sparsely accessed data structure shows high performance counters for TLB misses and page walks, even though its actual cache hit rate looks reasonable.",
    discipline: "COMPUTER",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["computer-architecture", "conceptual"],
    skillAreas: ["computer-architecture"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Explain the role of virtual memory and the TLB, what a TLB miss actually triggers, and why a workload can have a decent data cache hit rate yet still be bottlenecked on address translation.",
        rubric: "Should explain virtual memory gives each process a private virtual address space mapped to physical frames via page tables, providing isolation and the illusion of large contiguous memory. The TLB is a small cache of recent virtual-to-physical translations; every memory access needs a translation, so a TLB hit is essential for speed. A TLB miss triggers a page walk through the multi-level page table (several dependent memory accesses), which is expensive. Should explain the decoupling: data cache hit rate measures locality of the DATA, but the TLB caches TRANSLATIONS keyed by page; a workload touching many different pages (even with good locality within each line) can blow out the TLB's limited reach while the data lines themselves still hit. Key insight: address translation is a separate caching problem from data caching - you can have good data locality but poor page locality, so TLB reach, not cache hit rate, becomes the bottleneck for workloads spread across many pages.",
      },
      {
        prompt: "Now the constraints change - you want to reduce the translation overhead without rewriting the application's access pattern. What mechanisms address this, how do they help, and what are the trade-offs?",
        rubric: "Should propose huge/large pages (e.g. 2 MB or 1 GB instead of 4 KB): a single TLB entry then covers far more memory, dramatically increasing TLB reach and reducing misses and page-walk frequency. Trade-offs include internal fragmentation and memory waste, harder allocation/contiguity requirements, and coarser granularity for swapping/protection. May also mention multi-level TLBs and larger TLBs, hardware page-walk caches that cache upper page-table levels, and that some of these are not under software control. May note the OS (transparent huge pages) versus explicit application allocation. Key insight: the most direct lever is increasing TLB reach via larger page sizes so each entry maps more memory, trading some memory efficiency and allocation flexibility for far fewer translation misses.",
      },
    ],
  },
  {
    id: "computer_architecture_throughput_vs_latency",
    slug: "concept-computer-architecture-throughput-vs-latency",
    title: "Fast Per Request but Low Total Throughput",
    prompt: "Two processor designs are being compared for a request-processing service. Design A finishes any single request in the lowest time. Design B is slower on any single request in isolation but can have many requests in flight at once.",
    discipline: "COMPUTER",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["computer-architecture", "conceptual"],
    skillAreas: ["computer-architecture"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Define latency versus throughput, explain why optimizing one does not automatically optimize the other, and give an architectural example of a design choice that trades one for the other.",
        rubric: "Should define latency as the time to complete a single operation (how long one request takes) and throughput as the number of operations completed per unit time (rate). Should explain they are distinct: a design can have high latency yet high throughput by overlapping/pipelining many in-flight operations, or low latency on one request but low throughput if it cannot keep many in flight. Architectural examples: pipelining (increases throughput, may slightly raise per-instruction latency); deeper buffering/batching; GPUs and SMT/many-core designs that hide latency with massive parallelism to maximize throughput; versus an aggressive single-core OoO design that minimizes single-thread latency. Should connect to Little's law intuition (in-flight = throughput * latency) if possible. Key insight: latency is per-operation time and throughput is completion rate; you raise throughput by overlapping work even at the cost of per-operation latency, so the right design depends on whether you care about one request or many.",
      },
      {
        prompt: "Now the constraints change - the service has a strict per-request tail-latency SLA (for example, 99th percentile must stay under a deadline) AND must handle very high request volume. Which design do you lean toward, and how do you reconcile the throughput-latency tension?",
        rubric: "Should recognize the tension: pure throughput-oriented designs (deep batching, heavy queuing, SMT contention) tend to inflate tail latency because requests wait behind others, violating a strict p99 SLA even if mean latency and aggregate throughput look fine. Strategies: bound queue depths and batch sizes to cap waiting time, provision enough parallel units/cores so you can serve volume without deep queues (use throughput via concurrency rather than batching a single pipeline), isolate or prioritize latency-sensitive work, and watch utilization since latency grows sharply as utilization approaches saturation (queueing theory). May favor a design that scales out concurrency while keeping per-request critical path short, accepting lower peak utilization to protect the tail. Key insight: high throughput and tight tail latency conflict because the usual throughput tricks add queuing delay; you reconcile them by scaling concurrency (more parallel resources) instead of deepening queues, and by keeping utilization below saturation so the tail stays bounded.",
      },
    ],
  },
];
