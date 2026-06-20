import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_thermo",
  slug: "thermodynamics-laws-and-cycles",
  title: "Thermodynamics: Laws and Cycles",
  summary:
    "Why can't your car engine ever be 100% efficient — not because engineers are lazy, but because the universe forbids it? Why does heat always flow from hot to cold and never back? And how can a fridge make cold air by *using* energy? In one lesson you'll meet the two laws that govern every engine, power plant, and refrigerator on Earth, and you'll compute the hard ceiling on efficiency that nature will never let you beat.",
  discipline: "MECHANICAL",
  difficulty: "MEDIUM",
  estMinutes: 25,
  tags: [
    "thermodynamics",
    "carnot",
    "cycles",
    "entropy",
    "heat-engines",
    "efficiency",
    "first-law",
    "interview-favorite",
  ],
  objectives: [
    "State and apply the first law ΔU = Q − W as energy conservation, with the sign convention straight.",
    "Explain the second law and entropy: why heat flows hot → cold and why no engine can be 100% efficient.",
    "Compute the Carnot efficiency as the absolute ceiling for any heat engine between two temperatures.",
    "Recognize the major power cycles (Otto, Brayton, Rankine) and what each one drives in the real world.",
    "Use the coefficient of performance (COP) to reason about fridges and heat pumps — and why COP can exceed 1.",
    "Find the maximum work extractable from a given heat input using Carnot efficiency.",
  ],
  prerequisites: [
    "Energy and work in mechanics (joules, work = force × distance)",
    "The Kelvin temperature scale and absolute zero",
    "Comfort with ratios and percentages",
  ],
  interviewAngle:
    "Thermodynamics is where mechanical interviews separate the people who memorized formulas from the people who understand energy. The questions are deceptively simple and the follow-ups are brutal. A strong candidate nails four things: (1) writes the first law ΔU = Q − W with a clear sign convention and can say what each term means for an engine, (2) explains the second law not as a formula but as a story — entropy never decreases, heat flows hot to cold, and that's *why* you can't convert all heat to work, (3) computes Carnot efficiency η = 1 − Tc/Th in Kelvin instantly and stresses that it's an unbeatable upper bound, not a real engine's number, and (4) reasons about COP for refrigerators and heat pumps and isn't surprised that COP > 1 (you're moving heat, not creating it). Expect traps: forgetting to convert to Kelvin (a fatal error), confusing efficiency with COP, claiming a real engine hits Carnot, or thinking the second law is optional. The candidate who says 'Carnot is the ceiling set by the temperatures alone, and real cycles fall short because of irreversibilities' has shown they get it.",
  blocks: [
    {
      id: "t_intro",
      kind: "PROSE",
      title: "The two laws that boss the universe around 🔥",
      markdown:
        "Drop an ice cube in hot coffee and the coffee cools while the ice melts. You have *never once* seen the reverse — the coffee spontaneously getting hotter while the ice gets colder. Why not? Energy would be perfectly conserved either way. Nothing in Newton's laws forbids it. And yet it never, ever happens.\n\nThat one-way street is the deepest fact in all of physics, and thermodynamics is the science of it. The whole field rests on two laws that govern every engine, power plant, refrigerator, jet, and rocket ever built:\n\n- **The First Law: energy is conserved.** You can't create it or destroy it, only move it around and change its form. Heat in equals work out plus stored energy. No free lunch.\n- **The Second Law: energy has a *direction* and a *quality*.** Heat flows from hot to cold, never the other way on its own. Entropy — disorder — always increases overall. And the killer consequence: you can *never* turn 100% of heat into useful work. Not a worse lunch — a lunch where you *always* have to throw some food away.\n\nThe first law tells you the books must balance. The second law tells you that even when they balance, you still can't win — the best you can do is *not lose much*. Together they set the hard limit on every machine humanity will ever build. Let's meet them properly."
    },
    {
      id: "t_video",
      kind: "VIDEO",
      youtubeId: "NyOYW07-L5g",
      title: "Watch: The First Law of Thermodynamics",
      channel: "The Organic Chemistry Tutor",
      caption:
        "A clear, example-driven walkthrough of ΔU = Q − W and the sign conventions that trip everyone up. Watch it now — the energy bookkeeping below will feel obvious once you've seen a few problems worked."
    },
    {
      id: "t_first_law",
      kind: "PROSE",
      title: "The first law: the universe's accountant 💰",
      markdown:
        "The first law is just energy conservation dressed for thermodynamics. For a closed system, the change in its **internal energy** `ΔU` (the energy stored in the jiggling of its molecules) equals the heat you add `Q` minus the work the system does `W`:\n\n```\nΔU = Q − W\n```\n\nThink of internal energy as a bank balance. **Heat in (`Q`)** is a deposit. **Work done by the system (`W`)** is a withdrawal. Whatever's left changes the balance. That's the whole law.\n\nThe sign convention bites people, so pin it down once:\n\n- `Q > 0`: heat **added to** the system (deposit).\n- `W > 0`: work **done by** the system on its surroundings — like a gas pushing a piston out (withdrawal).\n\nSo when a gas absorbs 500 J of heat and does 200 J of work pushing a piston, its internal energy rises by `ΔU = 500 − 200 = 300 J`. The other 200 J left as useful work. Books balanced, to the joule.\n\nFor an engine running in a **cycle** — coming back to its exact starting state every loop — the internal energy returns to where it began, so `ΔU = 0` over a full cycle. That forces `Q_net = W_net`: the *net* heat absorbed equals the *net* work produced. Sounds like you could turn all your heat into work, doesn't it? The second law is about to crush that dream."
    },
    {
      id: "t_second_law",
      kind: "PROSE",
      title: "The second law: why you always have to throw heat away 🗑️",
      markdown:
        "Here's the cruel twist. A heat engine doesn't take heat from one place and turn it all into work. It *can't*. It takes heat `Q_h` from a **hot reservoir**, converts *some* of it to work `W`, and is **forced to dump the rest** `Q_c` into a **cold reservoir**. Always. By law.\n\n```\nW = Q_h − Q_c        (first law over a cycle)\nefficiency  η = W / Q_h = 1 − Q_c / Q_h\n```\n\nIf you could make `Q_c = 0`, you'd have a 100%-efficient engine. The second law says **you can't** — there's no way to run a cyclic engine that turns heat *entirely* into work with no waste. Some heat must be rejected to the cold side. That rejected heat isn't an engineering failure; it's the price of admission.\n\nWhy? **Entropy.** Entropy is a measure of how spread-out and disordered energy is, and the second law states that the **total entropy of an isolated system never decreases**. Heat flowing from hot to cold *increases* total entropy (energy spreading out), which is why it happens spontaneously. Heat flowing cold to hot would *decrease* entropy — forbidden, unless you pay for it with work (that's exactly what a fridge does). To run an engine while obeying the entropy rule, you *must* send some heat downhill to the cold reservoir to keep the entropy books legal.\n\nThe second law is what gives time its arrow, what kills perpetual-motion machines, and what sets the ceiling we're about to compute."
    },
    {
      id: "t_carnot_formula",
      kind: "FORMULA",
      title: "Carnot efficiency — the unbeatable ceiling",
      display: "η = 1 − Tc / Th",
      variables: [
        { symbol: "η", name: "Carnot (maximum possible) efficiency, as a fraction (×100 for %)", unit: "—" },
        { symbol: "Tc", name: "Absolute temperature of the cold reservoir", unit: "K" },
        { symbol: "Th", name: "Absolute temperature of the hot reservoir", unit: "K" }
      ],
      note:
        "TEMPERATURES MUST BE IN KELVIN — using °C here is the single most common and most fatal mistake in thermodynamics. This is the maximum efficiency ANY heat engine can reach between two temperatures; no real engine matches it because real processes have friction, finite-time heat transfer, and other irreversibilities. The ceiling depends ONLY on the two temperatures, not on the working fluid or the cleverness of the design."
    },
    {
      id: "t_carnot_prose",
      kind: "PROSE",
      title: "Carnot: the perfect engine that can't exist 🏆",
      markdown:
        "In 1824, a young French engineer named Sadi Carnot asked the ultimate question: what's the *best* an engine could possibly do? His answer is one of the most beautiful results in science. The maximum efficiency of *any* heat engine operating between a hot temperature `Th` and a cold temperature `Tc` is:\n\n```\nη_Carnot = 1 − Tc / Th        (Kelvin!)\n```\n\nThree things make this profound:\n\n- **It depends only on the two temperatures.** Not the fuel, not the working fluid, not the engineering. Steam, gas, magic — doesn't matter. The temperatures alone set the ceiling.\n- **It's a ceiling no one can beat.** A Carnot engine is a perfectly *reversible* idealization. Every real engine has friction, turbulence, and finite-speed heat transfer (all entropy-generating), so every real engine falls **short** of Carnot. If someone claims to beat it, they're wrong or lying.\n- **Hotter source and colder sink win.** To raise the ceiling, crank `Th` up or push `Tc` down. This is *exactly* why power plants run combustion as hot as the materials allow and why they reject heat to cold rivers or cooling towers.\n\nThe bad news the formula delivers: even a *perfect* engine between 600 K and 300 K maxes out at 50%. A real one does worse. That \"wasted\" half isn't bad engineering — it's the law. Carnot didn't tell us how to build a better engine; he told us how good is even *possible*."
    },
    {
      id: "t_sandbox",
      kind: "SANDBOX",
      title: "Play with it: the Carnot ceiling machine 🎛️",
      description:
        "Drag the two reservoir temperatures and watch the maximum possible efficiency respond. Remember: this is the absolute best ANY engine could do between these temperatures — real engines come in lower. With the defaults (Tc = 300 K ≈ room temperature, Th = 600 K) you get 50% — a perfect engine throwing away half its heat. Now try it: push Th way up toward 1500 K (like a gas turbine's combustion) and watch efficiency climb. Or drop Tc — but notice you can't get to Tc = 0 K (absolute zero is unreachable), so 100% efficiency stays forever out of reach.",
      variables: [
        { key: "Tc", label: "Cold reservoir Tc", unit: "K", min: 200, max: 500, step: 5, default: 300 },
        { key: "Th", label: "Hot reservoir Th", unit: "K", min: 350, max: 1500, step: 10, default: 600 }
      ],
      expression: "(1 - Tc / Th) * 100",
      outputLabel: "Carnot efficiency",
      outputUnit: "%",
      precision: 1
    },
    {
      id: "t_predict_double",
      kind: "PREDICT",
      question:
        "In the sandbox you've got Tc = 300 K and Th = 600 K, giving 50% efficiency. To do better, you DOUBLE the hot temperature to Th = 1200 K (keeping Tc = 300 K). What's the new Carnot efficiency?",
      options: [
        { id: "a", label: "100% — you doubled the hot side, so you doubled the efficiency" },
        { id: "b", label: "75% — it climbs but with diminishing returns" },
        { id: "c", label: "50% — efficiency only depends on the ratio, so nothing changes" },
        { id: "d", label: "25% — hotter is actually worse" }
      ],
      answerId: "b",
      reveal:
        "75%, not 100%. Efficiency climbs — but with **diminishing returns**.\n\n```\nη = 1 − Tc/Th = 1 − 300/1200 = 1 − 0.25 = 0.75 = 75%\n```\n\nDoubling `Th` did *not* double efficiency, because efficiency isn't proportional to `Th` — it depends on the *ratio* `Tc/Th`. Going from 600 K to 1200 K shrank that ratio from 0.5 to 0.25, lifting η from 50% to 75%. To get to 100% you'd need `Tc/Th = 0`, meaning `Tc = 0 K` (absolute zero) or `Th = ∞`. Both impossible.\n\nThis is why the chase for efficiency is a grind: each extra percent costs hotter, harder-to-survive conditions, and the law guarantees you'll *never* arrive at 100%. The ceiling rises but never touches the roof."
    },
    {
      id: "t_cycles",
      kind: "PROSE",
      title: "The cycles that actually power your world ⚙️",
      markdown:
        "Carnot is the dream. Real machines use practical cycles that trade some efficiency for being buildable. You should recognize the big three at a glance:\n\n- **Otto cycle — your gasoline car.** Intake, compress, ignite (spark plug), expand (the power stroke), exhaust. Its efficiency rises with the *compression ratio* — squeeze the mixture harder before ignition and you get more work out. That's why high-compression engines are more efficient (and why they need higher-octane fuel to avoid knocking).\n\n- **Brayton cycle — jet engines and gas turbines.** Continuously compress air, burn fuel in it, then expand the hot gas through a turbine. This is what flies airplanes and spins many power-plant generators. It loves high pressure ratios and very high turbine-inlet temperatures (hence exotic alloys and blade cooling).\n\n- **Rankine cycle — steam power plants.** Boil water into high-pressure steam, expand it through a turbine, condense it back to water, pump it up, repeat. This is how most of the world's electricity is *still* made — coal, nuclear, and many solar-thermal and geothermal plants all run Rankine. The condenser is where the second law's mandatory heat rejection happens, and it's why power plants sit next to big water bodies or cooling towers.\n\nEvery one of these obeys the same masters: the first law balances their energy, and the Carnot ceiling caps their efficiency. They differ in *how* they shuttle heat and work, but none escapes `η < η_Carnot`. Real combined-cycle plants — Brayton stacked on top of Rankine to reuse the turbine's hot exhaust — push past 60%, which is remarkable engineering precisely because the ceiling is so unforgiving."
    },
    {
      id: "t_cop",
      kind: "PROSE",
      title: "Run it backwards: fridges and heat pumps 🧊",
      markdown:
        "An engine takes heat and makes work. Run the whole thing **backwards** — spend work to *move* heat from cold to hot — and you've built a **refrigerator** or a **heat pump**. Same components, opposite direction. The work you pay forces heat to flow uphill (cold → hot), which the second law otherwise forbids for free.\n\nWe don't rate these by \"efficiency.\" We rate them by **coefficient of performance (COP)** — what you get divided by what you pay:\n\n- **Refrigerator / AC:** you want to *remove* heat from the cold space. `COP = Q_c / W`.\n- **Heat pump:** you want to *deliver* heat to the warm space. `COP = Q_h / W`.\n\nHere's the delightful part: **COP is usually greater than 1** — often 3 or 4. That is *not* a violation of anything. You're not creating energy; you're *moving* it. Pay 1 joule of electricity and you can shove 3 or 4 joules of heat from inside your fridge to your kitchen. It's a heat *mover*, not a heat *maker*.\n\nThis is the secret behind heat pumps for home heating: a resistive electric heater turns 1 J of electricity into 1 J of heat (COP = 1), but a heat pump turns 1 J of electricity into 3–4 J of heat *delivered* by scavenging the rest from the cold outdoor air. The Carnot ideal caps these too: `COP_fridge,max = Tc/(Th − Tc)` and `COP_heatpump,max = Th/(Th − Tc)`. Notice the heat pump's COP is always exactly 1 more than the fridge's — because the heat it delivers includes both the heat it pulled in *and* the work you paid."
    },
    {
      id: "t_predict_cop",
      kind: "PREDICT",
      question:
        "Your friend insists: \"A refrigerator with a COP of 4 is impossible — that means it outputs 4× more energy than it uses, which breaks conservation of energy!\" Are they right?",
      options: [
        { id: "a", label: "Yes — COP can never exceed 1, that would be a perpetual-motion machine" },
        { id: "b", label: "No — COP measures heat MOVED per work spent, and moving heat isn't creating energy" },
        { id: "c", label: "Yes, but only refrigerators cheat; heat pumps obey the rules" }
      ],
      answerId: "b",
      reveal:
        "Your friend is **wrong** — and it's a beautiful misunderstanding to clear up.\n\nCOP isn't an efficiency and it doesn't create energy. It's the ratio of heat *moved* to work *spent*. A COP of 4 means: pay 1 J of work, and the fridge **pumps** 4 J of heat out of the cold space. The energy isn't conjured from nothing — it was already there as heat inside the fridge; the work just *relocates* it (uphill, against the natural flow).\n\nCheck the first law: into the hot side goes `Q_h = Q_c + W = 4 + 1 = 5 J`. Energy is perfectly conserved — 4 J of moved heat plus 1 J of work = 5 J dumped to the kitchen. Nothing broken.\n\nThe lesson: don't compare COP to efficiency. An engine's efficiency is capped at 1 (you can't get more work out than heat in). But a heat *mover's* COP is routinely 3–5, because moving energy is fundamentally cheaper than converting it. This is exactly why heat pumps are eating resistive heaters alive."
    },
    {
      id: "t_check_kelvin",
      kind: "CHECK",
      question:
        "A heat engine runs between a hot reservoir at 327 °C and a cold reservoir at 27 °C. What is its maximum possible (Carnot) efficiency?",
      choices: [
        { id: "k1", label: "About 92% — using 327 and 27 directly: 1 − 27/327" },
        { id: "k2", label: "50% — converting to Kelvin: 1 − 300/600" },
        { id: "k3", label: "Exactly 27% — the temperature difference over the hot temperature" },
        { id: "k4", label: "0% — the reservoirs are too close to do useful work" }
      ],
      answerId: "k2",
      explanation:
        "Convert to Kelvin FIRST (this is the whole point of the question). Th = 327 + 273 = 600 K; Tc = 27 + 273 = 300 K. Then η = 1 − Tc/Th = 1 − 300/600 = 0.5 = 50%. Using Celsius directly gives the badly wrong 92% — the classic, fatal thermodynamics mistake. The Carnot formula is only valid on an absolute (Kelvin) scale because efficiency must be zero when there's no temperature difference and the ratio must behave physically near absolute zero. Always Kelvin."
    },
    {
      id: "t_check_secondlaw",
      kind: "CHECK",
      question:
        "An inventor claims their new engine takes in 1000 J of heat from a hot source and produces 1000 J of work, rejecting no heat at all. Which law does this violate?",
      choices: [
        { id: "l1", label: "The first law — energy isn't conserved" },
        { id: "l2", label: "The second law — no cyclic engine can convert heat entirely to work with zero rejection" },
        { id: "l3", label: "Neither — it's a perfectly valid Carnot engine" },
        { id: "l4", label: "Both laws equally" }
      ],
      answerId: "l2",
      explanation:
        "The first law is fine — 1000 J in, 1000 J out, energy balances perfectly. It's the SECOND law that's violated. A cyclic heat engine must reject some heat (Q_c > 0) to a cold reservoir to keep total entropy from decreasing; converting heat *entirely* into work with no waste is impossible. This hypothetical 100%-efficient engine is exactly the kind of perpetual-motion-of-the-second-kind machine the second law outlaws. Energy conservation alone (the first law) would happily allow it — which is precisely why we need the second law.",
    },
    {
      id: "t_worked_example",
      kind: "WORKED_EXAMPLE",
      title: "Real job: how much power can this plant make? ⚡",
      problem:
        "A power plant burns fuel to maintain a hot reservoir at Th = 800 K and rejects heat to a cooling tower at Tc = 320 K. It absorbs Q_h = 500 MW of heat from combustion. (a) Find the Carnot (maximum) efficiency. (b) Find the maximum possible work output (power). (c) Find the minimum heat that must be rejected. (d) The real plant only achieves 35% efficiency — how much actual power does it produce, and what fraction of the Carnot ceiling is that?",
      steps: [
        {
          label: "(a) Carnot efficiency",
          markdown:
            "Both temperatures are already in Kelvin — good. Apply the ceiling formula:\n\n```\nη_Carnot = 1 − Tc/Th = 1 − 320/800\n         = 1 − 0.40\n         = 0.60 = 60%\n```\n\nSo no engine on Earth, however clever, could beat 60% between these two temperatures."
        },
        {
          label: "(b) Maximum work output",
          markdown:
            "Maximum work is the Carnot efficiency times the heat in:\n\n```\nW_max = η_Carnot · Q_h = 0.60 × 500 MW\n      = 300 MW\n```\n\nThat's the theoretical best — 300 MW of electrical power from 500 MW of heat, with a perfect (impossible) engine."
        },
        {
          label: "(c) Minimum heat rejected",
          markdown:
            "By the first law over a cycle, whatever heat doesn't become work must be dumped to the cold side:\n\n```\nQ_c,min = Q_h − W_max = 500 − 300 = 200 MW\n```\n\nEven the perfect engine throws away 200 MW into the cooling tower. That's the second law's mandatory tax — not a flaw, a law. (This is the heat that warms the river or steams off the cooling tower.)"
        },
        {
          label: "(d) The real plant",
          markdown:
            "The real efficiency is 35%, not 60%:\n\n```\nW_real = 0.35 × 500 MW = 175 MW\n```\n\nFraction of the Carnot ceiling reached:\n\n```\n175 / 300 = 0.583 ≈ 58% of the maximum possible\n```\n\nThe real plant gets a bit over half of what a perfect engine could do — typical for a real thermal plant. The gap from 60% (ideal) to 35% (real) is eaten by friction, finite-time heat transfer, turbine losses, and other irreversibilities. Carnot tells you the prize; engineering tells you how close you got."
        }
      ],
      answer:
        "(a) η_Carnot = 60%. (b) W_max = 300 MW. (c) Q_c,min = 200 MW must be rejected. (d) The real plant makes 175 MW, about 58% of the Carnot ceiling. The temperatures alone cap the plant at 60%; real-world irreversibilities pull the achievable number down to 35%.",
    },
    {
      id: "t_callout_warning",
      kind: "CALLOUT",
      variant: "warning",
      title: "Three traps that sink thermo problems",
      markdown:
        "- **Forgetting Kelvin.** The Carnot formula `1 − Tc/Th` is *only* valid in absolute temperature. Plug in °C and you get nonsense (and usually a wildly optimistic efficiency). Convert first, every single time: K = °C + 273.15.\n- **Confusing efficiency with COP.** An engine's efficiency is capped at 1 (you can't get more work than the heat you put in). A fridge or heat pump's COP is routinely 3–5, because it *moves* heat rather than converting it. Comparing them as if they're the same number is a classic blunder.\n- **Thinking a real engine hits Carnot.** Carnot is a reversible idealization — a ceiling, never a target you reach. Any real cycle has irreversibilities (friction, turbulence, finite-speed heat transfer) and falls short. If a calculation says a real engine matches or beats Carnot, you've made an error."
    },
    {
      id: "t_callout_interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "What they're really testing 🎤",
      markdown:
        "Thermo interviews reward clear *physical* reasoning, not just formulas. The answers that signal a strong hire:\n\n- **\"State the first law and explain the signs.\"** `ΔU = Q − W`: heat added is positive, work done *by* the system is positive. For a cycle, `ΔU = 0`, so net work equals net heat. Say it crisply.\n- **\"Why can't an engine be 100% efficient?\"** The second law: a cyclic engine *must* reject heat to a cold reservoir to keep total entropy from decreasing. Zero rejection would violate the entropy rule. (Note: the *first* law would allow 100% — the second law is what forbids it.)\n- **\"Compute the max efficiency between 800 K and 300 K.\"** `1 − 300/800 = 62.5%`, *in Kelvin*, and add \"that's the unbeatable Carnot ceiling; a real engine does less.\"\n- **\"How can a heat pump have COP > 1?\"** Because it moves heat, it doesn't make it — 1 J of work can relocate 3–4 J of heat. COP isn't an efficiency and isn't bounded by 1. Conservation still holds: `Q_h = Q_c + W`.\n- **\"How do you raise an engine's efficiency ceiling?\"** Raise `Th` or lower `Tc` — widen the temperature gap. That's why plants run as hot as materials allow and reject to the coldest available sink. Naming the diminishing returns (η depends on the *ratio* Tc/Th) is a senior-level tell."
    },
    {
      id: "t_wrap",
      kind: "PROSE",
      title: "The two laws, in one breath",
      markdown:
        "Every thermodynamics problem you'll ever face is governed by the same two masters:\n\n1. **First law — energy is conserved.** `ΔU = Q − W`. Over a cycle, `ΔU = 0`, so net work equals net heat. The books always balance.\n2. **Second law — energy has direction and quality.** Entropy never decreases overall; heat flows hot → cold; and no cyclic engine can turn all its heat into work. You *must* reject some.\n\nFrom those two laws falls everything else: the **Carnot ceiling** `η = 1 − Tc/Th` (in Kelvin, always) that caps every engine; the real **cycles** — Otto, Brayton, Rankine — that power your car, your flights, and your grid; and the **COP** that lets a heat pump move 4 joules of heat for every joule you pay.\n\nThe first law says you can't win — you can't get more out than you put in. The second law says you can't even break even — you must always throw some heat away. And you can't quit the game, because absolute zero is unreachable. Cheerful? No. But it's the rulebook for every machine ever built, and now you can read it. Go run an engine. 🔥"
    }
  ],
  keyTakeaways: [
    "First law (energy conservation): ΔU = Q − W. Heat added is positive, work done by the system is positive; over a full cycle ΔU = 0 so net work = net heat.",
    "Second law: total entropy never decreases, heat flows hot → cold spontaneously, and no cyclic engine can convert heat entirely to work — some must always be rejected to a cold reservoir.",
    "Carnot efficiency η = 1 − Tc/Th (Kelvin!) is the absolute maximum for any engine between two temperatures; it depends only on the temperatures, and real engines always fall short.",
    "Always convert to Kelvin before using Carnot — using °C is the single most common fatal error in thermodynamics.",
    "The big real cycles are Otto (gasoline cars), Brayton (jets and gas turbines), and Rankine (steam power plants) — all capped by the Carnot ceiling.",
    "Run an engine backwards and you get a fridge or heat pump, rated by COP = heat moved / work spent; COP routinely exceeds 1 because it moves heat rather than creating it.",
    "To raise the efficiency ceiling, widen the temperature gap (higher Th, lower Tc) — but returns diminish and 100% is forever out of reach because absolute zero is unattainable.",
  ]
};
