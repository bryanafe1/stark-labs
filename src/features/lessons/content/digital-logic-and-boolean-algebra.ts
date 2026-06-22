import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_logic",
  slug: "digital-logic-and-boolean-algebra",
  title: "Digital Logic & Boolean Algebra: How Rocks Learned to Think in Yes and No",
  summary:
    "Every photo you've taken, every message you've sent, every game you've played is, underneath, just a tidal wave of two-state switches flipping yes/no, on/off, 1/0. This lesson builds the whole digital world from that single distinction: bits and binary, the six logic gates and their truth tables, the Boolean algebra laws (including the gorgeous De Morgan's theorems) that let you simplify circuits like algebra, the leap from combinational logic to *memory*, and the almost magical fact that one humble gate — NAND — can build literally everything. One playground for 2^n, two predictions that'll bend your intuition, and a worked example where you build an XOR from nothing but NANDs.",
  discipline: "COMPUTER",
  difficulty: "EASY",
  estMinutes: 22,
  tags: ["digital-logic", "boolean-algebra", "logic-gates"],
  objectives: [
    "Explain what a bit is, count in binary, and compute how many distinct states n bits can represent.",
    "Read and write truth tables for the six core gates: AND, OR, NOT, NAND, NOR, XOR.",
    "Apply Boolean algebra laws — identity, complement, and especially De Morgan's theorems — to simplify expressions.",
    "Distinguish combinational logic from sequential logic and explain what gives a circuit memory.",
    "Explain why 2^n matters for addressing, range, and data sizing.",
    "Show that NAND is a universal gate by building other gates (e.g. NOT, AND, XOR) from it.",
  ],
  prerequisites: [
    "Comfort with true/false reasoning",
    "Basic algebra (variables, substitution)",
    "Powers of two (helpful, not required)",
  ],
  interviewAngle:
    "Digital logic is a staple of CS and hardware interviews because it reveals whether you actually understand computation from the ground up. Expect to be handed a truth table and asked for the gate, to simplify a Boolean expression on a whiteboard (De Morgan's is the move they're fishing for), to explain the difference between combinational and sequential logic, and the classic curveball: 'build an XOR using only NAND gates' or 'why is NAND universal?' Strong candidates move smoothly between the truth table, the algebra, and the gate-level circuit — and they reach for De Morgan's to turn an ugly NOR/NAND mess into something clean without breaking a sweat.",
  blocks: [
    {
      id: "b_hook",
      kind: "PROSE",
      title: "A universe built from a light switch 💡",
      markdown:
        "Look up from this screen for a second. Every pixel rendering these words, the Wi-Fi carrying them, the chip deciding what to draw next — all of it, without exception, is built from one almost insultingly simple idea: a switch that is either **on** or **off**. That's it. That's the atom of the entire digital universe.\n\nWe call that switch a **bit**, and we write its two states as `1` (on, true, high voltage) and `0` (off, false, low voltage). One bit is almost nothing — a single yes-or-no. But wire millions of them together, teach them to influence each other with a handful of rules, and you get every program, every video, every AI model that has ever run. Computers are not 'electronic brains.' They're staggeringly large piles of yes/no switches, flipping in lockstep, fast.\n\nThe genuinely beautiful part — the part that makes this lesson *fun* — is how little you need to learn to understand all of it. The whole edifice rests on:\n\n- **Binary** — counting and representing everything with just `0` and `1`.\n- **Logic gates** — tiny circuits that take bits in and spit a bit out, following fixed rules (AND, OR, NOT, and friends).\n- **Boolean algebra** — the math (yes, *math*) that lets you manipulate and simplify those rules like equations.\n\nMaster these three and you can read a circuit, simplify it, and — as you'll see at the end — build the entire toolbox out of a single kind of gate. Let's flip some switches.",
    },
    {
      id: "b_video",
      kind: "VIDEO",
      youtubeId: "gI-qXk7XojA",
      title: "Watch: Boolean Logic & Logic Gates (Crash Course)",
      channel: "CrashCourse",
    },
    {
      id: "b_binary_prose",
      kind: "PROSE",
      title: "Binary: counting with two fingers",
      markdown:
        "You count in **decimal** (base 10) because you have ten fingers. A digit can be 0–9, and each position is worth ten times the one to its right: 1s, 10s, 100s. Computers count in **binary** (base 2) because their 'fingers' are switches with only two states. A binary digit — a **bit** — is 0 or 1, and each position is worth *twice* the one to its right: 1s, 2s, 4s, 8s, 16s...\n\nSo the binary number `1011` means: `(1×8) + (0×4) + (1×2) + (1×1) = 11` in decimal. Reading binary is just adding up the place-values where you see a 1.\n\nA few words you'll want in your pocket:\n\n- **Bit** — one binary digit, 0 or 1.\n- **Byte** — eight bits grouped together. One byte can represent 2⁸ = 256 different values (0 to 255), which is exactly enough for a character of text or one color channel of a pixel.\n- **Nibble** — four bits (yes, half a byte; computer scientists do have jokes).\n\nThe headline fact, the one everything in this section orbits around: **n bits give you 2ⁿ distinct combinations.** Each bit you add *doubles* the number of things you can represent, because every existing pattern can now be followed by either a 0 or a 1. One bit → 2 patterns. Two bits → 4 (`00, 01, 10, 11`). Three bits → 8. The growth is explosive, and that explosion is the whole reason a 64-bit computer can address a frankly ridiculous amount of memory. Go play with that doubling in the next block.",
    },
    {
      id: "b_predict_states",
      kind: "PREDICT",
      question:
        "You have a 4-bit number, which can represent 16 distinct values (0–15). You add just ONE more bit, making it 5 bits. How many distinct values can you represent now?",
      options: [
        { id: "p1", label: "17 — you added one bit, so one more value" },
        { id: "p2", label: "20 — 16 plus a few more" },
        { id: "p3", label: "32 — adding a bit DOUBLES the number of states" },
        { id: "p4", label: "256 — it jumps to a full byte's worth" },
      ],
      answerId: "p3",
      reveal:
        "**32.** Each new bit *doubles* the count, because every one of the 16 existing patterns can now be extended with either a 0 or a 1 — that's 16 × 2 = 32 = 2⁵. This doubling is the most important number-sense in all of computing. It's why going from 32-bit to 64-bit addressing didn't merely double the addressable memory — it multiplied it by 2³² (about 4 billion times). Exponential growth feels gentle for the first few steps and then becomes astronomical. Internalize 'one more bit = twice as much,' and powers of two will stop surprising you. Go feel the curve in the playground.",
    },
    {
      id: "b_formula",
      kind: "FORMULA",
      title: "States from n bits",
      display: "states = 2ⁿ",
      latex: "\\text{states} = 2^{n}",
      variables: [
        { symbol: "states", name: "Number of distinct values representable", unit: "–" },
        { symbol: "n", name: "Number of bits", unit: "bits" },
      ],
      note:
        "Each added bit DOUBLES the representable states, because every existing pattern can be extended by a 0 or a 1. This is why 8 bits = 256 values, and why bit-width directly sets a computer's memory-addressing reach and numeric range.",
    },
    {
      id: "b_sandbox",
      kind: "SANDBOX",
      title: "Playground — the power of doubling 🎛️",
      description:
        "Slide n up one bit at a time and watch the number of states double on every single step — 1, 2, 4, 8, 16... It feels slow, then it detonates. Notice that at n = 8 you hit exactly 256, the size of one byte. Push toward 16 and you're already past 65,000. This single curve is why bit-width is destiny for memory size and numeric range.",
      variables: [
        { key: "n", label: "Number of bits n", unit: "bits", min: 1, max: 16, step: 1, default: 8 },
      ],
      expression: "2 ^ n",
      outputLabel: "Distinct states",
      outputUnit: "states",
      precision: 0,
    },
    {
      id: "b_callout_2n",
      kind: "CALLOUT",
      variant: "insight",
      title: "Why 2ⁿ rules your computer 💡",
      markdown:
        "That tiny formula quietly sets the limits of the machine you're using right now:\n\n- **Addressing.** With n address bits you can point at exactly 2ⁿ memory locations. 32-bit addresses → 2³² = ~4 GB ceiling (the famous reason old systems couldn't use more RAM). 64-bit → 2⁶⁴, an absurd ~18 quintillion.\n- **Range.** An n-bit unsigned integer holds 0 to 2ⁿ − 1. An 8-bit byte tops out at 255 — overflow it and it wraps to 0, the source of countless bugs.\n- **Color & data.** 24-bit color = 2²⁴ ≈ 16.7 million shades. The size of nearly everything digital is some power of two in disguise.\n\nWhen you see 256, 1024, 65536, or 4,294,967,296 in the wild, you're looking at 2⁸, 2¹⁰, 2¹⁶, and 2³². They're everywhere once you know to look.",
    },
    {
      id: "b_gates_prose",
      kind: "PROSE",
      title: "The six gates: logic you can hold in your hand",
      markdown:
        "A **logic gate** is a tiny circuit that takes one or two input bits and produces one output bit by a fixed rule. We describe each gate completely with a **truth table** — a chart listing the output for every possible combination of inputs. There's no mystery left once you have the truth table; it *is* the gate.\n\nThe six you must know cold:\n\n- **NOT** (inverter, written `¬A` or `Ā`) — one input. Flips it. `0→1`, `1→0`. The only single-input gate.\n- **AND** (`A·B`) — output is 1 **only if both** inputs are 1. Think of two switches in series: the light is on only when both are closed.\n- **OR** (`A+B`) — output is 1 **if at least one** input is 1. Two switches in parallel: either one lights the bulb.\n- **NAND** (NOT-AND) — AND with the output flipped. 1 *unless both* inputs are 1. (Quietly the most important gate alive — more soon.)\n- **NOR** (NOT-OR) — OR flipped. 1 *only when both* inputs are 0.\n- **XOR** (exclusive OR, `A⊕B`) — output is 1 when the inputs **differ**. The 'one or the other but not both' gate. It's secretly a 1-bit adder and the heart of arithmetic.\n\nHere are the two-input truth tables side by side — read each row as 'given these inputs, here's the output':\n\n| A | B | AND | OR | NAND | NOR | XOR |\n|---|---|-----|----|----|----|-----|\n| 0 | 0 |  0  | 0  |  1  |  1  |  0  |\n| 0 | 1 |  0  | 1  |  1  |  0  |  1  |\n| 1 | 0 |  0  | 1  |  1  |  0  |  1  |\n| 1 | 1 |  1  | 1  |  0  |  0  |  0  |\n\nNotice how NAND is just the AND column inverted, and NOR is the OR column inverted. Spotting that pattern is half the battle — and it's about to pay off enormously.",
    },
    {
      id: "b_boolean_prose",
      kind: "PROSE",
      title: "Boolean algebra: simplifying circuits like equations",
      markdown:
        "Here's the part that makes engineers smile: logic obeys an **algebra**. Just like `x·1 = x` in ordinary math, Boolean variables follow tidy laws — and these laws let you take a sprawling, expensive circuit and shrink it down to something smaller, cheaper, and faster, all on paper. Using `+` for OR, `·` for AND, and a bar for NOT:\n\n- **Identity:** `A + 0 = A` and `A · 1 = A`. (Combining with the 'do-nothing' value changes nothing.)\n- **Null / Domination:** `A + 1 = 1` and `A · 0 = 0`. (A 1 in an OR, or a 0 in an AND, decides everything.)\n- **Complement:** `A + Ā = 1` and `A · Ā = 0`. (A thing OR-ed with its opposite is always true; AND-ed with its opposite, always false.)\n- **Idempotent:** `A + A = A` and `A · A = A`.\n- **Double negation:** `‾‾A = A`. (Two flips bring you home.)\n\nAnd then the crown jewels, the two laws interviewers fish for — **De Morgan's theorems**:\n\n`‾‾‾‾‾(A · B) = Ā + B̄`   and   `‾‾‾‾‾(A + B) = Ā · B̄`\n\nIn plain English: **the negation of an AND is the OR of the negations, and the negation of an OR is the AND of the negations.** 'NOT (both)' is the same as 'not-this OR not-that.' 'NOT (either)' is the same as 'not-this AND not-that.' De Morgan's is the universal translator between AND-world and OR-world — it lets you swap one for the other (with some inverters), which is *exactly* what you need to rebuild any circuit out of a single gate type. File it away; we're about to use it.",
    },
    {
      id: "b_predict_demorgan",
      kind: "PREDICT",
      question:
        "Using De Morgan's theorem, the expression NOT(A OR B) — i.e. ‾‾‾‾‾(A + B) — is equivalent to which of the following?",
      options: [
        { id: "p1", label: "Ā + B̄  (NOT-A OR NOT-B)" },
        { id: "p2", label: "Ā · B̄  (NOT-A AND NOT-B)" },
        { id: "p3", label: "A · B  (A AND B)" },
        { id: "p4", label: "A ⊕ B  (A XOR B)" },
      ],
      answerId: "p2",
      reveal:
        "It's **Ā · B̄**. De Morgan's rule: when you push a NOT *through* a parenthesis, the operation **flips** (OR becomes AND) and **each term gets negated**. So 'NOT (A OR B)' becomes 'NOT-A AND NOT-B.' Sanity-check it with a truth table: `‾‾‾‾‾(A+B)` is 1 only when A+B is 0, i.e. only when *both* A and B are 0 — which is precisely when Ā and B̄ are both 1, i.e. `Ā·B̄`. Same column, every row. (And note: that output — 1 only when both inputs are 0 — is exactly the NOR gate. De Morgan's just told you NOR = AND-of-inverted-inputs.) This flip-and-negate move is the single most useful trick in digital design.",
    },
    {
      id: "b_seq_prose",
      kind: "PROSE",
      title: "Combinational vs sequential: giving circuits a memory",
      markdown:
        "Everything so far has been **combinational logic**: the output depends *only* on the inputs right now. Feed in the same bits and you always get the same answer, instantly. Gates, adders, multiplexers — all combinational. They have no past. They forget everything the moment the inputs change.\n\nBut a computer that can't *remember* anything is just a calculator with amnesia. To store a value, run a program, or count, you need circuits whose output depends on the inputs **and on their own history**. That's **sequential logic**, and the trick that unlocks it is **feedback** — wiring a gate's output back into its own input so the circuit can hold a state.\n\n- **Flip-flop / latch** — the atom of memory. Built from a couple of cross-coupled gates (you can make one from two NANDs!), it stores a single bit: set it to 1, it stays 1; set it to 0, it stays 0, until you tell it otherwise. It *remembers*.\n- **Register** — a row of flip-flops storing a multi-bit value (say, an 8-bit byte). The little scratchpads inside a CPU are registers.\n- **The clock** — sequential circuits march to a clock signal, a steady tick that says 'now update.' It keeps millions of memory elements changing in disciplined lockstep instead of chaos.\n\nThe big picture: **combinational logic computes; sequential logic remembers.** Stack memory (flip-flops, registers) on top of computation (gates), drive it all with a clock, and you've got the skeleton of an actual processor. And remarkably, *both* halves can be built from the same humble gate — which is the magic trick we'll end on.",
    },
    {
      id: "b_callout_nand",
      kind: "CALLOUT",
      variant: "tip",
      title: "NAND: the one gate to rule them all 🔧",
      markdown:
        "NAND is **functionally complete** (a 'universal gate'): you can build *every* other logic function using nothing but NAND gates. Here's the starter kit:\n\n- **NOT** = a NAND with both inputs tied together: `NAND(A, A) = Ā`.\n- **AND** = NAND followed by a NAND-inverter: `NOT(NAND(A, B)) = A·B`.\n- **OR** = invert both inputs, then NAND them: `NAND(Ā, B̄) = A + B` (that's De Morgan's, live).\n\nFrom NOT, AND, and OR you can construct anything — including memory. This isn't just a party trick: real chips are often fabricated as vast seas of NAND (or NOR) gates because manufacturing *one* highly optimized gate type is cheaper and denser than mixing many. A modern CPU is, in a very real sense, an unfathomable number of NANDs wired with breathtaking cleverness.",
    },
    {
      id: "b_worked",
      kind: "WORKED_EXAMPLE",
      title: "Build an XOR from only NAND gates",
      problem:
        "The classic interview challenge: using NAND gates and nothing else, construct an XOR gate — output 1 exactly when inputs A and B differ. Recall XOR's truth table: 0⊕0=0, 0⊕1=1, 1⊕0=1, 1⊕1=0. (XOR can be written A·B̄ + Ā·B, 'A-and-not-B, or not-A-and-B.') Show the wiring and verify it.",
      steps: [
        {
          label: "Step 1 — The 4-NAND recipe",
          markdown:
            "The standard construction uses **four** NAND gates. Label NAND as the operation `↑` (so `X ↑ Y` means NAND(X,Y)). Wire them up:\n\n- `g1 = A ↑ B`\n- `g2 = A ↑ g1`\n- `g3 = B ↑ g1`\n- `out = g2 ↑ g3`\n\nThat's it — `out` is A XOR B.",
        },
        {
          label: "Step 2 — Why it works (the intuition)",
          markdown:
            "`g1 = NAND(A,B)` is 0 only when both are 1, else 1. Feeding g1 back with each original input, `g2` effectively computes `‾‾‾‾‾(A·g1)` and `g3` computes `‾‾‾‾‾(B·g1)`. The final NAND combines them so that `out` is high exactly when the inputs disagree. Rather than trust the hand-waving, just grind the truth table — that's what an interviewer wants to see anyway.",
        },
        {
          label: "Step 3 — Verify all four input rows",
          markdown:
            "Compute g1, g2, g3, out for every input pair (recall NAND(x,y)=0 only if x=y=1):\n\n| A | B | g1=A↑B | g2=A↑g1 | g3=B↑g1 | out=g2↑g3 |\n|---|---|--------|---------|---------|-----------|\n| 0 | 0 |   1    |    1    |    1    |     **0**     |\n| 0 | 1 |   1    |    1    |    0    |     **1**     |\n| 1 | 0 |   1    |    0    |    1    |     **1**     |\n| 1 | 1 |   0    |    1    |    1    |     **0**     |\n\nRead the `out` column: 0, 1, 1, 0 — exactly XOR. ✓",
        },
        {
          label: "Step 4 — Connect it back to De Morgan's",
          markdown:
            "Notice we never used an AND, OR, or NOT *gate* — only NAND. We *did* lean on the ideas behind De Morgan's: a NAND with tied inputs is a NOT, and inverting-then-NAND-ing builds OR. That's the universality of NAND in action: De Morgan's gives you the translations, and four NANDs assemble the most arithmetic-flavored gate of them all.",
        },
      ],
      answer:
        "XOR = NAND(NAND(A, g1), NAND(B, g1)) where g1 = NAND(A, B) — a four-NAND circuit whose output column is 0,1,1,0, exactly matching XOR. Proof that NAND alone can build anything: we constructed XOR (and implicitly NOT, AND, and OR) using only NAND gates.",
    },
    {
      id: "b_callout_interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "In the interview 🎯",
      markdown:
        "The prompts that come up again and again, and the move that scores each:\n\n- **\"Here's a truth table — name the gate / write the expression.\"** Read it row by row; spot the pattern (all-1s-but-one = NAND, differ = XOR). Don't guess — build the table.\n- **\"Simplify this Boolean expression.\"** Reach for the laws, and reach for **De Morgan's** first when you see a NOT over a parenthesis. Flip the operator, negate each term. Show your steps.\n- **\"Combinational vs sequential?\"** Combinational = output depends only on current inputs (no memory). Sequential = output depends on inputs *and* stored state, enabled by feedback and clocked by a clock. Flip-flops, registers.\n- **\"Build X using only NAND\" / \"Why is NAND universal?\"** NAND is functionally complete: NOT = NAND(A,A); AND = NOT(NAND); OR = NAND of inverted inputs (De Morgan's). Then sketch the four-NAND XOR if pushed.\n\nThe winning pattern, every time: connect the **truth table** → the **Boolean algebra** → the **gate-level circuit**, and verify with a quick table instead of trusting your gut.",
    },
    {
      id: "b_check_gate",
      kind: "CHECK",
      question:
        "A two-input gate outputs 1 for inputs (0,0), and outputs 0 for (0,1), (1,0), and (1,1). Which gate is it?",
      choices: [
        { id: "c1", label: "NOR — output is 1 only when both inputs are 0" },
        { id: "c2", label: "NAND — output is 0 only when both inputs are 1" },
        { id: "c3", label: "XOR — output is 1 when inputs differ" },
        { id: "c4", label: "AND — output is 1 only when both inputs are 1" },
      ],
      answerId: "c1",
      explanation:
        "Output is 1 *only* when both inputs are 0 — that's the signature of **NOR** (NOT-OR). OR is 1 whenever any input is 1, so its inverse, NOR, is 1 only when *every* input is 0. Contrast with NAND, which is 0 only when both inputs are 1 (the opposite corner of the table). Reading a truth table is just matching the output column to the gate's rule — and 'true only when all inputs are off' is NOR, every time.",
    },
    {
      id: "b_check_demorgan",
      kind: "CHECK",
      question:
        "Apply De Morgan's theorem: which expression equals NOT(A AND B), i.e. ‾‾‾‾‾(A · B)?",
      choices: [
        { id: "c1", label: "Ā + B̄  (NOT-A OR NOT-B)" },
        { id: "c2", label: "Ā · B̄  (NOT-A AND NOT-B)" },
        { id: "c3", label: "A + B  (A OR B)" },
        { id: "c4", label: "Ā ⊕ B̄  (NOT-A XOR NOT-B)" },
      ],
      answerId: "c1",
      explanation:
        "De Morgan's: pushing a NOT through the parenthesis **flips the operator and negates each term**. AND becomes OR, and each variable gets a bar — so `‾‾‾‾‾(A·B) = Ā + B̄`. Check it: `‾‾‾‾‾(A·B)` is 0 only when both A and B are 1; `Ā + B̄` is also 0 only when both Ā and B̄ are 0, i.e. when A and B are both 1. Identical columns. This is the twin of the NOR rule from earlier — together, the two De Morgan's theorems are the bridge between AND-logic and OR-logic, and the reason a single gate type can build everything.",
    },
    {
      id: "b_outro",
      kind: "PROSE",
      title: "The whole chain, in one breath",
      markdown:
        "Start with a single switch — a **bit**, 0 or 1 — and stack them: **n bits give 2ⁿ states**, the doubling that sets every computer's memory and range. Wire bits through **logic gates** (AND, OR, NOT, NAND, NOR, XOR), each fully captured by its **truth table**. Those gates obey a real **algebra** — identity, complement, and the star translators, **De Morgan's theorems** — that lets you simplify and *reshape* any circuit on paper. Add **feedback** and a **clock** and combinational logic that merely *computes* becomes sequential logic that *remembers* — flip-flops, registers, the bones of a CPU. And the closing magic trick: every last piece of it can be built from one universal gate, **NAND**, as you proved by assembling XOR from four of them.\n\nFrom a light switch to a thinking machine, with only yes and no. That's the deepest idea in computing — and now it's yours. Go build something out of it.",
    },
  ],
  keyTakeaways: [
    "A bit is a single 0/1 switch; n bits represent 2ⁿ distinct states, and each added bit DOUBLES that count — which is why bit-width sets a computer's memory addressing and numeric range.",
    "The six core gates (AND, OR, NOT, NAND, NOR, XOR) are each fully defined by a truth table; NAND/NOR are just AND/OR inverted, and XOR outputs 1 when inputs differ.",
    "Boolean algebra (identity, null, complement, idempotent) lets you simplify circuits like equations, with De Morgan's theorems as the key tool.",
    "De Morgan's theorems: ‾‾‾‾‾(A·B) = Ā + B̄ and ‾‾‾‾‾(A+B) = Ā · B̄ — push a NOT through a parenthesis by flipping the operator and negating each term.",
    "Combinational logic depends only on current inputs (it computes); sequential logic adds feedback and a clock to depend on stored state (it remembers) via flip-flops and registers.",
    "NAND is a universal gate: NOT, AND, OR, and even XOR can all be built from NAND alone, which is why real chips are often vast seas of one optimized gate type.",
    "Connect the truth table → the Boolean algebra → the gate-level circuit, and always verify by building the truth table rather than trusting intuition.",
  ],
};
