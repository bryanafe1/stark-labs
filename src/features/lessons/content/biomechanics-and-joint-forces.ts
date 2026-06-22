import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_biomech",
  slug: "biomechanics-and-joint-forces",
  title: "Biomechanics and Joint Forces",
  summary:
    "Hold a 10 kg dumbbell in your hand and your biceps is straining against something far heavier than 10 kg — it's pulling with the force of a small motorcycle. Why? Because your body is a collection of terrible levers, deliberately engineered to lose at force so it can win at speed. In one lesson you'll learn to read any joint as a lever, balance moments to find the brutal muscle and joint forces hiding inside your own arm, and see why your bones are quietly bearing loads that would surprise you.",
  discipline: "BIOMEDICAL",
  difficulty: "MEDIUM",
  estMinutes: 24,
  tags: ["biomechanics", "levers", "joint-forces"],
  objectives: [
    "Classify any joint in the body as a 1st-, 2nd-, or 3rd-class lever and predict whether it trades force for speed or speed for force.",
    "Set up and solve a static moment balance about a joint to find the muscle force required to hold a load.",
    "Explain — with a number — why muscle forces are so enormous compared to the loads they hold.",
    "Find the joint reaction force at a joint using force equilibrium, not just the muscle force.",
    "Estimate the stress on a bone or implant from σ = F/A and reason about whether it's safe.",
    "Connect static joint analysis to real-world loading like gait, lifting, and orthopedic implant design."
  ],
  prerequisites: [
    "Statics: free-body diagrams, force and moment equilibrium",
    "Trigonometry and basic vector components",
    "Stress and strain: σ = F/A"
  ],
  interviewAngle:
    "Biomechanics interviews — for medical-device, orthopedic, or rehabilitation roles — love joint-force problems precisely because they look like a clean statics problem wearing a lab coat. The interviewer wants to see whether you can model a messy biological joint as a rigid-body lever, draw a clean free-body diagram, and grind out a moment balance under pressure. The strong candidate does four things: (1) identifies the lever class and immediately predicts that the muscle force will be large because the muscle's moment arm is tiny, (2) writes ΣM = 0 about the joint to isolate the muscle force, (3) follows up with ΣF = 0 to get the joint reaction force — the number that actually wears out a hip or a knee implant — and (4) converts force to stress with σ = F/A to judge whether a bone, screw, or implant survives. Expect them to push on the modeling assumptions too: why we treat the forearm as rigid, why we ignore the antagonist muscles in a first pass, and why the joint reaction force is usually the design-driving load for an implant — far more than the external weight the person is holding."
  ,
  blocks: [
    {
      id: "b_intro",
      kind: "PROSE",
      title: "Your body is a machine that loses on purpose 💪",
      markdown:
        "Pick up a heavy book and hold it in your hand, elbow bent at 90°. It feels like your hand is holding the book. It isn't — not really. The book is held up by your **biceps**, a muscle that attaches to your forearm bone shockingly close to the elbow. And because it attaches so close to the pivot, it has to pull *much* harder than the weight of the book to keep your arm level.\n\nHere's the punchline up front: hold a 10 kg weight (about 100 N) in your hand and your biceps is pulling with something like **700 N** — the weight of a 70 kg person. Your elbow joint, getting squeezed between the muscle and the load, feels even more. Your body cheerfully amplifies a modest load into a huge internal force, every single time you bend your arm.\n\nWhy on earth would evolution build a machine that *loses* at force? Because in exchange, it **wins at speed and range of motion**. A tiny contraction of the biceps — your muscle barely shortens — whips your hand through a big, fast arc. You traded mechanical advantage for a hand that can move quickly and far. That's the deal nearly every joint in your body makes.\n\nThe entire job of this lesson is to take one idea — **the joint is a lever, and at rest the moments around it must balance** — and use it to compute the real forces hiding inside you: the muscle force, the joint reaction force that grinds your cartilage, and the stress those forces put on bone. These are the exact numbers an orthopedic engineer needs to design a hip that survives 25 years of walking."
    },
    {
      id: "b_video",
      kind: "VIDEO",
      youtubeId: "wjB0l33W100",
      title: "Watch: Biomechanics — Elbow Joint Forces",
      channel: "Catalyst University",
      caption:
        "A clear, worked walk-through of exactly the elbow problem we're about to solve — the muscle force and the joint reaction force at the elbow. Watch it now; the moment balance below will feel obvious afterward."
    },
    {
      id: "b_levers",
      kind: "PROSE",
      title: "Three kinds of lever, and why your body picked the worst one",
      markdown:
        "Every lever has three players: a **pivot** (the fulcrum, i.e. the joint), an **effort** (the muscle force), and a **load** (the external weight, or the weight of the limb itself). What changes between the three classes is the *order* in which they sit along the bone.\n\n1. **First-class lever** — pivot in the *middle*, effort and load on opposite sides. Like a seesaw or a pair of scissors. Example: your **head balancing on your neck** — the neck muscles pull down at the back, the weight of your face tips forward, and the atlanto-occipital joint sits in between.\n\n2. **Second-class lever** — load in the *middle*, between the pivot and the effort. Like a wheelbarrow. The effort always has the longer moment arm, so these *multiply force* (mechanical advantage > 1). Example: standing on tiptoe — the ball of your foot is the pivot, your body weight is in the middle, your calf pulls up at the heel.\n\n3. **Third-class lever** — effort in the *middle*, between the pivot and the load. The muscle attaches close to the joint; the load hangs way out at the end. The effort *always* has the shorter moment arm, so these have mechanical advantage **less than 1** — they cost you force. **Most muscles in your body are third-class levers,** including the biceps at your elbow.\n\nSo your body overwhelmingly chose the *force-losing* class. The biceps attaches maybe 5 cm from the elbow, while the load in your hand is 35 cm out. That 7-to-1 ratio means the biceps must pull about 7× the load. The reward, again, is **speed and reach**: that little 5 cm muscle attachment moves a tiny bit and your hand sweeps through a huge fast arc. Force-losing, speed-gaining — that's the third-class bargain."
    },
    {
      id: "b_moment_prose",
      kind: "PROSE",
      title: "The seesaw rule: balancing moments at a joint",
      markdown:
        "To find the muscle force we use the single most powerful idea in statics: **when something isn't rotating, the moments around the pivot must sum to zero.** A moment is just force × perpendicular distance to the pivot (its **moment arm**). It's the seesaw rule — a light kid far out can balance a heavy kid sitting close in.\n\nModel the forearm as a rigid bar hinged at the elbow. Two moments fight over it:\n\n- The **load** `W` in your hand, acting at distance `d` from the elbow, tries to rotate the forearm *down*. Its moment is `W·d`.\n- The **biceps** force `F`, acting at distance `a` from the elbow (its attachment point), tries to rotate the forearm *up*. Its moment is `F·a`.\n\nFor the arm to hold still (static equilibrium), set the moments equal:\n\n```\nF·a = W·d\n```\n\nSolve for the muscle force:\n\n```\nF = W·d / a\n```\n\nStare at that fraction. Because `a` (≈ 5 cm) is tiny and `d` (≈ 35 cm) is big, the ratio `d/a` is large — and the muscle force `F` is correspondingly huge. The whole brutal truth of joint loading lives in that little `d/a`. (We're ignoring the forearm's own weight here for clarity — adding it just tacks on another `W·d` term, which is exactly how a real analysis grows.)"
    },
    {
      id: "b_formula",
      kind: "FORMULA",
      title: "Muscle force from a moment balance",
      display: "F = W·d / a",
      latex: "F = \\dfrac{W \\cdot d}{a}",
      variables: [
        { symbol: "F", name: "Muscle (biceps) force required to hold the load", unit: "N" },
        { symbol: "W", name: "External load held in the hand", unit: "N" },
        { symbol: "d", name: "Moment arm of the load (elbow to hand)", unit: "m" },
        { symbol: "a", name: "Moment arm of the muscle (elbow to muscle attachment)", unit: "m" }
      ],
      note:
        "The ratio d/a is the inverse of the lever's mechanical advantage. For the elbow it's roughly 35/5 = 7, so the biceps pulls about 7× the load. A small a is the price your body pays for a fast, far-reaching hand. Shrink a and F explodes — which is exactly why tendon attachment points matter so much."
    },
    {
      id: "b_sandbox",
      kind: "SANDBOX",
      title: "Play with it: the biceps force machine 🎛️",
      description:
        "Stop reading, start dragging. Set the load W in the hand, the load's reach d, and the muscle's tiny moment arm a — and watch the biceps force respond. The defaults (W = 100 N, d = 0.35 m, a = 0.05 m) give F = 700 N, the headline number from the intro. Now do the experiment that matters: shrink a from 0.05 toward 0.02 and watch F rocket. A muscle that attaches closer to the joint has to pull dramatically harder. That single sensitivity explains a huge amount of joint biomechanics.",
      variables: [
        { key: "W", label: "Hand load W", unit: "N", min: 10, max: 300, step: 5, default: 100 },
        { key: "d", label: "Load moment arm d", unit: "m", min: 0.1, max: 0.5, step: 0.01, default: 0.35 },
        { key: "a", label: "Muscle moment arm a", unit: "m", min: 0.02, max: 0.1, step: 0.005, default: 0.05 }
      ],
      expression: "W * d / a",
      outputLabel: "Biceps force F",
      outputUnit: "N",
      precision: 0
    },
    {
      id: "b_predict_arm",
      kind: "PREDICT",
      question:
        "Two people hold the same 100 N weight in the same hand position. Person A's biceps tendon attaches 5 cm from the elbow; Person B's attaches 4 cm from the elbow (a perfectly normal anatomical difference). Whose biceps has to pull harder, and by how much?",
      options: [
        { id: "a", label: "Person A — the bigger attachment distance means more force" },
        { id: "b", label: "They're identical — same weight, same hand position" },
        { id: "c", label: "Person B, by about 25% — the smaller moment arm a costs them" },
        { id: "d", label: "Person B, but only by a negligible amount" }
      ],
      answerId: "c",
      reveal:
        "Person B, by about 25%. `F = W·d/a`, and `a` sits in the *denominator*, so a smaller `a` means a bigger `F`. The ratio is just `5/4 = 1.25` — Person B's biceps pulls 25% harder for the *exact same task*.\n\nThis is not a trivia question. A muscle's moment arm is set by where its tendon attaches, and small anatomical differences (or a surgically re-attached tendon, or a poorly placed implant) directly scale the force the muscle — and the joint — must endure for life. In the sandbox, drag `a` from 0.05 to 0.04 and watch F jump from 700 N to 875 N. Same job, more strain, every single rep."
    },
    {
      id: "b_predict_reach",
      kind: "PREDICT",
      question:
        "You're holding a weight with your arm. To cut the strain on your biceps the MOST, what should you do?",
      options: [
        { id: "a", label: "Hold the weight farther out, with your arm extended" },
        { id: "b", label: "Pull the weight in close to your body (smaller d)" },
        { id: "c", label: "It makes no difference where you hold it" },
        { id: "d", label: "Switch hands — the other arm is stronger" }
      ],
      answerId: "b",
      reveal:
        "Pull it in close. `F = W·d/a`, and the load's moment arm `d` is in the *numerator* — halve `d` and you halve the muscle force. This is why a waiter carries a heavy tray tucked against the body, why you instinctively hug a heavy box to your chest, and why reaching out to lift something at arm's length feels brutal.\n\nIt's the same physics as the diving-board lesson, just flipped onto your own anatomy: every centimeter of reach you give the load gets multiplied against your muscle. In the sandbox, slide `d` from 0.35 down to 0.18 and watch the biceps force roughly halve. Keep the load close — your joints will thank you."
    },
    {
      id: "b_jrf_prose",
      kind: "PROSE",
      title: "The hidden monster: the joint reaction force",
      markdown:
        "Here's the part most people miss. We found the *muscle* force — but what does the **elbow joint itself** feel? The joint is squeezed between two forces pulling on the forearm: the biceps yanking up with `F`, and... well, let's account for everything.\n\nThe forearm is in equilibrium, so *all* the vertical forces on it must also sum to zero (`ΣF = 0`), not just the moments. The forces are:\n\n- The biceps `F`, pulling **up** (≈ 700 N).\n- The load `W`, pulling **down** (≈ 100 N).\n- The **joint reaction force** `R` from the upper-arm bone (humerus) pushing on the forearm at the elbow — the unknown we want.\n\nVertical balance: `F − W − R = 0`, so `R = F − W`. With `F = 700 N` and `W = 100 N`, the joint reaction force is **R = 600 N**. The elbow is being compressed by 600 N — six times the weight in your hand — just to hold a book.\n\n**This** is the force that wears out joints and breaks implants. When an orthopedic engineer designs an artificial hip or knee, the external load the person carries is almost beside the point; it's the *joint reaction force* — pumped up by all those short muscle moment arms — that the implant must survive for tens of millions of cycles. At the hip during a brisk walk, the joint reaction force can hit **three to four times body weight**, and during a stumble, much more. The muscles aren't just moving you; they're crushing your own joints in the process."
    },
    {
      id: "b_callout_jrf",
      kind: "CALLOUT",
      variant: "insight",
      title: "Two equations, two answers",
      markdown:
        "Joint problems almost always need *both* equilibrium laws, in this order:\n\n- **ΣM = 0 (moments about the joint)** → isolates and gives you the **muscle force**, because taking moments about the joint makes the unknown joint reaction force vanish (its moment arm is zero). Clever.\n- **ΣF = 0 (forces)** → now that you know the muscle force, gives you the **joint reaction force**.\n\nSolve the moment balance first *specifically because* it kills the joint reaction term, leaving one unknown. Then sweep up the joint force with force balance. Skip the second step and you've found what the muscle does — but missed the number that actually destroys cartilage and implants."
    },
    {
      id: "b_worked_example",
      kind: "WORKED_EXAMPLE",
      title: "Real job: forces in the elbow holding a weight 🔧",
      problem:
        "A person holds a W = 100 N weight in their hand with the forearm horizontal. The hand is d = 0.35 m from the elbow joint, and the biceps tendon attaches a = 0.05 m from the elbow, pulling vertically upward. (a) Find the biceps force F. (b) Find the joint reaction force R at the elbow. (c) The biceps tendon has a cross-sectional area of about A = 60 mm². Find the tensile stress in the tendon and compare it to a typical tendon strength of ~80 MPa. (Ignore the weight of the forearm itself.)",
      steps: [
        {
          label: "(a) Moment balance → biceps force",
          markdown:
            "Take moments about the elbow joint (this conveniently eliminates the unknown joint reaction force, since it acts *at* the elbow with zero moment arm). The biceps moment must balance the load moment:\n\n```\nF·a = W·d\nF = W·d / a = 100 × 0.35 / 0.05\n  = 35 / 0.05\n  = 700 N\n```\n\nThe biceps pulls with 700 N — seven times the 100 N load — exactly the `d/a` ratio at work."
        },
        {
          label: "(b) Force balance → joint reaction force",
          markdown:
            "Now sum vertical forces on the forearm. Biceps up, load down, joint reaction `R` (the humerus pushing on the forearm). Taking up as positive:\n\n```\nF − W − R = 0\nR = F − W = 700 − 100 = 600 N\n```\n\nThe elbow joint is compressed by **600 N** — six times the weight being held. That's the load the cartilage actually carries."
        },
        {
          label: "(c) Tendon stress",
          markdown:
            "Stress is force over area, `σ = F/A`. Convert the area: `A = 60 mm² = 60×10⁻⁶ m²`.\n\n```\nσ = F / A = 700 / 60×10⁻⁶\n  = 1.167×10⁷ Pa\n  ≈ 11.7 MPa\n```\n\nThat's about 12 MPa, comfortably below the ~80 MPa where a healthy tendon would fail — a safety factor of roughly 7. Good thing too: tendons routinely take loads several times higher during fast or explosive movements, which is exactly why tendon injuries happen during sudden, high-force efforts rather than slow holds."
        }
      ],
      answer:
        "Biceps force F = 700 N; joint reaction force R = 600 N (compressing the elbow); tendon stress σ ≈ 11.7 MPa, well under the ~80 MPa tendon strength (safety factor ≈ 7). The takeaway: holding a 100 N weight quietly puts 700 N through your muscle and 600 N through your joint."
    },
    {
      id: "b_stress_callout",
      kind: "CALLOUT",
      variant: "tip",
      title: "From force to failure: σ = F/A",
      markdown:
        "Once you've got the muscle and joint forces, the last step in any biomechanics design problem is **stress**: `σ = F/A`. The same 600 N is harmless spread over a big bone cross-section but dangerous concentrated on a tiny screw or a hairline implant neck. This is why implant designers obsess over cross-sectional area and stress concentrations: the force is set by the lever geometry of the body, but the *stress* — and therefore whether something fails — is set by how much material is there to carry it. Bone, by the way, handles roughly 130 MPa in compression and far less in tension, which is why it usually fails by bending or twisting, not by being squashed."
    },
    {
      id: "b_check_lever",
      kind: "CHECK",
      question:
        "The biceps at your elbow is a third-class lever. What does that tell you about it before you compute anything?",
      choices: [
        { id: "c1", label: "It multiplies force — the muscle pulls less than the load" },
        { id: "c2", label: "It has mechanical advantage < 1 — the muscle pulls MORE than the load, gaining speed/reach in return" },
        { id: "c3", label: "The pivot is in the middle, like a seesaw" },
        { id: "c4", label: "The load sits between the pivot and the muscle, like a wheelbarrow" }
      ],
      answerId: "c2",
      explanation:
        "In a third-class lever the effort (muscle) sits between the pivot and the load, so the muscle's moment arm is always shorter than the load's. Mechanical advantage = (effort arm)/(load arm) < 1, meaning the muscle must pull *more* force than the load it moves. The payoff is speed and range of motion: a small muscle contraction sweeps the hand through a big, fast arc. Choice c3 describes a first-class lever; c4 describes a second-class lever (force-multiplying, the opposite of what the biceps does)."
    },
    {
      id: "b_check_jrf",
      kind: "CHECK",
      question:
        "You correctly found a biceps force of 700 N for a 100 N hand load. A teammate says \"so the elbow joint feels 700 N.\" What's the right correction?",
      choices: [
        { id: "j1", label: "Correct — the joint feels exactly the muscle force, 700 N" },
        { id: "j2", label: "The joint feels 800 N — you add the muscle and the load" },
        { id: "j3", label: "The joint reaction force is found from ΣF = 0: R = F − W = 600 N" },
        { id: "j4", label: "The joint feels only the 100 N load; the muscle force doesn't reach the joint" }
      ],
      answerId: "j3",
      explanation:
        "The joint reaction force is a separate unknown, found from force equilibrium *after* you know the muscle force. With the biceps pulling up (700 N) and the load pulling down (100 N) on the forearm, vertical balance gives R = F − W = 600 N. It's not 700 N (that's just the muscle), and it's not 800 N (the load pulls the opposite way from the muscle, so it subtracts in this geometry). Always finish with ΣF = 0 to get the force that actually loads the joint."
    },
    {
      id: "b_gait_prose",
      kind: "PROSE",
      title: "From a static arm to a walking body",
      markdown:
        "Everything so far was **static** — nothing moving. Real life is dynamic, but the same toolkit scales up beautifully, and that's the bridge to clinical biomechanics.\n\n**Gait (walking)** is the classic example. As you walk, your weight rocks over one leg at a time. During single-leg stance, your hip joint becomes a lever: your body weight pulls down on the inside of the pivot (the hip), and your **hip abductor muscles** pull up on the outside to keep your pelvis from dropping. Run the same moment balance and — because the abductor's moment arm is small compared to where your center of mass sits — you find the hip joint reaction force reaches **3–4× body weight** just from *walking*. Climbing stairs or stumbling pushes it higher. That's the load an artificial hip must survive for ~25 million steps a year.\n\nTo handle motion you add one term: instead of `ΣM = 0`, you write `ΣM = I·α` (the rotational version of `F = ma`, where `I` is the limb's moment of inertia and `α` its angular acceleration). At the instant of a snapshot, or whenever accelerations are small, it collapses right back to the static balance you already know. This is why static analysis is the foundation: it's the limiting case, and it's where every gait-lab and implant-design calculation begins.\n\nThe big-picture lesson for a biomedical engineer: the forces inside the body are *internally amplified* by lever geometry, the joint reaction force is the design-driving load, and converting that force to stress (`σ = F/A`) on bone, cartilage, screws, and implants is what separates a device that lasts decades from one that fails in two years."
    },
    {
      id: "b_callout_interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "What they're really testing 🎤",
      markdown:
        "Biomechanics interviewers want to watch you turn a body part into a free-body diagram. The prompts and the answers that scream \"hire this person\":\n\n- **\"Find the biceps force to hold a weight.\"** Take moments about the elbow: `F = W·d/a`. Say out loud *why* you choose the joint as your moment center — it eliminates the unknown joint reaction force.\n- **\"Now the joint reaction force.\"** `ΣF = 0` → `R = F − W`. Note that this, not the external weight, is what wears out implants. Bonus points for mentioning the hip reaches 3–4× body weight in gait.\n- **\"Why are muscle forces so large?\"** Third-class levers: the muscle's moment arm is tiny next to the load's, so `d/a` is large. The body trades force for speed and reach.\n- **\"Is the bone/implant/screw safe?\"** Convert force to stress with `σ = F/A` and compare to material strength. The force comes from lever geometry; the stress comes from cross-sectional area.\n- **\"What did you assume, and when does it break?\"** You modeled the forearm as rigid, ignored its weight and the antagonist muscles, and assumed static equilibrium. For fast motion you'd add `ΣM = I·α`. Naming your own assumptions is the single clearest signal of a real engineer."
    },
    {
      id: "b_wrap",
      kind: "PROSE",
      title: "The one path every joint problem walks",
      markdown:
        "Every biomechanics force problem — homework, interview, or real implant design — follows the same four steps. Burn the path in and you'll never be lost:\n\n1. **Model the joint as a lever.** Draw the free-body diagram of the limb, mark the pivot (joint), the effort (muscle), and the load. Identify the lever class — most are third-class, force-losing.\n2. **Moments → muscle force.** `ΣM = 0` about the joint gives `F = W·d/a`. Taking moments about the joint kills the unknown joint reaction force, leaving one equation, one unknown.\n3. **Forces → joint reaction force.** `ΣF = 0` gives the load the joint actually carries — usually the design-driving number.\n4. **Force → stress.** `σ = F/A` on bone, tendon, or implant tells you whether it survives.\n\nTwo facts to feel in your bones: muscle and joint forces are *much larger* than the external loads, because short muscle moment arms amplify everything; and the joint reaction force — not the weight in your hand — is what wears bodies and devices out. Now you can look at your own arm holding a coffee mug and *see* the 500 N quietly running through your elbow. Go bend something — carefully. 💪"
    }
  ],
  keyTakeaways: [
    "Joints are levers: pivot = joint, effort = muscle, load = external weight. Most body joints are 3rd-class levers — force-losing but speed- and reach-gaining.",
    "A static moment balance about the joint gives the muscle force: F = W·d/a. The tiny muscle moment arm a in the denominator is why muscle forces are huge.",
    "Holding 100 N can put ~700 N through the muscle — roughly the d/a ratio (≈7 at the elbow). The body internally amplifies every load you carry.",
    "After the muscle force, use ΣF = 0 to get the joint reaction force (R = F − W ≈ 600 N at the elbow). This, not the external load, is what wears out joints and implants.",
    "Convert force to stress with σ = F/A to judge whether bone, tendon, screw, or implant survives. Force is set by lever geometry; stress is set by cross-sectional area.",
    "Hip and knee joint reaction forces reach 3–4× body weight during normal gait — the design-driving load for orthopedic implants enduring tens of millions of cycles.",
    "Static analysis is the foundation: add ΣM = I·α for motion, but at a snapshot or low acceleration it collapses back to the moment balance you already know."
  ]
};
