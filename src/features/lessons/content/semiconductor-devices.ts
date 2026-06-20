import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_semis",
  slug: "semiconductor-devices",
  title: "Semiconductors: How Sand Learned to Make Decisions",
  summary:
    "Pure silicon is a mediocre conductor and a mediocre insulator — useless on its own. But sprinkle in a few atoms of the right impurity and it becomes the most important material in human history, capable of steering current one way only, switching billions of times a second, and amplifying a whisper into a roar. You'll learn how doping creates n- and p-type silicon, why a PN junction acts like a one-way valve, and how transistors became the switches that built the modern world. Drag the sliders to size an LED resistor, predict before you peek, and walk out fluent in diodes and transistors.",
  discipline: "ELECTRICAL",
  difficulty: "MEDIUM",
  estMinutes: 23,
  tags: ["semiconductors", "diode", "transistor"],
  objectives: [
    "Explain how doping turns intrinsic silicon into n-type and p-type material.",
    "Describe the PN junction and why a diode conducts in forward bias but blocks in reverse.",
    "Read a diode I-V curve, including the forward-voltage knee Vf and the steep exponential region.",
    "Size a current-limiting resistor for an LED using R = (Vs − Vf)/I.",
    "Contrast BJTs and MOSFETs as switches and amplifiers, and name the MOSFET operating regions.",
    "Explain why transistors are everywhere — from logic gates to power switching.",
  ],
  prerequisites: [
    "Ohm's law and basic series-circuit analysis",
    "Voltage, current, and resistance fundamentals",
    "Comfort reading a simple schematic",
  ],
  interviewAngle:
    "Semiconductor questions are a staple of hardware, embedded, and circuits interviews because they test whether you understand devices physically or just memorized symbols. Interviewers love the LED-resistor problem — it's a 30-second sanity check that you can apply KVL and Ohm's law together and that you remember a diode drops a roughly fixed voltage, not a fixed resistance. From there they probe transistor intuition: can you explain a MOSFET as a voltage-controlled switch, name the cutoff/triode/saturation regions, and say when you'd reach for a BJT versus a MOSFET? Strong candidates reason about the diode's exponential I-V curve, talk about gate voltage controlling channel conductance, and connect 'transistor as a switch' to digital logic and 'transistor as an amplifier' to analog. Reaching for fixed-resistance models of a diode, or confusing voltage-controlled MOSFETs with current-controlled BJTs, is the classic stumble.",
  blocks: [
    {
      id: "semi-hook",
      kind: "PROSE",
      title: "The most useful in-between material ever found",
      markdown:
        "Materials usually pick a lane. Copper *conducts* — electrons roam free. Glass *insulates* — electrons are locked down. Silicon does neither well, and for a long time that made it sound boring. It turns out that being stuck in the middle is the whole superpower.\n\nBecause silicon sits on the fence, we can *bribe* it. Add a vanishingly small pinch of the right impurity — about one foreign atom per ten million — and silicon flips from neutral fence-sitter into a material that can:\n\n- conduct current in **one direction only**, like a check valve for electrons,\n- **switch** itself on and off billions of times per second with no moving parts,\n- and **amplify**, turning a faint signal into a powerful one.\n\nEvery diode, every transistor, every chip in every device you own is built from this trick. By the end you'll understand the PN junction that makes a diode one-way, you'll size an LED resistor in your head, and you'll know why a transistor is just a faucet you control with electricity. Let's see how sand learned to make decisions.",
    },
    {
      id: "semi-video",
      kind: "VIDEO",
      youtubeId: "Bfvyj88Hs_o",
      title: "Watch: How a MOSFET Works",
      channel: "CircuitBread",
    },
    {
      id: "semi-doping-prose",
      kind: "PROSE",
      title: "Doping: bribing silicon to carry charge",
      markdown:
        "A silicon atom has four outer electrons and bonds neatly with four neighbors, locking everyone in place — that's why pure (\"intrinsic\") silicon barely conducts. **Doping** is the art of swapping in a few impurity atoms to free up charge carriers.\n\n- **n-type:** add atoms with *five* outer electrons (phosphorus, arsenic). Four bond with silicon; the fifth has nowhere to go and roams free. Now you have spare **electrons** — negative carriers — hence \"n.\"\n- **p-type:** add atoms with *three* outer electrons (boron). One bond is left unfilled, creating a **hole** — a missing electron that behaves like a *positive* mobile charge, because neighboring electrons keep hopping into it and shuffling it along. Hence \"p.\"\n\nKey subtlety that trips people up: both n-type and p-type silicon are **electrically neutral overall** — you didn't add net charge, just mobile carriers. You simply gave the material a surplus of one kind of carrier ready to move. n-type has electrons as its *majority carriers*; p-type has holes. Nothing interesting happens yet — until you press a piece of n-type against a piece of p-type. That junction is where the magic lives.",
    },
    {
      id: "semi-junction-prose",
      kind: "PROSE",
      title: "The PN junction: a one-way valve appears",
      markdown:
        "Slam n-type and p-type together and the carriers at the border immediately mingle. Free electrons from the n-side rush across to fill holes on the p-side. But as they leave, they expose fixed positive ions on the n-side and create fixed negatives on the p-side. This stranded charge builds an internal electric field across a thin **depletion region** — a no-man's-land scrubbed clean of free carriers. That field eventually pushes back hard enough to stop the stampede. Equilibrium.\n\nNow bias it, and the asymmetry shows up:\n\n- **Forward bias** (+ to p, − to n): your applied voltage *opposes* the internal field, shrinks the depletion region, and once you push past the **forward voltage Vf** (~0.7 V for silicon, ~2 V for a red LED), current flows freely. The valve opens.\n- **Reverse bias** (+ to n, − to p): your voltage *reinforces* the internal field, widens the depletion region, and current is blocked down to a tiny leakage. The valve slams shut.\n\nThat one-way behavior *is* the diode. Forward = open gate, reverse = closed gate. The arrow in the schematic symbol literally points the direction conventional current is allowed to flow.",
    },
    {
      id: "semi-formula-diode",
      kind: "FORMULA",
      title: "The diode equation and the forward drop",
      display: "I = Is·(e^(V/(n·Vt)) − 1)        Vt = k·T/q ≈ 26 mV at room temp",
      variables: [
        { symbol: "I", name: "Diode current", unit: "A" },
        { symbol: "Is", name: "Reverse saturation (leakage) current", unit: "A" },
        { symbol: "V", name: "Voltage across the diode", unit: "V" },
        { symbol: "n", name: "Ideality factor (≈ 1–2)", unit: "" },
        { symbol: "Vt", name: "Thermal voltage", unit: "V" },
      ],
      note: "Current rises EXPONENTIALLY with voltage, which is why the I-V curve has a sharp 'knee': below Vf almost nothing flows, then current rockets up. That steepness is exactly why we treat Vf as roughly constant and why a diode must never be driven by raw voltage without a current limit.",
    },
    {
      id: "semi-iv-prose",
      kind: "PROSE",
      title: "Reading the I-V curve (and why LEDs need a resistor)",
      markdown:
        "Plot diode current versus voltage and you get a hockey stick. Below the forward voltage Vf, current is essentially flat-zero. Cross Vf and current shoots up almost vertically — that's the exponential `e^(V/Vt)` term taking over.\n\nThe practical lesson hides in that steepness: **a diode does not have a fixed resistance.** It clamps to a roughly fixed *voltage* (Vf) and then lets current do whatever the rest of the circuit allows. So if you wire an LED straight across a battery, a tiny voltage above Vf demands a huge current, the LED overheats, and *poof* — you've made a very brief, very expensive light.\n\nThe fix is a **series current-limiting resistor.** The resistor eats the leftover voltage and sets the current by Ohm's law. Walk KVL around the loop: the supply equals the resistor drop plus the LED drop, `Vs = I·R + Vf`. Solve for R:\n\n`R = (Vs − Vf) / I`.\n\nThat one line is the most-asked semiconductor interview question on Earth, because it forces you to combine KVL, Ohm's law, and the fixed-Vf model of a diode in a single breath. We'll drill it in the sandbox.",
    },
    {
      id: "semi-formula-led",
      kind: "FORMULA",
      title: "LED current-limiting resistor",
      display: "Vs = I·R + Vf        →        R = (Vs − Vf) / I",
      variables: [
        { symbol: "R", name: "Series current-limiting resistor", unit: "Ω" },
        { symbol: "Vs", name: "Supply voltage", unit: "V" },
        { symbol: "Vf", name: "LED forward voltage drop", unit: "V" },
        { symbol: "I", name: "Desired LED current", unit: "A" },
      ],
      note: "Treat the LED as a fixed Vf drop; the resistor absorbs the rest of the supply and pins the current. Also check the resistor's power rating: P_R = (Vs − Vf)·I — a small-signal resistor can cook if you skip this.",
    },
    {
      id: "semi-sandbox",
      kind: "SANDBOX",
      title: "Play: size an LED resistor",
      description:
        "Drag the supply voltage, LED forward voltage, and target current and watch the required series resistor update. With the defaults — 5 V supply, 2 V red LED, 20 mA (0.02 A) — you get R = (5 − 2)/0.02 = 150 Ω, the classic answer every hardware tinkerer has memorized. Now bump the supply to 12 V and notice the resistor has to grow to soak up the extra voltage; drop the target current and it grows again.",
      variables: [
        { key: "Vs", label: "Supply voltage Vs", unit: "V", min: 3, max: 24, step: 0.5, default: 5 },
        { key: "Vf", label: "LED forward voltage Vf", unit: "V", min: 1.5, max: 3.5, step: 0.1, default: 2 },
        { key: "I", label: "LED current I", unit: "A", min: 0.005, max: 0.05, step: 0.001, default: 0.02 },
      ],
      expression: "(Vs - Vf) / I",
      outputLabel: "Series resistor",
      outputUnit: "Ω",
      precision: 0,
    },
    {
      id: "semi-predict-led",
      kind: "PREDICT",
      question:
        "You sized a 150 Ω resistor for a 2 V LED on a 5 V supply (20 mA). You swap to a blue LED with Vf = 3.2 V but keep the same 150 Ω resistor. What happens to the LED current?",
      options: [
        { id: "a", label: "It stays at 20 mA — the resistor sets the current." },
        { id: "b", label: "It drops to about 12 mA — less voltage is left for the resistor." },
        { id: "c", label: "It rises to about 30 mA — blue LEDs are brighter." },
        { id: "d", label: "It goes to zero — 3.2 V is too high for 5 V." },
      ],
      answerId: "b",
      reveal:
        "**It drops to about 12 mA.** The resistor only gets whatever voltage the LED *doesn't* take: `I = (Vs − Vf)/R = (5 − 3.2)/150 = 1.8/150 = 0.012 A = 12 mA`. The higher forward drop leaves less voltage across the resistor, so less current flows — the LED just runs dimmer. Option (a) is the trap: the resistor sets current only *for a given Vf*; change Vf and the current changes. (And 3.2 V is fine on a 5 V rail — there's still 1.8 V of headroom.)",
    },
    {
      id: "semi-transistor-prose",
      kind: "PROSE",
      title: "Transistors: a faucet you turn with electricity",
      markdown:
        "A diode is a one-way valve with no handle. A **transistor** adds the handle: a third terminal that lets a small electrical signal control a large current between the other two. That's it — a transistor is an electrically-controlled faucet. Two flavors dominate:\n\n- **BJT (bipolar junction transistor)** — three terminals: base, collector, emitter. A small **base current** controls a much larger collector current: `I_C = β·I_B`, where β might be 100. It's **current-controlled**, and the base-emitter junction needs ~0.7 V to turn on. Great for analog gain and certain switching.\n- **MOSFET (metal-oxide-semiconductor FET)** — three terminals: gate, drain, source. The gate is *insulated* from the channel by a thin oxide, so it draws almost no steady current. Instead the **gate voltage** builds an electric field that opens or pinches a conducting channel. It's **voltage-controlled**, sips no DC gate current, and switches fast — which is why essentially all digital logic and modern power switching is MOSFETs.\n\nThe one-sentence contrast every interviewer wants: **BJT = current-controlled, MOSFET = voltage-controlled.** Both can act as a switch (hard on / hard off) or as an amplifier (operating in a linear in-between region). Which job they do depends entirely on which region you bias them in.",
    },
    {
      id: "semi-regions-prose",
      kind: "PROSE",
      title: "The three MOSFET regions: off, resistor, current source",
      markdown:
        "A MOSFET's behavior splits into three regions, set by the gate-source voltage `V_GS` relative to a **threshold voltage** `V_th`, and by the drain-source voltage `V_DS`:\n\n- **Cutoff** (`V_GS < V_th`): no channel exists, the switch is **fully off**, essentially no current flows. This is the digital \"0\" state.\n- **Triode / ohmic** (`V_GS > V_th`, small `V_DS`): a channel is open and the device behaves like a small voltage-controlled **resistor**. This is the **fully-on** switch state — you want `V_DS` tiny so it dissipates little power. Digital \"1.\"\n- **Saturation** (`V_GS > V_th`, larger `V_DS`): the channel pinches off near the drain and current becomes roughly *constant*, set by `V_GS` and nearly independent of `V_DS`. This is the **amplifier** region, where small gate-voltage wiggles make big, controlled current swings.\n\nSo the same device is a switch when you slam it between cutoff and triode, and an amplifier when you park it in saturation. (Heads up on vocabulary: a BJT's \"saturation\" means *fully on* — the opposite of a MOSFET's saturation. Interviewers occasionally bait this; know which device you're talking about.)",
    },
    {
      id: "semi-predict-control",
      kind: "PREDICT",
      question:
        "You want to switch a 5 A motor on and off from a microcontroller pin that can only source a few microamps of current. Reaching for a switching device, which choice fits best and why?",
      options: [
        { id: "a", label: "A BJT, because base current directly sets collector current." },
        { id: "b", label: "A MOSFET, because the gate is voltage-controlled and draws almost no steady current." },
        { id: "c", label: "A plain diode, because it handles high current." },
        { id: "d", label: "Either transistor works identically; the choice is arbitrary." },
      ],
      answerId: "b",
      reveal:
        "**A MOSFET.** Its gate is insulated, so steady-state it draws essentially zero current — a feeble microcontroller pin can hold the gate voltage high with no trouble and switch a big load. A BJT (option a) needs real, continuous *base current* to stay on (`I_C = β·I_B`), so driving 5 A through β = 100 demands ~50 mA of base current — far beyond a microamp-class pin. A diode (c) has no control terminal at all; it can't be switched. And (d) ignores the whole current-vs-voltage control distinction that makes this an easy call.",
    },
    {
      id: "semi-worked",
      kind: "WORKED_EXAMPLE",
      title: "Worked example: drive an LED with a MOSFET switch",
      problem:
        "You're driving a green LED (Vf = 2.1 V) at 15 mA from a 5 V rail, switched on and off by a logic-level N-channel MOSFET (treat its on-resistance R_DS(on) = 0 for now). (a) Find the current-limiting resistor. (b) Find the power dissipated in that resistor. (c) The MOSFET is fully on with V_GS = 5 V and a tiny V_DS — which region is it operating in, and is it acting as a switch or amplifier? (d) Why use a MOSFET here instead of a BJT?",
      steps: [
        {
          label: "(a) Current-limiting resistor",
          markdown:
            "KVL with the MOSFET fully on (≈ 0 V drop): Vs = I·R + Vf, so R = (Vs − Vf)/I = (5 − 2.1)/0.015 = 2.9/0.015 ≈ 193 Ω. Use the nearest standard value, 200 Ω (slightly less current, perfectly safe).",
        },
        {
          label: "(b) Resistor power",
          markdown:
            "P_R = (Vs − Vf)·I = 2.9 V × 0.015 A = 0.0435 W ≈ 44 mW. A standard 1/4 W (250 mW) resistor handles this with enormous margin.",
        },
        {
          label: "(c) MOSFET region",
          markdown:
            "Fully on with V_GS well above threshold and a *small* V_DS means the channel is open and the device behaves like a small resistor — that's the **triode (ohmic) region**. It's acting as a **switch** (fully on), not an amplifier. The amplifier region would be saturation, with a larger V_DS.",
        },
        {
          label: "(d) Why MOSFET over BJT",
          markdown:
            "The MOSFET's insulated gate draws essentially no steady current, so the logic pin drives it directly with no base-resistor math and no continuous drive current. A BJT would need a base resistor sized to deliver enough base current (I_C/β) to stay saturated. For a simple logic-driven on/off load, the MOSFET is the cleaner switch.",
        },
      ],
      answer:
        "(a) R ≈ 193 Ω (use 200 Ω); (b) ≈ 44 mW, so a 1/4 W resistor is fine; (c) triode/ohmic region, acting as a fully-on switch; (d) the MOSFET's voltage-controlled, near-zero-current gate lets a logic pin drive it directly, unlike a current-hungry BJT base.",
    },
    {
      id: "semi-check-led",
      kind: "CHECK",
      question:
        "You need to run a 2.0 V LED at 10 mA from a 9 V supply. What current-limiting resistor do you need?",
      choices: [
        { id: "a", label: "200 Ω" },
        { id: "b", label: "700 Ω" },
        { id: "c", label: "900 Ω" },
        { id: "d", label: "70 Ω" },
      ],
      answerId: "b",
      explanation:
        "R = (Vs − Vf)/I = (9 − 2.0)/0.010 = 7.0/0.010 = 700 Ω. Option (c) forgets to subtract Vf (9/0.010 = 900 Ω). Option (a) uses the wrong supply voltage drop. The key move is subtracting the LED's forward drop *first* — the resistor only handles the leftover 7 V, not the full 9 V.",
    },
    {
      id: "semi-check-control",
      kind: "CHECK",
      question:
        "Which statement correctly distinguishes a BJT from a MOSFET?",
      choices: [
        { id: "a", label: "A BJT is voltage-controlled; a MOSFET is current-controlled." },
        { id: "b", label: "A BJT is current-controlled (via base current); a MOSFET is voltage-controlled (via gate voltage)." },
        { id: "c", label: "Both are current-controlled; the only difference is speed." },
        { id: "d", label: "A MOSFET draws large steady gate current; a BJT draws none." },
      ],
      answerId: "b",
      explanation:
        "A BJT is current-controlled: collector current follows base current, I_C = β·I_B. A MOSFET is voltage-controlled: the gate voltage sets up the channel and, because the gate is insulated by oxide, it draws essentially no steady current. Option (a) swaps the two; (c) ignores the control mechanism entirely; (d) reverses reality — it's the BJT base that needs continuous current, while the MOSFET gate sips almost none.",
    },
    {
      id: "semi-callout-interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "What interviewers are really probing",
      markdown:
        "Semiconductor questions test physical intuition, not memorized symbols. Hit these and you sound fluent:\n\n1. **The LED resistor on demand.** `R = (Vs − Vf)/I`. Say out loud: \"subtract the diode's forward drop, then Ohm's law on the rest.\" Treating the diode as a fixed Vf (not a fixed resistance) is the whole point.\n2. **BJT vs MOSFET in one line.** \"BJT is current-controlled, MOSFET is voltage-controlled with an insulated gate.\" Then pick a MOSFET for logic-driven switching because the gate needs almost no current.\n3. **Name the regions and what they're for.** Cutoff = off, triode = on (switch), saturation = amplifier — and flag that BJT \"saturation\" means the opposite (fully on).\n\nBonus: mention the exponential diode I-V curve to justify why Vf is roughly constant, and connect \"transistor as switch\" to digital logic and \"transistor as amplifier\" to analog gain. Reasoning physically beats reciting equations.",
    },
    {
      id: "semi-callout-warning",
      kind: "CALLOUT",
      variant: "warning",
      title: "Traps that quietly cost you points",
      markdown:
        "- **A diode is not a resistor.** It clamps to ~Vf and lets the *circuit* set the current. Never wire an LED straight across a supply — always add a current limiter.\n- **Subtract Vf before Ohm's law.** The resistor only sees `Vs − Vf`, not the full supply. Forgetting this is the most common LED-resistor mistake.\n- **Don't confuse the two 'saturations.'** MOSFET saturation = amplifier region (constant current). BJT saturation = fully-on switch. Same word, opposite meaning.\n- **MOSFET gate current ≈ 0 (DC), but not during switching.** Flipping the gate fast means charging its capacitance, which *does* draw transient current — relevant for high-speed or high-power switching.\n- **n-type and p-type are still neutral.** Doping adds mobile carriers, not net charge. The interesting charge separation only appears at the junction.",
    },
    {
      id: "semi-recap",
      kind: "CALLOUT",
      variant: "insight",
      title: "One thread to pull it together",
      markdown:
        "Doping gives silicon spare carriers (electrons in n-type, holes in p-type). Press the two together and a depletion region forms a one-way valve — the diode, which drops a roughly fixed Vf and is sized in circuits by `R = (Vs − Vf)/I`. Add a control terminal and you get a transistor: a faucet driven by base *current* (BJT) or gate *voltage* (MOSFET), living in cutoff (off), triode (on), or saturation (amplify). Diodes steer, transistors switch and amplify — and stacking billions of these tiny decisions is how sand became the brain of every device you own.",
    },
  ],
  keyTakeaways: [
    "Doping turns near-insulating silicon into n-type (extra free electrons) or p-type (holes) material; both stay electrically neutral, just with surplus mobile carriers.",
    "A PN junction forms a depletion region that acts as a one-way valve: it conducts in forward bias past Vf (~0.7 V silicon, ~2 V red LED) and blocks in reverse.",
    "Diode current rises exponentially with voltage, so a diode clamps to a roughly fixed Vf rather than a fixed resistance — it must be current-limited, never voltage-driven.",
    "Size an LED's series resistor with R = (Vs − Vf)/I, and check its power with P_R = (Vs − Vf)·I.",
    "A transistor is an electrically-controlled faucet: a BJT is current-controlled (I_C = β·I_B), a MOSFET is voltage-controlled through an insulated, near-zero-current gate.",
    "MOSFET regions: cutoff = off, triode/ohmic = fully-on switch, saturation = amplifier; note a BJT's 'saturation' means fully-on, the reverse of a MOSFET's.",
    "Transistors are everywhere because they both switch (digital logic, power control) and amplify (analog gain), and billions of them fit on a single chip.",
  ],
};
