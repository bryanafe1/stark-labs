import type { LessonDetail } from "@/types/lessons";

export const lesson: LessonDetail = {
  id: "l_statics",
  slug: "statics-and-free-body-diagrams",
  title: "Statics and Free-Body Diagrams",
  summary:
    "Why doesn't the Golden Gate Bridge fall down? Why does a ladder slip out from under you at exactly the wrong moment? The answer to every \"why doesn't this move?\" question in engineering is the same three equations — and one humble sketch. In this lesson you'll learn to draw a free-body diagram, find the hidden forces holding the world together, and solve for beam reactions like you've done it a thousand times.",
  discipline: "MECHANICAL",
  difficulty: "EASY",
  estMinutes: 22,
  tags: [
    "statics",
    "free-body-diagram",
    "equilibrium",
    "reactions",
    "moments",
    "supports",
    "mechanics",
    "interview-favorite",
  ],
  objectives: [
    "Draw a clean free-body diagram for any object or beam — and know exactly which forces to include and which to throw away.",
    "Identify the three support types (pin, roller, fixed) on sight and write down the reactions each one can produce.",
    "Apply the three equilibrium equations ΣFx = 0, ΣFy = 0, ΣM = 0 with confidence and the right sign convention.",
    "Take moments about a clever point to solve for an unknown reaction in a single line — no simultaneous equations needed.",
    "Solve both support reactions of a loaded simply-supported beam from scratch.",
  ],
  prerequisites: [
    "Basic trigonometry (resolving a force into x and y components)",
    "Vectors: adding forces, the idea of magnitude and direction",
    "Comfort with simple algebra (solving one equation for one unknown)",
  ],
  interviewAngle:
    "Statics is the gateway exam of every mechanical, civil, and structural interview, because it instantly reveals whether a candidate can model the physical world. Nobody asks \"state the equilibrium equations\" — they slide a sketch across the table and watch what you do. The strong candidate does four things fast: (1) draws a free-body diagram and isolates the body cleanly, replacing each support with the reactions it can actually exert (a roller gives one force, a pin gives two, a fixed end gives two forces plus a moment), (2) picks a smart point to sum moments about — usually a support, so an unknown reaction vanishes from the equation and you solve in one line, (3) keeps a consistent sign convention and never loses a minus sign, and (4) sanity-checks the answer: do the two reactions add up to the total load? Expect them to probe the modeling judgment too — why a roller can't resist horizontal force, what 'two-force member' buys you, and why you should sum moments about a support rather than blindly writing ΣFy first.",
  blocks: [
    {
      id: "s_intro",
      kind: "PROSE",
      title: "The most boring superpower in engineering 🏛️",
      markdown:
        "Look around. The chair you're sitting in, the building over your head, the bridge you'll drive across later — all of it is *not moving*. Boring, right? Except \"not moving\" is doing an enormous amount of work. Every one of those objects is being shoved, pulled, and tugged by forces in a dozen directions at once, and the only reason it sits there calmly is that all those forces **perfectly cancel**.\n\nThat is the entire subject of **statics**: the study of things that don't accelerate. And it rests on one almost embarrassingly simple idea from Newton — if an object isn't accelerating, the forces on it must sum to zero, *and* the twisting effects (moments) must sum to zero too.\n\nHere's the catch that trips up every beginner: the forces holding the world up are mostly **invisible**. The floor pushes back on your chair. The wall grips the shelf bracket. The bridge piers heave upward against gravity. These are **reaction forces** — they spring into existence exactly as needed to keep things still, and you can't see them by staring at the object.\n\nSo engineers invented a trick to *make them visible*: the **free-body diagram** (FBD). You mentally cut the object out of the world, draw it alone, and replace everything you removed with the force it was applying. Do this right and a confusing real-world scene collapses into a clean little physics problem you can actually solve. Master the FBD and you've mastered the doorway to all of mechanics."
    },
    {
      id: "s_video",
      kind: "VIDEO",
      youtubeId: "hP3MIc6nlew",
      title: "Watch: Free-Body Diagrams in 9 Minutes",
      channel: "Less Boring Lectures",
      caption:
        "A fast, friendly tour of exactly the skill we're building: isolating a body and drawing every force on it. Watch it now — the rest of the lesson will land harder once you've seen a few FBDs drawn from scratch."
    },
    {
      id: "s_supports",
      kind: "PROSE",
      title: "Supports: who can push, and which way? 🔩",
      markdown:
        "Before you can draw reactions, you need to know *what each support is allowed to do*. A support's job is to stop motion in certain directions — and it can only push back in exactly those directions. Three show up everywhere:\n\n- **Roller (or simple support).** Think of a beam resting on a roller or a smooth surface. It can only push **perpendicular** to that surface — usually straight up. It can't grab the beam sideways and it can't resist rotation. **Reactions: 1** (one force, perpendicular).\n\n- **Pin (or hinge).** Think of a bolt through a hole, like a door hinge. It can push in *any* direction in the plane — so we split that into a horizontal and a vertical component. But it lets the beam **rotate** freely about the pin, so it can't resist a moment. **Reactions: 2** (horizontal force + vertical force).\n\n- **Fixed (or cantilever / clamped).** Think of a beam concreted into a wall. It clamps the beam completely: no sliding, no rotating. So it can push horizontally, push vertically, *and* resist twisting. **Reactions: 3** (horizontal force + vertical force + a moment).\n\nThe magic number is how many unknowns each support adds: **1, 2, 3**. In a 2D problem you have exactly **three** equilibrium equations to spend, so if your support reactions add up to three unknowns, the problem is *statically determinate* — you can solve it with statics alone. (More than three and you've got a statically indeterminate problem that needs extra tools — a story for another lesson.)\n\nA classic **simply-supported beam** is a pin at one end and a roller at the other: 2 + 1 = 3 unknowns, 3 equations. A perfect match. That's the beam we'll solve."
    },
    {
      id: "s_callout_roller",
      kind: "CALLOUT",
      variant: "tip",
      title: "The roller test that saves you every time",
      markdown:
        "When you see a roller, ask one question: *which direction can it push?* The answer is always **perpendicular to the surface it rolls on** — and nothing else. A roller on flat ground gives a single vertical force. It cannot pull, cannot push sideways, cannot resist rotation. Beginners constantly draw a horizontal reaction at a roller; there is no such thing. If you need horizontal restraint, that's the pin's job. Get this and half of statics gets easier."
    },
    {
      id: "s_equilibrium",
      kind: "PROSE",
      title: "The three equations that run the universe",
      markdown:
        "Here they are — the entire toolkit for any 2D statics problem. If a body is in equilibrium (not accelerating, not spinning up), then:\n\n```\nΣFx = 0      (forces left-right cancel)\nΣFy = 0      (forces up-down cancel)\nΣM  = 0      (twisting effects cancel, about ANY point)\n```\n\nThe first two are intuitive: pushes left equal pushes right, pushes up equal pushes down. The third is the secret weapon. A **moment** (or torque) is a force's tendency to rotate the body, and it equals the force times its **perpendicular distance** from the pivot — the *lever arm*:\n\n```\nM = F · d\n```\n\nA force acting right at the pivot has zero lever arm, so it produces **zero moment** about that point. *That's the trick that makes statics easy.* You get to choose any point to take moments about — so choose the point where an annoying unknown reaction acts, and that unknown drops out of the equation entirely. One equation, one unknown, solved.\n\n**Sign convention:** pick a positive direction and stick with it. The usual choice is right = +x, up = +y, and **counterclockwise = positive moment** (curl the fingers of your right hand). If an answer comes out negative, don't panic — it just means the force points opposite to the way you guessed. The math self-corrects.\n\nIn symbols, equilibrium for any 2D body is simply $\\sum F_x = 0$, $\\sum F_y = 0$, and $\\sum M = 0$, where the moment of a force about a point is\n\n$$M = F\\,d$$"
    },
    {
      id: "s_formula",
      kind: "FORMULA",
      title: "Moment of a force about a point",
      display: "M = F · d",
      variables: [
        { symbol: "M", name: "Moment (torque) about the chosen point", unit: "N·m" },
        { symbol: "F", name: "Magnitude of the force", unit: "N" },
        { symbol: "d", name: "Perpendicular distance from the point to the force's line of action (the lever arm)", unit: "m" }
      ],
      note:
        "The d is the PERPENDICULAR distance, not the slanted distance to where the force is applied. A force whose line passes through your chosen point has d = 0 and contributes no moment — which is exactly why summing moments about a support kills that support's reaction and lets you solve the other one in a single line."
    },
    {
      id: "s_predict_pivot",
      kind: "PREDICT",
      question:
        "You want to find the reaction at support A of a simply-supported beam, and you're going to use ΣM = 0. To get R_A in a single clean equation, which point should you sum moments about?",
      options: [
        { id: "a", label: "About support A — it's the one you care about" },
        { id: "b", label: "About support B — the OTHER support" },
        { id: "c", label: "About the midpoint of the beam — it's central and fair" }
      ],
      answerId: "b",
      reveal:
        "About support **B** — the *other* one. It feels backwards, but it's the whole game.\n\nWhen you sum moments about B, the reaction `R_B` acts right at B, so its lever arm is zero and it **vanishes** from the equation. What's left contains only `R_A` and the known loads — one equation, one unknown, done. No simultaneous equations, no algebra mess.\n\nIf you'd summed about A instead, you'd kill `R_A` (the thing you wanted!) and solve for `R_B`. Both are valid — just aim the trick at whichever reaction you want to find by pivoting about the *opposite* support. This single habit is the difference between a slick one-line solution and a tangle of equations."
    },
    {
      id: "s_recipe",
      kind: "PROSE",
      title: "The five-step recipe for any statics problem 📋",
      markdown:
        "Every reaction problem you'll ever meet follows the same march. Burn this in and you'll never stare at a blank page again:\n\n1. **Isolate the body.** Mentally cut it free from the world. Draw it alone.\n2. **Draw every external force.** Applied loads (weights, pushes, pulls) *and* the reaction at every support, using the right number of arrows for each support type (roller = 1, pin = 2, fixed = 3). Guess directions; the signs will fix themselves.\n3. **Pick axes and a sign convention.** Right = +x, up = +y, counterclockwise = + moment. Write it down so you don't drift.\n4. **Write the three equations.** Start with ΣM about a *support* to bag one reaction immediately. Then mop up with ΣFy and ΣFx.\n5. **Solve and sanity-check.** Do the vertical reactions add up to the total downward load? If not, hunt the error. A negative answer just means you guessed a direction backwards.\n\nNotice the order in step 4: lead with moments, not forces. Beginners reflexively write ΣFy = 0 first and end up with two unknowns in one equation, stuck. Pros take moments about a support first, isolate one reaction, *then* the force equations become trivial. Same physics, a fraction of the work."
    },
    {
      id: "s_formula_ra",
      kind: "FORMULA",
      title: "Reaction at A for a point load (simply-supported beam)",
      display: "R_A = P·b / L",
      variables: [
        { symbol: "R_A", name: "Vertical reaction at support A", unit: "N" },
        { symbol: "P", name: "Magnitude of the downward point load", unit: "N" },
        { symbol: "b", name: "Distance from the load to support B (the far support)", unit: "m" },
        { symbol: "L", name: "Span between supports A and B", unit: "m" }
      ],
      note:
        "This is just ΣM about B, solved. The far support A carries more of the load when the load sits closer to A (large b). When the load is dead-center, b = L/2 and each support carries exactly half: R_A = P/2. Play with it in the sandbox below to feel the lever in action."
    },
    {
      id: "s_sandbox",
      kind: "SANDBOX",
      title: "Play with it: the seesaw reaction machine 🎛️",
      description:
        "Here's a simply-supported beam of span L with supports A (left) and B (right), carrying a downward point load P sitting a distance b from the FAR support B. Drag the load along the beam and watch how the two supports share it. Slide b toward L (load near A) and R_A grabs almost the whole load; slide b toward 0 (load near B) and R_A drops toward nothing. With the defaults (P = 1000 N, b = 3 m, L = 4 m) the load sits three-quarters of the way toward A, so support A carries 750 N — three-quarters of the load. The rest (250 N) is B's problem.",
      variables: [
        { key: "P", label: "Load P", unit: "N", min: 100, max: 5000, step: 100, default: 1000 },
        { key: "b", label: "Distance from B", unit: "m", min: 0, max: 4, step: 0.1, default: 3 },
        { key: "L", label: "Span L", unit: "m", min: 1, max: 6, step: 0.1, default: 4 }
      ],
      expression: "P * b / L",
      outputLabel: "Reaction at A",
      outputUnit: "N",
      precision: 0
    },
    {
      id: "s_predict_share",
      kind: "PREDICT",
      question:
        "In the sandbox, you slide the point load until it sits directly over support B (so b = 0, the load is right on top of B). What does support A read now?",
      options: [
        { id: "a", label: "Half the load — supports always split it evenly" },
        { id: "b", label: "The full load — A is doing all the work" },
        { id: "c", label: "Zero — A reads nothing at all" },
        { id: "d", label: "Exactly the load times the span" }
      ],
      answerId: "c",
      reveal:
        "Zero. Support A reads **nothing**.\n\nLook at the formula: `R_A = P·b/L`, and with `b = 0` the whole thing is zero. Physically, if the load is sitting *directly* on support B, then B feels the entire load and A has nothing to do — the beam between them is just along for the ride.\n\nThis is the lever logic of moments made visible: the farther a load sits from a support, the more that support is forced to carry. Push the load right onto B and you've handed B 100% of it. Slide it to the exact center (b = L/2) and the two supports split it 50/50. Statics isn't memorization — it's a seesaw you can feel."
    },
    {
      id: "s_check_supports",
      kind: "CHECK",
      question:
        "A beam is held by a roller at one end and a pin at the other. How many unknown reaction components does this create, and is the beam statically determinate in 2D?",
      choices: [
        { id: "c1", label: "2 unknowns — and yes, determinate" },
        { id: "c2", label: "3 unknowns — and yes, determinate" },
        { id: "c3", label: "4 unknowns — no, indeterminate" },
        { id: "c4", label: "6 unknowns — no, indeterminate" }
      ],
      answerId: "c2",
      explanation:
        "A roller gives 1 reaction (one force, perpendicular to its surface) and a pin gives 2 (a horizontal and a vertical force): 1 + 2 = 3 unknowns. In 2D you have exactly 3 equilibrium equations (ΣFx, ΣFy, ΣM), so 3 unknowns and 3 equations match perfectly — the beam is statically determinate and solvable with statics alone. This pin-plus-roller combo is the classic simply-supported beam for exactly this reason."
    },
    {
      id: "s_check_sign",
      kind: "CHECK",
      question:
        "You assume a reaction R points UP and solve the equations, but R comes out as −300 N. What does that mean?",
      choices: [
        { id: "s1", label: "You made an arithmetic mistake — reactions can't be negative" },
        { id: "s2", label: "The force is actually 300 N pointing DOWN; your assumed direction was backwards" },
        { id: "s3", label: "The beam is not in equilibrium" },
        { id: "s4", label: "The support is broken and provides no force" }
      ],
      answerId: "s2",
      explanation:
        "A negative result simply means the real force points opposite to the direction you assumed. You guessed up; the math says it actually acts downward with magnitude 300 N. This is a feature, not a bug — you never have to guess directions correctly, because the sign self-corrects. Just stay consistent with your convention and read the sign at the end. (A downward reaction is real and common, e.g. a support that has to hold a beam *down* against an overhanging load lifting it.)"
    },
    {
      id: "s_walkthrough",
      kind: "WALKTHROUGH",
      title: "Solve it live: reactions of a loaded beam 🧮",
      steps: [
        {
          title: "Draw the free-body diagram",
          markdown:
            "A horizontal beam spans `L = 4 m` between support **A** (a pin, at the left, `x = 0`) and support **B** (a roller, at the right, `x = 4 m`). A single downward load `P = 1000 N` hangs at `x = 1 m` — that is, a distance `b = 3 m` from the far support B.\n\nIsolate the beam and draw the forces:\n\n- `P = 1000 N` pointing **down** at `x = 1 m`.\n- `R_A` at A. The pin *could* give a horizontal component too, but there's no horizontal load, so `R_Ax = 0` and we just carry the vertical `R_A`, pointing **up** (our guess).\n- `R_B` at B, pointing **up** (roller → one vertical force).\n\nTwo unknowns left, `R_A` and `R_B`. Time to spend our equations."
        },
        {
          title: "Sum moments about B to find R_A",
          markdown:
            "Pivot about **B** so that `R_B` (acting right at B) drops out. Take counterclockwise as positive. Lever arms are measured from B:\n\n- `R_A` acts `L = 4 m` from B, and it pushes up on the left end → it rotates the beam **counterclockwise** about B → positive: `+R_A · 4`.\n- `P` acts `b = 3 m` from B, pushing down → it rotates the beam **clockwise** about B → negative: `−P · 3`.\n\n```\nΣM_B = 0:   R_A · 4 − 1000 · 3 = 0\n            R_A · 4 = 3000\n            R_A = 750 N  (up)\n```\n\nNotice the structure: `R_A = P·b/L = 1000 · 3 / 4 = 750 N`. That's the sandbox formula, derived from one moment equation."
        },
        {
          title: "Sum vertical forces to find R_B",
          markdown:
            "Now the easy one. Up is positive:\n\n```\nΣFy = 0:   R_A + R_B − P = 0\n           750 + R_B − 1000 = 0\n           R_B = 250 N  (up)\n```\n\nBoth reactions are positive, so both genuinely point up — our guesses were right. (We could equally have taken moments about A to get `R_B = P·a/L = 1000 · 1 / 4 = 250 N` directly. Same answer, two routes.)"
        },
        {
          title: "Check horizontal equilibrium and sanity-check",
          markdown:
            "There are no horizontal loads, so:\n\n```\nΣFx = 0:   R_Ax = 0   ✓ (confirmed, the pin carries no horizontal force here)\n```\n\nFinal sanity check — do the upward reactions equal the total downward load?\n\n```\nR_A + R_B = 750 + 250 = 1000 N = P   ✓\n```\n\nThey balance perfectly. The load sits closer to A, so A carries the larger share (750 N vs 250 N) — exactly what the seesaw intuition predicted. Three equations, two reactions, one tidy answer."
        }
      ]
    },
    {
      id: "s_worked_example",
      kind: "WORKED_EXAMPLE",
      title: "Real job: a balcony beam with two loads 🏗️",
      problem:
        "A simply-supported balcony beam spans L = 6 m, pinned at A (left) and on a roller at B (right). It carries two downward point loads: P₁ = 2000 N at 2 m from A, and P₂ = 3000 N at 4.5 m from A (a person and a planter, say). Find the vertical reactions R_A and R_B.",
      steps: [
        {
          label: "Set up the FBD and convention",
          markdown:
            "Beam from A (`x = 0`) to B (`x = 6 m`). Forces: `P₁ = 2000 N` down at `x = 2 m`; `P₂ = 3000 N` down at `x = 4.5 m`; `R_A` up at A; `R_B` up at B. No horizontal loads, so the pin's horizontal reaction is zero. Convention: up = +, counterclockwise moment = +."
        },
        {
          label: "Sum moments about A to find R_B",
          markdown:
            "Pivot about A so `R_A` drops out. Distances measured from A; the downward loads rotate clockwise (negative), `R_B` at the far end rotates counterclockwise (positive):\n\n```\nΣM_A = 0:   R_B · 6 − P₁ · 2 − P₂ · 4.5 = 0\n            R_B · 6 − 2000 · 2 − 3000 · 4.5 = 0\n            R_B · 6 − 4000 − 13500 = 0\n            R_B · 6 = 17500\n            R_B = 2916.7 N  (up)\n```"
        },
        {
          label: "Sum vertical forces to find R_A",
          markdown:
            "Total downward load is `P₁ + P₂ = 2000 + 3000 = 5000 N`.\n\n```\nΣFy = 0:   R_A + R_B − 5000 = 0\n           R_A = 5000 − 2916.7\n           R_A = 2083.3 N  (up)\n```"
        },
        {
          label: "Sanity-check",
          markdown:
            "Do they add up? `R_A + R_B = 2083.3 + 2916.7 = 5000 N` ✓ — exactly the total load. And it makes sense that B carries more: the heavier load `P₂` sits closer to B, so B is forced to shoulder the larger share. Intuition and algebra agree."
        }
      ],
      answer:
        "R_A ≈ 2083 N (up) and R_B ≈ 2917 N (up). They sum to the full 5000 N load, and B carries more because the bigger load (P₂ = 3000 N) sits nearer to B. Solved with one moment equation (about A) plus ΣFy — no simultaneous equations needed."
    },
    {
      id: "s_callout_warning",
      kind: "CALLOUT",
      variant: "warning",
      title: "Three mistakes that wreck statics problems",
      markdown:
        "- **Drawing a horizontal reaction at a roller.** A roller can only push perpendicular to its surface — there is no sideways force. Only pins and fixed supports resist horizontal loads. This is the single most common FBD error.\n- **Forgetting a reaction component (or inventing one).** Count by support type every time: roller = 1, pin = 2, fixed = 3. A fixed end has a *moment* reaction that's invisible and easy to drop — leave it out and your answers are simply wrong.\n- **Mixing up the lever arm.** The moment uses the *perpendicular* distance to the force's line of action, not the slanted distance to the application point, and not the distance along the beam if the force is angled. When in doubt, resolve the force into components first, then each component's lever arm is clean."
    },
    {
      id: "s_callout_interview",
      kind: "CALLOUT",
      variant: "interview",
      title: "What they're really testing 🎤",
      markdown:
        "Statics interviews are almost always a sketch and a \"walk me through it.\" The moves that signal a strong hire:\n\n- **\"Find the reactions on this beam.\"** Draw the FBD out loud, name each support's reactions (roller = 1, pin = 2, fixed = 3), then say *\"I'll sum moments about a support so one reaction drops out.\"* That sentence alone marks you as someone who's done this for real.\n- **\"Why sum moments about B instead of A?\"** Because `R_B` has zero lever arm about B and vanishes — you isolate `R_A` in one equation. Aim the trick at whichever reaction you want by pivoting about the *opposite* support.\n- **\"What can a roller resist?\"** Only force perpendicular to its surface. No horizontal force, no moment. Knowing what a support *can't* do is as important as what it can.\n- **\"Your reaction came out negative — bug or feature?\"** Feature. It means the true direction is opposite your assumption; magnitude is still correct. Confident candidates never re-solve over a sign.\n- **\"Is this beam solvable with statics alone?\"** Count unknowns vs equations. Three reactions, three equations (in 2D) → determinate. More unknowns → statically indeterminate, needs compatibility/deflection methods. Naming that distinction is a senior-level tell."
    },
    {
      id: "s_wrap",
      kind: "PROSE",
      title: "The one path every statics problem walks",
      markdown:
        "Strip away the scary sketches and every statics problem is the same short walk:\n\n1. **Isolate** the body and draw it alone — the free-body diagram.\n2. **Replace each support** with its reactions (roller 1, pin 2, fixed 3) and draw every applied load.\n3. **Pick axes and a sign convention**, and write them down.\n4. **Sum moments about a support first** to bag one reaction in a single line, then clean up with ΣFy and ΣFx.\n5. **Sanity-check**: do the reactions balance the loads?\n\nTwo ideas hold the whole subject up: a body in equilibrium has its **forces summing to zero** and its **moments summing to zero**, and a **moment is force times perpendicular distance** — which is why pivoting about a support makes an unknown disappear. Get fluent in the free-body diagram and you've unlocked the door to beams, trusses, frames, and machines — everything in mechanics is built on top of this. The world holds still for a reason. Now you can prove it. 💪"
    }
  ],
  keyTakeaways: [
    "A free-body diagram isolates one body and replaces everything you removed with the force it exerted — it makes the invisible reaction forces visible so you can solve for them.",
    "Supports come in three flavors with 1, 2, 3 reactions: roller (one perpendicular force), pin (horizontal + vertical force), fixed (those two plus a moment).",
    "Equilibrium in 2D is three equations: ΣFx = 0, ΣFy = 0, ΣM = 0 (about any point) — that's the entire toolkit.",
    "A moment is M = F·d with d the perpendicular lever arm; a force through your chosen pivot has zero moment, which is the key to one-line solutions.",
    "Sum moments about a support to make that support's reaction vanish and solve the other reaction directly — for R_A on a point-loaded simple beam, R_A = P·b/L.",
    "A negative reaction isn't an error — it just means the true direction is opposite your assumption; the magnitude is still right.",
    "Always sanity-check: the upward reactions must add up to the total downward load. If they don't, hunt the mistake.",
  ]
};
