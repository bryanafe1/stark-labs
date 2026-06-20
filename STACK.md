# STACK.md — Stark codebase audit (Iteration 2, Phase 0)

_Last audited: 2026-06-19. Source of truth for the current stack + data model. Update when these change._

## 1. Stack

| Concern | Current state |
|---|---|
| **Framework** | Next.js 14.2 (App Router), React 18.3, TypeScript 5.6 |
| **Styling** | Tailwind 3.4 + custom "Functional Monochrome" tokens (`globals.css`), framer-motion, lucide-react, Radix primitives |
| **DB (provisioned)** | PostgreSQL on **Supabase** (project "Stark", ref `zmnjtwlwieamdnvnlkdl`). Schema applied via Prisma. RLS off. |
| **ORM** | Prisma 5.22 (`prisma/schema.prisma`, client in `src/lib/prisma.ts`) |
| **DB (in use by the app)** | **None.** Every page reads from in-memory **mock loaders** (`src/features/*/get-*.ts`, `lessons-data.ts`, `problems.ts`). The app does **not** read or write Postgres yet. |
| **Auth** | **Stubbed.** `src/lib/auth.ts` → `getCurrentUserId()` always returns `"demo-user"`. No auth library installed. `NEXTAUTH_SECRET`/`NEXTAUTH_URL` env vars exist but nothing consumes them. Prisma has Auth.js-compatible `User`/`Account`/`Session` models ready. |
| **Payments** | **None.** No Stripe dependency, no billing code, no `subscription_status`. |
| **Hosting** | **Not deployed.** Runs locally via `next dev` only. No domain, no CI. |
| **Version control** | **Not a git repository.** `git` workflow in the spec cannot run until `git init`. (Bryan action.) |
| **Tests** | None before this phase. Phase 0 adds Vitest + the first unit-tested modules. |
| **Content pipeline** | Lessons & problems authored offline as TS modules in `src/features/*/content/*.ts`, validated by `scripts/validate-problems.ts` (wired into `npm run build`). 46 lessons, ~130 practice problems. |

### Env vars present (names only — values not inspected)
`DATABASE_URL`, `DIRECT_URL` (Supabase poolers), `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ANTHROPIC_API_KEY`, `GRADING_MODEL`.
**Note:** `DATABASE_URL` still needs the real DB password from the Supabase dashboard before any live DB read/write works (per project memory).

## 2. Data model (Prisma — every model + key fields)

26 models. Grouped:

- **Identity:** `User` (id, email, username, displayName, role, overallElo, rankTier, xp, streakDays, lastActive, timestamps) · `Account` · `Session` (Auth.js-ready).
- **Elo / matchmaking (Tier 3 — deferred):** `EloRating` (user×discipline) · `Match` · `MatchParticipant` · `MatchProblem`.
- **Skill tree:** `SkillNode` (slug, title, discipline, kind=SUBJECT|TECHNICAL, position, xpReward) · `SkillEdge` (prereq DAG) · `SkillProgress` (user×node: status, masteryPct, xpEarned).
- **Evaluation engine:** `Problem` (slug, title, prompt[md+LaTeX], discipline, difficulty, **evaluationMode** = NUMERIC_TOLERANCE|MULTIPLE_CHOICE|EXACT_MATCH|LLM_GRADED, expectedValue, **tolerance [Float, absolute only]**, unit, choices[Json], expectedText, rubric, eloWeight, skillAreas[], published) · `Submission` (user, problem, numericAnswer/textAnswer/choiceId, status, score, feedback, timeMs, createdAt).
- **Lessons:** `Lesson` (slug, title, summary, discipline, difficulty, skillNodeId, estMinutes, skillAreas[], published) · `LessonSection` (ordered blocks: PROSE|FORMULA|SANDBOX|WALKTHROUGH|FIGURE, content[Json]).
- **Quizzes:** `Quiz` · `QuizQuestion` · `QuizAttempt`.
- **Community:** `Thread` · `Post` · `Comment` (self-threading).
- **Taxonomy / misc:** `Tag` + `TagsOn{Problems,Lessons,Threads,Posts}` · `Notification`.
- **Enums:** `Discipline` (10), `SkillKind`, `UserRole`, `RankTier`, `Difficulty`, `EvaluationMode`, `SubmissionStatus`, `MatchStatus`, `MatchResult`, `SkillNodeStatus`, `ThreadCategory`, `NotificationType`.

### Mapping the Iteration-2 spec schema → existing model
| Spec table | Existing equivalent | Gap to close in Phase 1 |
|---|---|---|
| `disciplines (status)` | `Discipline` **enum** (no status) | Add `live`/`coming_soon` status (Phase 0: in `lib/constants` metadata; later a `Discipline` table or config) |
| `topics` | `SkillNode` / `skillAreas` slugs | Usable as-is; "topic" = SkillArea/SkillNode |
| `lessons` | `Lesson` (+ `LessonSection`) | Add `is_free` |
| `problems` | `Problem` | Add `worked_solution`, `distractor_explanations`, change `tolerance` Float → Json `{rel, abs}` |
| `attempts` | `Submission` | Usable as-is (add Leitner fields in Phase 2) |
| `users (subscription_status)` | `User` | Add `subscription_status` + Stripe customer id |

## 3. What works end-to-end vs. stubbed

**Works today (on mock data, no persistence):**
- Full UI for: landing, learn (46 lessons w/ interactive sandboxes, KaTeX added this phase), practice browser + per-problem auto-grading (numeric/MC/exact), skill tree (now deep-links into filtered practice), dashboard, profile, leaderboard, quizzes, notifications, community hub, ⌘K search.
- Pure grading logic (`src/lib/grading.ts`) shared by practice + sprint.
- Safe formula sandbox evaluator (`src/lib/expr.ts`, no `eval`).

**Stubbed / not real:**
- **No persistence** — progress, attempts, Elo, streaks are computed from mocks and reset on reload.
- **No auth** — single hardcoded `demo-user`.
- **No payments / paywall.**
- **No deployment.**
- **Arena/Elo/matchmaking** — simulated client-only demo (intentionally deferred to Tier 3).
- **LLM grading** (`LLM_GRADED` mode) — returns a "submitted for grading" placeholder; no API call wired.

## 4. Bryan action required (blocks Phase 1 completion)
1. `git init` + first commit (the small-commit workflow can't run without a repo).
2. **Supabase DB password** pasted into `DATABASE_URL`/`DIRECT_URL` (unblocks all live DB work).
3. **Stripe** account + API keys (publishable, secret, webhook signing secret) + a $5/mo Price id.
4. **Domain** + **deploy approval** (e.g. Vercel) — never deployed to your accounts without go-ahead.
5. (Phase 2 only) confirm using the existing `ANTHROPIC_API_KEY` for the "explain differently" feature (rate-limited + cached).

## 5. Phase 0 deliverables (this phase)
- This `STACK.md`.
- **LaTeX rendering** — `src/components/latex.tsx` (KaTeX, SSR-safe) + `$…$`/`$$…$$` support in `src/components/markdown.tsx`. Verified in a launch-discipline lesson.
- **Tolerant, unit-aware numeric grading** — `src/lib/grade-numeric.ts` (pure, isolated) + Vitest unit tests (`*.test.ts`) covering tolerance, units, and scientific notation.
- **Launch discipline** flag — `MECHANICAL` = `live`, all others `coming_soon`, in `lib/constants` (surfacing deferred to Phase 1).
