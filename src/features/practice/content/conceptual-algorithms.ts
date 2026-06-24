import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  {
    id: "algorithms_autocomplete_structure",
    slug: "concept-algorithms-autocomplete-structure",
    title: "Choosing a Structure for Autocomplete",
    prompt: "You are building the autocomplete box for a search bar. As the user types a prefix, you must return the stored words that start with that prefix, fast enough to feel instant on every keystroke. The dictionary has a few million words and is loaded once at startup.",
    discipline: "COMPUTER",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["algorithms", "conceptual"],
    skillAreas: ["algorithms"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: A teammate proposes a plain hash set of all words, and on each keystroke scanning every word to test the prefix. Explain why this is a poor fit, and propose a data structure that makes prefix queries efficient. Give the time cost of one lookup in terms of the prefix length and the number of matches.",
        rubric: "Should identify that a hash set keys on the whole word, so it gives O(1) exact lookup but no prefix locality, forcing an O(n) scan of all n words per keystroke. Should propose a trie (prefix tree) or a sorted array with binary search. For a trie: walking the prefix is O(p) where p is prefix length, then collecting matches is O(k) plus traversal of the subtree, so roughly O(p + size of matching subtree). For sorted array: binary search to the prefix range is O(log n + p) then O(k) to read matches. Should note the query cost is independent of total dictionary size for the search step. Key insight: a hash maps a whole key to a value and destroys ordering, so it cannot answer range or prefix queries; you need a structure that keeps keys organized by their sequence of characters or sort order.",
      },
      {
        prompt: "Part 2: Now the constraints change. The dictionary is no longer static: words are inserted and deleted constantly, and memory is tight because each word also stores a popularity score that you must use to return the top 5 completions. How does this change your choice, and what tradeoffs appear between the trie and the sorted-array approaches?",
        rubric: "Should note that a sorted array makes inserts and deletes O(n) due to shifting, so a static sorted array is now a bad fit; a balanced BST or the trie supports O(log n) or O(p) dynamic updates. Should address that returning top 5 by popularity within a prefix is a separate ranking problem: either store a small heap or precomputed top-k at each trie node, or scan the matching range and partially sort. Tries can be memory heavy due to per-node pointers (mitigated by radix/compressed tries); sorted arrays are compact but bad for updates; a balanced BST sits in between. Should mention the time-space tradeoff of caching top-k at internal nodes to speed queries at the cost of memory and update work. Key insight: dynamic data and ranking turn a simple membership question into a combined update + range + top-k problem, and the right structure is the one whose worst case stays bounded under the operation mix you actually run, not just lookups.",
      },
    ],
  },
  {
    id: "algorithms_dedupe_stream",
    slug: "concept-algorithms-dedupe-stream",
    title: "Hash Versus Tree for Deduplication",
    prompt: "A logging service receives a high-volume stream of event records. You must drop duplicates (keep only the first occurrence of each event id) and you also need to support an admin query that lists all event ids seen in a given id range, sorted.",
    discipline: "COMPUTER",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["algorithms", "conceptual"],
    skillAreas: ["algorithms"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: For the deduplication itself, compare using a hash set versus a balanced binary search tree to track which ids have been seen. Give the average and worst-case cost per event for each, and explain what causes the worst case for the hash set.",
        rubric: "Should state hash set is O(1) average insert/lookup, balanced BST is O(log n) guaranteed. Should explain hash worst case is O(n) per operation when many keys collide into the same bucket (bad hash function, adversarial inputs, or a degenerate load factor before resize), degrading to a linear chain. Should note the hash also has amortized cost from resizing. The balanced BST has no such collapse: O(log n) is a worst-case bound, not an average. Should note hashing needs a good hash function and that ordering of keys is lost. Key insight: hash tables trade a worst-case guarantee for a better average constant, and that trade is only safe when inputs are not adversarial and the load factor is controlled.",
      },
      {
        prompt: "Part 2: Now the constraints change. The admin range query (list all seen ids between A and B in sorted order) becomes the dominant, latency-critical operation, run far more often than ingestion. Does your choice flip, and why? What hybrid would you consider?",
        rubric: "Should recognize a hash set cannot answer range or sorted queries efficiently: it would require collecting all keys and sorting them, O(n log n) per query, because hashing destroys order. A balanced BST (or B-tree / skip list) answers a range query in O(log n + k) where k is the number of results, because it keeps keys ordered and supports in-order traversal. So the choice flips toward the tree when range/order queries dominate. A reasonable hybrid: keep the hash set for fast O(1) dedup on the hot ingestion path and maintain an ordered structure for queries, accepting extra memory and dual updates; or use a single ordered structure if its O(log n) ingest is acceptable. Key insight: pick the structure whose strength matches the dominant operation; a hash wins on point lookups but an ordered tree is the only one that makes range and sorted output cheap, and you can pay memory to keep both.",
      },
    ],
  },
  {
    id: "algorithms_why_nlogn_sort",
    slug: "concept-algorithms-why-nlogn-sort",
    title: "Why Comparison Sorting Is O(n log n)",
    prompt: "A candidate claims they have written a general-purpose comparison sort that runs in O(n) on any array of numbers. You are interviewing them and want to probe whether that is possible.",
    discipline: "COMPUTER",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["algorithms", "conceptual"],
    skillAreas: ["algorithms"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain the lower-bound argument for why any comparison-based sort must take at least O(n log n) comparisons in the worst case. Then explain why an algorithm like merge sort actually achieves O(n log n) by reasoning about its recurrence.",
        rubric: "Lower bound: a comparison sort distinguishes outcomes only via comparisons, so its execution is a binary decision tree; there are n! possible orderings (leaves), and a binary tree with n! leaves has height at least log2(n!). By Stirling, log2(n!) is Theta(n log n), so some input forces at least that many comparisons. Merge sort: splits into two halves and merges in linear time, giving T(n) = 2 T(n/2) + O(n); by the master theorem (or unrolling: log n levels, O(n) work per level) this is O(n log n). Should connect the two: merge sort meets the lower bound, so it is asymptotically optimal among comparison sorts. Key insight: the n log n barrier comes from information theory, you must gather enough yes/no comparison bits to single out one of n! arrangements, and no comparison sort can beat that in the worst case.",
      },
      {
        prompt: "Part 2: Now the constraints change. The keys are integers known to lie in the range 0 to 1000, and the array can be huge. Can you now sort in O(n), and does that contradict the lower bound? Explain precisely.",
        rubric: "Should answer yes, counting sort (or radix/bucket sort) sorts in O(n + r) where r is the range size, here r is about 1000 (a constant relative to a huge n), giving effectively O(n). Should explain this does NOT contradict the lower bound because counting sort is not comparison-based: it uses the key values as array indices, gaining information from the structure of the keys rather than only from pairwise comparisons. The O(n log n) bound applies only to algorithms whose sole operation on keys is comparison. Should note the tradeoffs: counting sort needs O(r) extra space and assumes a bounded integer range, so it fails for arbitrary or wide-range keys. Key insight: lower bounds are scoped to a model of computation; by stepping outside the comparison model and exploiting key structure you can beat n log n, but only by paying with assumptions about the keys and extra space.",
      },
    ],
  },
  {
    id: "algorithms_recursion_vs_iteration",
    slug: "concept-algorithms-recursion-vs-iteration",
    title: "Recursion Versus Iteration on Deep Inputs",
    prompt: "A service walks a deeply nested JSON tree (think a file system or org chart) and sums a numeric field across all nodes. The natural implementation is a recursive depth-first traversal, and it works on test data but crashes in production on certain inputs.",
    discipline: "COMPUTER",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["algorithms", "conceptual"],
    skillAreas: ["algorithms"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain the most likely cause of the production crash, in terms of what recursion consumes that iteration does not. Then describe how to convert the recursive DFS to an iterative version that avoids the failure, and state what space it uses.",
        rubric: "Should identify a stack overflow from too-deep recursion: each recursive call pushes a frame onto the limited call stack, so a very deep or skewed tree (effectively a long chain) exhausts it. Iteration does not grow the call stack. The fix: convert to an explicit-stack iterative DFS, pushing nodes onto a heap-allocated stack/queue data structure and looping; this moves the frames off the bounded call stack onto the much larger heap. Space is O(h) where h is the maximum depth (the explicit stack holds at most a path plus siblings), same asymptotic space but on the heap. Should note that time complexity is unchanged at O(number of nodes). Key insight: recursion and iteration can compute the same result, but recursion ties its working memory to the fixed-size call stack, so for unbounded depth you must externalize that state onto the heap.",
      },
      {
        prompt: "Part 2: Now the constraints change. A colleague says the real fix is just to enable tail-call optimization so the recursion uses constant stack space. Is that argument valid for this traversal? Explain when tail-call optimization can and cannot save a recursive algorithm.",
        rubric: "Should explain a tail call is a recursive call that is the very last action, with nothing left to do after it returns, so the current frame can be reused (constant stack). A tree DFS that recurses into multiple children is NOT tail recursive: after recursing into the first child, the function still must recurse into the remaining children and combine results, so work remains after each call and frames cannot all be reused. So tail-call optimization does not rescue a branching traversal in general (and many languages/runtimes do not perform it at all). It helps only for linear, single-trailing-call recursion (e.g. a loop-like accumulator). Should note that converting to an explicit stack is the robust fix. Key insight: tail-call optimization removes stack growth only when the recursive call is the final operation; branching recursion inherently retains pending work, so its depth-proportional stack use cannot be optimized away, only relocated.",
      },
    ],
  },
  {
    id: "algorithms_amortized_dynamic_array",
    slug: "concept-algorithms-amortized-dynamic-array",
    title: "Amortized Cost of a Growable Array",
    prompt: "Your team uses a growable array (like a vector or ArrayList) that doubles its capacity whenever it fills up, copying all existing elements into the new larger buffer. A performance reviewer flags the resize copy as O(n) and worries that appending is slow.",
    discipline: "COMPUTER",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["algorithms", "conceptual"],
    skillAreas: ["algorithms"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: Explain why, despite each resize costing O(n), the amortized cost of an append is O(1). Use the doubling strategy in your argument and show roughly why the total copy work across n appends is bounded by a constant times n.",
        rubric: "Should distinguish worst-case single-operation cost (an individual resize is O(n)) from amortized cost (average over a sequence). With doubling, resizes happen at sizes 1, 2, 4, 8, ... up to n, and the copy work is 1 + 2 + 4 + ... + n, a geometric series that sums to about 2n, i.e. O(n) total across all n appends. Divide total work O(n) by n appends to get O(1) amortized per append. May reference the aggregate, accounting (banker's), or potential method; e.g. each append pays a small constant credit that prepays its future copy. Key insight: amortized analysis charges the rare expensive operation against the many cheap ones; geometric (multiplicative) growth makes the total resize cost linear, so each append is constant on average even though one append can be linear.",
      },
      {
        prompt: "Part 2: Now the constraints change. A junior engineer suggests growing by a fixed amount (add 100 slots each time) instead of doubling, to save memory. Analyze the amortized append cost under fixed-increment growth, and explain the general principle about which growth factors preserve O(1) amortized append.",
        rubric: "Should show fixed-increment growth resizes at sizes 100, 200, 300, ... so the copy work is 100 + 200 + ... + n, an arithmetic series summing to about n^2 / (2 * 100), i.e. O(n^2) total across n appends, giving O(n) amortized per append, not O(1). The general principle: O(1) amortized append requires geometric growth (multiply capacity by a constant factor greater than 1, e.g. 1.5x or 2x); any additive/constant increment yields O(n) amortized. Should mention the tradeoff: larger growth factors waste more memory (up to ~50-100 percent transiently) but copy less often; smaller factors like 1.5x balance memory against copy frequency. Key insight: only multiplicative growth makes the resize cost a geometric (convergent) series; additive growth produces a quadratic total, so the choice of growth factor is the difference between constant and linear amortized appends, a classic time-space tradeoff.",
      },
    ],
  },
  {
    id: "algorithms_two_sum_tradeoff",
    slug: "concept-algorithms-two-sum-tradeoff",
    title: "Time-Space Tradeoff in Pair Finding",
    prompt: "Given an array of numbers and a target, you must determine whether any two distinct elements sum to the target. A first implementation uses two nested loops over all pairs.",
    discipline: "COMPUTER",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["algorithms", "conceptual"],
    skillAreas: ["algorithms"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Part 1: State the time and space complexity of the nested-loop approach, then describe a hash-based approach that reduces the time complexity. Give the time and space of the hash approach and explain the tradeoff being made.",
        rubric: "Nested loops: O(n^2) time, O(1) extra space. Hash approach: scan once, and for each element x check whether target minus x is already in a hash set, inserting x as you go; this is O(n) average time and O(n) extra space. The tradeoff is spending O(n) memory to cut time from quadratic to linear, the classic time-space tradeoff. Should note the hash approach's O(n) time is average-case and could degrade with bad hashing. Key insight: you trade extra memory (a hash table that remembers what you have seen) to avoid recomputing, turning a quadratic search into a single linear pass.",
      },
      {
        prompt: "Part 2: Now the constraints change. Memory is extremely constrained so you cannot afford the O(n) hash table, but you are allowed to modify the array and it turns out you can sort it. Describe an approach that uses O(1) extra space (beyond sorting) and beats O(n^2), and explain its complexity and why it works.",
        rubric: "Should describe sorting the array, then using the two-pointer technique: one pointer at the start, one at the end; if the pair sum is too small move the left pointer right, if too large move the right pointer left, if equal you found a pair. Sorting is O(n log n); the two-pointer scan is O(n) time and O(1) extra space (in-place if sorting is in-place). Total O(n log n) time, O(1) extra space, beating O(n^2) without a hash table. Should explain correctness: sorting lets you move pointers monotonically because the sum changes predictably with each move, so you never miss a valid pair. Key insight: when you cannot spend memory, you can instead spend a one-time O(n log n) sort to impose order, then exploit that order with constant-space two pointers, trading the hash table's space for sorting's time.",
      },
    ],
  },
];
