import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_arch",
  slug: "computer-architecture-cpu-and-cache",
  title: "CPU & Cache: Why Your Processor Spends Its Life Waiting",
  summary:
    "Your CPU is a Formula 1 engine bolted to a horse-drawn cart. It can do billions of operations a second, but main memory makes it twiddle its thumbs for *hundreds* of cycles every time it needs data. Caches are the heroic hack that hides that gap. You will learn the memory hierarchy, the locality that makes caching work, and the one formula — AMAT — that explains why shaving a few percent off your miss rate can make code fly.",
  discipline: "COMPUTER",
  difficulty: "MEDIUM",
  estMinutes: 23,
  tags: ["computer-architecture", "cache", "cpu"],
  objectives: [
    "Lay out the memory hierarchy from registers to disk and explain the speed/size/cost trade-off at each level.",
    "Define temporal and spatial locality and explain why caches exploit both.",
    "Explain cache hits, misses, and cache lines, and why data moves in blocks, not bytes.",
    "Compute Average Memory Access Time with AMAT = hitTime + missRate · missPenalty.",
    "Quantify the CPU-to-RAM latency gap and explain why it forces caching to exist.",
    "Connect CPU performance basics — clock rate and CPI — to how memory stalls wreck throughput.",
  ],
  prerequisites: [
    "What a CPU does at a high level (fetch, decode, execute)",
    "Bits, bytes, and the idea of an address pointing at memory",
    "Basic arithmetic with percentages and nanoseconds",
  ],
  interviewAngle:
    "Cache and memory-hierarchy questions are where systems interviews separate people who memorized Big O from people who understand machines. The classic prompts — \"why is iterating a 2D array row-major faster than column-major?\", \"what is a cache miss and what does it cost?\", \"how would you make this loop cache-friendly?\" — all reduce to one idea: the CPU is starved for data and caches feed it by betting on locality. Strong candidates reach for AMAT to reason quantitatively, know that a miss can cost 100+ cycles, explain that data moves in cache lines so access *patterns* matter as much as access *counts*, and tie it back to real performance with CPI and clock rate. They also know the punchline: a tiny change in miss rate dominates average access time because the miss penalty is so huge. Weak candidates treat memory as a single flat, instant resource and are baffled when two algorithms with identical Big O run 10× apart.",
  blocks: [
    {
      id: "arch-hook",
      kind: "PROSE",
      title: "A race car stuck in traffic",
      markdown:
        "Here is a dirty secret about the chip in your laptop: it spends an astonishing fraction of its life doing *nothing but waiting*.\n\nA modern CPU core can execute several instructions per nanosecond. But when it needs a piece of data that lives in main memory (RAM), it has to send a request out and twiddle its thumbs for something like **100 nanoseconds** before the answer comes back. In CPU time, that is *hundreds* of wasted cycles — enough to have run several hundred instructions. It is a race car that hits a red light every block.\n\nIf the processor actually waited for RAM on every access, your blazing gigahertz chip would crawl at the speed of the memory bus. Useless.\n\nSo computer architects pulled off one of the great magic tricks in engineering: a tiny, ultra-fast stash of memory called a **cache** that sits right next to the core and holds the data you are *probably* about to use. When the bet pays off, the CPU never sees the red light. This lesson is about how that bet works, why it works shockingly often, and the one formula that tells you exactly how much it buys you.",
    },
    {
      id: "arch-video",
      kind: "VIDEO",
      youtubeId: "SAk-6gVkio0",
      title: "Watch: How CPU Memory & Caches Work",
      channel: "Computerphile",
    },
    {
      id: "arch-hierarchy",
      kind: "PROSE",
      title: "The memory hierarchy: a pyramid of compromises",
      markdown:
        "There is no such thing as memory that is simultaneously huge, instant, and cheap. Physics and economics force a trade-off, so computers stack *several* kinds of memory into a pyramid — tiny and lightning-fast at the top, vast and sluggish at the bottom:\n\n- **Registers** — a few dozen slots *inside* the core. Access in well under a nanosecond (0 cycles of delay). Measured in *bytes*.\n- **L1 cache** — ~32 KB per core. ~1 ns, a handful of cycles. Split into instructions and data.\n- **L2 cache** — ~256 KB–1 MB. A few ns.\n- **L3 cache** — a few to tens of MB, shared across cores. ~10–20 ns.\n- **Main memory (RAM)** — gigabytes. ~100 ns. The infamous red light.\n- **Disk / SSD** — terabytes. *Microseconds to milliseconds* — thousands to millions of times slower than RAM.\n\nNotice the pattern: every step down is **bigger and cheaper per byte, but slower**. As you climb the pyramid, speed goes up and capacity goes down. The whole art of the memory system is keeping the data you need *right now* as high up that pyramid as possible — ideally in a cache, so the slow lower levels stay out of your critical path.",
    },
    {
      id: "arch-locality",
      kind: "PROSE",
      title: "Locality: the reason caching isn't hopeless",
      markdown:
        "A cache is tiny. RAM is gigantic. How can a thimble of fast memory possibly hold \"what you need\" out of billions of bytes? It would be hopeless — *except* that real programs are gloriously predictable. They obey two patterns called **locality**:\n\n- **Temporal locality — \"if you used it, you'll use it again soon.\"** Loop counters, the current object, a hot function: programs touch the same data over and over in a short window. Think of leaving the cookbook open on the counter because you keep glancing back at the recipe.\n- **Spatial locality — \"if you used it, you'll use its neighbors next.\"** Arrays, structs, and instruction streams march through *adjacent* addresses. Reading `a[0]` means `a[1]`, `a[2]`, `a[3]` are almost certainly next. Think of grabbing the whole carton of eggs, not driving back to the store for each egg.\n\nCaches exploit *both*. Temporal locality is why a cache *keeps* recently used data around. Spatial locality is why, when you ask for one byte, the cache quietly grabs a whole **block of neighbors** at the same time. Without locality, caching would be a coin flip. With it, caches guess right the vast majority of the time — and that high hit rate is the entire reason your computer feels fast.",
    },
    {
      id: "arch-hits-lines",
      kind: "PROSE",
      title: "Hits, misses, and why data travels in chunks",
      markdown:
        "Every time the CPU wants data, it asks the cache first. Two things can happen:\n\n- **Cache hit** — the data is already there. Lightning fast, a few cycles. Pay only the **hit time**.\n- **Cache miss** — not there. Now the CPU must trudge down to a slower level (L2, L3, or all the way to RAM), wait out the **miss penalty**, *and* copy the data up so next time it is a hit.\n\nThe fraction of accesses that miss is the **miss rate**; one minus that is the **hit rate**. A 5% miss rate means 95 of every 100 accesses are nearly free and 5 are expensive — and as we will see, those 5 can dominate.\n\nHere is the crucial mechanical detail: caches do **not** move single bytes. They move fixed-size blocks called **cache lines**, typically **64 bytes**. Ask for one `int` and the cache hauls in the 64-byte neighborhood around it. That is spatial locality cashed in: the next 15 ints are now already present, so the next accesses are free hits.\n\nThis is also why *access patterns matter as much as access counts*. Walk an array straight through (sequentially) and each 64-byte line you pull serves many accesses — great hit rate. Jump around randomly or stride across rows the wrong way, and you pull a fresh line for nearly every access, thrashing the cache. Same number of accesses, wildly different performance — the thing that mystifies people who think memory is flat.",
    },
    {
      id: "arch-formula",
      kind: "FORMULA",
      title: "AMAT: the price of an average memory access",
      display: "AMAT = hitTime + missRate · missPenalty",
      variables: [
        { symbol: "AMAT", name: "Average Memory Access Time", unit: "ns" },
        { symbol: "hitTime", name: "Time to access the cache (paid on every access)", unit: "ns" },
        { symbol: "missRate", name: "Fraction of accesses that miss (0 to 1)" },
        { symbol: "missPenalty", name: "Extra time to fetch from the slower level on a miss", unit: "ns" },
      ],
      note:
        "Read it as: you always pay the hit time, plus — on the fraction of accesses that miss — an extra penalty. Because the penalty is so much larger than the hit time (think 100 ns versus 1 ns), even a small miss rate carries a big chunk of the average. Real hierarchies nest this formula: a miss in L1 pays L2's AMAT as its penalty, and so on down the pyramid.",
    },
    {
      id: "arch-sandbox",
      kind: "SANDBOX",
      title: "Play: feel the miss rate dominate",
      description:
        "Average Memory Access Time, live. The defaults — hit time 1 ns, miss rate 0.05 (5%), miss penalty 100 ns — give AMAT = 1 + 0.05 × 100 = 6.00 ns. Look at that: a 1 ns cache delivers 6 ns *average* access, because the 5% of misses each cost 100 ns. Now nudge the miss rate from 0.05 to 0.10 and watch AMAT leap from 6 to 11 ns — almost double, from a tiny 5-point change. Then try dropping the penalty: the miss rate is the lever that moves the world.",
      variables: [
        { key: "hit", label: "Hit time", unit: "ns", min: 0.5, max: 5, step: 0.5, default: 1 },
        { key: "miss", label: "Miss rate (0–1)", unit: "", min: 0, max: 1, step: 0.01, default: 0.05 },
        { key: "pen", label: "Miss penalty", unit: "ns", min: 10, max: 300, step: 5, default: 100 },
      ],
      expression: "hit + miss * pen",
      outputLabel: "AMAT",
      outputUnit: "ns",
      precision: 2,
    },
    {
      id: "arch-predict-missrate",
      kind: "PREDICT",
      question:
        "Hit time is 1 ns and miss penalty is 100 ns. You improve your code so the miss rate drops from 5% to 1%. Roughly what happens to AMAT? Lock in your guess.",
      options: [
        { id: "a", label: "It barely changes — 4 percentage points is tiny." },
        { id: "b", label: "It drops from 6 ns to 2 ns — roughly a 3× speedup in average access." },
        { id: "c", label: "It drops from 6 ns to 5.5 ns." },
        { id: "d", label: "It increases, because lower miss rate means more cache work." },
      ],
      answerId: "b",
      reveal:
        "**It drops from 6 ns to 2 ns.** At 5%: AMAT = 1 + 0.05 × 100 = 6 ns. At 1%: AMAT = 1 + 0.01 × 100 = 2 ns. A \"tiny\" 4-percentage-point change cut average access time by a factor of 3. The reason is the lopsided penalty: a miss costs 100× a hit, so the miss term dominates the whole average. This is exactly why cache-friendly code (sequential access, smaller working sets, good data layout) can produce dramatic speedups with no change to your Big O.",
    },
    {
      id: "arch-predict-locality",
      kind: "PREDICT",
      question:
        "Cache lines are 64 bytes. You sum a large array of 4-byte ints. Which access pattern gives the BEST cache performance?",
      options: [
        { id: "a", label: "Reading the array straight through, index 0, 1, 2, 3, ..." },
        { id: "b", label: "Reading every 16th element, then coming back for the rest." },
        { id: "c", label: "Reading elements at random indices." },
        { id: "d", label: "It makes no difference — same number of reads either way." },
      ],
      answerId: "a",
      reveal:
        "**Reading straight through (a).** A 64-byte line holds 16 four-byte ints. Walk sequentially and the *first* access to each line is a miss that hauls in 16 ints; the next 15 accesses are free hits. That is spatial locality paying off — about 1 miss per 16 reads. Random access (c) likely pulls a fresh line nearly every read (close to a miss every time), and striding by 16 (b) touches a new line on each step, wasting most of every line it loads. Option (d) is the classic flat-memory fallacy: identical read *counts*, radically different miss rates — and AMAT only cares about the misses.",
    },
    {
      id: "arch-gap-cpi",
      kind: "PROSE",
      title: "The latency gap, and how stalls wreck throughput",
      markdown:
        "Why all this fuss? Because the speed gap between CPU and RAM is *enormous* and has only widened for decades — often dramatized as the \"memory wall.\" A CPU cycle is a fraction of a nanosecond; a RAM access is ~100 ns. So a single cache miss to main memory can stall the core for **hundreds of cycles**, during which a modern out-of-order chip could have retired hundreds of instructions. Misses are not a rounding error; they are the main event.\n\nTo see the damage, meet two basic CPU performance numbers:\n\n- **Clock rate** — cycles per second (a 3 GHz chip ticks 3 billion times a second, so one cycle ≈ 0.33 ns).\n- **CPI — cycles per instruction** — how many clock cycles an average instruction takes. Lower is better; superscalar cores even achieve CPI below 1.\n\nThe headline identity ties it together:\n\n`CPU time = (instructions) × (CPI) × (cycle time)`.\n\nHere is the punchline: **memory stalls inflate the effective CPI.** If 30% of your instructions touch memory and each miss adds, say, 100 stall cycles, your beautiful CPI of 1 can balloon to an effective CPI of 4 or 5 — meaning your 3 GHz processor delivers the throughput of a much slower one. You did not change a single line of logic; you just stalled waiting for data. That is why architects pour silicon into caches and why programmers who respect locality get \"free\" speedups. The cache is not a nice-to-have; it is what keeps the clock rate from being a lie.",
    },
    {
      id: "arch-worked",
      kind: "WORKED_EXAMPLE",
      title: "Worked example: AMAT and the power of a small miss-rate change",
      problem:
        "A CPU has an L1 cache with a hit time of 1 ns. On an L1 miss it must go to main memory, which adds a miss penalty of 120 ns. (a) If the L1 miss rate is 4%, what is the AMAT? (b) A colleague restructures the inner loop to access memory sequentially, dropping the miss rate to 1%. What is the new AMAT? (c) By what factor did the average memory access improve, and what does that say about where to spend optimization effort?",
      steps: [
        {
          label: "(a) AMAT at 4% miss rate",
          markdown:
            "Plug into AMAT = hitTime + missRate · missPenalty: AMAT = 1 ns + 0.04 × 120 ns = 1 + 4.8 = **5.8 ns**. Notice the cache itself is only 1 ns, but misses drag the average to nearly 6 ns.",
        },
        {
          label: "(b) AMAT at 1% miss rate",
          markdown:
            "Same formula, new miss rate: AMAT = 1 ns + 0.01 × 120 ns = 1 + 1.2 = **2.2 ns**. The hit time did not change at all — only the miss contribution shrank, from 4.8 ns down to 1.2 ns.",
        },
        {
          label: "(c) The improvement factor",
          markdown:
            "Speedup in average access = 5.8 / 2.2 ≈ **2.6×**. A change of just 3 percentage points in miss rate — achieved purely by accessing memory in a cache-friendly *order*, not by doing less work — made memory access about 2.6× faster on average.",
        },
        {
          label: "The takeaway",
          markdown:
            "Because the miss penalty (120 ns) towers over the hit time (1 ns), the miss-rate term carries almost the entire average. So the highest-leverage optimization is usually **reducing misses** — better data layout, sequential access, smaller working sets — not micro-optimizing the already-fast hit path.",
        },
      ],
      answer:
        "(a) AMAT = 5.8 ns; (b) AMAT = 2.2 ns; (c) ≈ 2.6× faster average access from a 3-point miss-rate drop — proving the miss rate, amplified by a huge penalty, dominates memory performance.",
    },
    {
      id: "arch-check-amat",
      kind: "CHECK",
      question:
        "A cache has a hit time of 2 ns, a miss rate of 10%, and a miss penalty of 80 ns. What is the AMAT?",
      choices: [
        { id: "a", label: "2 ns — most accesses hit." },
        { id: "b", label: "10 ns — that's 2 + 0.10 × 80." },
        { id: "c", label: "82 ns — hit time plus miss penalty." },
        { id: "d", label: "8 ns — just the miss term." },
      ],
      answerId: "b",
      explanation:
        "AMAT = hitTime + missRate · missPenalty = 2 + 0.10 × 80 = 2 + 8 = **10 ns**. You *always* pay the 2 ns hit time, and on the 10% of accesses that miss you pay an extra 80 ns, which averages to 8 ns across all accesses. Option (c) is the cost of a *single* miss, not the average; option (a) ignores misses entirely; option (d) forgets the hit time you pay on every access.",
    },
    {
      id: "arch-check-locality",
      kind: "CHECK",
      question:
        "A loop reads the same small lookup table thousands of times in quick succession. Which form of locality is it relying on, and why does the cache help?",
      choices: [
        { id: "a", label: "Spatial locality — the table's bytes are adjacent in memory." },
        { id: "b", label: "Temporal locality — the same data is reused repeatedly in a short window, so it stays cached." },
        { id: "c", label: "Neither — repeated access defeats caching." },
        { id: "d", label: "Both equally, with no way to tell them apart." },
      ],
      answerId: "b",
      explanation:
        "Reusing the *same* data over and over in a short time window is the definition of **temporal locality**. After the first access loads the table into cache, every later access in the loop is a fast hit — the cache keeps recently used data around precisely because programs tend to come back to it. (Spatial locality is the *separate* idea that you tend to use *neighboring* addresses next, which is why lines are 64 bytes. A real loop over a table often enjoys both, but the dominant effect of hammering the same entries is temporal.)",
    },
    {
      id: "arch-callout-interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "How to answer the cache question they always ask",
      markdown:
        "The setup is some version of: *\"These two functions have the same Big O — why is one 10× faster?\"* The expected answer threads three ideas:\n\n1. **Memory is a hierarchy, not a flat box.** A hit is a few ns; a miss to RAM is ~100 ns. Big O counts *operations*, not *memory stalls*.\n2. **Locality decides your miss rate.** Sequential access streams full 64-byte cache lines (great spatial locality); random or wrong-stride access (e.g. column-major over a row-major array) thrashes the cache.\n3. **AMAT makes it quantitative.** `AMAT = hitTime + missRate · missPenalty`. Because the penalty dwarfs the hit time, a small miss-rate difference explains a large runtime gap, and those stalls inflate effective CPI.\n\nGold-star moves: name the 64-byte cache line, mention that recursion and large working sets blow out of cache, and tie it back to `CPU time = instructions × CPI × cycle time`. Saying \"same Big O, different *constant factor*, and the constant is dominated by cache misses\" is the exact sentence interviewers are listening for.",
    },
    {
      id: "arch-callout-warning",
      kind: "CALLOUT",
      variant: "warning",
      title: "Mental-model bugs that bite people",
      markdown:
        "- **Memory is not flat or instant.** Treating every access as one fixed cost is the single biggest beginner mistake; the cost ranges over *four orders of magnitude* from register to disk.\n- **You always pay the hit time.** AMAT adds the miss penalty *on top of* the hit time; misses do not replace it. Forgetting this undercounts AMAT.\n- **Miss rate is a fraction, not a percentage, in the formula.** Use 0.05, not 5, or your AMAT will be off by 100×.\n- **Access *pattern* beats access *count*.** Two loops with identical read counts can have wildly different miss rates; the cache rewards sequential, line-friendly access.\n- **Caches move lines, not bytes.** Touching one byte loads ~64. That is great for neighbors and terrible for scattered, pointer-chasing data structures.",
    },
    {
      id: "arch-recap",
      kind: "CALLOUT",
      variant: "insight",
      title: "The whole lesson in one breath",
      markdown:
        "The CPU is fast and memory is slow, so computers stack a *hierarchy* — registers, L1/L2/L3, RAM, disk — getting bigger and slower as you descend. Caches bridge the gap by betting on **locality**: keep recently used data (temporal) and grab whole neighboring lines (spatial). Whether the bet pays off is your hit/miss rate, and `AMAT = hitTime + missRate · missPenalty` turns it into a number. Because the miss penalty is roughly 100× the hit time, the **miss rate dominates** — which is why cache-friendly, sequential code can be many times faster than cache-hostile code with the *exact same* Big O.",
    },
  ],
  keyTakeaways: [
    "Memory is a hierarchy — registers → L1/L2/L3 caches → RAM → disk — where each step down is bigger and cheaper per byte but slower, spanning roughly four orders of magnitude in latency.",
    "Caches work because programs have locality: temporal (reuse the same data soon) and spatial (use neighboring addresses next), so a small fast cache captures most accesses.",
    "Data moves in fixed-size cache lines (typically 64 bytes), so a single access loads a whole neighborhood — which is why sequential access patterns crush random ones even at identical read counts.",
    "AMAT = hitTime + missRate · missPenalty: you always pay the hit time and add the penalty only on the fraction that miss (use the miss rate as a fraction, e.g. 0.05).",
    "Because the miss penalty (~100 ns to RAM) dwarfs the hit time (~1 ns), a small change in miss rate dominates average access time — a 5%→1% drop can roughly triple effective speed.",
    "The CPU-to-RAM latency gap (the memory wall) means a single miss can stall the core for hundreds of cycles, inflating effective CPI and wasting clock rate.",
    "CPU time = instructions × CPI × cycle time, so memory stalls that raise effective CPI make a fast clock deliver slow throughput — which is why cache-friendly code yields free speedups.",
  ],
};
