# KaushalSetu (कौशल्यसेतू)
*Shiksha se Kaushal. Kaushal se Rozgaar.*

An AI-powered, voice-first, offline-ready learning-to-livelihood platform designed for rural Indian youth.

---

## The Problem
Millions of youth in rural and semi-urban India complete Class 10 or 12 but struggle to translate schooling into stable local livelihood. Existing job boards assume high digital literacy, urban relocation, English fluency, and formal degrees. Meanwhile, local repair shops, solar installers, and service centers face an acute shortage of trained apprentices with verified practical skills.

## The Solution
KaushalSetu replaces generic job boards with a structured, guided pathway:
1. **Discover**: Constraint-aware potential discovery identifying high-return local careers.
2. **Learn**: 4-week modular practical EarnPaths downloadable as lightweight audio/visual packs.
3. **Prove**: Hands-on SkillProof submissions combining photo evidence and spoken voice walkthroughs.
4. **Match**: Verified local opportunity matching grounded in district centers (e.g., Satara, Maharashtra).
5. **Act**: Practical application preparation without automated spam, empowering students to walk into local workshops with verified credentials.

---

## Core 5-Stage Flow
```
Discover (Potential Profile)
  ↓
Learn (4-Week EarnPath)
  ↓
Prove (SkillProof & Mentor Verification)
  ↓
Match (Opportunity Matcher & Eligibility)
  ↓
Act (Application Prep & Workshop Placement)
```

---

## Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Backend / API**: Node.js, Express (`server.ts`), Vite Dev Server
- **AI Engine**: Google Gemini API (`gemini-3.8-flash`) via `@google/genai` TypeScript SDK
- **Data & Persistence**: Local-First storage with structured schema matching Firestore collections
- **Sync & Offline**: Offline-first queue with latest-timestamp and mentor-authority conflict protection

---

## Demo Personas

### 1. Demo Student: Ravi Patil
- **Age**: 18
- **Education**: Class 10
- **Location**: Satara district, Maharashtra
- **Preferred Language**: Marathi (`mr`)
- **Travel Preference**: Nearby town (ST bus accessible)
- **Goal**: Start earning within 3 months
- **Career Path**: Mobile Device Repair Technician
- **Verified Skill**: Basic Mobile Device Diagnosis

### 2. Demo Facilitator: Anita Deshmukh
- **Role**: Senior Vocational Training Coordinator
- **Center**: Satara Rural Skill Development Center
- **Desk Access**: Switchable via "Facilitator Desk" in the top header or `#/facilitator`
- **Capabilities**: Review SkillProof queue, inspect photos and voice transcripts, apply rubric verification, manage learner support queue, print cohort impact reports.

---

## Architecture Summary
KaushalSetu strictly separates generative reasoning from deterministic decision-making:
- **Deterministic**: Career constraints, age/education eligibility, quiz correctness, match scoring, and final skill verification.
- **Gemini AI**: Personalized explanations, encouraging strengths summaries, audio transcript analysis, and contextual voice assistance.
- **Mentors**: Final verification authority for all physical skill credentials.
- **Offline Resilience**: Full functional operation even when disconnected from the internet.

---

## Environment Variables
Configured in `.env` (refer to `.env.example`):
```env
# Required for server-side Gemini API calls
GEMINI_API_KEY="your-gemini-api-key"

# Optional model override (defaults to gemini-3.8-flash)
GEMINI_MODEL="gemini-3.8-flash"

# Port (defaults to 3000)
PORT=3000
```

---

## How to Run

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```
Runs Express server with mounted Vite middleware on `http://localhost:3000`.

### Production Build
```bash
npm run build
npm start
```

---

## Verification & Key Checks
- Career match calculations remain 100% deterministic.
- Gemini explanations cannot override educational or age constraints.
- Quizzes are evaluated locally against structured answer keys.
- SkillProof status cannot be set to `verified` by AI (mentor action required).
- Document readiness stores only boolean checklist flags, never sensitive ID numbers.
- Full offline fallback ensures zero downtime if the Gemini API or network drops.
