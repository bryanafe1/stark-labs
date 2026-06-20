import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_bigo",
  slug: "algorithms-and-big-o",
  title: "Big O: How to Brag About Slowness Without Owning a Stopwatch",
  summary:
    "Two programs solve the same problem. One finishes before you blink; the other is still chewing when the heat death of the universe rolls around. Big O is the language that tells them apart without ever timing a single run. You will learn to drop the noise, read a loop's growth on sight, see why log n is borderline magic, and answer the complexity question every interviewer secretly loves to ask.",
  discipline: "COMPUTER",
  difficulty: "MEDIUM",
  estMinutes: 24,
  tags: ["algorithms", "big-o", "complexity"],
  objectives: [
    "Define Big O as the growth rate of work as n grows large, and explain why we drop constants and lower-order terms.",
    "Rank the common complexity classes O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) and recognize each in real code.",
    "Read the time complexity of a loop or nested loops directly from its structure.",
    "Explain why O(log n) is so fast using binary search and the halving trick.",
    "Distinguish time complexity from space complexity, and worst case from average case.",
    "Analyze a nested loop and a binary search from scratch and state their Big O.",
  ],
  prerequisites: [
    "Reading basic pseudocode or any C-style language (loops, arrays, function calls)",
    "Comfort with exponents and logarithms (2³ = 8, so log₂ 8 = 3)",
    "The idea of an array as indexed storage",
  ],
  interviewAngle:
    "Complexity analysis is the tax you pay on almost every coding interview: even when the prompt is \"write a function,\" the unspoken follow-up is \"now what is its time and space complexity, and can you do better?\" Interviewers use Big O to check whether you reason about scale instead of just getting one test case to pass. Strong candidates state the complexity of their solution unprompted, name the dominant term and why it dominates, separate time from space, and call out worst versus average case (especially for things like hashing and quicksort). They also know the cheat codes: a single loop over n is usually O(n), nested loops over the same n are usually O(n²), and any time you halve the search space each step you are looking at O(log n). Weak candidates either guess, conflate the size of the input with the size of a number, or forget that the recursion stack and extra arrays cost space.",
  blocks: [
    {
      id: "bigo-hook",
      kind: "PROSE",
      title: "The race nobody runs with a stopwatch",
      markdown:
        "Imagine two programmers swear their search function is \"fast.\" One tests it on 10 names and it returns instantly. The other tests it on 10 names and it *also* returns instantly. Tie game, right?\n\nNow feed both functions a phone book with 8 billion names. Suddenly one still answers in about 33 steps, and the other is grinding through *billions*. Same problem, same tiny demo, wildly different destinies. The catch: you could never have seen it coming from the 10-name test.\n\nThat is the whole reason Big O exists. It does not care how fast your laptop is, what language you used, or whether the demo felt snappy. It answers one question that actually predicts the future:\n\n> As the input gets *bigger and bigger*, how fast does the amount of work grow?\n\nGrowth is destiny. A program that doubles its work when you double the input will survive scaling. A program that *quadruples* its work will eventually fall off a cliff. Big O is how you spot the cliff from a mile away, before your users do it for you in a 2 a.m. incident channel.",
    },
    {
      id: "bigo-video",
      kind: "VIDEO",
      youtubeId: "XMUe3zFhM5c",
      title: "Watch: Big O Notation in 6 Minutes",
      channel: "Bro Code",
    },
    {
      id: "bigo-intuition",
      kind: "PROSE",
      title: "Drop the noise, keep the shape",
      markdown:
        "Big O is deliberately *sloppy*, and that sloppiness is the point. It throws away two kinds of detail that do not matter at scale:\n\n- **Constant factors.** If your algorithm does `3·n` operations and mine does `100·n`, we are *both* O(n). Yes, mine is 33× slower per item — but that is a fixed multiplier, not a growth rate. Buy a faster CPU and the constant shrinks; the *shape* of the curve does not. Big O measures the shape.\n- **Lower-order terms.** If the work is `n² + 500·n + 9000`, the `n²` eventually bullies everything else into irrelevance. At n = 1,000,000 the `n²` term is a trillion and the `500·n` is a measly half-billion — a rounding error by comparison. So we write O(n²) and walk away.\n\nThe mental move: **find the fastest-growing term, then erase its coefficient.** `7·n² + 12·n + 4` becomes `n²` becomes **O(n²)**.\n\nWhy is this allowed? Because Big O describes behavior as `n → ∞`. Near infinity, the biggest term wins by a landslide and constants are noise. It is like describing a person's height to the nearest meter: you lose the centimeters, but you instantly know who can reach the top shelf.",
    },
    {
      id: "bigo-classes",
      kind: "PROSE",
      title: "The complexity hall of fame, slowest-growing to scariest",
      markdown:
        "Almost every algorithm you meet lands in one of a handful of growth classes. Here they are, from \"who cares how big n is\" to \"please do not run this on real data,\" with the work each does when the input doubles:\n\n- **O(1) — constant.** Same work no matter what. Doubling n changes nothing. *Example: reading `array[5]`, or pushing onto a stack.* The dream.\n- **O(log n) — logarithmic.** Doubling n adds just *one* more step. *Example: binary search.* Borderline magic; more on this below.\n- **O(n) — linear.** Double n, double the work. Fair and honest. *Example: one loop scanning a list to find a max.*\n- **O(n log n) — linearithmic.** A hair above linear. *Example: good sorts — merge sort, heap sort.* This is the speed limit for comparison sorting, and it is fine.\n- **O(n²) — quadratic.** Double n, *quadruple* the work. *Example: comparing every pair of items, like a naive duplicate check.* Tolerable for small n, painful past a few thousand.\n- **O(2ⁿ) — exponential.** Add *one* item and the work *doubles*. *Example: naive recursive subsets / brute-forcing every combination.* Falls off a cliff around n ≈ 40. Here be dragons.\n\nA gut-level ranking to memorize: **O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)**. If you can place a new algorithm somewhere on that ladder, you already know more than half of \"how does it scale?\"",
    },
    {
      id: "bigo-reading-loops",
      kind: "PROSE",
      title: "Reading a loop like a barcode",
      markdown:
        "You do not need to count every instruction. You need to count how many times the *innermost* work runs as a function of n. A few rules turn loops into Big O almost mechanically:\n\n- **A single loop from 0 to n** runs the body n times → **O(n)**.\n\n  ```\n  for (i = 0; i < n; i++) { total += a[i]; }   // O(n)\n  ```\n\n- **A loop inside a loop, both over n,** runs the inner body n × n times → **O(n²)**. The classic tell: two index variables crawling over the same data.\n\n  ```\n  for (i = 0; i < n; i++)\n    for (j = 0; j < n; j++)\n      check(a[i], a[j]);                         // O(n²)\n  ```\n\n- **Sequential loops add; nested loops multiply.** A loop of n followed by *another* loop of n is `n + n = 2n` → still **O(n)** (drop the constant). But a loop of n *wrapped around* a loop of n is `n·n` → **O(n²)**.\n\n- **A loop that cuts the range in half each step** (`i = i / 2` or `i = i * 2`) runs only about log₂ n times → **O(log n)**. Halving is the fingerprint of the logarithm.\n\nThe single most useful habit: ignore the straight-line code and find the **most deeply nested repetition** that depends on n. That is almost always your answer.",
    },
    {
      id: "bigo-formula",
      kind: "FORMULA",
      title: "Why halving gives you log n",
      display: "comparisons ≈ log₂(n) = ln(n) / ln(2)",
      variables: [
        { symbol: "n", name: "Number of items in the sorted array", unit: "items" },
        { symbol: "log₂(n)", name: "Times you can halve n down to 1", unit: "steps" },
        { symbol: "ln", name: "Natural logarithm (log base e)" },
      ],
      note:
        "Binary search throws away half the remaining items every comparison, so the question \"how many comparisons?\" is really \"how many times can I halve n before I hit 1?\" — and that is exactly log₂ n. Most calculators only do natural log, so we use the change-of-base identity log₂(n) = ln(n)/ln(2). The 1/ln(2) ≈ 1.4427 is just a constant, which is why Big O calls every logarithm — base 2, base 10, base e — simply O(log n).",
    },
    {
      id: "bigo-sandbox",
      kind: "SANDBOX",
      title: "Play: how few questions does binary search ask?",
      description:
        "This computes log₂(n) — the number of comparisons binary search needs in the worst case. With the default n = 1024 you should see exactly 10.0 (because 2¹⁰ = 1024). Now slide n all the way to 1,000,000 and watch the answer barely budge to about 20 — searching a *million* items takes only ~20 questions. THAT is the magic of O(log n): every time you multiply n by 1024, you add a mere 10 steps.",
      variables: [
        { key: "n", label: "Array size n", unit: "items", min: 2, max: 1000000, step: 1, default: 1024 },
      ],
      expression: "ln(n) / ln(2)",
      outputLabel: "Binary-search comparisons (log₂ n)",
      outputUnit: "",
      precision: 1,
    },
    {
      id: "bigo-predict-double",
      kind: "PREDICT",
      question:
        "An O(n²) algorithm takes 4 seconds on an input of size n. You DOUBLE the input to 2n. Roughly how long does it take now? Lock in your guess.",
      options: [
        { id: "a", label: "About 8 seconds — double the input, double the time." },
        { id: "b", label: "About 16 seconds — it quadruples." },
        { id: "c", label: "About 6 seconds — a bit more than before." },
        { id: "d", label: "Still about 4 seconds — Big O ignores constants." },
      ],
      answerId: "b",
      reveal:
        "**About 16 seconds — it quadruples.** For O(n²), work scales with the *square* of the input. Double the input and the work goes up by 2² = 4, so 4 s becomes ~16 s. This is the trap with quadratic code: it feels fine in testing and then a modest growth in users makes it *explode*. (Option a is the O(n) answer; option d confuses \"drop the constant\" with \"the input does not matter\" — the input matters enormously, the *coefficient* is what we drop.)",
    },
    {
      id: "bigo-predict-class",
      kind: "PREDICT",
      question:
        "Which loop structure has the WORST (fastest-growing) time complexity as n gets large?",
      options: [
        { id: "a", label: "A single loop from 0 to n." },
        { id: "b", label: "A loop from 0 to n, followed by ANOTHER separate loop from 0 to n." },
        { id: "c", label: "A loop from 0 to n with a second loop from 0 to n nested inside it." },
        { id: "d", label: "A loop that halves its range each step (i = i / 2)." },
      ],
      answerId: "c",
      reveal:
        "**The nested loops (c) — that is O(n²).** Nesting *multiplies*: the inner body runs n × n times. Option (b) looks similar but the loops are *sequential*, so it is n + n = 2n → O(n) after dropping the constant. Option (a) is O(n) and option (d) is the speedy O(log n). Remember the rule: **sequential loops add, nested loops multiply.** One word — \"inside\" versus \"after\" — is the difference between linear and quadratic.",
    },
    {
      id: "bigo-log-magic",
      kind: "PROSE",
      title: "Why log n feels like cheating",
      markdown:
        "Go back to the phone book with 8 billion names, sorted alphabetically. You want \"Zhang.\" The linear approach reads name 1, name 2, name 3... up to 8 *billion* reads in the worst case. Big O calls that O(n), and it is a disaster.\n\nNow do what humans actually do: flip to the middle. Too early? Throw away the *entire first half* — 4 billion names gone in one move. Flip to the middle of what is left. Throw away half again. Each look *halves* the remaining haystack.\n\nHow many halvings to go from 8 billion down to 1? About 33. Thirty-three comparisons to find one name among eight billion. That is O(log n), and it is why the sandbox above barely moves when you crank n to a million.\n\nThe deep reason: a logarithm is the inverse of exponentiation. Doubling n (the input) only adds **one** to log n (the work). So while linear algorithms feel every new item, logarithmic algorithms shrug them off. The one catch — and interviewers love this — **binary search requires the data to be sorted first.** No free lunch: sorting itself costs O(n log n). The magic kicks in when you search many times after sorting once.",
    },
    {
      id: "bigo-worked",
      kind: "WORKED_EXAMPLE",
      title: "Worked example: analyze two functions cold",
      problem:
        "Function A scans an array of n integers and, for each element, loops over the whole array again to count how many other elements are smaller (a naive ranking). Function B takes a SORTED array of n integers and runs a binary search to test whether a target value is present. State the time complexity of each, and the space complexity of each.",
      steps: [
        {
          label: "(A) Find the nested repetition",
          markdown:
            "Function A has an outer loop running n times. *Inside* it, a second loop also runs n times to do the counting. Nested loops multiply: n × n = n² body executions.",
        },
        {
          label: "(A) Drop the noise → time complexity",
          markdown:
            "Even if the inner loop does a couple of comparisons each pass, that is a constant factor we erase. The growth is n². **Function A is O(n²) time.** It also keeps just a running counter and maybe a small result array of size n, so the *extra* working space beyond the input is O(n) (or O(1) if it writes ranks in place).",
        },
        {
          label: "(B) Count the halvings",
          markdown:
            "Function B starts with n candidates and discards half on every comparison: n → n/2 → n/4 → ... → 1. The number of steps is how many times you can halve n, which is log₂ n. **Function B is O(log n) time.**",
        },
        {
          label: "(B) Space complexity",
          markdown:
            "An iterative binary search keeps only a few index variables (low, high, mid) no matter how big n is. That is **O(1) extra space** — constant. (A *recursive* binary search would stack up about log n calls, making it O(log n) space — a great detail to mention.)",
        },
        {
          label: "Compare and conclude",
          markdown:
            "At n = 1,000,000, Function A does ~10¹² operations (a trillion — minutes to hours) while Function B does ~20 (instant). Same input size, two completely different fates. The structure alone — nested loop versus halving — told us everything before we ran a line.",
        },
      ],
      answer:
        "Function A: O(n²) time, O(n) extra space (or O(1) in place). Function B: O(log n) time, O(1) extra space iteratively (O(log n) if recursive). The nested loop is the quadratic tell; the halving is the logarithmic tell.",
    },
    {
      id: "bigo-check-nested",
      kind: "CHECK",
      question:
        "What is the time complexity of this code?\n\n```\nfor (i = 0; i < n; i++)\n  sum += a[i];            // loop 1\nfor (i = 0; i < n; i++)\n  for (j = 0; j < n; j++)\n    matrix[i][j] = 0;     // loop 2\n```",
      choices: [
        { id: "a", label: "O(n) — there are loops over n." },
        { id: "b", label: "O(n + n²) = O(n²) — the nested loop dominates." },
        { id: "c", label: "O(n³) — three loops total." },
        { id: "d", label: "O(2n²) — two pieces, both squared." },
      ],
      answerId: "b",
      explanation:
        "The two parts are *sequential*, so you add their costs: the first part is O(n), the second is O(n²). Total is O(n + n²). Now drop the lower-order term — n² crushes n at scale — leaving **O(n²)**. Option (c) wrongly multiplies sequential loops; you only multiply when one loop is *nested inside* another, and here the second loop's nesting (two levels) already gives n², not n³. Option (d) keeps a constant we always discard.",
    },
    {
      id: "bigo-check-worstavg",
      kind: "CHECK",
      question:
        "You look up a key in a hash table. People say hash lookups are O(1), yet the worst case is sometimes quoted as O(n). What is going on?",
      choices: [
        { id: "a", label: "O(1) is the average case; O(n) is the worst case when many keys collide into the same bucket." },
        { id: "b", label: "O(1) is a typo; hash tables are always O(n)." },
        { id: "c", label: "O(n) refers to space, not time." },
        { id: "d", label: "The two numbers describe two different data structures." },
      ],
      answerId: "a",
      explanation:
        "Big O is reported per scenario. In the **average case**, a good hash spreads keys evenly so each bucket holds ~1 item and lookups are O(1). In the **worst case** — a bad hash function or an adversary forcing every key into one bucket — that bucket degrades into a linear list and lookup becomes O(n). Same structure, different assumptions about the input. This worst-vs-average distinction also shows up in quicksort (O(n log n) average, O(n²) worst), and naming it unprompted is a green flag in interviews.",
    },
    {
      id: "bigo-callout-interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "The complexity questions you will be asked every time",
      markdown:
        "After you write any function in an interview, assume these are coming — and answer them *before* they are asked:\n\n1. **\"What is the time complexity?\"** State the dominant term and *why*. \"O(n²) because the inner loop runs n times for each of the n outer iterations.\"\n2. **\"What is the space complexity?\"** Count *extra* memory beyond the input: new arrays, hash maps, and the recursion stack all cost space. An in-place algorithm is O(1); one that clones the array is O(n).\n3. **\"Can you do better?\"** This is the real question. Often the answer is: replace a nested O(n²) scan with a hash set for O(n), or sort first to enable O(log n) binary search.\n\nTwo traps that sink candidates: confusing **n = the size of the input** with **the value of a number** (looping to a number value is pseudo-polynomial, not O(1)), and forgetting that **recursion costs stack space**. Say \"time and space\" as a reflex, and name worst versus average when they differ. Reasoning about scale out loud is exactly the signal interviewers are buying.",
    },
    {
      id: "bigo-callout-warning",
      kind: "CALLOUT",
      variant: "warning",
      title: "Misreadings that quietly cost you points",
      markdown:
        "- **Big O is not speed; it is growth.** An O(n) algorithm can be *slower* than an O(n²) one on small inputs because of constant factors. Big O only promises who wins as n → ∞.\n- **Constants are dropped, but they exist.** O(n) with a constant of 1000 is still O(n) — yet in production that 1000 is real money. Big O picks the algorithm; benchmarks tune the constant.\n- **Nested ≠ sequential.** \"A loop after a loop\" is addition (O(n)); \"a loop inside a loop\" is multiplication (O(n²)). The word \"inside\" is the whole ballgame.\n- **Binary search needs sorted input.** O(log n) search assumes the data is already sorted; if you must sort first, that is O(n log n) up front.\n- **log n has no base in Big O.** log₂, log₁₀, and ln differ only by a constant factor, so all of them are written O(log n).",
    },
    {
      id: "bigo-recap",
      kind: "CALLOUT",
      variant: "insight",
      title: "The one habit that makes Big O easy",
      markdown:
        "When you read code, do exactly two things. **First, find the most deeply nested repetition that depends on n** — that gives you the dominant term. **Second, erase every constant and lower-order term** — that gives you the clean class. A single loop is O(n); nested loops multiply to O(n²); halving the range is O(log n); a flat array access is O(1). Then, in the same breath, ask \"and how much *extra memory*?\" for space. Master that little ritual and you can classify almost any algorithm on sight — which is the entire job Big O was invented to do.",
    },
  ],
  keyTakeaways: [
    "Big O measures how work *grows* as the input grows toward infinity, not raw speed — so we drop constant factors and lower-order terms and keep only the dominant term.",
    "The class ladder is O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ); placing an algorithm on it tells you how it scales.",
    "Read loops mechanically: a single loop over n is O(n), nested loops over n multiply to O(n²), and a loop that halves its range is O(log n) — sequential loops add, nested loops multiply.",
    "O(log n) is fast because halving the search space means doubling n adds only one step; binary search finds one item among a million in ~20 comparisons, but the data must be sorted first.",
    "Time complexity counts operations; space complexity counts *extra* memory beyond the input, including new arrays and the recursion stack — always report both.",
    "Worst case and average case can differ (hash lookup is O(1) average but O(n) worst; quicksort is O(n log n) average but O(n²) worst), so state which you mean.",
    "Doubling the input on an O(n²) algorithm quadruples the work, which is why quadratic code passes small tests and then falls off a cliff at scale.",
  ],
};
