import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_heat",
  slug: "heat-transfer-modes",
  title: "Heat Transfer: Conduction, Convection & Radiation",
  summary:
    "Why does a metal spoon scald your fingers while a wooden one stays cool, why does blowing on soup actually work, and why can the Sun roast you across 150 million km of empty vacuum? Three mechanisms — and only three — move every joule of heat in the universe. In one lesson you'll learn to spot which one rules a given problem, wield Q = k·A·ΔT/L, and stack thermal resistances like a circuit.",
  discipline: "MECHANICAL",
  difficulty: "MEDIUM",
  estMinutes: 24,
  tags: [
    "heat-transfer",
    "conduction",
    "convection",
    "radiation",
    "Fourier's law",
    "thermal resistance",
    "Stefan-Boltzmann",
    "interview-favorite",
  ],
  objectives: [
    "Instantly identify whether conduction, convection, or radiation dominates a given situation — and explain why in one sentence.",
    "Wield Fourier's law Q = k·A·ΔT/L to compute steady heat flow through a wall, and feel what each variable does.",
    "Write convection as Q = h·A·ΔT and radiation as Q = ε·σ·A·T⁴, and know the physical meaning of every symbol.",
    "Model heat paths as thermal resistances (R = L/kA) and add them in series exactly like electrical resistors.",
    "Explain why doubling temperature quadruples conduction but multiplies radiation by sixteen — the deadly T⁴ law.",
    "Solve a real composite problem: heat conducting through a wall and then convecting off its surface.",
  ],
  prerequisites: [
    "Basic algebra and unit handling (SI units)",
    "The idea of temperature as a measure of thermal energy",
    "Comfort reading a simple equation and plugging in numbers",
  ],
  interviewAngle:
    "Heat transfer is a goldmine for thermal, mechanical, and design interviews because it instantly separates people who memorized three formulas from people who can reason about energy flow. The strong candidate does four things fast: (1) names all three modes and says where each dominates — conduction through solids, convection at fluid-solid boundaries, radiation across gaps and vacuum; (2) writes the governing law for each cold (Q = kAΔT/L, Q = hAΔT, Q = εσAT⁴) and can state units; (3) reaches for the thermal-resistance analogy, R = L/kA in series, and treats a multi-layer wall like a string of resistors — because that's how real envelopes, heat sinks, and insulation are actually sized; and (4) respects the T⁴ in radiation, noting it's negligible at room temperature but utterly dominant in furnaces, filaments, and spacecraft. Expect a curveball: 'why does a tile floor feel colder than a rug at the same temperature?' (answer: conductivity, not temperature) or 'how does a thermos work?' (it kills all three modes at once). If you can talk resistances and the T⁴ law, you sound like an engineer; if you just recite formulas, you don't.",
  blocks: [
    {
      id: "h_intro",
      kind: "PROSE",
      title: "Three ways, only three 🔥",
      markdown:
        "Grab a metal spoon and a wooden spoon, stick both in a pot of soup, and wait. In a minute the metal one is too hot to hold and the wood is perfectly comfortable. Same soup, same temperature, wildly different result. Why?\n\nNow blow across a spoonful of that soup to cool it. It works — but *why* does moving air over the surface chill it faster than just waiting?\n\nAnd here's the strangest one: step outside on a clear day and feel the Sun on your face. That warmth crossed **150 million kilometres of vacuum** to reach you. No spoon, no air, nothing to carry it. How?\n\nThese three everyday mysteries are the *entire* subject. Heat — thermal energy in transit — moves by exactly three mechanisms, and there are no others:\n\n- **Conduction**: heat marching through a material by direct contact, jiggling neighbor to neighbor. (The spoon.)\n- **Convection**: heat carried away by a moving fluid — liquid or gas. (Blowing on the soup.)\n- **Radiation**: heat beamed as electromagnetic waves, needing *nothing* to travel through. (The Sun.)\n\nMaster engineers don't ask \"is this hot?\" They ask \"*which mode* is moving the heat here, and how do I speed it up or shut it down?\" A CPU heat sink, a house wall, a coffee thermos, a spacecraft radiator — every one is a deliberate game played with these three. Let's learn the rules."
    },
    {
      id: "h_video",
      kind: "VIDEO",
      youtubeId: "Me60Ti0E_rY",
      title: "Watch: Conduction, Convection & Radiation",
      channel: "GalcoTV / Heat Transfer",
      caption:
        "A crisp tour of all three modes with real, tangible examples. Watch it now — once you've *seen* the three mechanisms side by side, every formula below turns from symbols into physical pictures."
    },
    {
      id: "h_conduction_intuition",
      kind: "PROSE",
      title: "Conduction: the relay race through a solid",
      markdown:
        "Conduction is heat passed hand-to-hand. Heat a bar at one end and its atoms there start vibrating harder. They bump their neighbors, who bump *their* neighbors, and the agitation ripples down the bar. In metals there's a turbo boost: free electrons zip around carrying energy fast — which is exactly why metals are both great electrical *and* thermal conductors. (That spoon? The electrons did it.)\n\nFour things set how fast conduction happens, and they're all baked into one beautiful equation, **Fourier's law**:\n\n- **Conductivity `k`** — how good the material itself is at passing heat. Copper (`k ≈ 400 W/m·K`) is a superhighway; air (`k ≈ 0.025`) and foam are near-dead ends. This single number is why your tile floor feels freezing and your rug feels cozy *at the very same temperature* — tile yanks heat out of your foot fast, the rug barely sips it.\n- **Area `A`** — more cross-section, more parallel lanes for heat. Double it, double the flow.\n- **Temperature difference `ΔT`** — the *driving force*. No difference, no flow. Bigger gap, harder push.\n- **Thickness `L`** — the distance heat must trudge. Thicker wall, slower flow. This is the whole point of insulation: pile on `L` (and pick a tiny `k`) to choke the heat.\n\nPut them together and you get the rate of heat flow `Q` in watts. Notice it's a *rate* — joules per second — not a quantity of energy. Conduction never sleeps as long as there's a `ΔT`."
    },
    {
      id: "h_fourier_formula",
      kind: "FORMULA",
      title: "Fourier's law (1-D steady conduction)",
      display: "Q = k·A·ΔT / L",
      variables: [
        { symbol: "Q", name: "Rate of heat flow (heat current)", unit: "W" },
        { symbol: "k", name: "Thermal conductivity of the material", unit: "W/m·K" },
        { symbol: "A", name: "Cross-sectional area perpendicular to heat flow", unit: "m²" },
        { symbol: "ΔT", name: "Temperature difference across the thickness", unit: "K" },
        { symbol: "L", name: "Thickness / length of the conduction path", unit: "m" }
      ],
      note:
        "Heat flows DOWN the temperature gradient (hot → cold), which is why the full vector form carries a minus sign. For magnitudes, just use ΔT = T_hot − T_cold. Note the elegant parallel to Ohm's law: Q plays the role of current, ΔT the voltage, and L/(kA) the resistance. Hold that thought — it's about to become a superpower."
    },
    {
      id: "h_sandbox",
      kind: "SANDBOX",
      title: "Play with it: the conduction machine 🎛️",
      description:
        "Stop reading, start dragging. Push the conductivity k (try copper at ~400 vs. steel at ~50), widen the area A, crank the temperature difference ΔT, or fatten the wall thickness L — and watch the heat rate Q react live. The defaults (k = 200 W/m·K, A = 0.01 m², ΔT = 50 K, L = 0.1 m) land exactly on 1000 W. Notice how k, A, and ΔT all scale Q proportionally, while L fights it in the denominator: that's insulation at work.",
      variables: [
        { key: "k", label: "Conductivity k", unit: "W/m·K", min: 1, max: 400, step: 1, default: 200 },
        { key: "A", label: "Area A", unit: "m²", min: 0.001, max: 1, step: 0.001, default: 0.01 },
        { key: "dT", label: "ΔT", unit: "K", min: 1, max: 200, step: 1, default: 50 },
        { key: "L", label: "Thickness L", unit: "m", min: 0.01, max: 1, step: 0.01, default: 0.1 }
      ],
      expression: "k * A * dT / L",
      outputLabel: "Heat rate Q",
      outputUnit: "W",
      precision: 0
    },
    {
      id: "h_predict_conductivity",
      kind: "PREDICT",
      question:
        "In the sandbox you just played with: keep A, ΔT, and L fixed, but swap the material from steel (k ≈ 50) to copper (k ≈ 400). What happens to the heat rate Q?",
      options: [
        { id: "a", label: "It barely changes — material doesn't matter much" },
        { id: "b", label: "It roughly doubles" },
        { id: "c", label: "It jumps about 8× — copper conducts ~8× better than steel" },
        { id: "d", label: "It drops, because copper is denser" }
      ],
      answerId: "c",
      reveal:
        "About **8× more heat**. `Q` is directly proportional to `k`, and copper's `k ≈ 400` is roughly eight times steel's `≈ 50`. Drag the slider and watch Q rocket.\n\nThis is why heat sinks and pots are copper or aluminum, never stainless steel — and why high-end cookware sandwiches a copper or aluminum core inside a steel shell to get the best of both. It's also the secret behind the spoon trick from the intro: the metal spoon's huge `k` floods heat into your hand, while wood's tiny `k` (~0.15) barely lets any through. Same soup, same ΔT, totally different `k`."
    },
    {
      id: "h_convection_intuition",
      kind: "PROSE",
      title: "Convection: heat that rides the current",
      markdown:
        "Conduction needs the material to sit still and pass heat atom to atom. **Convection** cheats: it physically *carries hot stuff away* by moving a fluid. Warm fluid touches a hot surface, soaks up energy, drifts off, and fresh cool fluid moves in to take its place. Heat doesn't seep — it gets *transported*.\n\nTwo flavors:\n\n- **Natural (free) convection**: the fluid moves on its own. Hot air near a radiator expands, gets lighter, rises — and cool air sinks to replace it. That self-driven loop is why heat rises and why a room's ceiling is always warmer than its floor.\n- **Forced convection**: you *make* the fluid move — a fan, a pump, a gust of wind, you blowing on your soup. Force more fluid past the surface and you haul heat away far faster.\n\nThe whole mess hides inside one number, the **convective heat-transfer coefficient `h`** (units W/m²·K), giving the disarmingly simple **Newton's law of cooling**:\n\n```\nQ = h·A·ΔT\n```\n\nHere `ΔT` is between the surface and the bulk fluid, and `A` is the wetted surface area. Don't be fooled by how clean it looks: `h` is the messy one. It hides fluid speed, viscosity, geometry, and whether flow is smooth or turbulent. Rough ballpark values: still air `h ≈ 5–25`, a stiff breeze on a wall `≈ 10–100`, water `≈ 100–1000`, and violently boiling water `≈ 10000+`. That enormous range is *exactly* why blowing on soup works (you crank `h` by speeding the air) and why a fan cools you even though it just pushes around room-temperature air — it's quietly multiplying `h`."
    },
    {
      id: "h_radiation_intuition",
      kind: "PROSE",
      title: "Radiation: heat that needs nothing at all",
      markdown:
        "Here's the spooky one. **Every** object above absolute zero glows — not always in visible light, but always in *electromagnetic radiation*. That glow carries energy away, and because it's just EM waves, it sails straight through a vacuum. No molecules required. That's how the Sun's heat crosses empty space to reach you, and how a campfire warms your face from across the clearing even when the air between is cold.\n\nThe rate is set by the magnificent **Stefan–Boltzmann law**:\n\n```\nQ = ε·σ·A·T⁴\n```\n\nwhere `σ = 5.67×10⁻⁸ W/m²·K⁴` is the Stefan–Boltzmann constant, `ε` (emissivity, 0 to 1) is how good a radiator the surface is (a perfect black body is 1; shiny polished metal can be 0.05), `A` is the surface area, and `T` is the **absolute** temperature in **kelvin** — never Celsius, or the answer is nonsense.\n\nNow stare at that exponent: **T⁴**. This is the single most important fact about radiation. Heat output doesn't just rise with temperature — it *explodes*. Double the absolute temperature and radiation jumps by 2⁴ = **sixteen times**. This is why:\n\n- At room temperature radiation is a quiet trickle, easily ignored next to conduction and convection.\n- In a furnace, a glowing filament, or rocket exhaust it utterly *dominates* — nothing else comes close.\n- A spacecraft, surrounded by vacuum with no air to convect into, can dump heat *only* by radiating it. Those panels are its sole way to stay cool.\n\n(For an object radiating into surroundings at temperature `T_surr`, the *net* exchange is `Q = ε·σ·A·(T⁴ − T_surr⁴)` — it both emits and absorbs. But the T⁴ punch is the headline.)"
    },
    {
      id: "h_predict_radiation",
      kind: "PREDICT",
      question:
        "An electric heater filament glows at 600 K. You crank it hotter until it reaches 1200 K — exactly double the absolute temperature. Roughly how much more heat does it radiate?",
      options: [
        { id: "a", label: "About 2× — heat scales with temperature" },
        { id: "b", label: "About 4× — like the area term" },
        { id: "c", label: "About 16× — radiation goes as T⁴" },
        { id: "d", label: "No change — emissivity caps it" }
      ],
      answerId: "c",
      reveal:
        "**Sixteen times** the radiated power. `Q ∝ T⁴`, so doubling the absolute temperature gives 2⁴ = 16. (Run it: `(1200/600)⁴ = 2⁴ = 16`.)\n\nThis brutal nonlinearity is why radiation is a non-event at room temperature but the *only thing that matters* inside a furnace or at a filament's surface. It's also why glowing-hot objects shed heat ferociously — and why an incandescent bulb is mostly a heater that happens to leak a little visible light. The T⁴ law is the one fact about radiation an interviewer will check. Burn it in: **double T, sixteen-fold the heat.**"
    },
    {
      id: "h_resistance",
      kind: "PROSE",
      title: "The superpower: thermal resistance in series ⚡",
      markdown:
        "Here's the trick that turns messy multi-layer problems into bookkeeping. Look at Fourier's law again:\n\n```\nQ = ΔT / (L / kA)\n```\n\nThat's *Ohm's law in disguise.* Heat current `Q` is like electrical current, the temperature difference `ΔT` is like voltage, and the lump `L/(kA)` is a **thermal resistance** `R`. Big `R` means heat struggles to get through:\n\n```\nR_conduction = L / (k·A)\n```\n\nConvection gets a resistance too — rearrange `Q = hAΔT` into `Q = ΔT / (1/hA)`:\n\n```\nR_convection = 1 / (h·A)\n```\n\nAnd here's the payoff: when heat must pass through one barrier *then* another *then* another — say it conducts through a wall and then convects off the far face — those resistances add up **in series**, exactly like resistors in a circuit:\n\n```\nR_total = R₁ + R₂ + R₃ + ...\n         Q = ΔT_overall / R_total\n```\n\nThis is how every real thermal system gets sized. A house wall is drywall + insulation + sheathing + siding + the air films on both faces — a stack of resistances in series, and the biggest one (the insulation) controls the whole flow, just like the biggest resistor dominates a series circuit. A CPU cooler is the chip + thermal paste + the metal sink + convection to the air. Add the R's, divide ΔT by the sum, out comes Q. No calculus, no drama — just resistors. (And in *parallel*, like heat leaking through a window *and* the wall around it, you add conductances `1/R` instead, same as parallel resistors.)"
    },
    {
      id: "h_callout_resistance",
      kind: "CALLOUT",
      variant: "tip",
      title: "The series-resistor shortcut",
      markdown:
        "Whenever heat flows through several barriers in a row, don't solve each step separately — convert each to a resistance (`L/kA` for conduction, `1/hA` for convection), **add them up**, and use `Q = ΔT_total / R_total`. Same current `Q` flows through every layer (steady state), and the biggest resistance is your bottleneck — so that's exactly where to spend your insulation budget. This one analogy collapses walls, heat sinks, and double-pane windows into a circuit you can solve in your head."
    },
    {
      id: "h_check_dominant",
      kind: "CHECK",
      question:
        "Which scenario is dominated by RADIATION (as opposed to conduction or convection)?",
      choices: [
        { id: "c1", label: "Heat travelling along a metal rod from a hot end to a cold end" },
        { id: "c2", label: "A fan cooling a hot CPU by blowing air across its heat sink" },
        { id: "c3", label: "The Sun warming Earth across the vacuum of space" },
        { id: "c4", label: "Your hand warming up while gripping a hot coffee mug" }
      ],
      answerId: "c3",
      explanation:
        "Radiation is the only mode that needs no medium — it crosses vacuum as electromagnetic waves, which is the *only* way the Sun's heat can reach Earth. The metal rod (c1) is pure conduction; the fan-cooled heat sink (c2) is forced convection; the hot mug in your hand (c4) is conduction through direct contact. Rule of thumb: vacuum or a wide gap with a big ΔT → suspect radiation; a moving fluid → convection; solid contact → conduction."
    },
    {
      id: "h_check_resistance",
      kind: "CHECK",
      question:
        "Two flat layers conduct heat in series: layer 1 has thermal resistance R₁ = 0.2 K/W and layer 2 has R₂ = 0.8 K/W. The overall temperature difference across both is 50 K. What is the steady heat flow Q?",
      choices: [
        { id: "r1", label: "250 W — divide ΔT by the smaller resistance" },
        { id: "r2", label: "50 W — using ΔT / (R₁ + R₂)" },
        { id: "r3", label: "62.5 W — using ΔT / (R₁ + R₂)" },
        { id: "r4", label: "100 W — average the two resistances" }
      ],
      answerId: "r2",
      explanation:
        "In series, resistances add: R_total = 0.2 + 0.8 = 1.0 K/W. Then Q = ΔT / R_total = 50 / 1.0 = 50 W. The same heat current Q flows through both layers in steady state — and notice layer 2 (R = 0.8, four times bigger) carries four-fifths of the temperature drop. The largest resistance soaks up the most ΔT and throttles the whole flow, exactly like the biggest resistor in a series circuit."
    },
    {
      id: "h_worked_example",
      kind: "WORKED_EXAMPLE",
      title: "Real job: heat loss through an exterior wall 🏠",
      problem:
        "On a winter night the inside surface of a brick wall sits at T_in = 20 °C. The wall is brick, thickness L = 0.20 m, conductivity k = 0.7 W/m·K, area A = 10 m². On the outside, a wind blows past the outer face with convection coefficient h = 25 W/m²·K, and the outdoor air is at T_out = 0 °C. Heat conducts through the brick, then convects off the outer surface into the wind. (a) Find the conduction and convection resistances. (b) Find the steady heat-loss rate Q. (c) Find the temperature of the outer brick surface.",
      steps: [
        {
          label: "(a) Two resistances in series",
          markdown:
            "**Conduction through the brick:**\n\n```\nR_cond = L / (k·A) = 0.20 / (0.7 × 10) = 0.20 / 7 = 0.0286 K/W\n```\n\n**Convection off the outer face into the wind:**\n\n```\nR_conv = 1 / (h·A) = 1 / (25 × 10) = 1 / 250 = 0.0040 K/W\n```\n\nThe brick is the bigger resistance here — it's the bottleneck."
        },
        {
          label: "(b) Total resistance and heat flow",
          markdown:
            "Add them in series:\n\n```\nR_total = R_cond + R_conv = 0.0286 + 0.0040 = 0.0326 K/W\n```\n\nThe overall driving ΔT is from the inside surface (20 °C) to the outdoor air (0 °C), so ΔT = 20 K. (A 20 °C difference equals a 20 K difference — degree sizes are identical.)\n\n```\nQ = ΔT_total / R_total = 20 / 0.0326 ≈ 614 W\n```\n\nThat's about 614 joules leaking out every second through this one wall."
        },
        {
          label: "(c) Temperature of the outer brick surface",
          markdown:
            "The same Q flows through every element (steady state). To get the outer-surface temperature `T_s`, walk the drop across just the convection step at the outer face — that's the gap between the surface and the outdoor air:\n\n```\nQ = (T_s − T_out) / R_conv\n614 = (T_s − 0) / 0.0040\nT_s = 614 × 0.0040 ≈ 2.5 °C\n```\n\nSo the brick's outer face sits at about 2.5 °C — most of the 20° drop (from 20 down to ~2.5) happens *across the brick*, because the brick holds the larger resistance. The wind then carries that last 2.5° away easily."
        }
      ],
      answer:
        "R_cond ≈ 0.0286 K/W, R_conv ≈ 0.0040 K/W, R_total ≈ 0.0326 K/W. Heat loss Q ≈ 614 W. Outer brick surface ≈ 2.5 °C. The biggest resistance (the brick) eats most of the temperature drop — add insulation there to cut Q the most."
    },
    {
      id: "h_callout_warning",
      kind: "CALLOUT",
      variant: "warning",
      title: "Three traps that bite real engineers",
      markdown:
        "- **Radiation lives in KELVIN, never Celsius.** `Q = εσAT⁴` blows up garbage if you plug in °C — and because it's `T⁴`, the error is catastrophic, not small. Always convert: K = °C + 273.15.\n- **Don't ignore radiation just because it's small at room temperature.** It scales as T⁴, so the moment something gets hot — a stove element, a furnace wall, a brake disc — radiation can quietly become the *dominant* loss. Check it; don't assume it away.\n- **`h` is not a material property.** Thermal conductivity `k` is a fixed property of a substance you can look up. The convection coefficient `h` is *not* — it depends on fluid speed, geometry, orientation, and flow regime, and can swing by orders of magnitude. Treating `h` like a constant is how heat-sink and HVAC designs go badly wrong."
    },
    {
      id: "h_callout_interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "What they're really testing 🎤",
      markdown:
        "Expect a spoken version of this whole lesson. The prompts and the answers that scream \"hire this person\":\n\n- **\"Name the three modes and where each dominates.\"** Conduction → through solids by contact; convection → at a fluid–solid boundary, supercharged by flow; radiation → across gaps and vacuum, dominant when things get hot.\n- **\"Write the governing equation for each.\"** `Q = kAΔT/L`, `Q = hAΔT`, `Q = εσAT⁴`. Bonus: state the units of k (W/m·K) and h (W/m²·K) without flinching.\n- **\"Why does a tile floor feel colder than a rug at the same temperature?\"** Conductivity, not temperature — tile's high `k` pulls heat from your foot fast; the rug's low `k` barely does. (This trips up people who think \"feels colder = is colder.\")\n- **\"How does a thermos keep coffee hot?\"** It defeats all three modes at once: a vacuum gap kills conduction and convection, and a silvered (low-ε) surface kills radiation. Name all three for full marks.\n- **\"Walk me through heat loss through a multi-layer wall.\"** Thermal resistances in series: `R = L/kA` per solid layer, `R = 1/hA` per surface film, add them, `Q = ΔT/R_total`. Note the largest R is the bottleneck — that's where insulation pays off.\n- **\"Double a radiator's temperature — what happens to its output?\"** Sixteen-fold, because radiation goes as T⁴ (and remember: kelvin)."
    },
    {
      id: "h_wrap",
      kind: "PROSE",
      title: "The one mindset every heat problem needs",
      markdown:
        "Every heat-transfer problem you'll ever face — homework, interview, or a real heat sink — starts with the same question: **which mode (or modes) is moving the heat here?** Get that right and the rest is plugging in.\n\n1. **Conduction** through any solid: `Q = k·A·ΔT/L`. High `k`, big `A`, big `ΔT`, thin `L` → fast. It's the relay race through the material.\n2. **Convection** at any fluid–solid surface: `Q = h·A·ΔT`. Crank `h` by moving the fluid faster. It's heat riding the current away.\n3. **Radiation** across gaps and vacuum: `Q = ε·σ·A·T⁴` (kelvin!). Negligible when cool, savage when hot, thanks to the T⁴ law.\n\nThen, when heat passes through several barriers, collapse the whole thing into **thermal resistances in series** — `R = L/kA` for conduction, `R = 1/hA` for convection — add them like resistors, and divide ΔT by the sum. The biggest resistance is your bottleneck and your best lever.\n\nThat's the entire toolkit. Spot the mode, write its law, stack the resistances. Now go feel the heat — try the conduction sandbox again and watch every variable do exactly what your intuition now predicts. 🔥"
    }
  ],
  keyTakeaways: [
    "There are exactly three heat-transfer modes: conduction (through solids by contact), convection (carried by a moving fluid), and radiation (electromagnetic waves needing no medium at all).",
    "Fourier's law Q = k·A·ΔT/L governs conduction: heat flow rises with conductivity, area, and temperature difference, and falls with thickness — which is the entire principle of insulation.",
    "Convection is Q = h·A·ΔT (Newton's cooling), where h is NOT a material property — it depends on flow speed and geometry and ranges from ~5 (still air) to ~10000+ (boiling water).",
    "Radiation is Q = ε·σ·A·T⁴ with T in KELVIN: the T⁴ law means doubling absolute temperature multiplies heat output by sixteen — negligible when cool, dominant when hot.",
    "Heat flow is Ohm's law in disguise: Q = ΔT/R, with R = L/kA for conduction and R = 1/hA for convection. In series, resistances ADD — exactly like resistors.",
    "In a multi-layer path the biggest resistance is the bottleneck and soaks up the most temperature drop, so that's where adding insulation cuts heat loss the most.",
    "The engineer's first move is always 'which mode dominates here?' — vacuum or wide gap → radiation; moving fluid → convection; solid contact → conduction."
  ]
};
