# KaushalSetu — Technical Architecture

> **Core Principle**: *"KaushalSetu uses structured rules for decisions that must be reliable, Gemini for personalized explanations and guidance, human mentors for final skill verification, and an offline-first data layer so the experience remains usable under weak connectivity."*

---

## 1. Frontend Architecture
- **Framework**: React 19 SPA running on Vite with TypeScript and Tailwind CSS v4.
- **Design Philosophy**: Tactile, human-centered "notebook & field journal" aesthetic tailored for rural Indian youth (`#FAF9F4` paper canvas, masking-tape accents, Kalam handwritten notes, and Noto Sans Devanagari typography).
- **Responsive Strategy**:
  - **Student View**: Mobile-first optimized for low-cost Android smartphones and one-thumb navigation.
  - **Facilitator View**: Desktop-first operations desk (`1280px+`) with left sidebar, learner queues, and side-by-side evidence inspection.
- **Routing**: Lightweight hash synchronization (`#/home`, `#/earnpath`, `#/skillproof`, `#/opportunities`, `#/facilitator/*`) ensuring smooth transitions, bookmarkability, and zero reload latency.

---

## 2. Backend & API Proxy Architecture
- **Server**: Express server (`server.ts`) mounting Vite middleware in development and serving static production builds in deployment.
- **Server-Side AI Proxy**: Client components never call the Gemini API directly with client-side secrets. All calls pass through `/api/ai/*` server proxy routes:
  - `POST /api/ai/career-explanation`
  - `POST /api/ai/skillproof-review`
  - `POST /api/ai/assistant`
- **Security & Secrets**: `GEMINI_API_KEY` is loaded from server environment variables and never bundled into client JavaScript.
- **Fail-Safe Operation**: If Gemini is unreachable, rate-limited, or times out, the server logs a developer-safe entry and returns a validated, deterministic fallback response (`isFallback: true`).

---

## 3. Data & Storage Model
The system uses a clean collection schema ready for Firestore or local fallback:

| Collection | Key Responsibilities |
| :--- | :--- |
| `users` | Role identity (`student`, `facilitator`), display name, language |
| `studentProfiles` | Age, education, interests, skills, timeline, constraints (NO Aadhaar/bank numbers) |
| `careerProfiles` | Curated 10 vocational careers, education baselines, training weeks |
| `careerRecommendations` | Deterministic score breakdown, hard constraint flags, Gemini explanations |
| `learningPaths` | 4-week modular vocational curricula |
| `lessons` | Structured lesson cards, audio transcripts, quiz questions |
| `learningProgress` | Completed lessons, quiz scores, attempts, offline download packs |
| `skillProofs` | Evidence metadata (photos count, audio seconds), preliminary AI reviews, mentor sign-offs |
| `verifiedSkills` | Human-verified skill credentials linked to mentor and date |
| `opportunities` | Local verified apprenticeships, ITI seats, and entry-level bench technician jobs |
| `applications` | Document readiness booleans, preparation steps, shop visit status |
| `facilitatorNotes` | Confidential counseling and phone call logs |
| `notifications` | Practical, state-grounded updates |
| `journeyEvents` | Audit events powering the 6-stage Livelihood Journey Tracker |

---

## 4. Gemini AI Integration Strategy
KaushalSetu enforces a strict rule: **Structured Logic + Gemini** (not unconstrained AI).

- **Model Used**: `gemini-3.8-flash` via `@google/genai` TypeScript SDK.
- **Where Gemini is Used**:
  1. Personalizing career reasoning to student background and local context.
  2. Generating encouraging strength summaries and improvement recommendations.
  3. Pre-checking spoken audio transcripts for technical vocabulary and safety terms.
  4. Contextual Q&A in the student's chosen language (Marathi, Hindi, English).
- **Where Gemini is STRICTLY FORBIDDEN**:
  - Evaluating quiz correctness (scored deterministically against structured answer keys).
  - Calculating career match scores (calculated deterministically with weighted formula).
  - Determining legal eligibility (computed deterministically from hard age/education rules).
  - Awarding verified skill badges (reserved strictly for human mentors).
  - Determining the Next Step (computed deterministically via the 16-tier priority engine).

---

## 5. Deterministic Recommendation Engine
Careers are scored using a weighted multi-factor formula:
- **Interest Alignment**: 25%
- **Existing Skill Fit**: 15%
- **Work Preference**: 15%
- **Education Fit**: 10%
- **Earning Timeline Fit**: 10%
- **Travel Fit**: 10%
- **Learning Preference**: 10%
- **Device / Internet Fit**: 5%

**Hard Constraint Overrides**:
If a career requires Class 12 or a diploma and the student has Class 10, the engine marks it as a "Future Path" with the explanation *"Additional education required"* and caps the score. Gemini cannot override this constraint.

---

## 6. Deterministic Opportunity Matching & Eligibility
- **Formula**: Verified Skill Alignment (25%), Education Fit (15%), Career Relevance (20%), Travel Fit (10%), Age Eligibility (10%), Preferred Skills (10%), Timeline Fit (10%).
- **Eligibility Engine (`checkEligibility`)**:
  - Compares student age against legal apprenticeship minimums (18+).
  - Verifies minimum education completion.
  - Checks presence of Verified SkillProof badge.
  - Evaluates travel distance (within 20 km for rural commute).
  - Returns structured requirements with statuses: `met`, `pending`, `unmet`.

---

## 7. SkillProof AI Pre-Check & Mentor Verification
1. **Student Action**: Submits project evidence (photo of multimeter bench test, 45s audio explanation, notes).
2. **AI Preliminary Assessment**: Gemini evaluates the transcript against qualitative categories (`taskUnderstanding`, `toolAwareness`, `safetyAwareness`, `problemDiagnosis`).
3. **Safety Boundary**: The AI preliminary review explicitly states: *"AI feedback is only a preliminary review. Your mentor will make the final SkillProof decision."* The submission status remains `mentor_pending`.
4. **Human Verification**: A training facilitator (e.g., Anita Deshmukh) reviews the evidence side-by-side against a 5-point rubric in the Facilitator Desk. Only facilitator submission transitions the record to `verified`.

---

## 8. Offline-First Sync & Conflict Strategy
- **Local-First**: All state writes directly to local storage first, ensuring instantaneous UI feedback even with 0 KB/s connectivity.
- **Sync Queue**: Background operations are enqueued:
  ```typescript
  offlineQueue = [{ id, entityType, operation, payload, createdAt }]
  ```
- **Conflict Resolution**:
  - *Learning Progress*: Latest valid timestamp wins.
  - *SkillProof / Verification*: Mentor-verified state in the backend **always takes precedence**. An offline student device can never overwrite a `verified` status with an older unverified draft.

---

## 9. Fallback Architecture
The app implements a 3-tier resilience layer:
1. **Live Cloud Services**: Real Express backend + Gemini API (`gemini-3.8-flash`).
2. **Validated Local Cache**: Cached responses for repeat visits.
3. **Deterministic Seed Data**: Instant fallbacks for Ravi Patil, Satara center cohort, and 10 vocational careers.
*Result: The application will never display a blank screen, a 500 error, or a broken JSON dump to a student.*

---

## 10. Privacy & Data Minimization Strategy
- **Zero Sensitive Storage**: The system explicitly forbids storing:
  - Aadhaar numbers
  - Bank account / IFSC numbers
  - Passwords
  - Government ID scans
- **Readiness Flags Only**: Document tracking uses simple boolean flags (`aadhaar: true`, `class10Certificate: true`, `passportPhoto: false`) indicating whether the physical paper copy is ready to take to the workshop.
- **Facilitator Notes**: Private counseling logs are isolated to facilitator views and never rendered in student payloads.
