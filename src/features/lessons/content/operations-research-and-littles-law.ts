import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_or",
  slug: "operations-research-and-littles-law",
  title: "Operations Research and Little's Law",
  summary:
    "Why does the coffee line that's only \"a little busy\" suddenly stretch out the door? Why can a factory be 95% utilized and still ship late? Operations research is the science of squeezing systems for more throughput, and Little's Law — L = λ·W — is its almost embarrassingly simple superpower: it holds for queues, hospitals, hard drives, and highways with no assumptions about anything. Learn it once and you'll see hidden bottlenecks everywhere.",
  discipline: "INDUSTRIAL",
  difficulty: "MEDIUM",
  estMinutes: 24,
  tags: ["operations-research", "queuing", "littles-law"],
  objectives: [
    "Explain what operations research is and recognize when a problem is really an optimization problem in disguise.",
    "State and apply Little's Law, L = λ·W, and explain why it holds for almost any stable system with no distributional assumptions.",
    "Distinguish throughput, work-in-process (WIP), and cycle time, and use Little's Law to convert between them.",
    "Compute utilization ρ = λ/µ and explain why queue length and wait time explode as ρ → 1.",
    "Identify a system's bottleneck and reason about it with the Theory of Constraints.",
    "Recognize where classic OR tools — EOQ and linear programming — fit into the optimization toolkit.",
  ],
  prerequisites: [
    "Basic algebra and ratios",
    "Comfort with rates (arrivals per hour, items per minute)",
    "Intuition for averages — no probability theory required",
  ],
  interviewAngle:
    "Operations, product, and quant interviews love Little's Law because it separates people who memorize formulas from people who reason about systems. The expected move is fluency in three directions: given any two of L (number in system), λ (throughput/arrival rate), and W (time in system), produce the third instantly — and know that the same equation answers \"how long is the line?\", \"how much WIP is on the floor?\", and \"what's our cycle time?\". The strong candidate also (1) names the law's killer feature — it needs *no* assumptions about arrival or service distributions, only that the system is stable — (2) reaches for utilization ρ = λ/µ to explain why a system at 90% load has a far longer queue than one at 80%, the nonlinear blow-up as ρ → 1, and (3) frames improvement around the bottleneck (Theory of Constraints): the throughput of the whole line equals the throughput of its slowest stage, so optimizing anything else is wasted effort. Expect a coffee-shop or call-center scenario, a \"why is the wait so long?\" probe, and a \"what would you fix first?\" follow-up where bottleneck thinking is the winning answer.",
  blocks: [
    {
      id: "or_intro",
      kind: "PROSE",
      title: "The coffee line that breaks your intuition ☕",
      markdown:
        "You walk into your usual café. Some mornings there are three people ahead of you and you're out in two minutes. Other mornings — the line looks *barely* longer — you're trapped for fifteen. The arrival rate only crept up a bit. So why did your wait *explode*?\n\nThat gap between \"a little busier\" and \"catastrophically slower\" is the central, counterintuitive truth of **operations research** (OR): the math of making systems run better. OR is what airlines use to route planes, what Amazon uses to place warehouses, what hospitals use to staff ERs, and what your phone's OS uses to schedule tasks. The unifying question is always the same: *given limited resources, how do we get the most throughput, the lowest cost, the shortest wait?*\n\nMost of OR can feel like a sprawling bag of techniques — linear programming, inventory models, scheduling, network flows. But underneath the coffee-line mystery sits one law so simple it looks like a typo, yet so general it borders on magic:\n\n```\nL = λ · W\n```\n\nThe average number of things *in* a system equals how fast they *arrive* times how long each one *stays*. That's it. No probability distributions, no assumptions about randomness, no fine print. It governs the café, the freeway, the hospital ward, and the buffer in your network card — all with the same three letters. By the end of this lesson you'll wield it in your sleep, *and* you'll understand exactly why that line out the door appears so suddenly.",
    },
    {
      id: "or_video",
      kind: "VIDEO",
      youtubeId: "2Lx7QtaPDKw",
      title: "Watch: Little's Law in Queuing Theory",
      channel: "Little's Law / Queuing",
      caption:
        "A tight visual intro to the one equation this whole lesson orbits. Watch it now — once you've seen items flow into and out of the box, L = λ·W stops being a formula and becomes obvious.",
    },
    {
      id: "or_what_is_or",
      kind: "PROSE",
      title: "What operations research actually is",
      markdown:
        "Operations research was born in World War II, when mathematicians were asked unglamorous but urgent questions: how big should a convoy be? where should we put radar? how do we schedule bombing runs to lose the fewest planes? They turned messy real-world decisions into models you could *optimize*, and the discipline never looked back.\n\nThe modern toolkit is broad, but it clusters into a few big ideas:\n\n- **Optimization** — find the best decision subject to constraints. *Linear programming (LP)* is the crown jewel: maximize or minimize a linear objective (profit, cost, distance) subject to linear constraints (capacity, budget, demand). The famous result is that the optimum always sits at a *corner* of the feasible region, which is why the simplex algorithm just walks the corners.\n- **Inventory theory** — how much to stock and when to reorder. The *Economic Order Quantity (EOQ)* balances the cost of ordering too often against the cost of holding too much, landing on a sweet-spot order size.\n- **Queuing theory** — the math of waiting lines, where Little's Law lives. This is our focus.\n- **Scheduling, routing, and network flows** — sequencing jobs, routing trucks, moving goods through a network at minimum cost.\n\nThe through-line: model the system, find the lever that matters, pull it. And the single most reusable lever-finding tool in the whole kit is the one we're about to meet.",
    },
    {
      id: "or_littles_formula",
      kind: "FORMULA",
      title: "Little's Law",
      display: "L = λ · W",
      latex: "L = \\lambda \\cdot W",
      variables: [
        { symbol: "L", name: "Average number of items in the system (length)", unit: "items" },
        { symbol: "λ", name: "Average arrival rate = throughput of a stable system (lambda)", unit: "items/hr" },
        { symbol: "W", name: "Average time an item spends in the system (wait/cycle time)", unit: "hr" },
      ],
      note:
        "Astonishingly assumption-free: it holds for ANY stable system regardless of arrival pattern, service distribution, or queue discipline — you just need long-run averages and a system that isn't blowing up (arrivals ≈ departures). \"System\" is whatever box you draw: just the queue, just the servers, or both. Define the box, then L, λ, W must refer to that same box.",
    },
    {
      id: "or_why_universal",
      kind: "PROSE",
      title: "Why one tiny equation rules them all 🌍",
      markdown:
        "Here's what makes Little's Law feel like a cheat code: it makes **no assumptions**. Most queuing results demand that arrivals be random in a specific way (Poisson) or service times follow some distribution. Little's Law demands *none of that*. As long as the system is **stable** — meaning stuff doesn't pile up forever, so over the long run arrivals ≈ departures — the relationship `L = λ·W` holds exactly, on average. Bursty arrivals, weird service times, priority queues, you cutting in line: doesn't matter.\n\nThe intuition is a flow argument. Imagine a box with items flowing in at rate `λ` and each staying for time `W`. Take a snapshot: roughly how many are inside? Each item lingers for `W`, and `λ` of them arrive per unit time, so at any instant about `λ·W` of them are caught inside the box. (It's the same logic as \"if 60 cars per minute enter a tunnel and each takes 2 minutes to drive through, there are about 120 cars in the tunnel.\")\n\nThe killer feature is that **the box is yours to define**, and the law holds for whatever box you draw:\n\n- Box = the *whole café* → `L` is everyone inside (waiting + being served), `W` is total time from door to coffee.\n- Box = *just the line* → `L` is people waiting, `W` is just the wait.\n- Box = *just the barista* → `L` is people being served (the server utilization!), `W` is service time.\n\nSame law, three insights, zero new math. Just keep `L`, `λ`, and `W` referring to the *same* box and you can never go wrong.",
    },
    {
      id: "or_sandbox",
      kind: "SANDBOX",
      title: "Play with it: the Little's Law machine 🎛️",
      description:
        "Stop reading, start dragging. λ is how fast items arrive (the throughput of a stable system), W is how long each one hangs around, and the output L is how many are inside the box at any moment. Notice it's perfectly linear: double either λ or W and L doubles. The defaults (λ = 12 arrivals/hr, W = 0.5 hr in system) give L = 6.0 — on average six items in the system at once. Try cranking W: making each item linger longer is just as crowding as more arrivals.",
      variables: [
        { key: "lambda", label: "Arrival rate λ", unit: "/hr", min: 1, max: 120, step: 1, default: 12 },
        { key: "W", label: "Time in system W", unit: "hr", min: 0.05, max: 5, step: 0.05, default: 0.5 },
      ],
      expression: "lambda * W",
      outputLabel: "Avg number in system L",
      outputUnit: "items",
      precision: 1,
    },
    {
      id: "or_throughput_wip",
      kind: "PROSE",
      title: "The factory-floor reframe: throughput, WIP, cycle time",
      markdown:
        "Little's Law isn't just about waiting in line — it's the secret backbone of **lean manufacturing** and modern operations. Rename the three letters in factory language and the same equation becomes a production planner's best friend:\n\n- **L → WIP** (work-in-process): the number of jobs currently on the floor — half-built cars, open tickets, code in review.\n- **λ → throughput**: the rate of finished output (for a stable system, output rate = arrival rate).\n- **W → cycle time** (a.k.a. lead time / flow time): how long one job takes from start to finish.\n\nSo Little's Law reads: **WIP = throughput × cycle time.** Rearranged, it becomes the most useful diagnostic in operations:\n\n```\nCycle time = WIP / throughput\n```\n\nThis is *huge*. It says that if you want shorter lead times (and who doesn't?), and you can't easily raise throughput, then you must **cut WIP**. Drowning a floor in started-but-unfinished work doesn't speed anything up — it just inflates cycle time, one-for-one. This is the mathematical heart of \"stop starting, start finishing,\" of Kanban WIP limits, of \"a smaller batch ships faster.\" Software teams rediscover it constantly: pile 50 tickets into \"in progress\" and each one crawls; limit WIP and everything flows. Same three letters, profound consequence.",
    },
    {
      id: "or_predict_wip",
      kind: "PREDICT",
      question:
        "A software team finishes 10 tickets per week (throughput) and currently has 40 tickets in progress (WIP). Leadership, frustrated by slow delivery, decides to start working on even MORE tickets at once — pushing WIP to 80 — without changing how fast the team actually completes work. What happens to the average time a ticket takes to get done (cycle time)?",
      options: [
        { id: "a", label: "It halves — more parallel work means faster delivery" },
        { id: "b", label: "It stays the same — cycle time depends on the work, not the WIP" },
        { id: "c", label: "It doubles — from 4 weeks to 8 weeks per ticket" },
        { id: "d", label: "It drops slightly — busier teams are more focused" },
      ],
      answerId: "c",
      reveal:
        "It **doubles** — to a miserable 8 weeks per ticket. Little's Law: `cycle time = WIP / throughput`. Before: `40 / 10 = 4 weeks`. After: `80 / 10 = 8 weeks`. Throughput didn't budge (the team can only finish 10/week), so doubling the WIP simply doubled how long each ticket languishes.\n\nThis is the most expensive misconception in operations, and leaders fall for it constantly: starting *more* work feels like progress, but if your completion rate is fixed, all that extra WIP just sits there aging. The fix is the exact opposite of the instinct — **limit WIP** to *shrink* cycle time. \"Stop starting, start finishing\" isn't a slogan; it's literally `W = L / λ`. Fewer things in flight, faster everything moves.",
    },
    {
      id: "or_utilization",
      kind: "PROSE",
      title: "Utilization ρ: why queues blow up near 100% 📈",
      markdown:
        "Now we can finally crack the coffee-line mystery. Define **utilization** as how hard a server is working:\n\n```\nρ = λ / µ      (arrival rate ÷ service rate)\n```\n\nwhere `µ` (mu) is the *service rate* — how many customers one barista *could* serve per hour if never idle. If customers arrive at `λ = 30/hr` and a barista can handle `µ = 40/hr`, then `ρ = 0.75`: the barista is busy 75% of the time. For the system to be **stable**, you need `ρ < 1` — if `ρ ≥ 1`, work arrives faster than it can leave and the queue grows without bound. Forever. (That's the line out the door and down the block.)\n\nHere's the brutal, beautiful part. As `ρ` climbs toward 1, the average queue length and wait don't grow *linearly* — they **explode hyperbolically**. For a standard single-server random queue, the average number waiting scales like:\n\n```\nL_q ∝ ρ / (1 − ρ)\n```\n\nLook at that denominator. At `ρ = 0.5`, the factor `ρ/(1−ρ) = 1`. At `ρ = 0.9` it's `9`. At `ρ = 0.95` it's `19`. At `ρ = 0.99` it's `99`. Going from 90% to 99% utilization makes the line **roughly 10× longer** — even though you only got 9% busier. *That* is why your café flips from \"two minutes\" to \"fifteen minutes\" with a tiny bump in arrivals: you crossed into the steep part of the curve.\n\nThe deep, expensive lesson for every manager: **you cannot run a variable system at 100% utilization and expect short waits.** Slack isn't waste — it's the buffer that absorbs randomness. ERs, runways, and CPUs that target ~85% leave room to breathe; the ones cranked to 99% drown in their own queue.",
    },
    {
      id: "or_predict_rho",
      kind: "PREDICT",
      question:
        "A call center runs at 80% utilization (ρ = 0.8) and management wants to handle more calls without hiring, so they push it to 95% utilization (ρ = 0.95). Using the queue factor ρ/(1−ρ), roughly how much longer does the line of waiting callers get?",
      options: [
        { id: "a", label: "About 19% longer — proportional to the 15-point bump in utilization" },
        { id: "b", label: "Slightly shorter — higher utilization means more efficient agents" },
        { id: "c", label: "About 4.75× longer — the queue blows up nonlinearly near ρ = 1" },
        { id: "d", label: "Exactly double — utilization went up by a sixth" },
      ],
      answerId: "c",
      reveal:
        "About **4.75× longer** — a near-fivefold explosion from a seemingly modest 15-point increase. Run the queue factor `ρ/(1−ρ)`:\n\n```\nAt ρ = 0.80:  0.80 / 0.20 = 4\nAt ρ = 0.95:  0.95 / 0.05 = 19\nRatio: 19 / 4 ≈ 4.75×\n```\n\nThis is the single most counterintuitive result in queuing, and it bites real businesses hard. \"We're only at 80%, we have 20% headroom, let's use it!\" sounds reasonable — but that last sliver of capacity is precisely where the curve goes vertical. The closer `ρ` creeps to 1, the more violently waits balloon. The fix for long waits is almost never \"work the existing servers harder\"; it's *add capacity* (raise µ, lowering ρ) or *reduce variability*. Slack is the price of speed.",
    },
    {
      id: "or_bottleneck",
      kind: "PROSE",
      title: "Bottlenecks and the Theory of Constraints 🍾",
      markdown:
        "If utilization explains why a *single* station chokes, the **Theory of Constraints (TOC)** explains how to think about a whole *chain* of them. The core idea is almost insultingly obvious once stated: **a system's throughput is set entirely by its slowest stage — the bottleneck.** A factory line that can mold 100 parts/hr, paint 60/hr, and assemble 90/hr produces exactly **60/hr**, full stop. The paint booth is the constraint, and everything upstream of it just piles into a queue while everything downstream sits starved and idle.\n\nThe consequences are sharp and frequently ignored:\n\n- **Improving a non-bottleneck does nothing.** Speed up molding to 150/hr and you still ship 60/hr — you've just grown the pile in front of the paint booth. Optimizing anywhere but the constraint is wasted money. (This is the #1 mistake in real improvement projects.)\n- **The bottleneck should never be idle.** Every minute the constraint isn't working is throughput lost *for the entire system* and can never be recovered. Protect it, buffer it, feed it.\n- **Fix the constraint and the bottleneck moves.** Bump the paint booth to 95/hr and now *assembly* (90/hr) is the constraint. Improvement is a never-ending game of whack-a-bottleneck — which is exactly the point of TOC's cycle: *identify → exploit → subordinate everything else → elevate → repeat.*\n\nThe one-sentence takeaway that wins interviews: **to speed up a system, find the bottleneck and work only on that.** Everything else is rearranging deck chairs.",
    },
    {
      id: "or_worked_example",
      kind: "WORKED_EXAMPLE",
      title: "Real job: diagnosing a coffee shop ☕📊",
      problem:
        "A coffee shop has one barista. Customers arrive at λ = 36 per hour. The barista takes an average of 90 seconds to make a drink. (a) What's the service rate µ and the utilization ρ? (b) Using the single-server estimate, about how many customers are waiting in line (L_q ≈ ρ²/(1−ρ))? (c) Now the morning rush pushes arrivals to λ = 38 per hour — recompute ρ and L_q and explain what happened. (d) If on average there are 5 people total in the shop (waiting + being served) during the rush, use Little's Law to find the average time a customer spends from door to drink.",
      steps: [
        {
          label: "(a) Service rate and utilization",
          markdown:
            "90 seconds per drink means the barista *could* serve `3600 / 90 = 40` customers per hour, so `µ = 40/hr`.\n\nUtilization:\n\n```\nρ = λ / µ = 36 / 40 = 0.90\n```\n\nThe barista is busy 90% of the time. Stable (ρ < 1), but living dangerously close to the edge.",
        },
        {
          label: "(b) Customers waiting at ρ = 0.90",
          markdown:
            "Using the single-server estimate `L_q ≈ ρ²/(1−ρ)`:\n\n```\nL_q ≈ 0.90² / (1 − 0.90) = 0.81 / 0.10 = 8.1 customers\n```\n\nAbout **8 people** waiting in line on average. Already a long line for one barista — but watch what one tiny nudge does.",
        },
        {
          label: "(c) The rush pushes λ to 38 — the explosion",
          markdown:
            "New utilization:\n\n```\nρ = 38 / 40 = 0.95\nL_q ≈ 0.95² / (1 − 0.95) = 0.9025 / 0.05 ≈ 18.0 customers\n```\n\nArrivals rose only ~5.5% (36 → 38), but the line **more than doubled**, from ~8 to ~18. That's the `1/(1−ρ)` denominator going vertical as ρ → 1. The shop didn't get a bit slower — it tipped into the steep part of the curve. One more barista (raising µ, dropping ρ) is worth far more than asking the current one to \"hurry up.\"",
        },
        {
          label: "(d) Time in system via Little's Law",
          markdown:
            "Box = the whole shop. `L = 5` people, `λ = 38/hr`. Solve Little's Law for `W`:\n\n```\nW = L / λ = 5 / 38 hr = 0.1316 hr ≈ 7.9 minutes\n```\n\nSo door-to-drink averages about **8 minutes** during the rush — and notice we needed *zero* assumptions about how arrivals or service times are distributed. That's Little's Law earning its keep: two numbers in, the third falls out.",
        },
      ],
      answer:
        "(a) µ = 40/hr, ρ = 0.90. (b) ~8 customers waiting. (c) At λ = 38, ρ = 0.95 and the line ≈ 18 — a ~5% arrival bump more than doubled the queue (the ρ → 1 blow-up). (d) W = L/λ = 5/38 hr ≈ 8 minutes door-to-drink. The fix is more capacity (lower ρ), not a faster barista.",
    },
    {
      id: "or_check_littles",
      kind: "CHECK",
      question:
        "A hospital ER sees 6 patients arrive per hour, and on average each patient spends 3 hours in the ER from check-in to discharge. Using Little's Law, about how many patients are in the ER at any given time?",
      choices: [
        { id: "c1", label: "2 patients — arrivals divided by time" },
        { id: "c2", label: "18 patients — L = λ·W = 6 × 3" },
        { id: "c3", label: "9 patients — half the arrival-time product" },
        { id: "c4", label: "Can't tell without knowing the arrival distribution" },
      ],
      answerId: "c2",
      explanation:
        "L = λ·W = 6 patients/hr × 3 hr = 18 patients in the ER on average. And note choice (d) is the trap: Little's Law famously needs *no* information about the arrival distribution, service-time distribution, or queue discipline — only stable long-run averages. That assumption-free generality is exactly what makes it so powerful. Two numbers (rate and time-in-system) hand you the third (number in system) directly.",
    },
    {
      id: "or_check_bottleneck",
      kind: "CHECK",
      question:
        "A production line has three stages with capacities: Stage A = 120 units/hr, Stage B = 70 units/hr, Stage C = 100 units/hr. Management spends a fortune upgrading Stage A to 200 units/hr. What is the line's throughput now?",
      choices: [
        { id: "s1", label: "200 units/hr — the upgraded first stage sets the pace" },
        { id: "s2", label: "70 units/hr — unchanged, because Stage B is still the bottleneck" },
        { id: "s3", label: "130 units/hr — the average of the three stages" },
        { id: "s4", label: "100 units/hr — limited by Stage C" },
      ],
      answerId: "s2",
      explanation:
        "Still **70 units/hr**. A line's throughput equals the capacity of its slowest stage — the bottleneck — which is Stage B at 70/hr. Upgrading Stage A (already faster than B) was wasted money: it just grows the pile of inventory waiting in front of B. This is the central lesson of the Theory of Constraints: improving a non-bottleneck does nothing for system throughput. The *only* way to ship more is to elevate the constraint itself (Stage B). Always find the bottleneck before you spend a dime improving anything.",
    },
    {
      id: "or_callout_interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "What they're really testing 🎤",
      markdown:
        "Operations, product, and quant interviews lean hard on this material. The prompts and the answers that scream \"hire this person\":\n\n- **\"There are 200 people in line and 50 arrive per hour — how long is the wait?\"** Little's Law, rearranged: `W = L/λ = 200/50 = 4 hours`. Then add: \"and this needs no assumptions about the arrival pattern — only that the system is stable.\" Naming the assumption-free property is the flex.\n- **\"Throughput, WIP, cycle time — how do they relate?\"** `WIP = throughput × cycle time`. Note that to cut cycle time without raising throughput, you must cut WIP. (\"Stop starting, start finishing.\")\n- **\"We're at 85% utilization and waits are bad — what's going on, and what do we do?\"** Explain the `1/(1−ρ)` blow-up: near full utilization, tiny load increases cause huge wait increases. The fix is more capacity or less variability, not \"work harder.\" Slack is the price of speed.\n- **\"Where would you focus to speed up this multi-stage process?\"** The bottleneck — the slowest stage sets the whole system's throughput; improving anything else is wasted. (Theory of Constraints.)\n- **Bonus:** know that OR's optimization side is LP (optimum at a corner of the feasible region) and EOQ (the order-size sweet spot trading off ordering vs. holding cost).",
    },
    {
      id: "or_callout_slack",
      kind: "CALLOUT",
      variant: "insight",
      title: "Slack is a feature, not waste",
      markdown:
        "The most expensive instinct in operations is \"idle capacity is wasted money — drive utilization to 100%.\" Queuing theory says the opposite: in any system with *variability* (and every real system has variability), the buffer of unused capacity is what absorbs the random bumps and keeps waits short. Push utilization to 100% and the queue length heads to infinity. This is why well-run emergency rooms, airport runways, and CPU schedulers deliberately target ~80–90%, not 99%. The same idea scales to your own calendar: a person booked to 100% has zero ability to absorb a surprise, so one delayed meeting cascades through the whole day. A little planned slack isn't laziness — it's the only thing standing between you and a queue that explodes.",
    },
    {
      id: "or_wrap",
      kind: "PROSE",
      title: "The lens you'll never put down",
      markdown:
        "Operations research is enormous, but you can carry its most powerful ideas in your pocket:\n\n1. **Little's Law, `L = λ·W`** — the assumption-free Swiss Army knife. Given any two of *number in system*, *arrival/throughput rate*, and *time in system*, you've got the third. Works for queues, factories (`WIP = throughput × cycle time`), hospitals, and hard drives alike.\n2. **Utilization `ρ = λ/µ`** — and the brutal `1/(1−ρ)` blow-up that makes nearly-full systems choke. Never run a variable system at 100% and expect speed.\n3. **The bottleneck (Theory of Constraints)** — the slowest stage caps the whole system; to go faster, fix *only* that.\n4. **Optimization (LP, EOQ)** — when the question is \"what's the best decision under constraints,\" reach for the optimization toolkit.\n\nOnce you have this lens, you'll see queues and constraints *everywhere* — the grocery checkout, your code-review backlog, the on-ramp to the highway, your own to-do list. The world is full of bathtubs filling and draining, lines forming and clearing. Now you know the math that governs all of them. Go find a bottleneck. 🔍",
    },
  ],
  keyTakeaways: [
    "Little's Law, L = λ·W, relates the average number in a system, the arrival/throughput rate, and the time each item spends inside — and holds for ANY stable system with no distributional assumptions.",
    "The same law renames to WIP = throughput × cycle time, so cycle time = WIP / throughput: to deliver faster without more throughput, cut work-in-process. (\"Stop starting, start finishing.\")",
    "Utilization ρ = λ/µ must stay below 1 for stability, and queue length scales like ρ/(1−ρ) — so waits explode nonlinearly as ρ → 1. Going 90% → 99% busy makes the line ~10× longer.",
    "A multi-stage system's throughput equals its slowest stage's capacity (the bottleneck); improving any non-bottleneck does nothing — the heart of the Theory of Constraints.",
    "Slack is not waste: in any variable system, unused capacity is the buffer that keeps waits short. Run ERs, runways, and CPUs near 85%, not 100%.",
    "Operations research is the science of optimizing systems under constraints — its optimization arm includes linear programming (optimum at a corner) and EOQ (order-size sweet spot).",
    "The interview move is fluency in all three directions of L = λ·W plus bottleneck-first reasoning: to speed up a system, find the constraint and work only on that.",
  ],
};
