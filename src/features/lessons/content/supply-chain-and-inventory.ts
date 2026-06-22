import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_supplychain",
  slug: "supply-chain-and-inventory",
  title: "Supply Chain and Inventory",
  summary:
    "Why does a warehouse hold thousands of widgets it won't sell for months — and why is that sometimes the *smart* move? Inventory is money frozen in physical form, sitting on a shelf, and the entire science of supply chain is a tug-of-war between two opposing costs: order too often and you drown in paperwork and shipping fees; order too rarely and you bury cash in stock that just sits there. The Economic Order Quantity formula, EOQ = √(2DS/H), finds the exact sweet spot — and it's one of the oldest, most quietly useful equations in all of operations. Add reorder points, safety stock, the bullwhip effect, and JIT, and you've got the toolkit that keeps the modern world stocked.",
  discipline: "INDUSTRIAL",
  difficulty: "MEDIUM",
  estMinutes: 23,
  tags: ["supply-chain", "inventory", "eoq"],
  objectives: [
    "Explain why inventory exists and identify the two costs it trades off: ordering cost and holding (carrying) cost.",
    "State and apply the Economic Order Quantity formula, EOQ = √(2DS/H), and explain the trade-off it balances.",
    "List the EOQ model's key assumptions and recognize when they break down.",
    "Compute a reorder point from demand and lead time, and explain the role of safety stock against uncertainty.",
    "Describe the bullwhip effect — why demand swings amplify upstream — and what causes it.",
    "Contrast traditional batch ordering with JIT / lean inventory and the trade-offs each makes.",
  ],
  prerequisites: [
    "Basic algebra and square roots",
    "Comfort with rates (units per year, units per day)",
    "A rough feel for cost trade-offs — no calculus required",
  ],
  interviewAngle:
    "Supply chain and inventory questions appear across operations, retail, logistics, ops-finance, and product interviews because they test whether a candidate can reason about a trade-off quantitatively. The expected fluency: derive or at least *explain* EOQ = √(2DS/H) as the order size that minimizes total annual cost, where ordering cost (which falls as you order in bigger batches) and holding cost (which rises with bigger batches) cross. The strong candidate (1) explains *why* it's a square root — total cost is a U-shaped curve and the optimum sits where the two cost curves intersect, so doubling demand only raises EOQ by √2, not 2× — (2) can compute downstream metrics like optimal orders per year (D/EOQ) and reorder point (demand-rate × lead-time + safety stock), (3) names EOQ's assumptions (constant known demand, fixed costs, instant replenishment, no quantity discounts) and when they fail, and (4) connects the dots to the bullwhip effect (small demand signals amplifying upstream) and JIT/lean (driving order/setup cost down so small batches become optimal). Expect a \"compute EOQ and orders-per-year\" drill, a \"demand doubled — does EOQ double?\" trap, and a \"when would you *not* use EOQ?\" follow-up.",
  blocks: [
    {
      id: "sc_intro",
      kind: "PROSE",
      title: "The money frozen on the shelf 🧊",
      markdown:
        "Walk through any warehouse and you're looking at a pile of cash that someone deliberately *froze*. Every box on every shelf is money that's already been spent but hasn't yet earned anything back — it's just sitting there, taking up space, possibly going stale, definitely not in the bank. So here's the obvious question: **why hold any inventory at all?** Why not order each item exactly when a customer wants it?\n\nBecause ordering isn't free, and stockouts are brutal. Every time you place an order there's a *fixed* cost — paperwork, shipping, setup, a minimum freight charge — that you pay no matter how big the order is. And if you run out when a customer shows up, you lose the sale (or worse, the customer). So you *batch*: you order a chunk at a time and hold the surplus as inventory to ride out the gap until the next order.\n\nBut now you've created the *opposite* problem. Holding inventory costs money too — warehouse rent, insurance, spoilage, obsolescence, and the big invisible one: the **opportunity cost** of capital tied up in stock instead of earning elsewhere. Order in giant batches to save on ordering, and your holding costs balloon. Order in tiny batches to keep holding low, and your ordering costs explode.\n\nTwo costs pulling in *exactly opposite directions*. That tension is the entire science of inventory management, and over a century ago someone found the precise order size that minimizes their sum. It's a square root, it's beautiful, and it's coming. First, watch the trade-off in motion.",
    },
    {
      id: "sc_video",
      kind: "VIDEO",
      youtubeId: "KiCFfD5zBWQ",
      title: "Watch: Economic Order Quantity (EOQ) Explained",
      caption:
        "A clear visual walk through the EOQ trade-off and formula this lesson is built around. Watch it now — once you *see* the ordering-cost curve sliding down while the holding-cost curve climbs up, and the total-cost U-curve dipping at their crossing, EOQ = √(2DS/H) becomes obvious instead of magical.",
    },
    {
      id: "sc_two_costs",
      kind: "PROSE",
      title: "The tug-of-war: ordering vs. holding ⚖️",
      markdown:
        "Inventory management is a battle between two costs that hate each other. Get crisp on both, because the whole model is just their sum.\n\n- **Ordering cost (S)** — the *fixed* cost of placing one order, regardless of size. Purchase-order processing, shipping/freight minimums, receiving and inspection, machine *setup* time in manufacturing. Order a truckload or a single unit, you pay roughly the same S. So the more units you cram into each order, the more you *spread* this fixed cost — ordering cost per unit *falls* with bigger batches. Over a year you place `D/Q` orders (demand ÷ order size), costing `S · D/Q`.\n\n- **Holding cost (H)** — the cost to *carry* one unit in inventory for a year. Warehouse space, insurance, taxes, spoilage and obsolescence, and the opportunity cost of cash locked in stock (usually the biggest piece). The more you order at once, the more sits on the shelf on average, so holding cost *rises* with bigger batches. If you order Q and draw it down steadily to zero, your *average* inventory is `Q/2`, costing `H · Q/2`.\n\nNow stare at the directions:\n\n```\nOrdering cost = S · (D / Q)   → DECREASES as Q grows (fewer, bigger orders)\nHolding cost  = H · (Q / 2)   → INCREASES as Q grows (more sitting around)\nTotal cost    = S·D/Q + H·Q/2\n```\n\nOne curve slides down, the other climbs up, and their **sum is U-shaped** — high at both extremes (tiny orders = constant reordering; huge orders = a warehouse full of frozen cash) with a single low point in the middle. That low point is the **Economic Order Quantity**: the order size where the two costs are perfectly balanced. Finding it is the whole game.",
    },
    {
      id: "sc_formula",
      kind: "FORMULA",
      title: "Economic Order Quantity (EOQ)",
      display: "EOQ = √( 2 · D · S / H )",
      latex: "\\text{EOQ} = \\sqrt{\\dfrac{2 \\cdot D \\cdot S}{H}}",
      variables: [
        { symbol: "EOQ", name: "Optimal order quantity (units per order)", unit: "units" },
        { symbol: "D", name: "Annual demand", unit: "units/yr" },
        { symbol: "S", name: "Fixed cost per order (setup / ordering cost)", unit: "$/order" },
        { symbol: "H", name: "Holding (carrying) cost per unit per year", unit: "$/unit/yr" },
      ],
      note:
        "The order size that minimizes total annual cost (ordering + holding). It sits exactly where the two cost curves cross — at the EOQ, annual ordering cost equals annual holding cost. Note the square root: the optimum is insensitive, so being a bit off is cheap, and doubling demand D raises EOQ by only √2 ≈ 1.41×, NOT 2×. The total cost at the optimum works out to √(2·D·S·H). Assumes constant, known demand, fixed S and H, instant replenishment, and no quantity discounts.",
    },
    {
      id: "sc_why_sqrt",
      kind: "PROSE",
      title: "Why is it a square root? 📐",
      markdown:
        "The square root isn't decorative — it carries real intuition, and explaining it is the move that separates memorizers from understanders.\n\nThe optimum lives where the total-cost U-curve bottoms out, which is exactly where the **two cost curves cross** — where annual ordering cost equals annual holding cost. Set them equal and solve:\n\n```\nS · (D / Q) = H · (Q / 2)\n2 · S · D     = H · Q²\nQ²            = 2·D·S / H\nQ             = √( 2·D·S / H )\n```\n\nThe `Q²` is where the root comes from: holding cost grows with Q while ordering cost shrinks with 1/Q, so balancing them squares Q. Three consequences fall out, and each is interview gold:\n\n- **EOQ scales with the *square root* of demand.** Demand quadruples? EOQ only *doubles* (√4 = 2). This is the famous economy of scale in inventory: bigger operations hold proportionally *less* stock relative to their throughput. It's why a giant retailer is far more inventory-efficient than a corner shop.\n- **EOQ rises with √S and falls with √(1/H).** Cheaper, easier ordering (lower S) → smaller optimal batches. Pricier holding (higher H) → smaller batches too. Both pushes are *dampened* by the square root, so the optimum moves gently.\n- **The U-curve is flat near the bottom.** Because it's a smooth minimum, ordering somewhat more or less than the exact EOQ barely raises total cost. The formula is *forgiving* — get in the right ballpark and you've captured almost all the savings. (Great news, since D, S, and H are all estimates anyway.)\n\nSo the square root tells you: don't sweat precision, *do* respect that doubling your business doesn't double your stockroom.",
    },
    {
      id: "sc_sandbox",
      kind: "SANDBOX",
      title: "Play with it: the EOQ machine 🎛️",
      description:
        "Drag the three levers and watch the optimal order size respond. EOQ = √(2DS/H). The defaults — annual demand D = 1200 units, order cost S = $50, holding cost H = $6/unit/yr — give 2·1200·50 = 120,000, divided by 6 = 20,000, square-rooted ≈ 141 units per order. Now play with the square root: crank D up to 4800 (4×) and EOQ only doubles to ~283 — not 4×. Make ordering cheaper (drop S, like JIT does) and the optimal batch shrinks. Make holding pricier (raise H, e.g. perishables) and it shrinks too. Notice how *gently* everything moves: that's the dampening power of the square root, and why being a little off the exact EOQ costs you almost nothing.",
      variables: [
        { key: "D", label: "Annual demand D", unit: "units/yr", min: 100, max: 100000, step: 100, default: 1200 },
        { key: "S", label: "Order cost S", unit: "$", min: 5, max: 500, step: 5, default: 50 },
        { key: "H", label: "Holding cost H", unit: "$/unit/yr", min: 0.5, max: 50, step: 0.5, default: 6 },
      ],
      expression: "sqrt(2 * D * S / H)",
      outputLabel: "EOQ",
      outputUnit: "units",
      precision: 0,
    },
    {
      id: "sc_predict_demand",
      kind: "PREDICT",
      question:
        "A store's EOQ for a popular item is 200 units. Next year a viral trend makes annual demand for that item exactly QUADRUPLE (4×). Holding cost H and ordering cost S stay the same. What's the new EOQ?",
      options: [
        { id: "a", label: "800 units — EOQ scales directly with demand, so 4× demand → 4× EOQ" },
        { id: "b", label: "400 units — EOQ scales with the square root of demand, so √4 = 2× → 400" },
        { id: "c", label: "200 units — EOQ depends only on costs, not demand" },
        { id: "d", label: "1600 units — demand affects EOQ quadratically" },
      ],
      answerId: "b",
      reveal:
        "**400 units** — only *double*, even though demand quadrupled. EOQ = √(2DS/H), so demand sits *under a square root*: multiply D by 4 and EOQ multiplies by √4 = 2. Original √(2·D·S/H) = 200, so the new EOQ = √(2·4D·S/H) = √4 × 200 = 400.\n\nThis is the most important — and most counterintuitive — property of EOQ, and a favorite interview trap. People instinctively assume a 4× busier store needs 4× the inventory, but it doesn't: it needs only 2× the order size. This is a genuine **economy of scale**. Bigger operations hold proportionally *less* inventory relative to their sales, which is a real structural advantage of scale (and why giant retailers run leaner stockrooms per dollar of revenue than small shops). The square root is doing the heavy lifting.",
    },
    {
      id: "sc_predict_jit",
      kind: "PREDICT",
      question:
        "A factory invests in faster machine changeovers and streamlined purchasing, slashing its per-order setup cost S to a *quarter* (¼) of what it was. Demand D and holding cost H are unchanged. What happens to the optimal order quantity EOQ?",
      options: [
        { id: "a", label: "It quarters — EOQ falls in direct proportion to S" },
        { id: "b", label: "It stays the same — only demand affects order size" },
        { id: "c", label: "It halves — EOQ scales with √S, so √(¼) = ½" },
        { id: "d", label: "It doubles — lower costs mean you can afford bigger orders" },
      ],
      answerId: "c",
      reveal:
        "**It halves.** EOQ = √(2DS/H), so order cost S is under the square root too: cut S to ¼ and EOQ falls by √(¼) = ½. Smaller optimal batches, ordered twice as often.\n\nThis tiny result is the entire economic engine behind **Just-In-Time (JIT) and lean manufacturing.** EOQ treats S as fixed and finds the best batch *given* it — but the deeper lean insight is to **attack S itself.** Toyota obsessed over slashing setup/changeover time (SMED: Single-Minute Exchange of Die) precisely because driving S toward zero drives the optimal batch toward *one*. When ordering/setup is nearly free, small frequent batches become genuinely optimal — less inventory, faster flow, less frozen cash, problems surfaced sooner. JIT doesn't violate EOQ; it *changes the inputs* to EOQ. That's the elegant part.",
    },
    {
      id: "sc_reorder",
      kind: "PROSE",
      title: "Reorder point and safety stock 🛟",
      markdown:
        "EOQ answers *how much* to order. It says nothing about **when** — and ordering at the wrong moment means a stockout even with a perfect batch size. That's the job of the **reorder point (ROP)**: the inventory level that triggers a new order.\n\nThe key wrinkle is **lead time (L)** — the gap between placing an order and receiving it. If demand runs `d` units per day and your supplier takes `L` days to deliver, then while you wait you'll consume `d · L` units. So you must reorder *before* you hit zero, with exactly enough left to last through the lead time:\n\n```\nReorder point = d · L      (daily demand × lead time)\n```\n\nExample: you sell 20 units/day and the supplier takes 5 days. When stock drops to `20 × 5 = 100` units, place the order — it arrives just as you'd otherwise run dry. Clean. *In a perfect world.*\n\nBut the real world isn't constant. Demand spikes, suppliers run late. If you cut it that fine and *anything* goes wrong, you stock out — and a stockout means lost sales, idle production lines, or angry customers. The buffer against this uncertainty is **safety stock**: extra inventory held specifically to absorb variability in demand and lead time.\n\n```\nReorder point = (d · L) + safety stock\n```\n\nSafety stock is a deliberate bet: you pay extra holding cost to buy protection against stockouts. How much depends on how *variable* demand and lead time are (more variability → more safety stock) and how badly a stockout hurts — captured by your target **service level** (e.g., \"in stock 95% of the time\"). It's insurance: not free, but cheaper than the disaster it prevents. EOQ sets the batch; ROP-plus-safety-stock sets the timing and the cushion.",
    },
    {
      id: "sc_bullwhip",
      kind: "PROSE",
      title: "The bullwhip effect 🐂",
      markdown:
        "Here's one of the eeriest phenomena in all of supply chain. A retailer notices customer demand for a product tick up just *slightly* and steadily. Yet by the time that gentle signal travels upstream — retailer → distributor → manufacturer → raw-material supplier — it has mutated into *wild* swings: massive over-orders, then sudden cancellations, then frantic catch-up. The further upstream you go, the more violent the oscillations. A tiny flick at the consumer end becomes a thunderous crack at the source. This is the **bullwhip effect**, and it's a structural curse of multi-stage supply chains.\n\nWhat causes a small ripple to amplify into a tsunami? Several reinforcing culprits:\n\n- **Demand-forecast updating.** Each stage forecasts based on the *orders it receives* (not true end-customer demand) and adds its own safety buffer. Buffers stack on buffers, so the signal swells at every hop.\n- **Order batching.** Stages order in EOQ-style batches rather than continuously, so a smooth demand stream arrives upstream as lumpy bursts.\n- **Price promotions & forward buying.** A sale makes customers stockpile, creating a fake demand spike followed by a trough — noise the upstream reads as a real trend.\n- **Shortage gaming / rationing.** When supply is tight and orders get rationed, buyers *inflate* their orders to grab a bigger slice, then cancel when supply normalizes — pure phantom demand.\n\nThe damage is real: upstream players swing between crippling stockouts and warehouses of excess, all chasing a phantom. The cure is **information sharing** — give every stage visibility into *true end-customer demand* (point-of-sale data) instead of letting each guess from the distorted orders next door. Smaller, more frequent orders (lean!), stable everyday pricing, and shorter lead times all dampen the whip too. The lesson: in a supply chain, *what you don't see distorts what you do.*",
    },
    {
      id: "sc_jit",
      kind: "PROSE",
      title: "JIT and lean: the war on inventory ⚔️",
      markdown:
        "For decades, big buffer inventories were considered prudent — a cushion against every surprise. Then Toyota flipped the script with the **Toyota Production System**, and **Just-In-Time (JIT)** reframed inventory not as a safety net but as **waste to be eliminated.** The philosophy: produce and order *exactly what's needed, exactly when it's needed, in exactly the amount needed* — ideally a batch size approaching **one**.\n\nWhy treat inventory as the villain? Because in lean thinking, **inventory hides problems.** It's the water level in a lake covering up rocks — quality defects, unreliable machines, long changeovers, flaky suppliers. With fat buffers you never feel those rocks; you just paper over them with stock. **Lower the water (cut inventory) and the rocks surface**, forcing you to actually *fix* the underlying problems. Less inventory also means less frozen cash, less space, less spoilage, and dramatically faster detection of defects (you find the bad part in hours, not after a warehouse-full is built).\n\nThe connection back to EOQ is the elegant part — JIT doesn't break the formula, it **changes its inputs.** Recall EOQ shrinks as ordering/setup cost S shrinks. Toyota relentlessly drove S down — slashing machine changeover times (SMED), tightening supplier partnerships, using simple **kanban** pull signals so production is triggered by actual downstream consumption rather than a forecast. Drive S toward zero and the *economically optimal* batch genuinely approaches one. So JIT is EOQ logic taken to its limit, by first making small batches cheap.\n\nThe trade-off, of course: JIT runs lean with little safety stock, so it's gloriously efficient but **fragile to disruption** — a late supplier or a demand shock can halt the line. (The pandemic taught everyone this the hard way.) The modern answer isn't pure JIT or pure buffering but a deliberate balance: lean where supply is reliable, more buffer where it isn't. Resilience is the new frontier.",
    },
    {
      id: "sc_worked_example",
      kind: "WORKED_EXAMPLE",
      title: "Real job: stocking the bike shop 🚲📊",
      problem:
        "A bike shop sells D = 1,200 tires per year (assume steady demand, 300 selling days). Each order costs S = $50 to place (shipping + paperwork), and holding one tire for a year costs H = $6 (space + capital). (a) Compute the EOQ. (b) How many orders should the shop place per year, and how often? (c) If the supplier's lead time is 10 days, what's the reorder point (no safety stock)? (d) Sanity-check: what's the annual ordering cost vs. annual holding cost at the EOQ?",
      steps: [
        {
          label: "(a) Compute the EOQ",
          markdown:
            "Plug into EOQ = √(2DS/H):\n\n```\nEOQ = √( 2 × 1200 × 50 / 6 )\n    = √( 120000 / 6 )\n    = √( 20000 )\n    ≈ 141 tires per order\n```\n\nThe cost-minimizing batch is about **141 tires**. Order much bigger and holding cost dominates; much smaller and ordering cost dominates.",
        },
        {
          label: "(b) Optimal number of orders per year",
          markdown:
            "Divide annual demand by the order size:\n\n```\nOrders per year = D / EOQ = 1200 / 141 ≈ 8.5 orders/yr\n```\n\nSo roughly **8–9 orders a year** — about one every `300 / 8.5 ≈ 35 selling days`, i.e. once every ~5 weeks. (In practice you'd round to a clean cadence, and the flat U-curve means rounding costs you almost nothing.)",
        },
        {
          label: "(c) Reorder point",
          markdown:
            "First the daily demand rate:\n\n```\nd = 1200 tires / 300 days = 4 tires/day\n```\n\nWith a 10-day lead time and no safety stock:\n\n```\nReorder point = d × L = 4 × 10 = 40 tires\n```\n\nWhen stock falls to **40 tires**, place the next order — it arrives just as you'd hit zero. (In reality you'd add safety stock here to absorb demand spikes or a late supplier; without it, one busy week stocks you out.)",
        },
        {
          label: "(d) Sanity check: the two costs balance",
          markdown:
            "At the true EOQ, annual ordering cost should equal annual holding cost — that's the whole point of the optimum. Check:\n\n```\nOrdering cost = S × D/Q = 50 × 1200/141 = $425.5\nHolding cost  = H × Q/2 = 6  × 141/2   = $423.0\n```\n\nThey match (within rounding) ✓ — both ≈ $424, total ≈ $849. That equality *is* the EOQ condition: the optimum sits exactly where the down-sloping ordering curve crosses the up-sloping holding curve. If the two costs were lopsided, you'd know the batch size was wrong.",
        },
      ],
      answer:
        "(a) EOQ = √(2·1200·50/6) = √20000 ≈ 141 tires/order. (b) D/EOQ = 1200/141 ≈ 8.5 orders/year, about one every 5 weeks. (c) d = 4 tires/day, reorder point = d×L = 4×10 = 40 tires (add safety stock in practice). (d) At the EOQ, ordering cost (≈ $425) ≈ holding cost (≈ $423) — the two are balanced, confirming the optimum.",
    },
    {
      id: "sc_check_eoq",
      kind: "CHECK",
      question:
        "A warehouse renegotiates its lease and its holding cost H jumps to 4× what it was (much pricier storage). Annual demand D and order cost S are unchanged. What happens to the optimal order quantity (EOQ)?",
      choices: [
        { id: "c1", label: "It quarters — EOQ falls in direct proportion to H" },
        { id: "c2", label: "It halves — EOQ scales with √(1/H), so 4× H → ½ the EOQ" },
        { id: "c3", label: "It doubles — higher holding cost means you should stock more" },
        { id: "c4", label: "It's unchanged — only demand affects order size" },
      ],
      answerId: "c2",
      explanation:
        "**It halves.** EOQ = √(2DS/H), with H in the *denominator under the square root*. Multiply H by 4 and EOQ multiplies by √(1/4) = 1/2. The logic is sound: when carrying inventory gets expensive, you want *less* sitting on the shelf, so you order *smaller* batches more often — but, thanks to the square root, the adjustment is gentle (half, not a quarter). This is exactly why perishable or high-value goods (high H) are ordered in small, frequent batches, while cheap, durable goods (low H) are ordered in big bulk loads.",
    },
    {
      id: "sc_check_bullwhip",
      kind: "CHECK",
      question:
        "In a supply chain, end-customer demand for a product is actually quite stable, rising just 5%. Yet the raw-material supplier at the very top of the chain sees its orders swing violently up and down. What is this phenomenon called, and what's the best primary fix?",
      choices: [
        { id: "s1", label: "Economies of scale — share EOQ calculations across the chain" },
        { id: "s2", label: "Safety stock failure — fix it by holding far more inventory at every stage" },
        { id: "s3", label: "The bullwhip effect — fix it by sharing true end-customer demand data across all stages" },
        { id: "s4", label: "Seasonal variation — fix it by ordering only once per quarter" },
      ],
      answerId: "s3",
      explanation:
        "This is the **bullwhip effect**: small variations in real end-customer demand amplify into ever-larger swings as you move upstream, because each stage reacts to the *distorted orders* it receives (not true demand), stacking forecast buffers, batching orders, and gaming shortages. The single most effective fix is **information sharing** — giving every stage visibility into actual point-of-sale (end-customer) demand so no one is forecasting blindly from the noisy orders of the stage below. (Note that piling on MORE inventory everywhere, choice 2, makes it *worse* — more buffers stacking on buffers is part of what causes the whip in the first place.) Smaller frequent orders, stable pricing, and shorter lead times help dampen it too.",
    },
    {
      id: "sc_callout_interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "What they're really testing 🎤",
      markdown:
        "Operations, retail, logistics, and ops-finance interviews lean on this material to see if you can reason about trade-offs quantitatively. The prompts and the answers that land:\n\n- **\"Compute the EOQ and the optimal number of orders per year.\"** EOQ = √(2DS/H); orders/year = D/EOQ. Then add the insight: \"at the EOQ, annual ordering cost equals annual holding cost\" — naming the balance point shows you understand *why*, not just the plug-in.\n- **\"Demand doubled — does EOQ double?\"** No — it rises by √2 ≈ 1.41×, because demand is under a square root. This is the classic trap; nail it and mention the economy-of-scale implication (bigger operations hold proportionally less inventory).\n- **\"When would you NOT use EOQ?\"** When its assumptions break: variable/uncertain demand, quantity discounts (use a discount-adjusted model), perishability with deadlines, or capacity limits. Knowing the assumptions is the senior signal.\n- **\"How do you decide *when* to order?\"** Reorder point = (daily demand × lead time) + safety stock. Safety stock sizing depends on demand/lead-time variability and target service level.\n- **\"What's the bullwhip effect / what is JIT?\"** Bullwhip = upstream amplification of demand swings; fix with demand-data sharing. JIT = drive ordering/setup cost S down so the optimal batch shrinks toward one — efficient but fragile to disruption.",
    },
    {
      id: "sc_callout_sqrt",
      kind: "CALLOUT",
      variant: "insight",
      title: "The square root is forgiving — and that's a gift",
      markdown:
        "The most practically reassuring fact about EOQ is that its total-cost curve is *flat near the bottom*. Because the minimum is smooth, ordering 20–30% above or below the exact EOQ raises your total cost by only a percent or two. This matters enormously in the real world, where D, S, and H are all rough estimates anyway — you'll never know them precisely, and EOQ doesn't punish you for it. So don't agonize over a perfect number: land in the right ballpark and you've captured nearly all the savings. The flip side is the lesson that *does* bite: never forget that EOQ scales with the **square root** of demand. Doubling your sales does not double your stockroom — it grows it by only √2. Getting *that* relationship wrong (over-ordering proportionally) is far more expensive than missing the exact EOQ by a bit.",
    },
    {
      id: "sc_wrap",
      kind: "PROSE",
      title: "The inventory lens 📦",
      markdown:
        "Inventory management is one giant balancing act, and now you can carry its core ideas in your pocket:\n\n1. **Inventory trades off two opposing costs** — ordering cost S (fixed per order, falls with bigger batches) versus holding cost H (per unit per year, rises with bigger batches). Their sum is U-shaped.\n2. **EOQ = √(2DS/H)** finds the bottom of that U — the order size where ordering and holding costs balance. The square root means doubling demand grows EOQ by only √2 (economy of scale), and the flat minimum makes it forgiving of estimation error.\n3. **Reorder point = (daily demand × lead time) + safety stock** answers *when* to order, with safety stock as insurance against demand and lead-time uncertainty.\n4. **The bullwhip effect** amplifies demand swings upstream; the cure is sharing true end-customer demand data. **JIT/lean** drives S toward zero so tiny batches become optimal — supremely efficient but fragile, so balance lean against resilience.\n\nOnce you have this lens, you'll see the trade-off everywhere: your pantry (bulk-buy vs. fresh trips), the cloud team's pre-provisioned capacity, the cash you keep in checking vs. invested. Every one is an ordering-cost-vs-holding-cost dance. Now you know the math that finds the sweet spot. Go find some frozen cash and thaw it. 🧊➡️💵",
    },
  ],
  keyTakeaways: [
    "Inventory exists to buffer the gap between supply and demand, and it trades off two opposing costs: ordering cost S (fixed per order, falls with bigger batches) and holding cost H (per unit per year, rises with bigger batches); total cost is U-shaped.",
    "EOQ = √(2DS/H) is the order size that minimizes total annual cost — it sits exactly where annual ordering cost equals annual holding cost (the bottom of the U).",
    "EOQ scales with the SQUARE ROOT of demand, so quadrupling demand only doubles the order size — a genuine economy of scale — and the flat cost curve near the optimum makes EOQ forgiving of estimation error.",
    "EOQ's assumptions (constant known demand, fixed S and H, instant replenishment, no quantity discounts) limit it; when they break, use adjusted models.",
    "Reorder point = (daily demand × lead time) + safety stock answers WHEN to order; safety stock is insurance against demand and lead-time variability, sized by the target service level.",
    "The bullwhip effect amplifies small end-customer demand swings into violent upstream swings (from forecast buffering, batching, promotions, and shortage gaming); the cure is sharing true end-customer demand data.",
    "JIT/lean treats inventory as waste that hides problems and drives ordering/setup cost S toward zero so small batches become optimal — extremely efficient but fragile to disruption, so balance leanness against resilience.",
  ],
};
