import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_balances",
  slug: "mass-and-energy-balances",
  title: "Mass and Energy Balances",
  summary:
    "Every chemical plant on Earth runs on one childishly simple idea: stuff doesn't appear or vanish. Master \"what goes in must come out (plus whatever piles up)\" and you can analyze a mixing tank, a distillation column, or a city's water supply with the same five-step recipe — then bolt on energy balances and size the heater that warms the stream. This is the load-bearing skill of chemical engineering, and it's mostly just very careful bookkeeping.",
  discipline: "CHEMICAL",
  difficulty: "EASY",
  estMinutes: 22,
  tags: ["mass-balance", "energy-balance", "conservation"],
  objectives: [
    "Write the general conservation law — in = out + accumulation — and instantly collapse it to in = out whenever a process is at steady state.",
    "Run the five-step balance recipe (system, basis, streams, equations, solve) on any flowsheet without panicking.",
    "Track individual species through splitters, mixers, and recycle loops, not just total mass.",
    "Apply the open-system energy balance and compute a sensible-heat duty with Q = ṁ·cp·ΔT.",
    "Choose a smart basis and count your degrees of freedom so you know a problem is solvable before you start.",
    "Tell the difference between a mass balance question and an energy balance question — and know when you need both.",
  ],
  prerequisites: [
    "Basic algebra: solving systems of linear equations",
    "Units and unit conversion (kg, kg/s, kJ, kW)",
    "Comfort with the idea of a chemical stream having a flow rate and a composition",
  ],
  interviewAngle:
    "Mass and energy balances are the chemical-engineering equivalent of \"reverse a linked list\": if you can't do them fluently, nothing else matters, so interviewers lead with them. What they're actually probing is discipline, not cleverness. The strong candidate (1) draws a box, labels every stream in and out, and explicitly states the system boundary before writing a single equation; (2) picks a convenient basis (\"let's say 100 kg/h of feed\") instead of dragging unknowns around; (3) writes one total balance plus one balance per independent species and counts degrees of freedom to confirm the problem is closed; and (4) keeps mass balances and energy balances in separate buckets, reaching for Q = ṁ·cp·ΔT only for sensible heating and knowing to add latent heat or reaction enthalpy when a phase changes or a reaction fires. Expect a quick mixing-tank or splitter question, a \"what's the recycle ratio\" curveball, and a \"now size the heater\" follow-up. Calm, systematic bookkeeping beats fast arithmetic every time.",
  blocks: [
    {
      id: "mb_intro",
      kind: "PROSE",
      title: "The bathtub that explains all of chemical engineering 🛁",
      markdown:
        "Picture a bathtub. The tap is running in, the drain is open, and the water level is changing. How fast does the level rise or fall? You already know the answer in your bones: it's the rate water comes *in*, minus the rate it goes *out*. If in beats out, the level climbs. If out wins, it drops. If they're equal, the level just... sits there.\n\nCongratulations — you now understand the single most important equation in chemical engineering. Every refinery, brewery, water-treatment plant, and pharmaceutical reactor is, at heart, a fancy bathtub. The water might be crude oil or fermenting beer or a stream of reacting gases, and the \"tub\" might be a 40-metre distillation column, but the bookkeeping is identical:\n\n```\nINPUT - OUTPUT + GENERATION - CONSUMPTION = ACCUMULATION\n```\n\nThat's the **general conservation balance**, and you write it for whatever you're counting — total mass, a single chemical species, atoms, energy, money. The middle two terms (generation/consumption) only show up when a chemical reaction is making or destroying the thing you're tracking. Turn off reactions and it's just the bathtub: **in − out = accumulation**.\n\nHere's the move that makes 90% of real problems tractable: most plants run at **steady state**. The level in the tub isn't changing — accumulation is zero — so the equation flattens into the one you'll use constantly:\n\n```\nINPUT = OUTPUT     (steady state, no reaction)\n```\n\nWhat goes in, comes out. It sounds too simple to be useful. It is, in fact, almost the entire job.",
    },
    {
      id: "mb_video",
      kind: "VIDEO",
      youtubeId: "-2rKsJ_SUO0",
      title: "Watch: The Easiest Way to Solve Mass Balances",
      channel: "The ChemEngStudent",
      caption:
        "A clean, no-nonsense walkthrough of the exact procedure we're about to formalize. Watch it first — seeing the box-and-streams method once will make every worked example below feel like review instead of revelation.",
    },
    {
      id: "mb_conservation",
      kind: "PROSE",
      title: "Conservation: the law you can't break",
      markdown:
        "Why does any of this work? Because of a law so fundamental it feels like cheating: **mass is conserved.** Atoms don't appear from nowhere and don't blink out of existence (we'll politely ignore nuclear reactors, where a sliver of mass becomes energy). So if you draw a boundary around *anything* and carefully count what crosses it, the books *must* balance. The universe is the world's strictest accountant.\n\nThree distinctions to lock in:\n\n- **Total mass vs. species mass.** Total mass is *always* conserved, even with reactions — atoms just rearrange. But an individual *species* (say, ethanol) can be created or destroyed by reaction, so its balance carries the generation/consumption terms. No reaction? Then every species is independently conserved too, which hands you a separate equation for each one. Free equations are good.\n- **Steady state vs. unsteady (transient).** Steady state means nothing inside the system is changing with time → accumulation = 0. Start-up, shut-down, and that filling bathtub are *transient* — accumulation is alive and the right-hand side is `dm/dt`. Steady state is the default assumption for a running plant.\n- **Batch vs. continuous.** A batch process (a pot of soup) has no in/out flows while it cooks — it's all accumulation. A continuous process (a pipeline) is all flow, no accumulation at steady state. Most of industry is continuous because continuous is efficient.\n\nThe quantity you balance can be mass flow (kg/s), molar flow (mol/s), or even individual atoms (great for reactions). Pick whichever makes the algebra cleanest — they're all conserved.",
    },
    {
      id: "mb_general_formula",
      kind: "FORMULA",
      title: "The general balance equation",
      display: "In − Out + Gen − Cons = Accumulation",
      latex: "\\text{In} - \\text{Out} + \\text{Gen} - \\text{Cons} = \\text{Accumulation}",
      variables: [
        { symbol: "In", name: "Rate of the quantity entering across the system boundary", unit: "kg/s" },
        { symbol: "Out", name: "Rate of the quantity leaving across the boundary", unit: "kg/s" },
        { symbol: "Gen", name: "Rate generated inside (only for a reacting species)", unit: "kg/s" },
        { symbol: "Cons", name: "Rate consumed inside (only for a reacting species)", unit: "kg/s" },
        { symbol: "Acc", name: "Rate of accumulation inside the system, dm/dt", unit: "kg/s" },
      ],
      note:
        "Two switches turn this monster into something friendly. No reaction → Gen and Cons vanish. Steady state → Acc = 0. Flip both and you get the workhorse: In = Out. Total mass always conserves (Gen − Cons = 0 for total); only individual species feel reaction terms.",
    },
    {
      id: "mb_procedure",
      kind: "PROSE",
      title: "The five-step recipe (do these in order, every time)",
      markdown:
        "Balance problems aren't hard; *unsystematic* balance problems are hard. The pros follow the same checklist on a one-stream splitter and a 12-unit flowsheet. Internalize the recipe and you'll never stare at a blank page again.\n\n1. **Draw the system and the boundary.** Sketch a box around what you're analyzing. Decide *exactly* what's inside. Every stream that crosses the box is an input or an output — anything that doesn't cross it is irrelevant. This single act of drawing prevents most mistakes.\n\n2. **Label every stream.** Give each stream a flow rate and a composition, known or unknown. Use letters for unknowns. If a stream is a mixture, label the fraction of each component.\n\n3. **Choose a basis.** Pick a convenient amount to anchor the math — \"100 kg/h of feed\" or \"1 second of operation.\" A basis turns a problem about *ratios* into a problem about *numbers*. If a flow rate is already given, that's your basis for free.\n\n4. **Write the balance equations.** One total mass balance, plus one balance per independent species. Each is just `in = out` (steady state, no reaction) for that quantity. Now **count degrees of freedom**: unknowns minus independent equations. Zero means it's solvable. Positive means you're missing info; negative means something's over-specified or contradictory.\n\n5. **Solve, then sanity-check.** Crunch the algebra. Then ask: do the numbers make sense? Do outputs sum to inputs? Are all fractions between 0 and 1? A negative flow rate means you blew a sign somewhere.\n\nThat's it. The whole discipline of balances is choosing the box well and counting honestly.",
    },
    {
      id: "mb_units_streams",
      kind: "PROSE",
      title: "Splitting, mixing, and the dreaded recycle 🔁",
      markdown:
        "Three stream patterns show up everywhere, and once you see them you'll never *un*-see them:\n\n- **Mixing (a tee or a tank):** two or more streams merge into one. Total out = sum of totals in; and *each species* out = sum of that species in. A coffee with cream is a mixing problem: the mug's mass is coffee + cream, and the caffeine in the mug is the caffeine from the coffee (cream brings none).\n\n- **Splitting (a splitter):** one stream divides into two or more. The magic of a pure splitter is that *composition doesn't change* — you're just dividing the same soup into bowls. So the only unknown is the **split fraction**: how much went down each path. (Contrast a *separator*, like a filter or distillation column, which *does* change composition — that's a real separation, not a split.)\n\n- **Recycle:** part of an output stream is fed back to the front. Sounds exotic, but it's everywhere — recycling unreacted feed boosts overall conversion, recycling solvent saves money. The trick that trips people up: a recycle loop creates a stream that's both an output *and* an input, so you draw a clever boundary (around just the mixing point, or around the whole system) to expose the equations you need. The **recycle ratio** (recycle flow ÷ fresh feed) is the number interviewers love to ask for. We'll keep recycle conceptual here — just know that the *same* in = out bookkeeping cracks it; you only have to choose your box wisely.\n\nThe meta-lesson: complicated flowsheets are just simple balances wearing a trench coat. Box, label, balance, repeat.",
    },
    {
      id: "mb_predict_split",
      kind: "PREDICT",
      question:
        "A single stream of salty water (5% salt by mass) hits a simple splitter and divides: 70% of the flow goes left, 30% goes right. What is the salt concentration in the LEFT branch?",
      options: [
        { id: "a", label: "About 3.5% — the salt splits in proportion to the flow" },
        { id: "b", label: "Still 5% — a splitter divides the stream but doesn't change its composition" },
        { id: "c", label: "About 7.1% — the bigger branch concentrates the salt" },
        { id: "d", label: "0% — the salt stays behind in the splitter" },
      ],
      answerId: "b",
      reveal:
        "Still **5%**. A pure splitter is dumb on purpose: it just divides the same soup into two bowls without changing the recipe. Both branches come out at 5% salt — the *amounts* differ (the 70% branch carries 70% of the salt and 70% of the water), but the *concentration* is identical everywhere.\n\nThis is the defining feature of a splitter, and the thing people forget under pressure: **composition is preserved across a split.** If a unit changes the concentration of the outgoing streams, it isn't a splitter — it's a separator (a filter, a still, a membrane), and that's a fundamentally harder, more interesting problem. Spotting \"split vs. separate\" instantly is half the battle on a flowsheet.",
    },
    {
      id: "mb_energy_prose",
      kind: "PROSE",
      title: "Now the other ledger: energy 🔥",
      markdown:
        "Mass isn't the only thing the universe refuses to lose track of — **energy is conserved too**, and it gets its very own balance. This is just the **first law of thermodynamics** dressed up for flowing systems. For an open system (one with streams crossing the boundary) at steady state, ignoring kinetic and potential energy and shaft work, the energy balance simplifies to a satisfyingly clean statement:\n\n```\nQ = (enthalpy out) − (enthalpy in) = ṁ · Δh\n```\n\nThe heat you add (`Q`) equals the change in the stream's enthalpy. And for the most common case — heating or cooling a stream *without* a phase change or reaction — the enthalpy change is just **sensible heat**: the energy that shows up as a temperature change. That gives the formula you'll reach for constantly:\n\n```\nQ = ṁ · cp · ΔT\n```\n\nIn words: to raise a mass flow `ṁ` by a temperature jump `ΔT`, you must pour in heat proportional to the material's **specific heat capacity** `cp` — how stubborn the substance is about warming up. Water has a famously huge `cp` (≈ 4.18 kJ/kg·K), which is exactly why it's the world's favorite coolant and why the ocean moderates the climate: it soaks up enormous heat for a tiny temperature rise.\n\nWatch the units like a hawk. With `ṁ` in kg/s, `cp` in kJ/kg·K, and `ΔT` in K (or °C — a *difference* is the same in both), `Q` comes out in **kW** (kJ/s). Mix up per-second and per-hour and your heater will be off by 3600×.",
    },
    {
      id: "mb_energy_formula",
      kind: "FORMULA",
      title: "Sensible-heat duty (steady-flow)",
      display: "Q = ṁ · cp · ΔT",
      latex: "Q = \\dot{m}\\,c_p\\,\\Delta T",
      variables: [
        { symbol: "Q", name: "Heat duty — rate of heat added (or removed if negative)", unit: "kW" },
        { symbol: "ṁ", name: "Mass flow rate of the stream", unit: "kg/s" },
        { symbol: "cp", name: "Specific heat capacity at constant pressure", unit: "kJ/kg·K" },
        { symbol: "ΔT", name: "Temperature change, T_out − T_in", unit: "K" },
      ],
      note:
        "This covers SENSIBLE heat only — energy that changes temperature. The instant a stream boils, melts, or reacts, you must add LATENT heat (ṁ·Δh_vap) or reaction enthalpy on top. A positive Q means heating; negative means cooling. Units: kg/s · kJ/kg·K · K = kJ/s = kW.",
    },
    {
      id: "mb_sandbox",
      kind: "SANDBOX",
      title: "Play with it: the heater-duty machine 🎛️",
      description:
        "Stop reading, start dragging. You're sizing the heater for a flowing stream. Crank the mass flow ṁ, swap the fluid by changing cp (water is 4.18; many oils and organics are nearer 2), and dial the temperature rise ΔT — then watch the heat duty Q react in real time. Notice that Q is perfectly linear in all three: double any one of them and Q doubles. The defaults (ṁ = 2 kg/s, cp = 4.18 kJ/kg·K, ΔT = 50 K) land on 418.0 kW — the heat to warm 2 kg/s of water by 50 °C. That's a serious industrial heater.",
      variables: [
        { key: "m", label: "Mass flow ṁ", unit: "kg/s", min: 0.1, max: 20, step: 0.1, default: 2 },
        { key: "cp", label: "Specific heat cp", unit: "kJ/kg·K", min: 0.5, max: 5, step: 0.01, default: 4.18 },
        { key: "dT", label: "ΔT", unit: "K", min: 1, max: 200, step: 1, default: 50 },
      ],
      expression: "m * cp * dT",
      outputLabel: "Heat duty Q",
      outputUnit: "kW",
      precision: 1,
    },
    {
      id: "mb_predict_cp",
      kind: "PREDICT",
      question:
        "In the sandbox you just used, keep ṁ and ΔT fixed but switch the fluid from water (cp ≈ 4.18) to a hydrocarbon oil (cp ≈ 2.09 — about half). What happens to the heat duty Q needed to achieve the same temperature rise?",
      options: [
        { id: "a", label: "It roughly doubles — oil is harder to heat" },
        { id: "b", label: "It's roughly halved — oil takes about half the heat for the same ΔT" },
        { id: "c", label: "No change — duty depends only on flow rate and ΔT" },
        { id: "d", label: "It drops to nearly zero — oils barely store heat" },
      ],
      answerId: "b",
      reveal:
        "It's **roughly halved**. `Q = ṁ·cp·ΔT` is dead linear in `cp`, so halving the specific heat halves the duty — same flow, same temperature rise, half the heater.\n\nThis is why specific heat is such a big deal in practice. Water's enormous `cp` makes it the champion coolant and heat-transfer fluid, but it also makes water *expensive to heat* — boiling a pot takes real energy precisely because water hoards it. Many organic process fluids have `cp` around 2, so they warm up with about half the energy water would need. When an interviewer hands you a duty problem, the *fluid* matters as much as the flow rate. Try it in the slider: drag cp from 4.18 down to ~2.09 and watch Q fall by half.",
    },
    {
      id: "mb_predict_state",
      kind: "PREDICT",
      question:
        "You're sizing a heater to take 1 kg/s of water from 90 °C, fully boil it, and deliver saturated steam at 100 °C. A teammate computes the duty as just Q = ṁ·cp·ΔT with ΔT = 10. Is that right?",
      options: [
        { id: "a", label: "Yes — 10 °C is 10 °C, the formula handles it" },
        { id: "b", label: "No — it badly UNDER-counts; boiling needs a huge latent-heat term on top" },
        { id: "c", label: "No — but it OVER-counts; phase change releases energy" },
        { id: "d", label: "Yes, as long as you use the steam value of cp" },
      ],
      answerId: "b",
      reveal:
        "No — and the miss is enormous. `Q = ṁ·cp·ΔT` only counts **sensible** heat, the energy that changes *temperature*. But boiling water from liquid to vapor at 100 °C changes its *phase* at constant temperature, and that costs a fortune: water's latent heat of vaporization is ≈ 2257 kJ/kg.\n\nDo the real arithmetic for 1 kg/s. Sensible part (90→100 °C): `1 × 4.18 × 10 ≈ 42 kW`. Latent part (boiling all of it): `1 × 2257 ≈ 2257 kW`. The latent heat is **~50× larger** than the sensible heat your teammate computed. Forgetting it would undersize the heater by a catastrophic margin.\n\nThe takeaway, and a classic interview trap: the instant a stream changes phase (or a reaction fires), `ṁ·cp·ΔT` is *not enough* — you must add the latent heat `ṁ·Δh_vap` (or the reaction enthalpy). Sensible heat moves the thermometer; latent heat changes the state of matter.",
    },
    {
      id: "mb_worked_example",
      kind: "WORKED_EXAMPLE",
      title: "Real job: a mixing tank, then size its heater 🔧",
      problem:
        "A continuous mixing tank blends two streams of sugar solution at steady state. Stream 1: 100 kg/h at 10% sugar by mass. Stream 2: 60 kg/h at 40% sugar by mass. They mix into a single product stream. (a) Find the product flow rate and its sugar concentration. (b) The blended product enters at 20 °C and must be warmed to 70 °C before bottling. Taking cp ≈ 3.8 kJ/kg·K for the solution, size the heater duty Q in kW.",
      steps: [
        {
          label: "(a1) Draw the box and write the total mass balance",
          markdown:
            "System: the mixing tank. Two inputs (S1, S2), one output (product P). Steady state, no reaction → **in = out** for total mass:\n\n```\nṁ_P = ṁ_S1 + ṁ_S2 = 100 + 60 = 160 kg/h\n```\n\nThat's the product flow rate. Now we need its composition.",
        },
        {
          label: "(a2) Write the sugar (species) balance",
          markdown:
            "Sugar is conserved too (no reaction), so sugar in = sugar out:\n\n```\nsugar in  = 0.10 × 100 + 0.40 × 60 = 10 + 24 = 34 kg/h\nsugar out = x_P × 160\n```\n\nSet them equal and solve for the product sugar fraction `x_P`:\n\n```\nx_P = 34 / 160 = 0.2125 → 21.25% sugar\n```\n\nSanity check: 21.25% sits between 10% and 40%, exactly where a blend should land. Mass balance closed. ✅",
        },
        {
          label: "(b1) Convert the flow to consistent units",
          markdown:
            "For the energy balance we want `ṁ` in kg/s to land Q in kW. Convert the product flow:\n\n```\nṁ_P = 160 kg/h ÷ 3600 s/h = 0.0444 kg/s\n```\n\nThe temperature rise is `ΔT = 70 − 20 = 50 K` (a difference, so °C and K are interchangeable).",
        },
        {
          label: "(b2) Apply the sensible-heat balance",
          markdown:
            "No phase change (it just warms up), so sensible heat is all we need:\n\n```\nQ = ṁ · cp · ΔT\n  = 0.0444 × 3.8 × 50\n  = 8.44 kW\n```\n\nSo an ~8.4 kW heater takes the blended syrup from 20 °C to 70 °C. (If we'd instead computed in kg/h: 160 × 3.8 × 50 = 30,400 kJ/h, and 30,400 ÷ 3600 = 8.44 kW — same answer, good cross-check.)",
        },
      ],
      answer:
        "(a) Product = 160 kg/h at 21.25% sugar (total + species balances). (b) Heater duty Q ≈ 8.4 kW to warm it 20 °C → 70 °C (sensible heat, no phase change). Mass balance and energy balance are two separate ledgers — and you needed both.",
    },
    {
      id: "mb_check_basis",
      kind: "CHECK",
      question:
        "You're told a feed stream is 30% methanol / 70% water by mass, but no flow rate is given anywhere in the problem. What's the smartest first move?",
      choices: [
        { id: "c1", label: "Give up — the problem is unsolvable without a flow rate" },
        { id: "c2", label: "Assume a basis, e.g. 100 kg of feed, and carry the answers as ratios/fractions" },
        { id: "c3", label: "Set the flow rate to zero so the equations simplify" },
        { id: "c4", label: "Guess a flow rate and hope the final answer doesn't depend on it" },
      ],
      answerId: "c2",
      explanation:
        "Pick a basis. When only compositions (ratios) are given, *assume* a convenient total — 100 kg of feed is the classic choice — so 30% becomes 30 kg of methanol and 70 kg of water. Now every other stream comes out as a number, and any final answer that's a ratio or a fraction is independent of the basis you chose. Choosing a basis is step 3 of the recipe for exactly this reason: it turns a problem about proportions into a problem about arithmetic. It's not a hack; it's the standard professional move.",
    },
    {
      id: "mb_check_steady",
      kind: "CHECK",
      question:
        "A storage tank has liquid flowing IN at 50 kg/min and OUT at 50 kg/min, with no reaction. Over the next hour, what happens to the mass of liquid inside the tank?",
      choices: [
        { id: "s1", label: "It rises by 3000 kg — input keeps adding mass" },
        { id: "s2", label: "It stays constant — in = out means zero accumulation (steady state)" },
        { id: "s3", label: "It falls, because output always wins eventually" },
        { id: "s4", label: "It depends on the tank's volume, not the flows" },
      ],
      answerId: "s2",
      explanation:
        "Stays constant. The balance is in − out = accumulation → 50 − 50 = 0. Zero accumulation means the mass inside doesn't change with time — that's the definition of **steady state**. The level just sits there, exactly like the bathtub with tap and drain perfectly matched. (If input had exceeded output, accumulation would be positive and the tank would fill; that's a *transient*, unsteady balance.) Recognizing steady state is what lets you drop the accumulation term and use the simple in = out form.",
    },
    {
      id: "mb_callout_interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "What they're really testing 🎤",
      markdown:
        "Balances are the chemical-engineering interview's bread and butter. The prompts and the answers that signal \"hire this person\":\n\n- **\"Walk me through how you'd approach this balance.\"** Don't compute — *narrate the recipe*: \"First I draw the system boundary and label every stream, then I pick a basis, then I write a total balance plus one balance per species, count degrees of freedom, and solve.\" Process beats a fast number.\n- **\"This problem has no flow rate given.\"** Instantly say \"I'll assume a basis of 100 kg of feed.\" Hesitating here is a red flag.\n- **\"Total mass in didn't equal total mass out — is that possible?\"** Only with accumulation (unsteady) — total mass is *always* conserved, even with reaction. If your steady-state books don't balance, you made an error. Individual *species* can change with reaction, though.\n- **\"Now size the heater for this stream.\"** Reach for `Q = ṁ·cp·ΔT`, then immediately add: \"...assuming no phase change; if it boils I'd add the latent heat ṁ·Δh_vap.\" Naming the assumption unprompted is the move.\n- **\"What's the recycle ratio?\"** Recycle flow ÷ fresh feed. Show you can pick a boundary (around the mixing point) that exposes the equation.",
    },
    {
      id: "mb_callout_units",
      kind: "CALLOUT",
      variant: "warning",
      title: "The two errors that wreck balance problems",
      markdown:
        "- **Unit mismatch — the 3600× killer.** Energy duties die on per-second vs. per-hour confusion. `Q = ṁ·cp·ΔT` only gives kW when `ṁ` is in **kg/s**. Feed it kg/h and your heater is off by a factor of 3600. Convert *first*, every time, and the units will literally cancel to kJ/s = kW if you did it right. Carry units through the algebra as a built-in error detector.\n- **Forgetting the phase change (or the reaction).** `ṁ·cp·ΔT` is *sensible heat only*. The moment a stream boils, condenses, melts, or reacts, you must add latent heat (`ṁ·Δh_vap`) or reaction enthalpy — and that term is usually *much* bigger than the sensible part (boiling water needs ~50× the heat of warming it 10 °C). Likewise, never apply a no-reaction species balance to a reactor: turn the generation/consumption terms back on. Know which simplifications you've switched off.",
    },
    {
      id: "mb_callout_eob",
      kind: "CALLOUT",
      variant: "insight",
      title: "Same idea, bigger boxes",
      markdown:
        "The reason balances feel so powerful is that the box can be *any size*. Draw it around a single valve, around one reactor, around an entire 50-unit plant, or around the whole planet's carbon cycle — the equation `in − out + gen − cons = acc` never changes, only what crosses the boundary does. Economists balance money, ecologists balance nitrogen, climate scientists balance CO₂, and electrical engineers balance charge (Kirchhoff's current law is literally a mass balance on electrons at a node). You're not learning a chemistry trick; you're learning the universal grammar of \"stuff is conserved.\" Choose your boundary wisely and almost any system in the world becomes a bathtub.",
    },
    {
      id: "mb_wrap",
      kind: "PROSE",
      title: "The one path every balance problem walks",
      markdown:
        "Every balance you'll ever do — homework, interview, or a real plant at 3 a.m. — follows the identical path. Burn it in:\n\n1. **Box it.** Draw the system, fix the boundary, identify every stream in and out.\n2. **Label it.** Flow rates and compositions, known and unknown.\n3. **Anchor it.** Choose a basis if no flow rate is handed to you.\n4. **Balance it.** Total mass + one species each; turn off gen/cons if there's no reaction and acc if it's steady state; count degrees of freedom; solve.\n5. **Energize it (when asked).** Switch to the energy ledger: `Q = ṁ·cp·ΔT` for sensible heating, plus latent or reaction terms whenever the state changes.\n\nTwo conservation laws hold up the whole edifice — **mass** and **energy** — and your only real job is careful, boundary-aware bookkeeping. Master that, and a refinery is just a very large, very expensive bathtub. Now go balance something. 💧",
    },
  ],
  keyTakeaways: [
    "Every balance is one equation: in − out + generation − consumption = accumulation. No reaction kills the middle terms; steady state kills accumulation, leaving the workhorse in = out.",
    "Total mass is ALWAYS conserved (atoms only rearrange); an individual species can be created or destroyed by reaction, so only species balances carry generation/consumption terms.",
    "Follow the recipe every time: draw the boundary, label streams, choose a basis, write total + per-species balances, count degrees of freedom, solve, sanity-check.",
    "A splitter divides a stream without changing composition (the only unknown is the split fraction); a separator changes composition; recycle just needs a cleverly chosen box.",
    "Energy is its own conserved ledger (the first law). For heating/cooling with no phase change, Q = ṁ·cp·ΔT — and a fluid's specific heat matters as much as its flow rate.",
    "Watch units like a hawk: ṁ in kg/s, cp in kJ/kg·K, ΔT in K gives Q in kW. Per-hour vs. per-second mistakes cost a factor of 3600.",
    "Q = ṁ·cp·ΔT is SENSIBLE heat only. The instant a stream boils, melts, or reacts, add latent heat (ṁ·Δh_vap) or reaction enthalpy — usually a much bigger term.",
  ],
};
