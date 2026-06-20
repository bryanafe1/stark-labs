import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  // SOLUTION:
  // Net available time per shift = 480 min gross - 2*15 min breaks - 20 min cleanup = 430 min/shift.
  // Two shifts/day => 2 * 430 = 860 min/day. Five days/week => 4300 min/week.
  // Weekly demand = 5160 units/week. Takt = available time / demand = 4300 / 5160 = 0.8333 min/unit = 50 s/unit.
  // Answer requested in seconds per unit: 0.8333 min * 60 = 50.0 s/unit.
  {
    id: "ie_takt_time",
    slug: "industrial-takt-time-basic",
    title: "Pacing a Two-Shift Cell to Weekly Demand",
    prompt:
      "A cell runs two shifts per day, five days per week. Each shift is scheduled for 480 minutes, but operators take two 15-minute breaks and the cell loses 20 minutes per shift to startup and cleanup that cannot be used for production.\n\nThe product family must ship 5160 good units per week.\n\nDetermine the pace at which one unit must leave the cell to exactly meet demand. Report the answer in seconds per unit, rounded to the nearest 0.1 s.",
    discipline: "INDUSTRIAL",
    difficulty: "MEDIUM",
    eloWeight: 20,
    tags: ["takt-time", "lean", "capacity"],
    skillAreas: ["manufacturing"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 50,
    tolerance: 0.5,
    unit: "s/unit",
    hints: [
      "Takt time is net available production time divided by customer demand over the same period. Both must cover the same window (a full week here).",
      "Build up the net available minutes per shift by subtracting every non-producing minute from the gross 480, then scale up by shifts per day and days per week.",
      "Once you have weekly available minutes and weekly demand, divide to get minutes per unit, then convert to seconds.",
    ],
    solution:
      "**Governing principle — Takt time.** Takt is the rhythm of customer demand: the *net available production time* divided by the *customer demand* over the **same** window. It applies here because we want the pace at which one unit must leave the cell to exactly meet demand, with no over- or under-production. The trap is mismatching the time window or forgetting to strip out non-producing minutes.\n\n" +
      "**Step 1 — Net available time per shift.** Start from the gross 480 min and remove every minute that cannot be used for production:\n" +
      "$$480 - 2(15) - 20 = 480 - 30 - 20 = 430 \\text{ min/shift}$$\n\n" +
      "**Step 2 — Scale to a full week.** Two shifts/day, five days/week, so both numerator and denominator cover the same weekly window:\n" +
      "$$430 \\times 2 \\times 5 = 4300 \\text{ min/week available}$$\n\n" +
      "**Step 3 — Apply the takt relation.** With weekly demand $D = 5160$ units:\n" +
      "$$\\text{Takt} = \\frac{\\text{available time}}{\\text{demand}} = \\frac{4300 \\text{ min}}{5160 \\text{ units}} = 0.8333 \\text{ min/unit}$$\n\n" +
      "**Step 4 — Convert to seconds.** $0.8333 \\text{ min} \\times 60 = 50.0 \\text{ s/unit}$.\n\n" +
      "**Key insight:** Takt is set by demand and *available* time, never by how fast the machines *can* go — that is cycle time. Using the gross 480 min would understate takt and pace the cell too fast.\n\n" +
      "**Final answer: 50.0 s/unit.**",
  },
  // SOLUTION:
  // ρ = λ/µ. Doubling λ from 8 to 16 while µ = 20 gives ρ = 0.40 -> 0.80.
  // For M/M/1, expected number in system L = ρ/(1-ρ).
  // At ρ=0.40: L = 0.40/0.60 = 0.667. At ρ=0.80: L = 0.80/0.20 = 4.0.
  // The point: WIP/wait grows nonlinearly; doubling arrivals multiplies WIP by 6x, not 2x.
  // Correct choice: utilization doubles (0.40->0.80) but average number in system rises ~6x, because congestion explodes as ρ->1.
  {
    id: "ie_utilization",
    slug: "industrial-server-utilization",
    title: "Why Doubling Arrivals Is Not Twice the Pain",
    prompt:
      "A single-server station (exponential arrivals and service, M/M/1) currently sees 8 arrivals per hour and can serve 20 per hour. Management expects demand to double to 16 arrivals per hour next quarter; service capacity is unchanged.\n\nWhich statement most accurately describes what happens to the server utilization and the average number of jobs in the system?",
    discipline: "INDUSTRIAL",
    difficulty: "HARD",
    eloWeight: 27,
    tags: ["queueing", "utilization", "congestion"],
    skillAreas: ["operations-research"],
    evaluationMode: "MULTIPLE_CHOICE",
    choices: [
      {
        id: "a",
        label:
          "Utilization doubles to 0.80 and the average number in system also doubles, from about 0.67 to about 1.33 jobs.",
      },
      {
        id: "b",
        label:
          "Utilization doubles to 0.80 and the average number in system rises about six-fold, from roughly 0.67 to about 4 jobs.",
        correct: true,
      },
      {
        id: "c",
        label:
          "Utilization quadruples to 1.60, so the system becomes unstable and no steady state exists.",
      },
      {
        id: "d",
        label:
          "Utilization rises to 0.80 but the average number in system is unchanged because service rate is unchanged.",
      },
    ],
    hints: [
      "Utilization for a single server is the arrival rate divided by the service rate. That part is linear in arrivals.",
      "For M/M/1, the average number in system is rho/(1 - rho). Notice the (1 - rho) in the denominator drives nonlinear growth as rho approaches 1.",
      "Compute the number in system at both rho = 0.40 and rho = 0.80 and compare the ratio to the ratio of the utilizations.",
    ],
    solution:
      "**Governing principle — M/M/1 queueing.** For a single-server station with Poisson arrivals and exponential service, two facts drive the answer: utilization $\\rho = \\lambda/\\mu$ is *linear* in arrivals, but the average number in system $L = \\rho/(1-\\rho)$ is *nonlinear* and blows up as $\\rho \\to 1$. The whole point of the problem is to see that doubling arrivals does not double the pain.\n\n" +
      "**Step 1 — Utilization at both demand levels.** Service rate $\\mu = 20$/h is fixed.\n" +
      "$$\\rho_{\\text{now}} = \\frac{8}{20} = 0.40, \\qquad \\rho_{\\text{next}} = \\frac{16}{20} = 0.80$$\n" +
      "Utilization exactly doubles, $0.40 \\to 0.80$ — and stays below 1, so a steady state still exists (kills choice C).\n\n" +
      "**Step 2 — Average number in system, $L = \\rho/(1-\\rho)$.**\n" +
      "$$L_{0.40} = \\frac{0.40}{1-0.40} = \\frac{0.40}{0.60} = 0.667$$\n" +
      "$$L_{0.80} = \\frac{0.80}{1-0.80} = \\frac{0.80}{0.20} = 4.0$$\n\n" +
      "**Step 3 — Compare the ratios.** Utilization ratio $= 2\\times$; number-in-system ratio $= 4.0/0.667 \\approx 6\\times$. The $(1-\\rho)$ denominator shrinks from 0.60 to 0.20, amplifying congestion.\n\n" +
      "**Why the distractors fail:** (A) wrongly assumes $L$ scales linearly like $\\rho$. (C) confuses doubling $\\lambda$ with doubling $\\rho$ — $\\rho=0.80<1$, still stable. (D) ignores that $L$ depends on $\\rho$, not on $\\mu$ alone.\n\n" +
      "**Key insight:** Congestion is governed by *headroom* $(1-\\rho)$, not by the raw arrival count. This is why stations near full utilization are so fragile.\n\n" +
      "**Final answer: Choice B — utilization doubles to 0.80 while the average number in system rises about six-fold, from ~0.67 to ~4 jobs.**",
  },
  // SOLUTION:
  // Little's Law L = λ·W applied to a stable system.
  // Throughput (departure rate = arrival rate in steady state) = 360 units/8 h = 45 units/h.
  // Observed average WIP on the floor L = 30 units.
  // Solve for flow time W = L/λ = 30/45 = 0.6667 h = 40 minutes.
  // Answer in minutes: 40.
  {
    id: "ie_littles_law",
    slug: "industrial-littles-law-wip",
    title: "Back Out Flow Time from a Floor Count",
    prompt:
      "Over a steady 8-hour shift a fabrication area completes 360 units. A walk-the-floor count finds, on average, 30 units physically in process (waiting plus being worked) at any instant.\n\nThe system is stable: output rate equals input rate. Estimate the average time a unit spends in the area from entry to exit.\n\nReport the answer in minutes, rounded to the nearest minute.",
    discipline: "INDUSTRIAL",
    difficulty: "MEDIUM",
    eloWeight: 21,
    tags: ["littles-law", "cycle-time", "wip"],
    skillAreas: ["operations-research"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 40,
    tolerance: 1,
    unit: "min",
    hints: [
      "Little's Law ties together the average inventory in a system, the throughput rate, and the average time each item spends inside.",
      "In steady state, throughput equals the completion rate. Convert the shift's output into a per-hour rate before applying the law.",
      "Solve the law for flow time (inventory divided by throughput), then convert the result from hours to minutes.",
    ],
    solution:
      "**Governing principle — Little's Law.** For any *stable* system, $L = \\lambda \\cdot W$, where $L$ is the average inventory (WIP), $\\lambda$ is the throughput rate, and $W$ is the average time an item spends inside. It applies here because the area is in steady state (output rate = input rate) and we are told both $L$ and the completion count. The beauty of the law is that it needs no detail about the process inside — only the three aggregate quantities.\n\n" +
      "**Step 1 — Throughput $\\lambda$.** In steady state, departure rate = arrival rate, so use the completion rate:\n" +
      "$$\\lambda = \\frac{360 \\text{ units}}{8 \\text{ h}} = 45 \\text{ units/h}$$\n\n" +
      "**Step 2 — Average WIP $L$.** Given by the floor count: $L = 30$ units.\n\n" +
      "**Step 3 — Solve Little's Law for flow time $W$.**\n" +
      "$$W = \\frac{L}{\\lambda} = \\frac{30}{45} = 0.6667 \\text{ h}$$\n\n" +
      "**Step 4 — Convert to minutes.** $0.6667 \\text{ h} \\times 60 = 40 \\text{ min}$.\n\n" +
      "**Key insight / trap:** Do not divide the 30 units by the 360 completed units — that is dimensionally meaningless. Throughput must be a *rate* (units per unit time), so convert the shift output to units/h first.\n\n" +
      "**Final answer: 40 min.**",
  },
  // SOLUTION:
  // Effective per-station capacities accounting for stated losses:
  //  S1: 60 units/h.
  //  S2: rated 50 but down 10% of time => 50*0.90 = 45 units/h.
  //  S3: 55 units/h but 2 parallel? No - single. Scrap 8% downstream not affecting its rate; rate 55.
  //  S4: rated 48 units/h.
  // Bottleneck = min(60, 45, 55, 48) = 45 units/h => this is the line capacity of GOOD+bad flow at S4?
  // Wait: define throughput limited by slowest effective station = 45 units/h (Station 2).
  // But Station 3 scraps 8% of what passes; final good output = bottleneck feed adjusted.
  // Line good-output: bottleneck (S2) = 45/h enter S3; S3 scraps 8% => 45*0.92 = 41.4 good/h; S4 cap 48 ok.
  // Final good throughput = 41.4 units/h.
  {
    id: "ie_bottleneck_throughput",
    slug: "industrial-bottleneck-throughput",
    title: "Good-Unit Throughput Through a Constraint",
    prompt:
      "A serial line runs Station 1 -> Station 2 -> Station 3 -> Station 4. Rated rates are: S1 = 60 units/h; S2 = 50 units/h; S3 = 55 units/h; S4 = 48 units/h.\n\nStation 2 is only available 90% of the time (the rest is unplanned downtime). Station 3 scraps 8% of the parts that pass through it; scrapped parts are removed and do not continue.\n\nAssuming the line is fed without starving, determine the maximum sustainable rate of good finished units leaving Station 4.\n\nReport the answer in good units per hour, rounded to the nearest 0.1.",
    discipline: "INDUSTRIAL",
    difficulty: "HARD",
    eloWeight: 30,
    tags: ["bottleneck", "theory-of-constraints", "yield"],
    skillAreas: ["manufacturing", "operations-research"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 41.4,
    tolerance: 0.5,
    unit: "units/h",
    hints: [
      "First convert each station's rated rate into an effective rate by applying its own availability loss; scrap is handled separately from a rate reduction.",
      "The slowest effective station sets the pace of parts entering the line; identify which station that is.",
      "After the bottleneck sets the input rate, apply the downstream scrap fraction to convert parts-processed into good parts that survive to the end.",
    ],
    solution:
      "**Governing principle — Theory of Constraints + yield.** A serial line's sustainable rate is set by its slowest *effective* station (the bottleneck), and the final *good* output is that rate reduced by downstream yield losses. The two distinct effects — availability (a rate reducer) and scrap (a yield reducer) — must be applied in the right place, not lumped together.\n\n" +
      "**Step 1 — Effective rate of each station.** Apply each station's own availability loss to its rated rate:\n" +
      "- S1: $60$ units/h\n" +
      "- S2: $50 \\times 0.90 = 45$ units/h (down 10% of the time)\n" +
      "- S3: $55$ units/h (scrap is a yield issue, not a rate issue)\n" +
      "- S4: $48$ units/h\n\n" +
      "**Step 2 — Identify the bottleneck.** The slowest effective station sets the input pace:\n" +
      "$$\\min(60,\\ 45,\\ 55,\\ 48) = 45 \\text{ units/h} \\quad (\\text{Station 2})$$\n\n" +
      "**Step 3 — Apply downstream scrap.** Of the 45 parts/h that reach S3, 8% are scrapped and removed, so good parts surviving S3:\n" +
      "$$45 \\times (1 - 0.08) = 45 \\times 0.92 = 41.4 \\text{ good units/h}$$\n\n" +
      "**Step 4 — Check S4 is not a new constraint.** S4 only needs to handle the $\\le 45$ parts/h flowing to it; its capacity is 48/h $> 45$, so it does not starve or choke the flow.\n\n" +
      "**Key insight / trap:** Do not turn S3's 8% scrap into a rate cut on S3 (that would mis-rank the bottleneck), and do not apply scrap before the bottleneck. Availability shrinks a *rate*; scrap shrinks a *yield* downstream.\n\n" +
      "**Final answer: 41.4 good units/h.**",
  },
  // SOLUTION:
  // Shift planned production time = 8 h * 60 = 480 min; planned downtime (breaks) = 40 min => operating time = 440 min.
  // Availability A = operating/planned = 440/480 = 0.9167.
  // Ideal cycle time = 0.5 min/unit. Total count produced = 760 units.
  // Performance P = (ideal cycle * total count)/operating time = (0.5*760)/440 = 380/440 = 0.8636.
  // Quality Q = good/total = (760-38)/760 = 722/760 = 0.95.
  // OEE = A*P*Q = 0.9167*0.8636*0.95 = 0.7521 => 75.2%.
  {
    id: "ie_oee",
    slug: "industrial-overall-equipment-effectiveness",
    title: "OEE from Raw Shift Data",
    prompt:
      "Over an 8-hour shift, a machine is scheduled to run except for 40 minutes of planned breaks. During the run it produced 760 total pieces, of which 38 were defective. The machine's ideal cycle time is 0.5 minutes per piece.\n\nFrom these figures, compute the Overall Equipment Effectiveness (the product of availability, performance, and quality).\n\nReport the answer as a percentage rounded to 1 decimal place (for example, enter 75.0 for 75.0%).",
    discipline: "INDUSTRIAL",
    difficulty: "HARD",
    eloWeight: 31,
    tags: ["oee", "lean", "manufacturing"],
    skillAreas: ["manufacturing", "quality-systems"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 75.2,
    tolerance: 0.6,
    unit: "%",
    hints: [
      "OEE is the product of three fractions: availability, performance, and quality. Compute each on its own before multiplying.",
      "Availability compares operating time to planned production time; performance compares the ideal time the actual count should have taken to the operating time; quality compares good pieces to total pieces.",
      "Watch the denominators: performance uses operating time (after subtracting breaks), not the full shift. Multiply the three fractions and convert to a percentage.",
    ],
    solution:
      "**Governing principle — Overall Equipment Effectiveness.** $\\text{OEE} = A \\times P \\times Q$, the product of three loss buckets: Availability (time lost to stoppages), Performance (speed lost), and Quality (defects). The classic trap is using the wrong denominator for Performance — it must be *operating* time, not the full shift.\n\n" +
      "**Step 1 — Set up the time base.** Planned production time $= 8 \\times 60 = 480$ min. Subtract planned breaks: operating time $= 480 - 40 = 440$ min.\n\n" +
      "**Step 2 — Availability** $= \\dfrac{\\text{operating time}}{\\text{planned time}}$:\n" +
      "$$A = \\frac{440}{480} = 0.9167$$\n\n" +
      "**Step 3 — Performance** $= \\dfrac{\\text{ideal cycle} \\times \\text{total count}}{\\text{operating time}}$:\n" +
      "$$P = \\frac{0.5 \\times 760}{440} = \\frac{380}{440} = 0.8636$$\n\n" +
      "**Step 4 — Quality** $= \\dfrac{\\text{good pieces}}{\\text{total pieces}}$:\n" +
      "$$Q = \\frac{760 - 38}{760} = \\frac{722}{760} = 0.95$$\n\n" +
      "**Step 5 — Multiply.**\n" +
      "$$\\text{OEE} = 0.9167 \\times 0.8636 \\times 0.95 = 0.7521 \\approx 75.2\\%$$\n\n" +
      "**Key insight / trap:** Performance's denominator is the 440 min of operating time, *not* the 480 min shift — availability already accounted for the break loss. Double-counting it would understate Performance.\n\n" +
      "**Final answer: 75.2%.**",
  },
  // SOLUTION:
  // EOQ = sqrt(2 D S / H). D = 250 units/wk * 50 wk = 12,500 units/yr.
  // S = $80/order. Holding H = 20% of unit cost $30 = $6/unit/yr.
  // EOQ = sqrt(2*12500*80/6) = sqrt(2,000,000/6) = sqrt(333,333) = 577.35 units.
  // Number of orders per year N = D/EOQ = 12500/577.35 = 21.65 orders/yr.
  // Question asks number of orders per year, rounded to nearest whole = 22.
  {
    id: "ie_eoq",
    slug: "industrial-economic-order-quantity",
    title: "Order Frequency at the Economic Order Quantity",
    prompt:
      "A distributor sells 250 units per week and operates 50 weeks per year. Placing an order costs $80 regardless of size. Each unit costs $30, and the firm charges inventory holding at 20% of unit cost per year.\n\nIf the firm orders in the quantity that minimizes total ordering-plus-holding cost, how many orders will it place per year?\n\nReport the answer rounded to the nearest whole number of orders.",
    discipline: "INDUSTRIAL",
    difficulty: "HARD",
    eloWeight: 29,
    tags: ["eoq", "inventory", "optimization"],
    skillAreas: ["operations-research"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 22,
    tolerance: 1,
    unit: "orders",
    hints: [
      "The economic order quantity minimizes ordering plus holding cost and depends on annual demand, fixed cost per order, and annual holding cost per unit.",
      "Two inputs are not handed to you directly: convert weekly demand to annual demand, and turn the percentage holding charge on unit cost into a dollar holding cost per unit per year.",
      "After finding the optimal order size, the number of orders per year is annual demand divided by that order quantity; round to a whole number.",
    ],
    solution:
      "**Governing principle — Economic Order Quantity (EOQ).** Balancing ordering cost (favors big, rare orders) against holding cost (favors small, frequent orders) gives the cost-minimizing lot size $Q^* = \\sqrt{\\dfrac{2DS}{H}}$. The two traps are unit mismatch (weekly vs. annual demand) and forgetting that $H$ is a *dollar* cost, derived from the percentage charge.\n\n" +
      "**Step 1 — Annual demand $D$.** Convert weekly to annual:\n" +
      "$$D = 250 \\text{ units/wk} \\times 50 \\text{ wk} = 12{,}500 \\text{ units/yr}$$\n\n" +
      "**Step 2 — Holding cost $H$ in dollars.** 20% of the \\$30 unit cost:\n" +
      "$$H = 0.20 \\times 30 = \\$6 \\text{ /unit/yr}, \\qquad S = \\$80 \\text{ /order}$$\n\n" +
      "**Step 3 — EOQ.**\n" +
      "$$Q^* = \\sqrt{\\frac{2DS}{H}} = \\sqrt{\\frac{2(12{,}500)(80)}{6}} = \\sqrt{\\frac{2{,}000{,}000}{6}} = \\sqrt{333{,}333} \\approx 577.35 \\text{ units}$$\n\n" +
      "**Step 4 — Orders per year.**\n" +
      "$$N = \\frac{D}{Q^*} = \\frac{12{,}500}{577.35} = 21.65 \\approx 22 \\text{ orders/yr}$$\n\n" +
      "**Key insight / trap:** The question asks for *order frequency*, not the lot size — students often stop at 577. Also note the EOQ formula tolerates rounding: being slightly off $Q^*$ barely changes total cost (the cost curve is flat near the optimum).\n\n" +
      "**Final answer: 22 orders/yr.**",
  },
  // SOLUTION:
  // Reorder point ROP = (demand during lead time) + safety stock.
  // Mean demand = 200 units/day; lead time = 4 days => mean LT demand = 800 units.
  // Daily demand std = 25 units/day; over 4 days (independent), sigma_LT = 25*sqrt(4) = 50 units.
  // 97.5% cycle service level => z = 1.96 (one-sided, area to left 0.975).
  // Safety stock = z*sigma_LT = 1.96*50 = 98 units.
  // ROP = 800 + 98 = 898 units.
  {
    id: "ie_reorder_point",
    slug: "industrial-reorder-point-safety-stock",
    title: "Reorder Point for a Target Service Level",
    prompt:
      "An item has daily demand that is independent across days with a mean of 200 units and a standard deviation of 25 units. Replenishment lead time is a fixed 4 days. Management wants a 97.5% cycle service level (the probability of not stocking out during a replenishment cycle).\n\nDetermine the inventory level at which a new order should be placed.\n\nReport the answer in units, rounded to the nearest unit.",
    discipline: "INDUSTRIAL",
    difficulty: "EXPERT",
    eloWeight: 36,
    tags: ["reorder-point", "safety-stock", "service-level"],
    skillAreas: ["operations-research"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 898,
    tolerance: 6,
    unit: "units",
    hints: [
      "The reorder point covers expected demand during the lead time plus a safety buffer sized to the desired service level.",
      "Because demand is independent across days, the standard deviation over the lead time scales with the square root of the number of lead-time days, not with the number of days directly.",
      "A 97.5% one-sided service level corresponds to a specific z multiplier from the normal table; multiply it by the lead-time standard deviation for safety stock, then add the mean lead-time demand.",
    ],
    solution:
      "**Governing principle — Reorder point with safety stock.** $\\text{ROP} = \\mu_{LT} + z\\,\\sigma_{LT}$: cover the *expected* demand over the lead time, plus a buffer sized to the desired service level. Because demand is random and independent across days, the lead-time variability scales with $\\sqrt{L}$, not $L$ — the central trap.\n\n" +
      "**Step 1 — Mean demand over lead time.** Daily mean 200, lead time $L = 4$ days:\n" +
      "$$\\mu_{LT} = 200 \\times 4 = 800 \\text{ units}$$\n\n" +
      "**Step 2 — Standard deviation over lead time.** With independent days, variances add, so $\\sigma_{LT} = \\sigma_d \\sqrt{L}$:\n" +
      "$$\\sigma_{LT} = 25 \\times \\sqrt{4} = 25 \\times 2 = 50 \\text{ units}$$\n\n" +
      "**Step 3 — z for 97.5% service level.** A 97.5% one-sided cycle service level means area to the left $= 0.975$, so from the standard normal table:\n" +
      "$$z = 1.96$$\n\n" +
      "**Step 4 — Safety stock and ROP.**\n" +
      "$$SS = z\\,\\sigma_{LT} = 1.96 \\times 50 = 98 \\text{ units}$$\n" +
      "$$\\text{ROP} = \\mu_{LT} + SS = 800 + 98 = 898 \\text{ units}$$\n\n" +
      "**Key insight / trap:** Do not multiply the daily $\\sigma$ by 4 — that would give 100 and overstate the buffer. The $\\sqrt{4}=2$ scaling reflects the smoothing of independent daily fluctuations over the lead time.\n\n" +
      "**Final answer: 898 units.**",
  },
  // SOLUTION:
  // 85% learning curve: b = ln(0.85)/ln(2) = -0.2345.
  // T1 = 50 h. T_n = T1 * n^b.
  // Need cumulative time for units 1..8 then average, OR specific unit?
  // Ask: total labor hours for the first 8 units.
  // T1=50.
  // T2 = 50*2^b = 50*0.85 = 42.5
  // T3 = 50*3^-0.2345 = 50*exp(-0.2345*ln3)=50*exp(-0.2576)=50*0.7729=38.64
  // T4 = 50*0.85^2... 4^b = (2^b)^2 =0.7225 =>50*0.7225=36.125
  // T5 = 50*5^-0.2345 = 50*exp(-0.2345*1.6094)=50*exp(-0.3774)=50*0.6857=34.28
  // T6 = 50*6^-0.2345 = 50*exp(-0.2345*1.7918)=50*exp(-0.4202)=50*0.6569=32.85
  // T7 = 50*7^-0.2345 = 50*exp(-0.2345*1.9459)=50*exp(-0.4563)=50*0.6336=31.68
  // T8 = 50*8^b = 50*(2^b)^3 = 50*0.85^3 = 50*0.614125 = 30.706
  // Sum = 50+42.5+38.64+36.125+34.28+32.85+31.68+30.706 = 296.78 h.
  // Let me re-add: 50+42.5=92.5; +38.64=131.14; +36.125=167.265; +34.28=201.545; +32.85=234.395; +31.68=266.075; +30.706=296.78.
  // Total ~296.8 h.
  {
    id: "ie_learning_curve",
    slug: "industrial-learning-curve-unit-time",
    title: "Total Labor for a Pilot Build Under Learning",
    prompt:
      "A new assembly follows an 85% learning curve: every time cumulative output doubles, the labor hours per unit fall to 85% of the prior level. The very first unit takes 50 labor-hours, and unit times follow a power law in the cumulative unit number.\n\nEstimate the total labor hours required to build the first 8 units (the pilot lot).\n\nReport the answer in labor-hours, rounded to the nearest whole number.",
    discipline: "INDUSTRIAL",
    difficulty: "EXPERT",
    eloWeight: 35,
    tags: ["learning-curve", "manufacturing", "estimation"],
    skillAreas: ["manufacturing"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 297,
    tolerance: 3,
    unit: "labor-hours",
    hints: [
      "The time for the nth unit follows T_n = T_1 * n^b, where the exponent b comes from the learning rate, not from the rate itself.",
      "Find b from the doubling condition: at twice the cumulative output the unit time is 0.85 of before, so b = ln(0.85)/ln(2), a negative number.",
      "You need the cumulative total, so compute the individual unit times for units 1 through 8 and sum them; it is not simply 8 times the first unit nor 8 times the average of the first and eighth.",
    ],
    solution:
      "**Governing principle — Learning curve (Wright's model).** Unit time follows a power law $T_n = T_1\\, n^{b}$, where doubling cumulative output multiplies unit time by the learning rate (here 0.85). To get the lot total you must *sum the individual unit times* — there is no shortcut like $8\\times T_1$.\n\n" +
      "**Step 1 — Find the exponent $b$.** At doubled output the unit time is 0.85 of before, so $2^{b} = 0.85$:\n" +
      "$$b = \\frac{\\ln 0.85}{\\ln 2} = \\frac{-0.16252}{0.69315} = -0.2345$$\n\n" +
      "**Step 2 — Compute each unit time** $T_n = 50\\, n^{-0.2345}$ (doubling points use $\\times 0.85$ directly):\n" +
      "- $T_1 = 50.00$\n" +
      "- $T_2 = 50 \\times 0.85 = 42.50$\n" +
      "- $T_3 = 50 \\times 3^{-0.2345} = 38.64$\n" +
      "- $T_4 = 50 \\times 0.85^2 = 36.13$\n" +
      "- $T_5 = 50 \\times 5^{-0.2345} = 34.28$\n" +
      "- $T_6 = 50 \\times 6^{-0.2345} = 32.85$\n" +
      "- $T_7 = 50 \\times 7^{-0.2345} = 31.68$\n" +
      "- $T_8 = 50 \\times 0.85^3 = 30.71$\n\n" +
      "**Step 3 — Sum the lot.**\n" +
      "$$50 + 42.50 + 38.64 + 36.13 + 34.28 + 32.85 + 31.68 + 30.71 = 296.8 \\text{ labor-hours}$$\n\n" +
      "**Key insight / trap:** $8 \\times T_1 = 400$ ignores learning entirely; $8 \\times$ the average of $T_1$ and $T_8$ ($\\approx 323$) is also wrong because the curve is convex, not linear. You must sum unit-by-unit (or use a cumulative-total factor).\n\n" +
      "**Final answer: ≈ 297 labor-hours.**",
  },
  // SOLUTION:
  // Cp = (USL-LSL)/(6σ); Cpk = min[(USL-μ)/(3σ),(μ-LSL)/(3σ)].
  // Given Cp=1.50, Cpk=0.80 => process is precise (tight spread vs spec) but off-center.
  // Off-center => one tail produces nonconforming. With Cpk=0.80, the nearest spec is only
  // 0.80*3σ = 2.4σ from μ; that tail fraction ≈ Φ(-2.4) = 0.0082 = 0.82% => ~8200 ppm out on that side.
  // The conceptual judgment: re-center to recover most capability (could reach ~Cpk≈1.5 if centered).
  // Correct choice: spread is fine, mean off-center; recentering would raise Cpk toward Cp (~1.5).
  {
    id: "ie_process_capability",
    slug: "industrial-process-capability-cp-cpk",
    title: "Diagnosing a Capable-but-Drifted Process",
    prompt:
      "A machined dimension has Cp = 1.50 but Cpk = 0.80. The process distribution is approximately normal and the spread (sigma) is stable.\n\nWhich statement is the most accurate engineering interpretation and the right first corrective action?",
    discipline: "INDUSTRIAL",
    difficulty: "MEDIUM",
    eloWeight: 24,
    tags: ["process-capability", "cp-cpk", "spc"],
    skillAreas: ["quality-systems"],
    evaluationMode: "MULTIPLE_CHOICE",
    choices: [
      {
        id: "a",
        label:
          "The spread is comfortably tight for the tolerance, but the mean has drifted off-center; recentering the process alone could raise Cpk toward 1.5 without reducing variation.",
        correct: true,
      },
      {
        id: "b",
        label:
          "The process variation is far too large for the tolerance; the only fix is to reduce sigma, since centering cannot help.",
      },
      {
        id: "c",
        label:
          "Because Cp exceeds 1.33 the process is fully capable and is producing essentially zero defects, so no action is needed.",
      },
      {
        id: "d",
        label:
          "Cpk cannot be smaller than Cp, so the gauge or the calculation must be wrong and the data should be discarded.",
      },
    ],
    hints: [
      "Cp measures only the spread of the process against the tolerance width; Cpk measures spread and centering together, so it is penalized when the mean drifts toward one limit.",
      "When Cpk is well below Cp, the spread is acceptable but the mean is off-center. Centering does not change sigma, so it cannot change Cp, but it can raise Cpk.",
      "Think about the ceiling: if you perfectly center a process, Cpk rises to equal Cp. Which corrective action follows from that?",
    ],
    solution:
      "**Governing principle — Capability indices.** $C_p = \\dfrac{USL - LSL}{6\\sigma}$ measures *spread only*; $C_{pk} = \\min\\!\\left(\\dfrac{USL-\\mu}{3\\sigma},\\ \\dfrac{\\mu-LSL}{3\\sigma}\\right)$ measures spread *and* centering. The gap between them is a centering diagnostic.\n\n" +
      "**Step 1 — Read the spread from $C_p$.** $C_p = 1.50$ means the tolerance is $9\\sigma$ wide ($6\\sigma \\times 1.5$). The process is comfortably narrow relative to spec — variation is *not* the problem.\n\n" +
      "**Step 2 — Read the centering from the gap.** Always $C_{pk} \\le C_p$. Here $C_{pk} = 0.80 \\ll 1.50$, so the mean has drifted toward one limit. The nearest spec sits only $0.80 \\times 3\\sigma = 2.4\\sigma$ from $\\mu$, giving a tail $\\approx \\Phi(-2.4) = 0.0082$ ($\\sim 8200$ ppm) on that side.\n\n" +
      "**Step 3 — Choose the corrective action.** Centering shifts $\\mu$ but does **not** change $\\sigma$, so $C_p$ stays 1.50 while $C_{pk}$ rises toward $C_p$. Re-centering alone could lift $C_{pk}$ to ~1.5 — the cheapest, fastest fix.\n\n" +
      "**Why the distractors fail:** (B) says reduce $\\sigma$, but $C_p=1.5$ shows variation is already fine. (C) claims no action needed, but $C_{pk}=0.80$ means real defects are escaping. (D) is false — $C_{pk}$ is *supposed* to be $\\le C_p$; an off-center mean is exactly why.\n\n" +
      "**Key insight:** $C_p$ is the *ceiling* $C_{pk}$ can reach. A large $C_p - C_{pk}$ gap always points to centering, never to variation.\n\n" +
      "**Final answer: Choice A — the spread is fine, the mean is off-center, and recentering alone could raise $C_{pk}$ toward 1.5 without reducing variation.**",
  },
  // SOLUTION:
  // Two sub-audits must be combined before computing DPMO.
  //  Line A: 30,000 units, 6 opportunities each => 180,000 opportunities; 900 defects.
  //  Line B: 20,000 units, 5 opportunities each => 100,000 opportunities; 300 defects.
  // Pooled: total defects = 900 + 300 = 1,200; total opportunities = 180,000 + 100,000 = 280,000.
  // DPO = 1200/280000 = 0.0042857. DPMO = DPO*1e6 = 4285.7 => 4286 DPMO.
  // (Trap: averaging the two lines' DPMO or using a single opportunity count gives the wrong value.)
  {
    id: "ie_dpmo",
    slug: "industrial-dpmo-sigma-level",
    title: "From Inspection Counts to DPMO",
    prompt:
      "A quality audit covers two production lines that feed the same product. Line A: 30,000 units inspected, 6 independent defect opportunities per unit, 900 defects found. Line B: 20,000 units inspected, 5 independent defect opportunities per unit, 300 defects found.\n\nTreating the two lines as one combined process, compute the overall defects-per-million-opportunities (DPMO).\n\nReport the answer in DPMO, rounded to the nearest whole number.",
    discipline: "INDUSTRIAL",
    difficulty: "MEDIUM",
    eloWeight: 22,
    tags: ["dpmo", "six-sigma", "quality"],
    skillAreas: ["quality-systems"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 4286,
    tolerance: 40,
    unit: "DPMO",
    hints: [
      "DPMO is defects divided by total opportunities, scaled to one million. The total number of opportunities is units times opportunities-per-unit.",
      "Pool the two lines correctly: add the defects together and add the opportunity counts together before dividing. Do not average the two lines' DPMO values.",
      "Each line contributes a different opportunity count because both the unit count and opportunities-per-unit differ; compute each line's opportunities, sum, then divide total defects by total opportunities and multiply by one million.",
    ],
    solution:
      "**Governing principle — DPMO.** Defects-Per-Million-Opportunities $= \\dfrac{\\text{defects}}{\\text{total opportunities}} \\times 10^6$, where total opportunities $=$ units $\\times$ opportunities-per-unit. To combine two processes you must *pool the raw counts*, not average their rates — averaging two DPMO values weighted equally ignores their different sizes.\n\n" +
      "**Step 1 — Opportunities per line** (units $\\times$ opps/unit):\n" +
      "$$\\text{Line A: } 30{,}000 \\times 6 = 180{,}000$$\n" +
      "$$\\text{Line B: } 20{,}000 \\times 5 = 100{,}000$$\n\n" +
      "**Step 2 — Pool defects and opportunities.**\n" +
      "$$\\text{Total defects} = 900 + 300 = 1{,}200$$\n" +
      "$$\\text{Total opportunities} = 180{,}000 + 100{,}000 = 280{,}000$$\n\n" +
      "**Step 3 — Compute DPO, then DPMO.**\n" +
      "$$DPO = \\frac{1{,}200}{280{,}000} = 0.0042857$$\n" +
      "$$DPMO = 0.0042857 \\times 10^6 = 4285.7 \\approx 4286$$\n\n" +
      "**Key insight / trap:** Computing each line's DPMO (A = 5000, B = 3000) and averaging to 4000 is **wrong** — the lines have different opportunity totals, so the pooled value is a size-weighted blend, not a simple mean. Always pool numerators and denominators separately.\n\n" +
      "**Final answer: 4286 DPMO.**",
  },
  // SOLUTION:
  // X-bar control chart limits: UCL/LCL = x_doublebar ± A2 * R-bar  OR  ± 3*sigma/sqrt(n).
  // Given grand mean = 100.0 mm, average range R-bar = 4.0 mm, subgroup size n = 5.
  // For n=5, A2 = 0.577 (standard SPC constant).
  // UCL = 100 + 0.577*4 = 100 + 2.308 = 102.308 mm.
  // Question asks UCL (upper control limit) of the X-bar chart.
  // Answer = 102.31 mm.
  {
    id: "ie_control_chart",
    slug: "industrial-control-chart-limits",
    title: "Upper Control Limit of an X-bar Chart",
    prompt:
      "An X-bar / R control chart is built from subgroups of size 5. The grand average of the subgroup means is 100.0 mm, and the average subgroup range is 4.0 mm.\n\nUsing standard Shewhart control-chart constants, compute the upper control limit for the subgroup-mean (X-bar) chart.\n\nReport the answer in millimeters, rounded to 2 decimal places.",
    discipline: "INDUSTRIAL",
    difficulty: "HARD",
    eloWeight: 28,
    tags: ["control-chart", "spc", "quality"],
    skillAreas: ["quality-systems"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 102.31,
    tolerance: 0.05,
    unit: "mm",
    hints: [
      "X-bar chart limits sit a fixed distance above and below the grand mean. The distance is built from the average range, not from a directly given sigma.",
      "Use the A2 form: control limit = grand mean +/- A2 times the average range. A2 is a Shewhart constant that depends on subgroup size.",
      "For a subgroup size of 5, look up the standard A2 value (about 0.577), then add A2 times the average range to the grand mean for the upper limit.",
    ],
    solution:
      "**Governing principle — Shewhart X-bar / R control limits.** The control limits sit $\\pm 3$ standard errors from the grand mean, but rather than estimating $\\sigma$ directly we use the average range and the tabulated constant $A_2$: $\\text{UCL} = \\bar{\\bar{x}} + A_2 \\bar{R}$. The $A_2$ form bakes in the $3\\sigma/\\sqrt{n}$ scaling and the $\\bar{R}\\to\\sigma$ conversion ($d_2$).\n\n" +
      "**Step 1 — Gather inputs.** Grand mean $\\bar{\\bar{x}} = 100.0$ mm, average range $\\bar{R} = 4.0$ mm, subgroup size $n = 5$.\n\n" +
      "**Step 2 — Look up $A_2$.** For $n = 5$, the standard Shewhart constant is $A_2 = 0.577$.\n\n" +
      "**Step 3 — Compute the UCL.**\n" +
      "$$\\text{UCL} = \\bar{\\bar{x}} + A_2 \\bar{R} = 100 + 0.577 \\times 4.0 = 100 + 2.308 = 102.308 \\text{ mm}$$\n\n" +
      "**Step 4 — Round.** $102.31$ mm (and symmetrically $\\text{LCL} = 100 - 2.308 = 97.69$ mm).\n\n" +
      "**Key insight / trap:** These are *control* limits (voice of the process from data), not *specification* limits (voice of the customer). Also, $A_2$ already includes the $\\sqrt{n}$ factor — do not divide $\\bar{R}$ by $\\sqrt{5}$ again.\n\n" +
      "**Final answer: 102.31 mm.**",
  },
  // SOLUTION:
  // Poisson process: defects arrive at mean λ = 3 per inspected panel.
  // P(at least 1 defect) = 1 - P(0) = 1 - e^{-3} = 1 - 0.049787 = 0.950213.
  // Answer 0.9502 (dimensionless probability).
  {
    id: "ie_poisson",
    slug: "industrial-poisson-defects",
    title: "Probability of a Defective Panel (Poisson)",
    prompt:
      "Surface defects on a coated panel occur randomly and independently at an average of 3 defects per panel.\n\nA panel is rejected if it has one or more defects. Determine the probability that a randomly chosen panel is rejected.\n\nReport the probability rounded to 4 decimal places (dimensionless).",
    discipline: "INDUSTRIAL",
    difficulty: "MEDIUM",
    eloWeight: 23,
    tags: ["poisson", "probability", "quality"],
    skillAreas: ["operations-research"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 0.9502,
    tolerance: 0.005,
    hints: [
      "Defect counts that occur randomly and independently at a known average follow a Poisson distribution with mean equal to that average.",
      "Rather than summing the probabilities of one, two, three, ... defects, use the complement: the probability of at least one is one minus the probability of exactly zero.",
      "The probability of exactly zero defects for a Poisson mean is e raised to the negative mean; subtract it from one.",
    ],
    solution:
      "**Governing principle — Poisson distribution.** Counts of rare, independent events occurring at a constant average rate follow Poisson: $P(X=k) = \\dfrac{\\lambda^k e^{-\\lambda}}{k!}$. Surface defects arriving randomly at a mean of 3 per panel fit this model exactly.\n\n" +
      "**Step 1 — Use the complement.** A panel is rejected with one *or more* defects. Rather than summing $P(1)+P(2)+\\cdots$, use:\n" +
      "$$P(X \\ge 1) = 1 - P(X = 0)$$\n\n" +
      "**Step 2 — Evaluate $P(X=0)$ for $\\lambda = 3$.**\n" +
      "$$P(X=0) = \\frac{3^0 e^{-3}}{0!} = e^{-3} = 0.049787$$\n\n" +
      "**Step 3 — Subtract from one.**\n" +
      "$$P(X \\ge 1) = 1 - 0.049787 = 0.950213 \\approx 0.9502$$\n\n" +
      "**Key insight / trap:** The complement turns an infinite sum into a single term — the standard move for \"at least one\" Poisson problems. Note $\\lambda = 3 > 1$ is fine; Poisson means need not be small.\n\n" +
      "**Final answer: 0.9502.**",
  },
  // SOLUTION:
  // Binomial acceptance sampling: lot fraction defective p = 0.05, sample n = 20, accept if <=1 defective.
  // P(accept) = P(X<=1) = P(0)+P(1).
  // P(0) = (0.95)^20 = 0.358486.
  // P(1) = 20*(0.05)*(0.95)^19 = 20*0.05*0.377354 = 1.0*0.377354... compute (0.95)^19 = 0.377354; *0.05=0.0188677; *20=0.377354.
  // P(accept) = 0.358486 + 0.377354 = 0.735840.
  // Answer 0.7358.
  {
    id: "ie_binomial",
    slug: "industrial-binomial-acceptance",
    title: "Acceptance Probability of a Sampling Plan",
    prompt:
      "An incoming lot is sampled with the plan: draw 20 items at random and accept the lot if at most 1 is defective. The supplier's true defect rate is 5%.\n\nDetermine the probability that a lot from this supplier is accepted.\n\nReport the probability rounded to 4 decimal places (dimensionless).",
    discipline: "INDUSTRIAL",
    difficulty: "HARD",
    eloWeight: 30,
    tags: ["binomial", "acceptance-sampling", "probability"],
    skillAreas: ["operations-research", "quality-systems"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 0.7358,
    tolerance: 0.005,
    hints: [
      "The number of defectives in a fixed sample drawn from a constant defect rate follows a binomial distribution with the sample size and the defect probability.",
      "Acceptance means at most one defective, so add the probability of exactly zero defectives to the probability of exactly one.",
      "The exactly-one term needs the count of ways to place one defective among the sample (the binomial coefficient), times the defect probability once, times the non-defect probability for the rest.",
    ],
    solution:
      "**Governing principle — Binomial acceptance sampling.** The number of defectives in $n$ independent draws at constant defect rate $p$ is binomial: $P(X=k) = \\binom{n}{k} p^k (1-p)^{n-k}$. The plan accepts on $X \\le 1$, so the acceptance probability is $P(0) + P(1)$.\n\n" +
      "**Step 1 — Parameters.** $n = 20$, $p = 0.05$, $1-p = 0.95$. Accept if $X \\le 1$.\n\n" +
      "**Step 2 — $P(X=0)$.**\n" +
      "$$P(0) = \\binom{20}{0}(0.05)^0(0.95)^{20} = (0.95)^{20} = 0.358486$$\n\n" +
      "**Step 3 — $P(X=1)$.**\n" +
      "$$P(1) = \\binom{20}{1}(0.05)^1(0.95)^{19} = 20 \\times 0.05 \\times 0.377354 = 0.377354$$\n\n" +
      "**Step 4 — Sum for acceptance.**\n" +
      "$$P(\\text{accept}) = P(0) + P(1) = 0.358486 + 0.377354 = 0.735840 \\approx 0.7358$$\n\n" +
      "**Key insight / trap:** Do not forget the $\\binom{20}{1}=20$ multiplier on the one-defective term — there are 20 distinct positions the lone defective could occupy. This single OC-curve point ($p=0.05 \\Rightarrow P_a \\approx 0.74$) shows the plan still accepts a 5%-defective lot most of the time.\n\n" +
      "**Final answer: 0.7358.**",
  },
  // SOLUTION:
  // Line balancing minimum stations with a non-integer ratio (ceiling matters).
  // Total work content = 9.6 min. Required cycle time (takt) = 480 min available / 320 units demand = 1.5 min/unit.
  // Raw ratio = work content / cycle time = 9.6 / 1.5 = 6.4 stations.
  // A fractional station is impossible, so the theoretical minimum is the ceiling: ceil(6.4) = 7 stations.
  // (Trap: reporting 6 by truncating/rounding down; 6 stations cannot absorb 9.6 min within 1.5-min cycles.)
  {
    id: "ie_line_balancing",
    slug: "industrial-line-balancing-stations",
    title: "Minimum Stations to Hit Takt",
    prompt:
      "An assembly job is divided into tasks whose times sum to 9.6 minutes of total work content, and no single task exceeds the cycle time. The line runs 480 productive minutes per shift and must complete 320 units per shift.\n\nIgnoring precedence constraints, determine the theoretical minimum number of workstations needed to keep up with demand.\n\nReport a whole number of workstations.",
    discipline: "INDUSTRIAL",
    difficulty: "EASY",
    eloWeight: 16,
    tags: ["line-balancing", "takt-time", "manufacturing"],
    skillAreas: ["manufacturing"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 7,
    tolerance: 0.4,
    unit: "stations",
    hints: [
      "First find the required cycle time from available time and demand; that sets how much work each station can hold per unit.",
      "The theoretical minimum number of stations is total work content divided by the cycle time, but stations come only in whole numbers.",
      "When that ratio is not a whole number, you must round up, because a fractional station cannot exist and rounding down would leave work that does not fit within the cycle.",
    ],
    solution:
      "**Governing principle — Line balancing (theoretical minimum stations).** The fewest stations needed is total work content divided by the cycle time, rounded *up*: $N_{\\min} = \\lceil \\sum t / C \\rceil$. Stations come only in whole numbers, and a fraction of a station cannot hold leftover work.\n\n" +
      "**Step 1 — Required cycle time.** From available time and demand:\n" +
      "$$C = \\frac{480 \\text{ min}}{320 \\text{ units}} = 1.5 \\text{ min/unit}$$\n\n" +
      "**Step 2 — Raw station ratio.** Total work content $\\sum t = 9.6$ min:\n" +
      "$$\\frac{\\sum t}{C} = \\frac{9.6}{1.5} = 6.4 \\text{ stations}$$\n\n" +
      "**Step 3 — Round up.** A fractional station is impossible, so:\n" +
      "$$N_{\\min} = \\lceil 6.4 \\rceil = 7 \\text{ stations}$$\n\n" +
      "**Key insight / trap:** You must take the *ceiling*, not round to nearest (which would also give 7 here, but consider 6.4 vs 6.1). Truncating to 6 fails: six stations offer only $6 \\times 1.5 = 9.0$ min of capacity per cycle, less than the 9.6 min of work required. Seven is the floor on station count; precedence constraints could only push it higher.\n\n" +
      "**Final answer: 7 stations.**",
  },
  // SOLUTION:
  // Hypothesis test decision via confidence interval / z reasoning.
  // Sample: n=36, sample mean x-bar = 49.4 mm, population sigma = 1.8 mm (known), target μ0 = 50.0 mm.
  // SE = sigma/sqrt(n) = 1.8/6 = 0.30 mm.
  // Test stat z = (49.4 - 50.0)/0.30 = -0.6/0.30 = -2.00.
  // Two-sided α = 0.05 => critical ±1.96. |z|=2.00 > 1.96 => reject H0 (mean differs from 50).
  // p-value two-sided = 2*Φ(-2.00) = 2*0.02275 = 0.0455 < 0.05 => reject.
  // Correct judgment: reject H0; the deviation is statistically significant at 5% (z=-2.0, p≈0.046).
  {
    id: "ie_hypothesis_test",
    slug: "industrial-hypothesis-test-decision",
    title: "Is the Process Mean Off Target?",
    prompt:
      "A target dimension is 50.0 mm. The process standard deviation is known to be 1.8 mm. A random sample of 36 parts has a mean of 49.4 mm.\n\nTesting, at the 5% significance level (two-sided), whether the true mean differs from 50.0 mm, what is the correct conclusion and why?",
    discipline: "INDUSTRIAL",
    difficulty: "HARD",
    eloWeight: 29,
    tags: ["hypothesis-test", "z-test", "statistics"],
    skillAreas: ["operations-research", "quality-systems"],
    evaluationMode: "MULTIPLE_CHOICE",
    choices: [
      {
        id: "a",
        label:
          "Reject the null hypothesis: the test statistic is z = -2.0, which is beyond the critical value of -1.96 (two-sided p ≈ 0.046), so the mean is significantly off target.",
        correct: true,
      },
      {
        id: "b",
        label:
          "Fail to reject: a 0.6 mm shift is small relative to the 1.8 mm standard deviation, so it is within normal variation.",
      },
      {
        id: "c",
        label:
          "Reject the null hypothesis because the sample mean is not exactly 50.0 mm, which by itself proves the process changed.",
      },
      {
        id: "d",
        label:
          "The test cannot be performed because the population is not confirmed normal and n is too small for the central limit theorem.",
      },
    ],
    hints: [
      "With a known population standard deviation, this is a z-test on the mean. The standard error of the sample mean shrinks with the square root of the sample size.",
      "Form the test statistic as the gap between sample mean and target, divided by the standard error, then compare its magnitude to the two-sided critical value.",
      "At 5% two-sided the critical value is about 1.96. Decide whether the computed statistic falls beyond it, and note that n = 36 is large enough for the central limit theorem.",
    ],
    solution:
      "**Governing principle — One-sample z-test on the mean.** With the population $\\sigma$ *known*, test $H_0: \\mu = 50.0$ vs. $H_1: \\mu \\ne 50.0$ using $z = \\dfrac{\\bar{x} - \\mu_0}{\\sigma/\\sqrt{n}}$. Compare $|z|$ to the two-sided critical value 1.96 at $\\alpha = 0.05$.\n\n" +
      "**Step 1 — Standard error.** $\\sigma = 1.8$, $n = 36$:\n" +
      "$$SE = \\frac{\\sigma}{\\sqrt{n}} = \\frac{1.8}{\\sqrt{36}} = \\frac{1.8}{6} = 0.30 \\text{ mm}$$\n\n" +
      "**Step 2 — Test statistic.** $\\bar{x} = 49.4$, $\\mu_0 = 50.0$:\n" +
      "$$z = \\frac{49.4 - 50.0}{0.30} = \\frac{-0.6}{0.30} = -2.00$$\n\n" +
      "**Step 3 — Compare to the critical value.** Two-sided $\\alpha = 0.05 \\Rightarrow z_{crit} = \\pm 1.96$. Since $|-2.00| = 2.00 > 1.96$, the statistic falls in the rejection region. Equivalently, the two-sided p-value $= 2\\,\\Phi(-2.00) = 2(0.02275) = 0.0455 < 0.05$.\n\n" +
      "**Step 4 — Conclude.** Reject $H_0$: the mean is significantly off target.\n\n" +
      "**Why the distractors fail:** (B) compares the shift to raw $\\sigma$, ignoring that the *sample mean's* SE shrinks by $\\sqrt{n}$ — a 0.6 mm shift is 2 SEs, not small. (C) is a logic error: a sample mean $\\ne 50$ never \"proves\" anything by itself; significance requires the test. (D) is wrong because $n=36$ is large enough for the CLT, so normality of the sampling distribution holds.\n\n" +
      "**Key insight:** Significance is about distance in *standard errors*, not in raw units — the $\\sqrt{n}$ shrinkage of the SE is what makes a modest shift detectable.\n\n" +
      "**Final answer: Choice A — reject $H_0$; $z = -2.0$ is beyond $-1.96$ (two-sided $p \\approx 0.046$), so the mean is significantly off target.**",
  },
  // SOLUTION:
  // z-score / normal percentile, two-sided spec, expected scrap.
  // Spec limits 49.0 to 51.0 mm. Process N(μ=50.2, σ=0.4).
  // Upper z = (51.0-50.2)/0.4 = 0.8/0.4 = 2.00 => P(>USL)=Φ(-2.00)=0.02275.
  // Lower z = (49.0-50.2)/0.4 = -1.2/0.4 = -3.00 => P(<LSL)=Φ(-3.00)=0.00135.
  // Fraction nonconforming = 0.02275+0.00135 = 0.02410 => 2.41% => 24,100 ppm.
  // Question asks expected percent of parts out of spec.
  // Answer = 2.41%.
  {
    id: "ie_zscore_scrap",
    slug: "industrial-zscore-fraction-nonconforming",
    title: "Expected Scrap from a Drifted Normal Process",
    prompt:
      "A part feature must lie between 49.0 mm and 51.0 mm. The process output is approximately normal with mean 50.2 mm and standard deviation 0.4 mm.\n\nEstimate the percentage of parts that will fall outside the specification limits (combining both tails).\n\nReport the answer as a percentage rounded to 2 decimal places (for example, 2.50 for 2.50%).",
    discipline: "INDUSTRIAL",
    difficulty: "EXPERT",
    eloWeight: 34,
    tags: ["z-score", "normal-distribution", "quality"],
    skillAreas: ["quality-systems", "operations-research"],
    evaluationMode: "NUMERIC_TOLERANCE",
    expectedValue: 2.41,
    tolerance: 0.1,
    unit: "%",
    hints: [
      "Because the mean sits off-center between the limits, the two tails are not equal. Treat each specification limit separately.",
      "Convert each limit to a z-score using (limit minus mean) divided by sigma, then find the tail area beyond each from the normal table.",
      "Add the upper-tail area beyond the USL to the lower-tail area below the LSL; that sum is the total fraction nonconforming, which you then express as a percentage.",
    ],
    solution:
      "**Governing principle — Normal tail areas (z-scores).** For a normal process, the fraction outside a spec limit is the standard-normal tail beyond that limit's z-score, $z = \\dfrac{x - \\mu}{\\sigma}$. Because the mean is *off-center* (50.2, not the midpoint 50.0), the two tails are unequal and must be evaluated separately.\n\n" +
      "**Step 1 — Upper limit z-score.** $USL = 51.0$, $\\mu = 50.2$, $\\sigma = 0.4$:\n" +
      "$$z_U = \\frac{51.0 - 50.2}{0.4} = \\frac{0.8}{0.4} = 2.00 \\;\\Rightarrow\\; P(X > USL) = \\Phi(-2.00) = 0.02275$$\n\n" +
      "**Step 2 — Lower limit z-score.** $LSL = 49.0$:\n" +
      "$$z_L = \\frac{49.0 - 50.2}{0.4} = \\frac{-1.2}{0.4} = -3.00 \\;\\Rightarrow\\; P(X < LSL) = \\Phi(-3.00) = 0.00135$$\n\n" +
      "**Step 3 — Add the two tails.**\n" +
      "$$P(\\text{out of spec}) = 0.02275 + 0.00135 = 0.02410 = 2.41\\%$$\n\n" +
      "**Key insight / trap:** Do not assume symmetric tails and double one side — the off-center mean makes the upper tail (2.0σ away) ~17× larger than the lower tail (3.0σ away). The drift toward the USL is where nearly all the scrap comes from; recentering would cut total nonconforming dramatically.\n\n" +
      "**Final answer: 2.41%.**",
  },
];
