import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  // SOLUTION:
  // Address arithmetic in hex, then derive the index-bit count.
  // Region size = 0x3C00 - 0x3A00 = 0x0200 = 2 * 16^2 = 512 bytes.
  // Line size = 64 bytes -> lines = 512 / 64 = 8 lines.
  // A direct-mapped cache that holds EXACTLY these 8 lines needs enough index
  // bits to name each line uniquely: index bits = log2(number of lines)
  //   = log2(8) = 3 index bits.
  // (Offset bits = log2(64) = 6; the question asks only for the index width.)
  {
    id: "ce_hex_to_decimal",
    slug: "computer-hex-to-decimal",
    title: "Mapping an Address Region to Cache Lines",
    prompt:
      "A byte-addressable memory region runs from 0x3A00 (inclusive) up to 0x3C00 (exclusive). A direct-mapped cache is sized so that it holds EXACTLY the number of 64-byte lines needed to cover this region, with the region aligned to a line boundary.\n\nHow many address bits does this cache use for the line INDEX field (not the byte offset)?\n\nGive your answer as a whole number.",
    discipline: "COMPUTER",
    difficulty: "EASY",
    eloWeight: 16,
    tags: ["number-systems", "hexadecimal", "memory-addressing", "cache"],
    skillAreas: ["computer-architecture", "digital-logic"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 3,
    tolerance: 0.5,
    unit: "",
    hints: [
      "First find the region size by subtracting the two hex addresses; convert the hex difference to a count of bytes.",
      "Divide the region size in bytes by the line size to get the number of cache lines the cache must hold.",
      "The index field must uniquely name each line: its width in bits is log2(number of lines), separate from the offset bits.",
    ],
    solution:
      "**Governing concept — cache address decomposition.** A byte address splits into `tag | index | offset`. The number of index bits is fixed by how many lines the cache holds, because the index must uniquely name every line: index bits $= \\log_2(\\text{number of lines})$. So the whole problem reduces to counting lines, which means measuring the region in bytes and dividing by the line size.\n\n" +
      "**Step 1 — size the region in hex.** The region runs from `0x3A00` (inclusive) to `0x3C00` (exclusive), so its size is the difference:\n$$0x3C00 - 0x3A00 = 0x0200.$$\nConvert `0x0200` to decimal: $0x200 = 2 \\times 16^2 = 2 \\times 256 = 512$ bytes.\n\n" +
      "**Step 2 — count the lines.** Each line is 64 bytes, and the region is line-aligned, so it covers exactly\n$$512 / 64 = 8 \\text{ lines}.$$\n\n" +
      "**Step 3 — derive the index width.** The cache holds exactly these 8 lines, so it needs enough index bits to name each one:\n$$\\text{index bits} = \\log_2(8) = 3.$$\n\n" +
      "**Key insight / trap:** The offset field is a separate $\\log_2(64) = 6$ bits — do not add it in. The question asks ONLY for the index width, and the tag is irrelevant here because the cache is sized to fit the region exactly. The mistake to avoid is reporting offset bits (6) or total bits (9) instead of the index.\n\n" +
      "**Final answer: 3 index bits.**",
  },
  // SOLUTION:
  // 0x9C as raw bits = 1001 1100. As an UNSIGNED 8-bit value = 156.
  // As SIGNED two's complement: MSB = 1, so value = 156 - 256 = -100.
  // Sign-extending -100 to 16 bits gives 0xFF9C (upper byte all 1s), still -100.
  // Zero-extending the same byte gives 0x009C = 156 (the unsigned meaning).
  // Correct statement: the byte is 156 unsigned but -100 signed, and sign-
  // extension to 16 bits yields 0xFF9C. The other options each contain an error
  // (wrong sign value, wrong extension byte, or claim the two readings are equal).
  {
    id: "ce_binary_to_hex",
    slug: "computer-binary-to-hex",
    title: "One Byte, Two Meanings",
    prompt:
      "A register holds the 8-bit pattern 0x9C. A junior engineer must reason about how this byte behaves depending on interpretation and how it is widened to 16 bits.\n\nWhich statement is correct?",
    discipline: "COMPUTER",
    difficulty: "MEDIUM",
    eloWeight: 22,
    tags: ["twos-complement", "number-systems", "sign-extension"],
    skillAreas: ["digital-logic", "computer-architecture"],
    evaluationMode: "MULTIPLE_CHOICE",
    choices: [
      {
        id: "a",
        label:
          "Unsigned it is 156; signed (two's complement) it is -100; sign-extended to 16 bits it becomes 0xFF9C.",
        correct: true,
      },
      {
        id: "b",
        label:
          "Unsigned it is 156; signed it is -28; sign-extended to 16 bits it becomes 0x009C.",
      },
      {
        id: "c",
        label:
          "Signed and unsigned both equal 156 because two's complement only changes negative-valued bytes.",
      },
      {
        id: "d",
        label:
          "Unsigned it is 156; signed it is -100; sign-extended to 16 bits it becomes 0x009C.",
      },
    ],
    hints: [
      "Write 0x9C in binary and note the most-significant bit; that bit decides the signed interpretation.",
      "Unsigned value is just the bit pattern; the two's-complement value of a byte with MSB=1 equals (unsigned value) - 256.",
      "Sign extension replicates the MSB into the new high byte, so a negative byte gains a high byte of all 1s (0xFF), not 0x00.",
    ],
    solution:
      "**Governing concept — interpretation vs. representation.** A bit pattern has no inherent sign; the SAME bits mean different numbers depending on whether software reads them as unsigned or as two's complement. Width extension must then preserve that chosen meaning, which is why signed and unsigned values extend differently.\n\n" +
      "**Step 1 — write the byte in binary.** `0x9C` = `1001 1100`. The most-significant bit is `1`. That MSB is the deciding clue: it makes the two's-complement reading negative.\n\n" +
      "**Step 2 — unsigned value.** Treat the bits as a plain magnitude:\n$$0x9C = 9 \\times 16 + 12 = 144 + 12 = 156.$$\n\n" +
      "**Step 3 — signed (two's complement) value.** For an 8-bit byte with MSB = 1, the signed value is (unsigned) $- 256$:\n$$156 - 256 = -100.$$\n\n" +
      "**Step 4 — extend to 16 bits.** Sign extension replicates the MSB into the new high byte. Since the MSB is 1, the high byte becomes all 1s = `0xFF`, giving `0xFF9C`. Check: `0xFF9C` as 16-bit two's complement $= 0xFF9C - 0x10000 = 65436 - 65536 = -100$. Value preserved. Zero-extension would instead give `0x009C` = 156, which only preserves the unsigned reading.\n\n" +
      "**Key insight / trap:** Choice (d) keeps the correct signed value (-100) but extends with `0x00`, which silently turns -100 into +156 — the classic sign-extension bug. Choice (b) gives the wrong signed value (-28 would be `0xE4`, not `0x9C`). Choice (c) is wrong because two's complement changes the meaning of ANY byte with MSB = 1, regardless of whether you 'expected' it to be negative.\n\n" +
      "**Final answer: (a) — unsigned 156, signed -100, sign-extended to `0xFF9C`.**",
  },
  // SOLUTION:
  // 8-bit signed (two's complement) addition: 0x50 + 0x40.
  // 0x50 = +80, 0x40 = +64. True sum = 144.
  // 144 does NOT fit in signed 8-bit range [-128, +127] -> signed overflow.
  // The stored 8-bit result is 144 mod 256 = 144 = 1001 0000b, MSB=1 (negative).
  // Interpreted as two's complement: 144 - 256 = -112.
  // So the register holds -112 even though both operands were positive.
  {
    id: "ce_twos_complement",
    slug: "computer-twos-complement",
    title: "Signed Overflow in an 8-Bit ALU",
    prompt:
      "An 8-bit ALU adds two values that the program treats as signed integers: 0x50 + 0x40. The result is written back to an 8-bit register and later read back as a signed (two's complement) integer.\n\nWhat signed decimal value will the program read from that register? (Include the minus sign if negative.)\n\nGive your answer as a whole number.",
    discipline: "COMPUTER",
    difficulty: "HARD",
    eloWeight: 27,
    tags: ["twos-complement", "overflow", "alu", "binary"],
    skillAreas: ["digital-logic", "computer-architecture"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: -112,
    tolerance: 0.5,
    unit: "",
    hints: [
      "Add the two bytes as ordinary integers first; the hardware keeps only the low 8 bits of that sum.",
      "Check whether the true sum fits in the signed 8-bit range [-128, +127]; if not, the stored pattern's sign bit flips.",
      "Reinterpret the kept 8-bit pattern in two's complement: if its MSB is 1, the value is (pattern as unsigned) - 256.",
    ],
    solution:
      "**Governing concept — signed overflow in fixed-width arithmetic.** An 8-bit ALU keeps only the low 8 bits of any sum. When two same-sign operands produce a true sum outside the signed range $[-128, +127]$, the result's sign bit flips: this is signed overflow, and the stored value is mathematically wrong even though no bits are 'lost' beyond the byte.\n\n" +
      "**Step 1 — operands as signed integers.** `0x50` = `0101 0000` = +80. `0x40` = `0100 0000` = +64. Both are positive (MSB = 0).\n\n" +
      "**Step 2 — true sum.** $80 + 64 = 144$.\n\n" +
      "**Step 3 — check the signed 8-bit range.** Signed 8-bit holds $[-128, +127]$. Since $144 > 127$, the result overflows — adding two positives produced a value too large to represent.\n\n" +
      "**Step 4 — what the register actually holds.** The ALU keeps $144 \\bmod 256 = 144$ = `1001 0000`. The MSB is now 1, so reading it back as two's complement gives\n$$144 - 256 = -112.$$\n\n" +
      "**Key insight / trap:** Two positive operands yielding a NEGATIVE result is the unmistakable signature of signed overflow (carry-in to the sign bit ≠ carry-out). The trap is to report the unsigned reading (144) or to assume the hardware 'saturates' to +127 — a plain 8-bit ALU does neither; it wraps and the sign bit lies.\n\n" +
      "**Final answer: -112.**",
  },
  // SOLUTION:
  // Extract the GREEN channel from a 24-bit packed color 0x1A2B3C, layout R:G:B
  // from most- to least-significant byte (bits 23-16 = R, 15-8 = G, 7-0 = B).
  // Green = (0x1A2B3C >> 8) & 0xFF = 0x1A2B & 0xFF = 0x2B = 43.
  {
    id: "ce_bitwise_shift",
    slug: "computer-bitwise-shift",
    title: "Extracting a Color Channel by Masking",
    prompt:
      "A 24-bit pixel is stored as a packed integer 0x1A2B3C, where the most-significant byte is the red channel, the middle byte is green, and the least-significant byte is blue.\n\nUsing shifting and masking, isolate the green channel and report its value as a decimal (base-10) integer.\n\nGive your answer as a whole number.",
    discipline: "COMPUTER",
    difficulty: "MEDIUM",
    eloWeight: 21,
    tags: ["bitwise", "masking", "shift", "binary"],
    skillAreas: ["programming", "digital-logic"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 43,
    tolerance: 0.5,
    unit: "",
    hints: [
      "Each channel occupies one byte; locate which 8 bits of the 24-bit word the green channel sits in.",
      "Shift the word right so the target byte lands in the lowest 8 bits, then mask with 0xFF to discard everything above it.",
      "After isolating the byte, convert that hex byte to decimal for the final answer.",
    ],
    solution:
      "**Governing concept — field extraction via shift-then-mask.** To pull one packed field out of a word: shift it down so the field sits in the low bits, then AND with a mask that keeps only the field's width. The shift amount equals the field's bit position; the mask width equals the field's bit width.\n\n" +
      "**Step 1 — locate the green byte.** The 24-bit word `0x1A2B3C` is laid out R:G:B from high byte to low byte: red = bits 23–16 (`0x1A`), green = bits 15–8 (`0x2B`), blue = bits 7–0 (`0x3C`). Green sits one byte up from the bottom, i.e. starting at bit 8.\n\n" +
      "**Step 2 — shift the green byte down.** Right-shift by 8 to drop the blue byte:\n$$0x1A2B3C \\gg 8 = 0x1A2B.$$\n\n" +
      "**Step 3 — mask off everything above one byte.** AND with `0xFF` to keep only the low 8 bits (discarding the red byte `0x1A`):\n$$0x1A2B \\,\\&\\, 0xFF = 0x2B.$$\n\n" +
      "**Step 4 — convert to decimal.** $0x2B = 2 \\times 16 + 11 = 32 + 11 = 43.$\n\n" +
      "**Key insight / trap:** You must mask AFTER shifting — shifting alone leaves the red byte (`0x1A`) in the high bits, so `0x1A2B` = 6699, not 43. Forgetting the `& 0xFF` is the most common error. The shift count (8) and mask (`0xFF`, one byte) both follow directly from green occupying exactly the middle byte.\n\n" +
      "**Final answer: 43.**",
  },
  // SOLUTION:
  // Effective CPI from instruction mix:
  //   ALU 50% @ CPI 1 = 0.50
  //   Load 20% @ CPI 5 = 1.00
  //   Store 10% @ CPI 3 = 0.30
  //   Branch 20% @ CPI 2 = 0.40
  //   Effective CPI = 0.50 + 1.00 + 0.30 + 0.40 = 2.2
  // CPU time = (instruction count * CPI) / clock frequency
  //          = (5e8 * 2.2) / 2.5e9 = 1.1e9 / 2.5e9 = 0.44 s.
  {
    id: "ce_cpu_execution_time",
    slug: "computer-cpu-execution-time",
    title: "Execution Time from an Instruction Mix",
    prompt:
      "A program runs 5 × 10⁸ instructions on a 2.5 GHz processor. The dynamic instruction mix and per-class cycle costs are:\n\n  ALU ops:   50% of instructions, 1 cycle each\n  Loads:     20% of instructions, 5 cycles each\n  Stores:    10% of instructions, 3 cycles each\n  Branches:  (the remaining instructions), 2 cycles each\n\nThe branch fraction is not stated directly; deduce it from the fact that the four classes account for all instructions. Determine the total CPU execution time in seconds (s), rounded to two decimal places.",
    discipline: "COMPUTER",
    difficulty: "HARD",
    eloWeight: 28,
    tags: ["cpu-performance", "cpi", "instruction-mix", "clock"],
    skillAreas: ["computer-architecture"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 0.44,
    tolerance: 0.01,
    unit: "s",
    hints: [
      "The four class fractions must sum to 1; back out the missing branch fraction before doing anything else.",
      "Compute the effective CPI as the weighted average of per-class cycle counts using those fractions.",
      "Total cycles = instruction count × effective CPI; divide by the clock frequency (in Hz) to get seconds.",
    ],
    solution:
      "**Governing concept — the iron law of CPU performance.** $\\text{CPU time} = \\dfrac{\\text{instruction count} \\times \\text{CPI}}{\\text{clock frequency}}$. With a mixed instruction stream, the effective CPI is the frequency-weighted average of each class's CPI. So the recipe is: find all fractions, weight the CPIs, then apply the iron law.\n\n" +
      "**Step 1 — back out the branch fraction.** The four classes cover all instructions, so the fractions sum to 1:\n$$\\text{branch} = 1 - (0.50 + 0.20 + 0.10) = 1 - 0.80 = 0.20.$$\n\n" +
      "**Step 2 — compute effective CPI (weighted average).**\n- ALU: $0.50 \\times 1 = 0.50$\n- Load: $0.20 \\times 5 = 1.00$\n- Store: $0.10 \\times 3 = 0.30$\n- Branch: $0.20 \\times 2 = 0.40$\n\n$$\\text{CPI} = 0.50 + 1.00 + 0.30 + 0.40 = 2.2.$$\n\n" +
      "**Step 3 — total cycles.** $5 \\times 10^8 \\text{ instr} \\times 2.2 = 1.1 \\times 10^9$ cycles.\n\n" +
      "**Step 4 — divide by clock frequency.** $2.5$ GHz $= 2.5 \\times 10^9$ Hz:\n$$\\text{CPU time} = \\frac{1.1 \\times 10^9}{2.5 \\times 10^9} = 0.44 \\text{ s}.$$\n\n" +
      "**Key insight / trap:** CPI is weighted by how OFTEN each class runs (its fraction), not by a simple average of $(1+5+3+2)/4$. Also keep the units straight — GHz means $10^9$ Hz, so the $10^9$ factors cancel cleanly. Forgetting to solve for the missing 20% branch fraction first throws off the entire weighted sum.\n\n" +
      "**Final answer: 0.44 s.**",
  },
  // SOLUTION:
  // Two-level cache AMAT. Definitions: L1 access 1 ns; L1 local miss rate 5%.
  // On an L1 miss, go to L2: L2 access 10 ns; L2 LOCAL miss rate 40%.
  // On an L2 miss, go to main memory: penalty 100 ns.
  // AMAT = L1_hit + L1_missrate * (L2_hit + L2_missrate * mem_penalty)
  //      = 1 + 0.05 * (10 + 0.40 * 100)
  //      = 1 + 0.05 * (10 + 40)
  //      = 1 + 0.05 * 50
  //      = 1 + 2.5 = 3.5 ns.
  {
    id: "ce_amat_cache",
    slug: "computer-amat-cache",
    title: "Two-Level Cache Access Time",
    prompt:
      "A processor has a two-level cache hierarchy. The L1 cache responds in 1 ns and misses 5% of the time. On an L1 miss, the L2 cache responds in 10 ns and itself misses 40% of the time (its local miss rate). On an L2 miss, main memory is reached with a penalty of 100 ns.\n\nDetermine the average memory access time in nanoseconds (ns), rounded to one decimal place.",
    discipline: "COMPUTER",
    difficulty: "EXPERT",
    eloWeight: 34,
    tags: ["cache", "memory-hierarchy", "amat", "multilevel"],
    skillAreas: ["computer-architecture", "operating-systems"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 3.5,
    tolerance: 0.05,
    unit: "ns",
    hints: [
      "Build AMAT from the inside out: every access pays the L1 access time, and only the fraction that miss L1 pay anything more.",
      "The L2 miss rate given is LOCAL (fraction of L1 misses that also miss L2), so the memory penalty is weighted by L1_missrate × L2_missrate.",
      "AMAT = L1_access + L1_missrate × (L2_access + L2_missrate × memory_penalty).",
    ],
    solution:
      "**Governing concept — Average Memory Access Time (AMAT) for a multilevel hierarchy.** Every access pays the top level's time; only the fraction that miss descend and pay more. Built recursively from the inside out:\n$$\\text{AMAT} = t_{L1} + m_{L1}\\,(t_{L2} + m_{L2}\\,t_{mem}),$$\nwhere the inner term is the L1 miss penalty (the average cost of going to L2 and beyond).\n\n" +
      "**Step 1 — list the parameters.** $t_{L1} = 1$ ns, $m_{L1} = 0.05$. $t_{L2} = 10$ ns, local $m_{L2} = 0.40$. Memory penalty $t_{mem} = 100$ ns.\n\n" +
      "**Step 2 — innermost term (cost beyond L1).** An L1 miss always pays the L2 access, and the 40% of those that also miss L2 pay the memory penalty:\n$$10 + 0.40 \\times 100 = 10 + 40 = 50 \\text{ ns}.$$\n\n" +
      "**Step 3 — weight by the L1 miss rate and add the L1 hit time.**\n$$\\text{AMAT} = 1 + 0.05 \\times 50 = 1 + 2.5 = 3.5 \\text{ ns}.$$\n\n" +
      "**Key insight / trap:** The L2 miss rate here is LOCAL (fraction of L1 misses that also miss L2), so memory is reached on $m_{L1} \\times m_{L2} = 0.05 \\times 0.40 = 0.02$ = 2% of all accesses — already baked into the nested formula. If you mistakenly treated 0.40 as a GLOBAL miss rate, you would double-count the L1 filtering and overcount memory traffic. Always confirm whether a stated miss rate is local or global before weighting.\n\n" +
      "**Final answer: 3.5 ns.**",
  },
  // SOLUTION:
  // Maximum clock frequency from the register-to-register critical path.
  // Minimum clock period must cover: clock-to-Q + combinational logic + setup.
  //   T_min = t_clk_to_Q + t_logic + t_setup = 0.2 + 1.5 + 0.3 = 2.0 ns.
  // (Hold time does not bound the clock period; it is a separate fast-path check.)
  // f_max = 1 / T_min = 1 / 2.0 ns = 0.5 GHz = 500 MHz.
  {
    id: "ce_rc_digital_timing",
    slug: "computer-rc-digital-timing",
    title: "Maximum Clock Frequency of a Pipeline Stage",
    prompt:
      "In a synchronous datapath, data launched from one flip-flop must arrive and be stable at the next flip-flop before the capturing clock edge. The relevant timing parameters are:\n\n  Clock-to-Q delay:                0.2 ns\n  Worst-case combinational logic:  1.5 ns\n  Setup time:                      0.3 ns\n  Hold time:                       0.1 ns\n\nDetermine the maximum clock frequency at which the design operates reliably, in megahertz (MHz). Round to the nearest whole MHz.",
    discipline: "COMPUTER",
    difficulty: "HARD",
    eloWeight: 29,
    tags: ["timing", "clock", "pipeline", "setup-hold"],
    skillAreas: ["computer-architecture", "digital-logic"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 500,
    tolerance: 5,
    unit: "MHz",
    hints: [
      "The minimum clock period must cover the full launch-to-capture path; identify which three parameters add up along that path.",
      "Hold time does not lengthen the clock period — it is a separate short-path constraint, so leave it out of the period sum.",
      "Period = clock-to-Q + logic + setup; the maximum frequency is its reciprocal (watch the ns → MHz conversion).",
    ],
    solution:
      "**Governing concept — the setup-time (max-delay) constraint.** Data launched at one clock edge must arrive and stabilize at the next flip-flop's input before that flop's setup window. The minimum clock period is therefore the full launch-to-capture path:\n$$T_{min} = t_{clk\\text{-}to\\text{-}Q} + t_{logic} + t_{setup}.$$\nThe maximum frequency is its reciprocal.\n\n" +
      "**Step 1 — sum the three path delays.** Clock-to-Q launches the data (0.2 ns), the combinational logic propagates it (1.5 ns), and it must settle before the setup window (0.3 ns):\n$$T_{min} = 0.2 + 1.5 + 0.3 = 2.0 \\text{ ns}.$$\n\n" +
      "**Step 2 — take the reciprocal.**\n$$f_{max} = \\frac{1}{T_{min}} = \\frac{1}{2.0 \\text{ ns}} = \\frac{1}{2.0 \\times 10^{-9}\\,\\text{s}} = 0.5 \\times 10^9 \\text{ Hz} = 500 \\text{ MHz}.$$\n\n" +
      "**Key insight / trap:** Hold time (0.1 ns) is a distractor. It does NOT lengthen the clock period — it is a separate short-path (min-delay) constraint checking that new data does not arrive too SOON and clobber the previous value before it is captured. Including it in the period sum is the classic error. The unit conversion also matters: $1 / (2\\,\\text{ns}) = 500$ MHz, not 0.5 (Hz) or 2 (something).\n\n" +
      "**Final answer: 500 MHz.**",
  },
  // SOLUTION:
  // Reasoning over algorithmic complexity, not a single formula.
  // - Binary search: each comparison halves the space -> Theta(log n); for
  //   n = 1,000,000, worst case ~ floor(log2 n) + 1 = 20 comparisons. Bounded.
  // - Merge sort: Theta(n log n) in ALL cases (worst, average, best) -> stable
  //   guarantee, the key reason it is preferred when worst-case matters.
  // - Quicksort: average Theta(n log n) but worst case Theta(n^2) (e.g. already-
  //   sorted input with a poor pivot). So quicksort is NOT O(n log n) worst case.
  // Correct option: merge sort is Theta(n log n) in the worst case while
  // quicksort degrades to Theta(n^2) in the worst case.
  {
    id: "ce_big_o_binary_search",
    slug: "computer-big-o-binary-search",
    title: "Worst-Case Behavior of Sorting and Searching",
    prompt:
      "A candidate is asked to compare the worst-case asymptotic behavior of common algorithms for an interviewer who cares about guarantees, not averages.\n\nWhich statement is correct?",
    discipline: "COMPUTER",
    difficulty: "MEDIUM",
    eloWeight: 23,
    tags: ["algorithms", "big-o", "complexity", "sorting"],
    skillAreas: ["algorithms"],
    evaluationMode: "MULTIPLE_CHOICE",
    choices: [
      {
        id: "a",
        label:
          "Merge sort is Θ(n log n) in the worst case, whereas quicksort can degrade to Θ(n²) in the worst case.",
        correct: true,
      },
      {
        id: "b",
        label:
          "Quicksort is Θ(n log n) in the worst case, so it always beats merge sort's Θ(n²) worst case.",
      },
      {
        id: "c",
        label:
          "Both merge sort and quicksort are Θ(n²) in the worst case; only the average cases differ.",
      },
      {
        id: "d",
        label:
          "Binary search is Θ(n) in the worst case because it may have to inspect every element.",
      },
    ],
    hints: [
      "Distinguish algorithms with a guaranteed bound in ALL cases from those whose worst case is worse than their average.",
      "Recall what breaks quicksort: an adversarial or already-sorted input with a poor pivot choice, and the order it degrades to.",
      "Binary search halves the search space each step, so its worst case is logarithmic — eliminate any option claiming otherwise.",
    ],
    solution:
      "**Governing concept — worst-case vs. average-case guarantees.** An interviewer who cares about guarantees wants the bound that holds for EVERY input (worst case), not the typical behavior. Some algorithms match their average in the worst case; others degrade badly on adversarial input. The distinction is exactly what separates merge sort from quicksort.\n\n" +
      "**Step 1 — binary search.** Each comparison halves the remaining range, so it runs in $\\Theta(\\log n)$ even in the worst case. For $n = 1{,}000{,}000$, that is only $\\lfloor \\log_2 n \\rfloor + 1 = 20$ comparisons — logarithmic, not linear. This kills option (d), which claims $\\Theta(n)$.\n\n" +
      "**Step 2 — merge sort.** It always splits in half and merges in linear time, giving $\\Theta(n \\log n)$ in the worst, average, AND best case. This guaranteed bound is precisely why it is preferred when worst-case matters (at the cost of extra memory).\n\n" +
      "**Step 3 — quicksort.** Average case is $\\Theta(n \\log n)$, but a poor pivot (e.g. always picking the first element on already-sorted input) produces maximally unbalanced partitions, degrading to $\\Theta(n^2)$. So quicksort offers no worst-case guarantee.\n\n" +
      "**Step 4 — match to the options.** Only (a) states both facts correctly: merge sort is $\\Theta(n \\log n)$ worst case while quicksort can fall to $\\Theta(n^2)$. (b) inverts the two algorithms. (c) wrongly assigns $\\Theta(n^2)$ to merge sort. (d) misstates binary search as linear.\n\n" +
      "**Key insight / trap:** $\\Theta(n \\log n)$ is the comparison-sort lower bound, so 'better than $n \\log n$' is impossible for these; the real question is whether an algorithm HOLDS that bound in the worst case. Merge sort does; quicksort does not.\n\n" +
      "**Final answer: (a) — merge sort is $\\Theta(n \\log n)$ worst case; quicksort can degrade to $\\Theta(n^2)$.**",
  },
];
