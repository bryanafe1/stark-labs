import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_hydrology",
  slug: "hydrology-and-hydraulics",
  title: "Hydrology and Stormwater Runoff",
  summary:
    "Pave a meadow and you don't just build a parking lot — you build a flood. Rain that used to soak quietly into grass now sheets off the asphalt and arrives at the storm drain all at once, and somewhere downstream a culvert that was fine for a century suddenly isn't. In this lesson you'll follow a raindrop through the water cycle, learn why a single number — the runoff coefficient C — separates a sponge from a slip-n-slide, and use the engineer's back-of-envelope classic, the Rational Method Q = CiA, to predict the peak flood from a storm.",
  discipline: "ENVIRONMENTAL",
  difficulty: "MEDIUM",
  estMinutes: 22,
  tags: ["hydrology", "runoff", "stormwater"],
  objectives: [
    "Trace water through the hydrologic cycle and explain where rainfall goes: interception, infiltration, evaporation, and runoff.",
    "Explain the runoff coefficient C and why paving a surface dramatically raises the fraction of rain that runs off.",
    "Use the Rational Method (Q = C·i·A) to estimate peak runoff from a small catchment, and state the assumptions that make it valid.",
    "Define time of concentration and read a rainfall intensity-duration-frequency (IDF) relationship to pick a design storm.",
    "Compare pre-development and post-development peak flows and explain why development increases flooding.",
    "Describe how detention/retention basins absorb the extra runoff that development creates."
  ],
  prerequisites: [
    "Basic algebra and unit conversions",
    "The idea of a rate (volume per time, flow)",
    "Area units (hectares, m²) and simple proportions"
  ],
  interviewAngle:
    "Hydrology and stormwater questions are staples of civil and environmental interviews because they test whether you can connect land use to a flood and back it with a fast, defensible calculation. Interviewers want to hear the hydrologic cycle, a clear story about runoff vs infiltration, and a confident Rational Method estimate — Q = CiA — with units that resolve and assumptions stated out loud. The strong candidate does four things: (1) explains where rain goes and why pavement converts soak-in to run-off, (2) picks a sensible runoff coefficient C for the surface (≈0.2 grass, ≈0.9 asphalt) and explains it as the fraction of rain that becomes flow, (3) runs the calculation while naming the small-watershed assumptions — uniform rainfall, steady state, area small enough that the time of concentration is short — and (4) compares pre- vs post-development peak flow to justify why a detention basin is required. Expect probing on the meaning of time of concentration, why the design uses a storm of a chosen return period from an IDF curve, and why the Rational Method is only trusted on small sites. Naming its limits is as important as running it."
  ,
  blocks: [
    {
      id: "b_intro",
      kind: "PROSE",
      title: "How to build a flood (accidentally) 🌧️",
      markdown:
        "Here's a quiet catastrophe that plays out every time a city grows. A grassy field absorbs a rainstorm like a sponge — most of the water sinks into the soil, and only a trickle ever reaches the creek. Then someone paves it: a shopping center, a parking lot, a subdivision of roofs and driveways. The *same* storm now falls on surfaces that can't absorb a drop. The water sheets off the asphalt, races down the gutters, and slams into the storm drain — and a culvert downstream that handled every flood for a hundred years suddenly overtops. Nobody built a dam. Nobody changed the weather. They just changed the *ground* — and accidentally built a flood.\n\nThat's the central drama of stormwater engineering. Rain is a given; what an engineer controls is what the *land* does with it. And the whole field rests on one beautifully simple question: when a storm hits a patch of ground, **how much of that rain runs off** instead of soaking in or evaporating? Answer that, and you can predict the peak flow that a drain, a channel, or a detention basin must handle.\n\nThe tool for the first estimate is over 150 years old and still taught in every program: the **Rational Method**, `Q = C·i·A`. Multiply a runoff coefficient `C` (the fraction that runs off) by the rainfall intensity `i` (how hard it's raining) by the catchment area `A` (how big the patch is), divide by a unit-conversion constant, and out pops `Q` — the peak runoff flow. One line of arithmetic, and you've sized the drainage for a site.\n\nBy the end of this lesson you'll follow a raindrop through the whole water cycle, understand why `C` for asphalt is four-plus times `C` for grass, run `Q = CiA` yourself, and see why every new development has to build a basin to give the flood somewhere to wait."
    },
    {
      id: "b_video",
      kind: "VIDEO",
      youtubeId: "brNpLh21UCg",
      title: "Watch: The Rational Method in Under 5 Minutes",
      caption:
        "A fast, clear walk through Q = CiA — what each term means and how engineers actually use it to size drainage. Watch it now; the sandbox and worked example below will click instantly once you've seen the method in motion."
    },
    {
      id: "b_cycle",
      kind: "PROSE",
      title: "The hydrologic cycle: where does a raindrop go?",
      markdown:
        "Before we can predict runoff, we have to follow the water. The **hydrologic cycle** is the endless circulation of water through the environment — and the part an engineer cares about is what happens to rain *after* it hits the ground. A single raindrop has a few possible fates:\n\n- **Interception.** Some rain never reaches the ground — it's caught on leaves, roofs, and surfaces and evaporates straight back. Small but real.\n- **Infiltration.** Water soaks *into* the soil. This is the hero of flood control: infiltrated water recharges groundwater and is released slowly. Whether rain can infiltrate depends on the surface — porous soil drinks it; concrete refuses it.\n- **Evaporation and transpiration (ET).** Water returns to the atmosphere directly from surfaces (evaporation) and through plants (transpiration). Over a year, ET disposes of a *huge* fraction of rainfall.\n- **Surface runoff.** Whatever the ground can't absorb or hold flows *over* the surface, downhill, into gutters, ditches, and streams. **This is the part that causes floods** — and the part stormwater engineering exists to manage.\n\nThe critical insight: these fates compete. Every drop that infiltrates is a drop that *doesn't* run off. So the single biggest lever on flooding is how much of the rain the ground can absorb. A forest floor infiltrates almost everything; a parking lot infiltrates almost nothing. Change the land, and you change the split — which is exactly what development does, and exactly what the runoff coefficient is about to capture in a single number."
    },
    {
      id: "b_coefficient",
      kind: "PROSE",
      title: "The runoff coefficient C: sponge or slip-n-slide?",
      markdown:
        "Now we compress all that competition between infiltration and runoff into one elegant number. The **runoff coefficient `C`** is simply the **fraction of rainfall that becomes surface runoff** — a dimensionless number between 0 and 1. `C = 0` would mean every drop soaks in; `C = 1` would mean every drop runs off. Real surfaces live in between, and the values tell a story:\n\n- **Forest / meadow:** `C ≈ 0.1–0.3`. Mostly sponge — soil and roots drink the rain.\n- **Lawns and parks:** `C ≈ 0.2–0.35`, depending on slope and soil.\n- **Gravel, bare soil:** `C ≈ 0.4–0.6`.\n- **Pavement, roads, roofs:** `C ≈ 0.7–0.95`. Mostly slip-n-slide — almost nothing infiltrates.\n\nLook at the jump: paving a grassy site can take `C` from about 0.2 to about 0.9 — a **four-to-fivefold increase in the fraction of rain that runs off.** That's the entire flooding-from-development story in one number. Same rain, same area, but four-plus times the runoff because the ground stopped absorbing.\n\nA few subtleties worth knowing: `C` also creeps up with steeper slopes (water leaves faster) and with heavier, longer storms (the soil saturates and stops accepting water). For a mixed site — say, half roof and half lawn — engineers use an **area-weighted average** `C`, blending each surface's coefficient by its share of the area. But the headline is simple: `C` is the dial that converts land use into runoff, and development cranks it hard toward 1."
    },
    {
      id: "b_callout_C",
      kind: "CALLOUT",
      variant: "insight",
      title: "C is a land-use decision in disguise",
      markdown:
        "Here's the mental flip: the runoff coefficient isn't really a property of the *weather* — it's a property of the *ground*, and the ground is something humans choose. When a city approves a parking lot, it is, whether anyone says so or not, choosing to raise `C` from ~0.2 to ~0.9 and accept four-plus times the runoff. That's why modern stormwater rules push 'green infrastructure' — permeable pavement, rain gardens, green roofs — which are all, mathematically, just ways to push `C` back down toward the natural value. Every design that lowers `C` is recreating the sponge that development paved over."
    },
    {
      id: "b_rational_prose",
      kind: "PROSE",
      title: "The Rational Method: predicting the peak flood",
      markdown:
        "Now we assemble the pieces into the workhorse formula of small-site drainage: the **Rational Method.** The logic is, well, rational. The peak runoff rate from a patch of ground should depend on three things, and nothing more mysterious:\n\n1. **How hard it's raining** — the rainfall intensity `i` (e.g. mm/hr).\n2. **How big the catchment is** — the area `A` (e.g. hectares).\n3. **What fraction runs off** — the runoff coefficient `C` (dimensionless).\n\nMultiply them and you get the peak flow. In metric form, with `i` in mm/hr and `A` in hectares, a unit-conversion constant of 360 makes the answer come out in cubic metres per second:\n\n```\nQ = C · i · A / 360\n```\n\n(The 360 just reconciles the units: mm/hr × hectares needs converting to m³/s. Use it as given and the answer lands in m³/s.)\n\nWhy does this work, and when is it trusted? The Rational Method assumes the *peak* flow happens when the **entire** catchment is contributing runoff at once — which requires the storm to last at least as long as the **time of concentration** (the time for water to travel from the most distant corner of the site to the outlet). It also assumes the rainfall intensity is **uniform** over the whole area and the whole storm, and that `C` is constant. Those assumptions only hold for **small watersheds** — typically under a square kilometre or two (a few hundred acres). On a small site they're excellent; on a big, varied river basin they fall apart, and engineers reach for more sophisticated models. But for sizing the drainage on a parking lot, a subdivision, or a road? `Q = CiA` is the first tool out of the box. Let's drive it."
    },
    {
      id: "b_formula",
      kind: "FORMULA",
      title: "The Rational Method (metric)",
      display: "Q = C · i · A / 360",
      variables: [
        { symbol: "Q", name: "Peak runoff flow rate", unit: "m³/s" },
        { symbol: "C", name: "Runoff coefficient (fraction of rain that runs off)", unit: "" },
        { symbol: "i", name: "Rainfall intensity (for a storm lasting the time of concentration)", unit: "mm/hr" },
        { symbol: "A", name: "Catchment / drainage area", unit: "ha" }
      ],
      note:
        "The 360 is a unit-conversion constant so that mm/hr × hectares yields m³/s. Valid only for SMALL watersheds where rainfall is roughly uniform and the storm lasts at least the time of concentration (so the whole area contributes at once). C is dimensionless; for a mixed site use an area-weighted average C. Bigger C, heavier rain, or larger area all raise the peak flow proportionally."
    },
    {
      id: "b_sandbox",
      kind: "SANDBOX",
      title: "Play with it: the flood-peak machine 🎛️",
      description:
        "Stop reading, start dragging. Set the runoff coefficient C, the rainfall intensity i, and the catchment area A, and watch the peak runoff respond. The defaults (C = 0.7, i = 50 mm/hr, A = 10 ha) give Q ≈ 0.97 m³/s — a developed site in a solid storm. Now run the experiment at the heart of the field: slide C from 0.7 down to about 0.2 (imagine ripping out the asphalt and planting grass) and watch the peak flow collapse to roughly a quarter. That single dial — what the ground is made of — is the difference between a manageable drain and a flooded street.",
      variables: [
        { key: "C", label: "Runoff coefficient C", unit: "", min: 0.1, max: 0.95, step: 0.05, default: 0.7 },
        { key: "i", label: "Rainfall intensity i", unit: "mm/hr", min: 5, max: 200, step: 5, default: 50 },
        { key: "A", label: "Catchment area A", unit: "ha", min: 1, max: 100, step: 1, default: 10 }
      ],
      expression: "C * i * A / 360",
      outputLabel: "Peak runoff Q",
      outputUnit: "m³/s",
      precision: 2
    },
    {
      id: "b_predict_pave",
      kind: "PREDICT",
      question:
        "A 10-hectare grassy field has a runoff coefficient C ≈ 0.20. A developer paves most of it into a shopping center, raising C to ≈ 0.90. For the same design storm (same i and A), what happens to the peak runoff Q?",
      options: [
        { id: "a", label: "It stays about the same — the rain and area didn't change" },
        { id: "b", label: "It roughly quadruples — runoff scales directly with C, and C went up ~4.5×" },
        { id: "c", label: "It roughly doubles — paving has a moderate effect" },
        { id: "d", label: "It drops — pavement drains water away faster" }
      ],
      answerId: "b",
      reveal:
        "It roughly quadruples (about 4.5×, to be precise). In `Q = CiA/360`, the peak flow is *directly proportional* to `C`. Going from C ≈ 0.20 to C ≈ 0.90 multiplies the runoff by 0.90/0.20 = 4.5 — with the same rain falling on the same area.\n\nThis is the entire reason development causes flooding, in one ratio. The storm didn't get worse; the ground stopped absorbing. In the sandbox, hold i = 50 and A = 10 and slide C from 0.20 to 0.90 — watch Q jump from about 0.28 to about 1.25 m³/s. That extra flow has to go *somewhere*, which is exactly why the next section needs a basin to catch it."
    },
    {
      id: "b_predict_intensity",
      kind: "PREDICT",
      question:
        "An engineer is told to design for a rarer, more severe storm. On the IDF (intensity-duration-frequency) relationship, moving from a 10-year storm to a 100-year storm roughly doubles the rainfall intensity i. With C and A unchanged, what happens to the peak runoff Q the drainage must carry?",
      options: [
        { id: "a", label: "It roughly doubles — Q is directly proportional to i" },
        { id: "b", label: "It stays the same — intensity doesn't affect peak flow" },
        { id: "c", label: "It roughly halves — rarer storms produce less flow" },
        { id: "d", label: "It quadruples — intensity has a squared effect" }
      ],
      answerId: "a",
      reveal:
        "It roughly doubles. In `Q = CiA/360`, peak flow is directly proportional to rainfall intensity `i` — double `i` and you double `Q`. A rarer, more intense design storm means bigger pipes, bigger channels, bigger basins.\n\nThis is why the choice of **design storm** matters so much. Engineers read the intensity from an **IDF curve** — a chart giving rainfall intensity for a chosen storm *duration* and *return period* (the '10-year' or '100-year' storm, meaning a 1-in-10 or 1-in-100 chance per year). Designing for a rarer storm is safer but costlier; the return period is a deliberate risk-vs-cost decision. In the sandbox, hold C = 0.7 and A = 10 and slide i from 50 to 100 — watch Q double from about 0.97 to about 1.94 m³/s."
    },
    {
      id: "b_toc",
      kind: "PROSE",
      title: "Time of concentration and the IDF curve: picking the storm",
      markdown:
        "Two concepts quietly decide what number you plug in for `i`, and they trip up beginners constantly. Let's nail them.\n\n**Time of concentration (`t_c`)** is the time it takes a drop of water to travel from the *hydraulically most distant* point of the catchment all the way to the outlet. Why does it matter? Because the Rational Method's peak flow only occurs once **the entire catchment is contributing at the same time** — and that can't happen until the storm has lasted at least `t_c`. A small, steep, paved site has a short `t_c` (minutes); a large, flat, vegetated one has a long `t_c`. It's the catchment's response time.\n\nHere's the clever twist: short, intense bursts of rain are more intense than long, gentle ones (a 5-minute cloudburst is fierce; a 6-hour drizzle is mild). So we deliberately choose a **design storm whose duration equals the time of concentration.** Any shorter, and the whole area isn't contributing yet; any longer, and the intensity is needlessly low. The storm matched to `t_c` produces the true peak.\n\nThat's where the **IDF curve** comes in — *Intensity-Duration-Frequency.* It's a family of curves (one per return period) that tells you the rainfall intensity for any storm duration. The recipe is: (1) find the catchment's `t_c`, (2) pick a return period based on how much risk you'll accept (10-year for minor drains, 100-year for critical infrastructure), (3) read the intensity `i` off the IDF curve at that duration and frequency, and (4) drop it into `Q = CiA`. The IDF curve is how you turn 'a bad storm' into an actual number."
    },
    {
      id: "b_worked_example",
      kind: "WORKED_EXAMPLE",
      title: "Real job: sizing drainage and justifying a basin 🔧",
      problem:
        "A 10-hectare site will be developed. The design storm (matched to the time of concentration) has intensity i = 50 mm/hr. (a) BEFORE development the site is grass with C = 0.20 — what is the pre-development peak runoff? (b) AFTER development it's mostly paved with C = 0.70 — what is the post-development peak runoff? (c) Local rules say a development must not increase the peak flow leaving the site. How much extra peak flow must a detention basin absorb?",
      steps: [
        {
          label: "(a) Pre-development peak: Q = C·i·A/360",
          markdown:
            "Grass site, C = 0.20, i = 50 mm/hr, A = 10 ha:\n\n```\nQ_pre = C · i · A / 360 = 0.20 × 50 × 10 / 360\n      = 100 / 360\n      ≈ 0.28 m³/s\n```\n\nNaturally, the field releases only about 0.28 m³/s at the peak — most of the rain soaks in."
        },
        {
          label: "(b) Post-development peak",
          markdown:
            "Same storm, same area, but now paved with C = 0.70:\n\n```\nQ_post = C · i · A / 360 = 0.70 × 50 × 10 / 360\n       = 350 / 360\n       ≈ 0.97 m³/s\n```\n\nThe developed site peaks at about 0.97 m³/s — matching the sandbox default. Notice the ratio: 0.97 / 0.28 = 3.5×, exactly the ratio of the C values (0.70/0.20 = 3.5). Development tripled-and-a-half the peak flow."
        },
        {
          label: "(c) The extra flow a basin must handle",
          markdown:
            "To keep the outflow at the pre-development rate, the basin must temporarily store the *difference* between post and pre peaks:\n\n```\nΔQ = Q_post − Q_pre ≈ 0.97 − 0.28\n   ≈ 0.69 m³/s\n```\n\nThe detention basin must capture about 0.69 m³/s of peak inflow — holding it back and releasing it slowly so the flow *leaving* the site never exceeds the original 0.28 m³/s. That stored, slowly-released volume is the whole purpose of the basin: it buys back the absorption the pavement destroyed."
        }
      ],
      answer:
        "(a) Q_pre = 0.20×50×10/360 ≈ 0.28 m³/s. (b) Q_post = 0.70×50×10/360 ≈ 0.97 m³/s — a 3.5× increase. (c) The basin must absorb the difference, ΔQ ≈ 0.97 − 0.28 ≈ 0.69 m³/s, releasing it slowly so the site's outflow stays at the pre-development 0.28 m³/s."
    },
    {
      id: "b_basins",
      kind: "PROSE",
      title: "Detention basins: giving the flood somewhere to wait",
      markdown:
        "The worked example exposes the problem and points straight at the fix. Development raised the peak flow from 0.28 to 0.97 m³/s — and if that surge runs straight off-site, it floods whatever is downstream. So nearly every modern development is required to **not make things worse downstream**: the post-development peak flow leaving the site must not exceed the pre-development peak. How do you obey that while still paving the place? You build a **basin.**\n\nA **detention basin** is, at heart, a temporary parking lot for water. Stormwater pours in fast, the basin fills, and a deliberately undersized outlet (a small pipe or weir) lets it drain out *slowly*. The basin shaves the sharp inflow peak down to a gentle, prolonged outflow — it doesn't reduce the *total volume* of water, just the *rate* at which it leaves. Think of it as a funnel for time: the same water, spread over more hours. The basin sits empty most of the year and only does its job during storms.\n\nA close cousin, the **retention basin** (or wet pond), keeps a permanent pool of water and additionally removes pollutants as sediment settles and runoff lingers — so it provides water-*quality* treatment on top of flood control. And the gentler, newer philosophy — **green infrastructure** like permeable pavement, bioswales, and rain gardens — attacks the problem at the source by letting water infiltrate again, effectively pushing `C` back down rather than catching the extra runoff after the fact.\n\nThe through-line of the whole lesson: development raises `C`, which raises peak runoff `Q`, which threatens downstream flooding — and basins (or green infrastructure) exist to give that extra flow somewhere to wait, restoring the slow release that the natural ground used to provide for free."
    },
    {
      id: "b_callout_limits",
      kind: "CALLOUT",
      variant: "warning",
      title: "Two traps that bite real engineers",
      markdown:
        "- **Don't use the Rational Method on a big basin.** `Q = CiA` assumes uniform rainfall over the whole area and that the storm lasts the time of concentration so the *entire* catchment contributes at once. On a small site (rule of thumb: under ~1–2 km², a few hundred acres) that's fine. On a large, varied watershed it badly misestimates the peak — rainfall isn't uniform, travel times vary, and you need a real hydrograph model (SCS/NRCS, unit hydrographs, software). Knowing *when not to use* a formula is senior-level judgment.\n- **Match the storm duration to the time of concentration, and watch your units.** Picking an arbitrary storm duration gives the wrong intensity off the IDF curve. And the metric Rational Method's '360' constant only delivers m³/s if `i` is in mm/hr and `A` is in hectares — mix in m² or m/s and the answer is off by orders of magnitude. Units and the design storm are where real calculations go wrong."
    },
    {
      id: "b_check_runoff",
      kind: "CHECK",
      question:
        "A developer converts a grassy field (C ≈ 0.2) into a paved parking lot (C ≈ 0.9). For the same storm and the same area, what is the main hydrologic consequence?",
      choices: [
        { id: "r1", label: "Less rain falls on the site because pavement repels water" },
        { id: "r2", label: "More rain infiltrates, recharging groundwater" },
        { id: "r3", label: "A much larger fraction of rain becomes surface runoff, raising the peak flow" },
        { id: "r4", label: "The time of concentration increases, lowering the peak flow" }
      ],
      answerId: "r3",
      explanation:
        "Pavement can't absorb water, so the runoff coefficient C jumps from ~0.2 to ~0.9 — a 4.5× increase in the fraction of rain that becomes surface runoff. Since Q = CiA/360 is directly proportional to C, the peak flow rises about 4.5×. Infiltration *drops* (not rises), the same rain still falls, and paving actually *shortens* the time of concentration (water moves faster over smooth surfaces), which tends to raise the peak. The surge in runoff is exactly why detention basins are required."
    },
    {
      id: "b_check_rational",
      kind: "CHECK",
      question:
        "Why is the Rational Method (Q = CiA) considered valid only for SMALL watersheds?",
      choices: [
        { id: "m1", label: "Because large watersheds never flood" },
        { id: "m2", label: "Because it assumes uniform rainfall and that the whole area contributes at once — assumptions that fail over large, varied areas" },
        { id: "m3", label: "Because the runoff coefficient C only exists for small areas" },
        { id: "m4", label: "Because rainfall intensity i cannot be measured over large areas" }
      ],
      answerId: "m2",
      explanation:
        "The Rational Method assumes the rainfall intensity is uniform across the whole catchment and that the storm lasts at least the time of concentration so the entire area contributes runoff simultaneously. On a small site those hold well, but over a large, varied watershed rainfall is patchy and travel times differ widely, so the peak is misestimated — engineers then use hydrograph methods (SCS/NRCS, unit hydrographs) instead. C and i are perfectly definable at any scale; the limitation is in the simplifying assumptions, not the inputs."
    },
    {
      id: "b_callout_interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "What they're really testing 🎤",
      markdown:
        "Stormwater interviewers want the land-use-to-flood story plus a clean Rational Method calculation with assumptions stated. The prompts and the answers that scream \"hire this person\":\n\n- **\"Where does rainfall go?\"** Hydrologic cycle: interception, infiltration, evaporation/transpiration, and surface runoff. Every drop that infiltrates is a drop that doesn't run off.\n- **\"What's the runoff coefficient?\"** The fraction of rain that becomes runoff (0–1). ~0.2 for grass, ~0.9 for pavement — development cranks it up ~4–5×. Use an area-weighted C for mixed sites.\n- **\"Estimate the peak runoff.\"** `Q = C·i·A/360` (metric: i in mm/hr, A in ha → m³/s). State the assumptions: uniform rainfall, small watershed, storm duration equal to the time of concentration.\n- **\"What's time of concentration / why an IDF curve?\"** t_c is the travel time from the farthest point to the outlet; match the storm duration to t_c and read intensity off the IDF curve for your chosen return period (risk vs cost).\n- **\"Why does development need a detention basin?\"** Paving raises C → raises peak Q. The basin stores the *difference* between post- and pre-development peaks and releases it slowly, so off-site flow doesn't increase. Computing ΔQ = Q_post − Q_pre and naming the basin's job is the move that lands the offer."
    },
    {
      id: "b_wrap",
      kind: "PROSE",
      title: "The one path every runoff problem walks",
      markdown:
        "Every stormwater problem — homework, interview, or real subdivision — follows the same arc. Lock it in:\n\n1. **Follow the water.** Rain splits between infiltration, ET, interception, and runoff. Runoff is the flood-maker, and infiltration is its opposite.\n2. **C is the dial.** The runoff coefficient is the fraction that runs off — ~0.2 grass, ~0.9 pavement. Development cranks C toward 1, and that single change drives everything.\n3. **Estimate with Q = CiA/360.** Peak flow is directly proportional to C, to i, and to A. Mind the units (mm/hr, hectares → m³/s) and state the small-watershed assumptions.\n4. **Pick the storm honestly.** Match the storm duration to the time of concentration, choose a return period for your risk tolerance, and read intensity off the IDF curve.\n5. **Catch the difference.** Development raises the peak; a detention basin stores ΔQ = Q_post − Q_pre and releases it slowly so downstream flow never gets worse. Green infrastructure does it by pushing C back down.\n\nFeel two things in your bones: a flood is often a *land-use* decision wearing a weather costume, and the engineer's job is to give the extra water somewhere to wait. Next time you cross a parking lot in the rain and watch the sheets of water race for the drain, you'll see the whole story — the lost sponge, the spiked `Q`, and the quiet basin downstream holding the flood at bay. 💧"
    }
  ],
  keyTakeaways: [
    "In the hydrologic cycle, rainfall splits between interception, infiltration, evaporation/transpiration, and surface runoff — and every drop that infiltrates is one that doesn't run off, so infiltration is the key to flood control.",
    "The runoff coefficient C is the dimensionless fraction of rain that becomes runoff: ~0.1–0.3 for vegetation, ~0.7–0.95 for pavement. Development raises C four- to fivefold, which is the root cause of development-driven flooding.",
    "The Rational Method, Q = C·i·A/360 (metric: i in mm/hr, A in hectares → m³/s), estimates peak runoff; flow is directly proportional to C, intensity, and area.",
    "The method is valid only for small watersheds, where rainfall is roughly uniform and the storm lasts the time of concentration so the whole area contributes at once; large basins need hydrograph models.",
    "Time of concentration is the travel time from the catchment's farthest point to the outlet; the design storm duration is matched to it, and rainfall intensity is read from an IDF curve for a chosen return period (risk vs cost).",
    "Development sharply raises the peak flow; detention basins store the difference between post- and pre-development peaks and release it slowly, keeping off-site flow from increasing.",
    "Green infrastructure (permeable pavement, rain gardens, bioswales) attacks runoff at the source by restoring infiltration — effectively pushing C back down rather than catching extra runoff after the fact."
  ]
};
