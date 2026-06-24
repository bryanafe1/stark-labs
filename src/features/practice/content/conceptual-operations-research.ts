import type { PracticeProblem } from "../types";

export const problems: PracticeProblem[] = [
  {
    id: "operations_research_bottleneck_line",
    slug: "concept-operations-research-bottleneck-line",
    title: "The Bottleneck on a Four-Station Line",
    prompt: "A serial assembly line has four stations run back to back. Their processing times per unit are 30s, 45s, 60s, and 40s. Raw parts are always available at the front, and there is no buffer between stations.",
    discipline: "INDUSTRIAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["operations-research", "conceptual"],
    skillAreas: ["operations-research"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "What is the maximum throughput of this line, which station governs it, and why does adding effort or speeding up any other station not increase output?",
        rubric: "Identifies station 3 (60s) as the bottleneck because it is the slowest step. Computes max throughput as 1 unit per 60s = 60 units/hour, since a serial line can produce no faster than its slowest station. Explains that non-bottleneck stations have slack (idle time) and run starved or blocked, so improving them only adds idle time, not output. References Theory of Constraints: the system rate equals the constraint rate. Key insight: throughput of a serial system is set by the single slowest resource, so only the bottleneck dictates output.",
      },
      {
        prompt: "Now you cut station 3 from 60s to 35s with a process change, but you make no other changes. What happens to throughput, and where does the constraint move? What does this teach about repeated improvement?",
        rubric: "Recognizes station 2 (45s) becomes the new bottleneck once station 3 drops to 35s, so throughput rises to 1 per 45s = 80 units/hour, not unbounded. Notes the constraint moves rather than disappears, and that the gain is capped by the next-slowest station. Frames improvement as an iterative cycle: find the constraint, elevate it, then re-identify the new constraint (the TOC five-focusing-steps loop). Key insight: relieving a bottleneck just shifts the constraint elsewhere, so continuous improvement means repeatedly chasing the moving constraint.",
      },
    ],
  },
  {
    id: "operations_research_utilization_wait",
    slug: "concept-operations-research-utilization-wait",
    title: "Why a Busy Help Desk Explodes",
    prompt: "A single-server IT help desk handles tickets that arrive randomly and take variable time to resolve. Management is proud that the agent is busy 95 percent of the workday and wants to push toward 99 percent to look efficient.",
    discipline: "INDUSTRIAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["operations-research", "conceptual"],
    skillAreas: ["operations-research"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Explain to management why wait times do not grow linearly with utilization, and why running the agent at 95 to 99 percent busy produces disproportionately long ticket queues. What role does variability play?",
        rubric: "Explains nonlinear queue growth: as utilization rho approaches 1, expected wait blows up because the queue scales roughly with rho/(1-rho), so going from 0.95 to 0.99 multiplies the (1-rho) term from 0.05 to 0.01, a 5x worse wait. Notes that with no slack, any random burst of arrivals or long jobs has no idle time to recover into, so backlogs accumulate. Identifies variability (in both arrivals and service) as the driver: with zero variability you could load to 100 percent, but real randomness forces buffer capacity. Mentions the VUT or Kingman intuition that wait grows with variability and utilization. Key insight: queue length grows hyperbolically as utilization nears 100 percent, so high variability plus high utilization is what makes waits explode, not utilization alone.",
      },
      {
        prompt: "Now suppose you cannot reduce utilization, but you could either reduce the variability of ticket handling times or add a second agent (pooling the queue). Which lever helps more, and why?",
        rubric: "Notes both help, and reasons about magnitudes. Reducing service-time variability directly cuts the variability term in the wait formula (standardizing or scripting common tickets shrinks the coefficient of variation), lowering wait without more headcount. Pooling a second agent into one shared queue gives large gains via economies of scale: a single queue feeding multiple servers smooths randomness (a free server can absorb a long job), so an M/M/2 at the same utilization waits far less than two separate M/M/1 lines. Concludes pooling usually wins big when feasible because it both adds capacity and reduces effective variability, while variance reduction is the better move if headcount is fixed. Key insight: at fixed utilization you attack wait by cutting variability or by pooling servers into one queue, and pooling is powerful because shared capacity statistically smooths demand.",
      },
    ],
  },
  {
    id: "operations_research_lp_tradeoff",
    slug: "concept-operations-research-lp-tradeoff",
    title: "Reading a Production LP",
    prompt: "A factory maximizes profit by choosing how many units of two products to make, subject to limited machine hours and limited labor hours. The optimal solution is found by a linear program, and at the optimum machine hours are fully used but labor hours are not.",
    discipline: "INDUSTRIAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["operations-research", "conceptual"],
    skillAreas: ["operations-research"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Why does the optimal solution of a linear program land at a corner (vertex) of the feasible region, and what does it mean that machine hours are fully used but labor hours are not? What is the shadow price of each constraint telling you?",
        rubric: "Explains that a linear objective over a convex polytope attains its optimum at a vertex (extreme point), since improvement always pushes toward a boundary until constraints intersect. Identifies machine hours as a binding constraint (slack = 0) and labor as non-binding (positive slack, excess capacity). Defines shadow price as the marginal change in optimal profit per unit increase of a constraint right-hand side: machine hours have a positive shadow price (relaxing it raises profit), while labor has a shadow price of zero because there is leftover labor. Key insight: LP optima sit at vertices where binding constraints have positive shadow prices and slack constraints have zero shadow price, so only the binding (scarce) resources are worth buying more of.",
      },
      {
        prompt: "Now a supplier offers to sell you extra machine hours at a fixed price per hour. How do you decide whether to buy, and is the answer the same no matter how many extra hours you buy?",
        rubric: "Says to buy machine hours only while the shadow price (marginal value of an extra hour) exceeds the supplier price. Crucially notes the shadow price is constant only within a range (the right-hand-side sensitivity range); once enough machine hours are added, that constraint stops binding or a different constraint (like labor) becomes binding, and the shadow price drops, possibly to zero. So the decision is marginal and the answer changes after the allowable increase is exhausted. Mentions diminishing returns: keep buying until marginal value equals price or until the binding constraint changes. Key insight: extra capacity is worth buying only up to the shadow price, and that value holds only over a limited range before another constraint takes over, so capacity purchases face diminishing returns.",
      },
    ],
  },
  {
    id: "operations_research_littles_law",
    slug: "concept-operations-research-littles-law",
    title: "Littles Law in a Warehouse",
    prompt: "A fulfillment warehouse observes that on average 500 orders are in process (picked but not yet shipped) at any moment, and it ships an average of 100 orders per hour. The operations team wants to predict and improve how long an order spends inside the building.",
    discipline: "INDUSTRIAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["operations-research", "conceptual"],
    skillAreas: ["operations-research"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Using Littles Law, estimate the average time an order spends in the system, state the law plainly, and explain what assumptions make it valid here.",
        rubric: "States Littles Law as L = lambda * W, where L is average number in system, lambda is average throughput (arrival = departure rate in steady state), and W is average time in system. Solves W = L/lambda = 500/100 = 5 hours. Explains the key assumptions: the system is in steady state (stable, long-run average, arrivals roughly equal departures, no unbounded buildup), and it holds regardless of arrival distribution, service order, or internal structure. Key insight: Littles Law L = lambda * W ties inventory, throughput, and flow time together for any stable system, so knowing two of the three gives the third.",
      },
      {
        prompt: "Now the team doubles throughput to 200 orders per hour but wants the average order to spend only 2 hours in the building. What does Littles Law require about work in process, and what are the two distinct ways to cut flow time?",
        rubric: "Applies L = lambda * W = 200 * 2 = 400 orders in process as the required WIP target, lower than today despite higher throughput. Reasons that flow time W = L/lambda, so to cut W you either reduce work in process L (release fewer orders at once, limit WIP, smaller batches) or increase throughput lambda (more capacity), and reducing WIP is the direct lever when capacity is fixed. Notes the counterintuitive point that piling on more in-process work increases flow time without helping output once the system is saturated. Key insight: because W = L/lambda, capping work in process is the fastest way to shrink flow time, which is the core logic behind WIP limits and pull systems.",
      },
    ],
  },
  {
    id: "operations_research_inventory_tradeoff",
    slug: "concept-operations-research-inventory-tradeoff",
    title: "Sizing Order Batches and Safety Stock",
    prompt: "A distributor reorders a steady-selling part. Each purchase order incurs a fixed ordering and setup cost regardless of size, and holding inventory ties up cash and warehouse space. Demand is fairly steady but supplier lead times occasionally run long.",
    discipline: "INDUSTRIAL",
    difficulty: "MEDIUM",
    eloWeight: 26,
    tags: ["operations-research", "conceptual"],
    skillAreas: ["operations-research"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Describe the core tradeoff that sets the best order quantity (the EOQ logic). Why is ordering in very large batches wasteful, and why is ordering tiny amounts very often also wasteful?",
        rubric: "Frames the EOQ tradeoff between ordering cost and holding cost. Large batches mean few orders (low total ordering cost) but high average inventory (high holding cost, tied-up cash, space). Tiny frequent orders mean low inventory but many orders (high cumulative fixed ordering/setup cost). The optimum balances the two, where total cost is minimized as ordering cost falls and holding cost rises with batch size; roughly EOQ = sqrt(2*D*S/H) with D demand, S order cost, H holding cost per unit. Notes total cost is flat near the optimum, so EOQ is robust to estimate error. Key insight: optimal batch size balances fixed ordering cost against per-unit holding cost, so both very large and very small orders are inefficient.",
      },
      {
        prompt: "Now the supplier lead time becomes more variable (sometimes much longer than usual). How does that change your policy, what is safety stock for, and what service-level tradeoff does it create?",
        rubric: "Explains that lead-time variability is handled with safety stock and a reorder point, not by changing EOQ much (EOQ governs batch size; safety stock governs when to reorder and how much buffer). Safety stock buffers against demand and lead-time uncertainty during the replenishment window so a long lead time does not cause a stockout. The tradeoff is service level versus cost: higher safety stock raises the in-stock probability (fill rate) but increases holding cost, and the required buffer grows with the standard deviation of lead-time demand and with the target service level (z-factor). Notes diminishing returns chasing very high service levels. Key insight: variable lead time is absorbed by safety stock sized to demand-and-lead-time variability and the target service level, trading higher holding cost for fewer stockouts.",
      },
    ],
  },
  {
    id: "operations_research_batch_variability",
    slug: "concept-operations-research-batch-variability",
    title: "Batch Size, Variability, and Flow",
    prompt: "A machine shop processes jobs in large batches of 50 to amortize a long setup time. Lead times are long and erratic, and a downstream cell frequently sits idle and then gets flooded. A consultant suggests cutting batch sizes dramatically.",
    discipline: "INDUSTRIAL",
    difficulty: "HARD",
    eloWeight: 26,
    tags: ["operations-research", "conceptual"],
    skillAreas: ["operations-research"],
    evaluationMode: "LLM_GRADED",
    parts: [
      {
        prompt: "Explain how large batch sizes inflate flow time and create the feast-or-famine pattern downstream, connecting your answer to work-in-process and queueing behavior.",
        rubric: "Explains that large batches inflate work in process and, by Littles Law (W = L/lambda), inflate flow time. A whole batch must finish before it moves, so a downstream job waits for 49 other units (wait-to-batch and wait-in-batch delays), and arrivals downstream are lumpy: nothing, then a flood of 50. This lumpiness is high arrival variability, which (via queueing intuition) lengthens waits and creates the idle-then-overwhelmed pattern. Links large batches to longer queues and worse responsiveness. Key insight: large batches raise WIP and inject arrival variability, so they lengthen flow time and cause the feast-or-famine flow that smaller batches smooth out.",
      },
      {
        prompt: "Now cutting batch size is only attractive if setup time is also reduced. Why is setup reduction the enabler, and what is the limit, that is, what stops you from driving batches all the way to one unit?",
        rubric: "Explains setups as the reason batches are large: a long fixed setup forces large batches to keep machine utilization viable, since tiny batches with long setups would consume capacity in changeovers and effectively reduce throughput (setup time acts like the EOQ fixed ordering cost). Reducing setup time (SMED) lowers the cost of switching, so small batches become economical, enabling flow without sacrificing capacity. The limit is when setup-time-per-unit overhead would push utilization too high or the bottleneck would lose too much capacity to changeovers; you shrink batches only until added setup load threatens throughput or the bottleneck. Mentions one-piece flow is the ideal but bounded by remaining setup, transport, and capacity costs. Key insight: setup reduction is what makes small batches affordable, and the floor on batch size is set by how much capacity (especially at the bottleneck) you can spend on setups before throughput suffers.",
      },
    ],
  },
];
