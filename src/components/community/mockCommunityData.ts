import type { Thread } from "./types";

// ---------------------------------------------------------------------------
//  Static mock data — no DB, no API. Everything renders from this array.
//  The first thread nests comments 4 levels deep to prove the recursion.
// ---------------------------------------------------------------------------

export const MOCK_THREADS: Thread[] = [
  {
    id: "t_btu_benchmark",
    title:
      "Evaluating 18,300 BTU window units vs. central systems for lab benchmarking",
    author: "thermal_tom",
    flair: "HVAC",
    tags: ["heat-load", "cop", "benchmarking"],
    upvotes: 248,
    timestamp: "6h",
    content:
      "We're standing up a thermal-fluids test cell and need to hold ±0.5°C around a ~5 kW heat load. " +
      "Procurement is pushing two 18,300 BTU window units (≈5.36 kW nominal each) instead of tapping the building's central chilled-water loop.\n\n" +
      "My worry is duty-cycle stability and sensor-grade temperature control. Has anyone benchmarked window units for lab-grade control, or is the central system always worth the install cost? Looking for real numbers, not vibes.",
    comments: [
      {
        id: "c1",
        author: "coldplate_kara",
        content:
          "18,300 BTU/hr is ~5.36 kW of nominal cooling, but that's the rating at AHRI conditions (80°F DB / 67°F WB indoor). In a sealed lab pulling sensible-only load you'll see the unit short-cycle long before it modulates nicely. Window units are bang-bang controllers — they can't hold ±0.5°C.",
        upvotes: 132,
        timestamp: "5h",
        replies: [
          {
            id: "c1r1",
            author: "thermal_tom",
            content:
              "That's the crux of my concern. So even two units staged won't give me stable control because each is just on/off?",
            upvotes: 41,
            timestamp: "5h",
            replies: [
              {
                id: "c1r1r1",
                author: "coldplate_kara",
                content:
                  "Right. Staging two bang-bang units gives you a coarser sawtooth, not finer control. The fix is decoupling: run the window unit(s) flat-out to over-cool a buffer volume, then trim with a small PID-driven resistive heater on the load side. Cool hard, heat precisely — that's how you get ±0.1°C out of dumb compressors.",
                upvotes: 88,
                timestamp: "4h",
                replies: [
                  {
                    id: "c1r1r1r1",
                    author: "phd_dropout",
                    content:
                      "+1 to the over-cool-and-trim approach. We did exactly this on a battery abuse rig — window unit held the chamber ~8°C below setpoint, a 600 W cartridge heater on PID did the last mile. Held ±0.15°C across an 11-hour soak. Total BOM under $900.",
                    upvotes: 54,
                    timestamp: "3h",
                    replies: [],
                  },
                ],
              },
            ],
          },
          {
            id: "c1r2",
            author: "fluids_fan",
            content:
              "Don't forget latent load. If your cell isn't sealed, the window unit burns a big chunk of that 5.36 kW pulling moisture, and your *sensible* capacity craters. Measure your infiltration first.",
            upvotes: 37,
            timestamp: "4h",
            replies: [],
          },
        ],
      },
      {
        id: "c2",
        author: "central_systems_sam",
        content:
          "Central chilled water wins on stability and acoustics, full stop — but the install isn't free. Budget for a control valve, a flow meter, and a week of pipefitting. If this rig will run for years, amortized it's cheaper. For a 3-month study, the window-unit hack is defensible.",
        upvotes: 76,
        timestamp: "5h",
        replies: [
          {
            id: "c2r1",
            author: "thermal_tom",
            content:
              "It's a multi-year cell, so that reframes it. The amortization argument is what I'll take to procurement. Thanks.",
            upvotes: 19,
            timestamp: "4h",
            replies: [],
          },
        ],
      },
      {
        id: "c3",
        author: "datasheet_devotee",
        content:
          "Whatever you pick: do not trust the nameplate COP. Pull the actual capacity-vs-ambient curve and derate for your worst-case room temperature. A unit rated 5.36 kW at 35°C outdoor can drop below 4 kW on a hot day.",
        upvotes: 44,
        timestamp: "3h",
        replies: [],
      },
    ],
  },
  {
    id: "t_reynolds_intuition",
    title: "Fastest gut-check for turbulent vs laminar in an interview?",
    author: "vortex_vic",
    flair: "Fluids",
    tags: ["reynolds", "intuition"],
    upvotes: 161,
    timestamp: "1d",
    content:
      "Whiteboard, no calculator. Interviewer asks if flow in a pipe is turbulent. What's your 10-second reasoning instead of grinding Re = ρVD/μ by hand?",
    comments: [
      {
        id: "rc1",
        author: "coldplate_kara",
        content:
          "Anchor on water in a 25 mm tap at ~1 m/s → Re ≈ 25,000, firmly turbulent. Then scale from that reference point in your head. Most everyday liquid pipe flow is turbulent; you have to work to stay laminar.",
        upvotes: 73,
        timestamp: "1d",
        replies: [
          {
            id: "rc1r1",
            author: "fluids_fan",
            content:
              "The candle-plume visual also kills it: smoke rises laminar then trips to turbulent as it speeds up. Great thing to sketch.",
            upvotes: 28,
            timestamp: "22h",
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: "t_fea_singularity",
    title: "Peak stress won't converge at a fillet — am I doing FEA wrong?",
    author: "mesh_master",
    flair: "FEA",
    tags: ["mesh", "singularity", "verification"],
    upvotes: 134,
    timestamp: "2d",
    content:
      "Linear-static run. Every time I refine the mesh at a sharp re-entrant corner the von Mises peak climbs higher and never plateaus. Solver issue or model issue?",
    comments: [
      {
        id: "fc1",
        author: "phd_dropout",
        content:
          "Model issue — that's a geometric stress singularity. A perfectly sharp corner has theoretically infinite stress, so finer elements just resolve more of an unbounded field. Add a realistic fillet radius or evaluate stress a defensible distance away.",
        upvotes: 95,
        timestamp: "2d",
        replies: [
          {
            id: "fc1r1",
            author: "mesh_master",
            content:
              "So reporting the peak nodal stress there is meaningless. Got it. I'll model the actual fillet.",
            upvotes: 22,
            timestamp: "2d",
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: "t_offer_negotiation",
    title: "Got the structures offer — how hard can I push on comp?",
    author: "newgrad_nina",
    flair: "Career",
    tags: ["offer", "negotiation"],
    upvotes: 89,
    timestamp: "3d",
    content:
      "Aerospace structures, new grad, single offer in hand. Recruiter says the number is 'pretty firm.' Is there room, and what levers actually move for hardware roles?",
    comments: [
      {
        id: "oc1",
        author: "central_systems_sam",
        content:
          "'Pretty firm' is not 'final.' Sign-on bonus and start date are almost always more flexible than base. Ask for the sign-on first — it doesn't touch their band.",
        upvotes: 51,
        timestamp: "3d",
        replies: [],
      },
    ],
  },
];
