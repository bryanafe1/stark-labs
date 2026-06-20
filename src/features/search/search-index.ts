/**
 * Static search index for the ⌘K command palette.
 *
 * This is a hand-maintained, client-importable module (NO "server-only"):
 * the palette renders on the client and imports SEARCH_INDEX directly.
 *
 * It is intentionally a flat, static list. Later this can be generated at
 * build time from the real catalogs / DB (nav config, lessons-data, the
 * practice problem catalog, community threads) instead of being authored
 * by hand — the SearchItem shape is designed to be the generation target.
 */

export type SearchItem = {
  id: string;
  type: "page" | "problem" | "lesson" | "thread";
  title: string;
  subtitle?: string;
  href: string;
  keywords?: string[];
};

/** Primary nav + secondary destinations. */
const PAGES: SearchItem[] = [
  {
    id: "page-dashboard",
    type: "page",
    title: "Dashboard",
    subtitle: "Your overview & activity",
    href: "/dashboard",
    keywords: ["home", "overview", "stats", "activity"],
  },
  {
    id: "page-arena",
    type: "page",
    title: "Arena",
    subtitle: "Ranked ELO matchmaking",
    href: "/arena",
    keywords: ["ranked", "elo", "match", "duel", "compete", "versus"],
  },
  {
    id: "page-learn",
    type: "page",
    title: "Learn",
    subtitle: "Interactive lessons",
    href: "/learn",
    keywords: ["lessons", "courses", "study", "tutorials"],
  },
  {
    id: "page-practice",
    type: "page",
    title: "Practice",
    subtitle: "Drill engineering problems",
    href: "/practice",
    keywords: ["problems", "drills", "exercises", "quiz", "solve"],
  },
  {
    id: "page-leaderboard",
    type: "page",
    title: "Leaderboard",
    subtitle: "Top ranked engineers",
    href: "/leaderboard",
    keywords: ["ranking", "rankings", "top", "elo", "standings"],
  },
  {
    id: "page-community",
    type: "page",
    title: "Community",
    subtitle: "Discussions & threads",
    href: "/community",
    keywords: ["forum", "discussion", "threads", "people", "social"],
  },
  {
    id: "page-skills",
    type: "page",
    title: "Skills",
    subtitle: "Your skill tree & mastery",
    href: "/skills",
    keywords: ["skill tree", "mastery", "progress", "competency"],
  },
  {
    id: "page-quizzes",
    type: "page",
    title: "Quizzes",
    subtitle: "Timed assessments",
    href: "/quizzes",
    keywords: ["quiz", "test", "assessment", "exam"],
  },
  {
    id: "page-profile",
    type: "page",
    title: "Profile",
    subtitle: "Your public profile",
    href: "/profile",
    keywords: ["account", "me", "bio", "avatar"],
  },
  {
    id: "page-settings",
    type: "page",
    title: "Settings",
    subtitle: "Preferences & account",
    href: "/settings",
    keywords: ["preferences", "config", "account", "options"],
  },
];

/** The six published lessons (slugs/titles mirror features/lessons/content). */
const LESSONS: SearchItem[] = [
  {
    id: "lesson-beam-bending-and-deflection",
    type: "lesson",
    title: "Beam Bending and Deflection",
    subtitle: "Mechanics of materials",
    href: "/learn/beam-bending-and-deflection",
    keywords: ["beam", "bending", "deflection", "moment", "cantilever", "mechanical"],
  },
  {
    id: "lesson-column-buckling-and-stability",
    type: "lesson",
    title: "Column Buckling & Elastic Stability",
    subtitle: "Mechanics of materials",
    href: "/learn/column-buckling-and-stability",
    keywords: ["buckling", "euler", "column", "stability", "critical load", "mechanical"],
  },
  {
    id: "lesson-rc-circuits-and-transients",
    type: "lesson",
    title: "RC Circuits and First-Order Transients",
    subtitle: "Electrical engineering",
    href: "/learn/rc-circuits-and-transients",
    keywords: ["rc", "circuit", "capacitor", "transient", "time constant", "electrical"],
  },
  {
    id: "lesson-reynolds-number-and-internal-flow",
    type: "lesson",
    title: "Reynolds Number and Internal (Pipe) Flow",
    subtitle: "Mechanical engineering",
    href: "/learn/reynolds-number-and-internal-flow",
    keywords: ["reynolds", "pipe", "flow", "laminar", "turbulent", "fluid", "mechanical"],
  },
  {
    id: "lesson-fea-fundamentals-and-mesh-convergence",
    type: "lesson",
    title: "FEA Fundamentals & Mesh Convergence",
    subtitle: "Mechanical engineering",
    href: "/learn/fea-fundamentals-and-mesh-convergence",
    keywords: ["fea", "finite element", "mesh", "convergence", "simulation", "mechanical"],
  },
  {
    id: "lesson-wing-aerodynamics-lift-and-drag",
    type: "lesson",
    title: "Wing Aerodynamics: Lift and Drag",
    subtitle: "Aerospace engineering",
    href: "/learn/wing-aerodynamics-lift-and-drag",
    keywords: ["wing", "lift", "drag", "aerodynamics", "aerospace", "airfoil"],
  },
];

/** Representative practice problems (plausible slugs across disciplines). */
const PROBLEMS: SearchItem[] = [
  {
    id: "problem-cantilever-tip-deflection",
    type: "problem",
    title: "Cantilever Tip Deflection",
    subtitle: "Beam bending · mechanical",
    href: "/practice/cantilever-tip-deflection",
    keywords: ["cantilever", "deflection", "beam", "bending", "mechanical"],
  },
  {
    id: "problem-euler-buckling-load",
    type: "problem",
    title: "Euler Buckling Load",
    subtitle: "Column stability · mechanical",
    href: "/practice/euler-buckling-load",
    keywords: ["euler", "buckling", "critical load", "column", "mechanical"],
  },
  {
    id: "problem-rc-time-constant",
    type: "problem",
    title: "RC Time Constant",
    subtitle: "First-order transient · electrical",
    href: "/practice/rc-time-constant",
    keywords: ["rc", "time constant", "tau", "capacitor", "electrical"],
  },
  {
    id: "problem-pipe-flow-regime",
    type: "problem",
    title: "Pipe Flow Regime",
    subtitle: "Reynolds number · fluids",
    href: "/practice/pipe-flow-regime",
    keywords: ["reynolds", "pipe", "laminar", "turbulent", "regime", "fluid"],
  },
  {
    id: "problem-simply-supported-max-moment",
    type: "problem",
    title: "Simply Supported Max Moment",
    subtitle: "Beam analysis · civil",
    href: "/practice/simply-supported-max-moment",
    keywords: ["simply supported", "moment", "beam", "shear", "civil"],
  },
  {
    id: "problem-mohrs-circle-principal-stress",
    type: "problem",
    title: "Mohr's Circle Principal Stress",
    subtitle: "Stress transformation · mechanical",
    href: "/practice/mohrs-circle-principal-stress",
    keywords: ["mohr", "principal stress", "transformation", "shear", "mechanical"],
  },
  {
    id: "problem-thevenin-equivalent",
    type: "problem",
    title: "Thévenin Equivalent Circuit",
    subtitle: "Network reduction · electrical",
    href: "/practice/thevenin-equivalent",
    keywords: ["thevenin", "equivalent", "circuit", "resistance", "electrical"],
  },
  {
    id: "problem-rlc-resonant-frequency",
    type: "problem",
    title: "RLC Resonant Frequency",
    subtitle: "Second-order circuit · electrical",
    href: "/practice/rlc-resonant-frequency",
    keywords: ["rlc", "resonance", "frequency", "inductor", "electrical"],
  },
  {
    id: "problem-bernoulli-venturi-pressure",
    type: "problem",
    title: "Bernoulli Venturi Pressure Drop",
    subtitle: "Energy equation · fluids",
    href: "/practice/bernoulli-venturi-pressure",
    keywords: ["bernoulli", "venturi", "pressure", "flow", "fluid"],
  },
  {
    id: "problem-major-head-loss",
    type: "problem",
    title: "Major Head Loss (Darcy-Weisbach)",
    subtitle: "Pipe friction · fluids",
    href: "/practice/major-head-loss",
    keywords: ["head loss", "darcy", "weisbach", "friction factor", "pipe", "fluid"],
  },
  {
    id: "problem-thin-wall-pressure-vessel",
    type: "problem",
    title: "Thin-Wall Pressure Vessel Stress",
    subtitle: "Hoop & axial stress · mechanical",
    href: "/practice/thin-wall-pressure-vessel",
    keywords: ["pressure vessel", "hoop stress", "axial", "thin wall", "mechanical"],
  },
  {
    id: "problem-shaft-torsion-angle",
    type: "problem",
    title: "Shaft Torsion Twist Angle",
    subtitle: "Torsion · mechanical",
    href: "/practice/shaft-torsion-angle",
    keywords: ["torsion", "shaft", "twist", "shear stress", "mechanical"],
  },
  {
    id: "problem-fea-mesh-convergence-error",
    type: "problem",
    title: "FEA Mesh Convergence Error",
    subtitle: "Discretization · mechanical",
    href: "/practice/fea-mesh-convergence-error",
    keywords: ["fea", "mesh", "convergence", "error", "element size", "mechanical"],
  },
  {
    id: "problem-wing-lift-coefficient",
    type: "problem",
    title: "Wing Lift Coefficient",
    subtitle: "Lift equation · aerospace",
    href: "/practice/wing-lift-coefficient",
    keywords: ["lift", "coefficient", "wing", "aerodynamics", "aerospace"],
  },
  {
    id: "problem-induced-drag-aspect-ratio",
    type: "problem",
    title: "Induced Drag vs Aspect Ratio",
    subtitle: "Drag polar · aerospace",
    href: "/practice/induced-drag-aspect-ratio",
    keywords: ["induced drag", "aspect ratio", "drag", "wing", "aerospace"],
  },
  {
    id: "problem-truss-method-of-joints",
    type: "problem",
    title: "Truss Method of Joints",
    subtitle: "Statics · civil",
    href: "/practice/truss-method-of-joints",
    keywords: ["truss", "joints", "statics", "member force", "civil"],
  },
  {
    id: "problem-binary-hex-conversion",
    type: "problem",
    title: "Binary & Hex Conversion",
    subtitle: "Number systems · computer",
    href: "/practice/binary-hex-conversion",
    keywords: ["binary", "hexadecimal", "number system", "base", "computer"],
  },
  {
    id: "problem-cpu-cpi-execution-time",
    type: "problem",
    title: "CPU Execution Time (CPI)",
    subtitle: "Performance · computer",
    href: "/practice/cpu-cpi-execution-time",
    keywords: ["cpi", "cpu", "performance", "clock", "execution time", "computer"],
  },
  {
    id: "problem-cache-hit-rate",
    type: "problem",
    title: "Cache Hit Rate",
    subtitle: "Memory hierarchy · computer",
    href: "/practice/cache-hit-rate",
    keywords: ["cache", "hit rate", "memory", "miss", "computer"],
  },
  {
    id: "problem-reactor-conversion",
    type: "problem",
    title: "Reactor Conversion",
    subtitle: "Reaction engineering · chemical",
    href: "/practice/reactor-conversion",
    keywords: ["conversion", "reactor", "reaction", "moles", "chemical"],
  },
  {
    id: "problem-mass-balance-mixer",
    type: "problem",
    title: "Steady-State Mass Balance",
    subtitle: "Material balance · chemical",
    href: "/practice/mass-balance-mixer",
    keywords: ["mass balance", "material balance", "steady state", "mixer", "chemical"],
  },
  {
    id: "problem-sensible-heat-balance",
    type: "problem",
    title: "Sensible Heat Energy Balance",
    subtitle: "Energy balance · chemical",
    href: "/practice/sensible-heat-balance",
    keywords: ["energy balance", "heat", "cp", "temperature", "chemical"],
  },
  {
    id: "problem-pid-controller-tuning",
    type: "problem",
    title: "PID Controller Steady-State Error",
    subtitle: "Control systems · mechatronics",
    href: "/practice/pid-controller-tuning",
    keywords: ["pid", "controller", "control", "feedback", "mechatronics"],
  },
  {
    id: "problem-takt-time-line-balancing",
    type: "problem",
    title: "Takt Time & Line Balancing",
    subtitle: "Production systems · industrial",
    href: "/practice/takt-time-line-balancing",
    keywords: ["takt time", "line balancing", "throughput", "lean", "industrial"],
  },
  {
    id: "problem-cardiac-output",
    type: "problem",
    title: "Cardiac Output Estimation",
    subtitle: "Physiological systems · biomedical",
    href: "/practice/cardiac-output",
    keywords: ["cardiac output", "stroke volume", "heart rate", "physiology", "biomedical"],
  },
  {
    id: "problem-stream-dissolved-oxygen",
    type: "problem",
    title: "Stream Dissolved Oxygen Balance",
    subtitle: "Water quality · environmental",
    href: "/practice/stream-dissolved-oxygen",
    keywords: ["dissolved oxygen", "bod", "water quality", "stream", "environmental"],
  },
];

/** Quiz assessment pages (mirror features/quizzes/quizzes-data). */
const QUIZZES: SearchItem[] = [
  {
    id: "quiz-computer-engineering-fundamentals",
    type: "page",
    title: "Computer Engineering Fundamentals (Quiz)",
    subtitle: "Quiz · computer",
    href: "/quizzes/computer-engineering-fundamentals",
    keywords: ["quiz", "computer", "binary", "boolean", "cpi", "cache", "big-o", "complexity"],
  },
  {
    id: "quiz-chemical-engineering-fundamentals",
    type: "page",
    title: "Chemical Engineering Fundamentals (Quiz)",
    subtitle: "Quiz · chemical",
    href: "/quizzes/chemical-engineering-fundamentals",
    keywords: ["quiz", "chemical", "mass balance", "ideal gas", "conversion", "energy balance", "reynolds"],
  },
];

/** A few community discussion threads. */
const THREADS: SearchItem[] = [
  {
    id: "thread-euler-buckling-edge-cases",
    type: "thread",
    title: "Euler buckling — when do the end conditions actually matter?",
    subtitle: "Community · mechanical",
    href: "/community",
    keywords: ["buckling", "end conditions", "k factor", "discussion", "mechanical"],
  },
  {
    id: "thread-reynolds-transition-range",
    type: "thread",
    title: "Why is the laminar→turbulent transition a range, not a number?",
    subtitle: "Community · fluids",
    href: "/community",
    keywords: ["reynolds", "transition", "turbulent", "laminar", "discussion", "fluid"],
  },
  {
    id: "thread-arena-elo-strategy",
    type: "thread",
    title: "Arena ELO strategy — how to climb past 1500",
    subtitle: "Community · meta",
    href: "/community",
    keywords: ["arena", "elo", "ranked", "strategy", "climb", "discussion"],
  },
  {
    id: "thread-fea-mesh-best-practices",
    type: "thread",
    title: "FEA mesh refinement: practical convergence checks",
    subtitle: "Community · mechanical",
    href: "/community",
    keywords: ["fea", "mesh", "convergence", "refinement", "discussion", "mechanical"],
  },
];

export const SEARCH_INDEX: SearchItem[] = [
  ...PAGES,
  ...LESSONS,
  ...PROBLEMS,
  ...QUIZZES,
  ...THREADS,
];
