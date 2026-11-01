# ANTIGRAVITY NEWS — Complete Multilingual Digital News Platform

> **"Trusted News. A Connected World."**  
> High-density, credible, enterprise-grade multilingual news platform engineered with Next.js (App Router), TypeScript, Tailwind CSS, and Prisma ORM.

---

## 1. Platform Overview

**ANTIGRAVITY NEWS** is an end-to-end digital news publication platform featuring:
- **High-Density Editorial Homepage**: Inspired by premier news agencies, featuring breaking news ticker, playable HTML5 hero video player, top story matrix, live timestamped dispatches, multilingual language grid, and beat shelves.
- **11-Language Native Architecture**: Full support for English, Hindi, Kannada, Tamil, Telugu, Malayalam, Bengali, Marathi, Gujarati, Punjabi, and Urdu (with true **RTL layout direction**).
- **Citizen Journalism & Contributor Desk**: Multi-step submission form with image/video uploads, originality declarations, and editorial status tracking (`PENDING` → `UNDER_REVIEW` → `APPROVED` → `PUBLISHED` or `REJECTED`).
- **Editorial CMS & Moderation Suite**: Metrics dashboard, submission review queue, article manager, comment moderation, and user role governance.
- **Interactive Reader Engagement**: Likes with live counts, story bookmarks, threaded comment replies with moderation reporting, text-to-speech article reader, and social sharing.
- **Multimedia Journalism**: Video News portal, 24/7 Live TV broadcast stream with program schedule, and photo galleries.
- **Search & Feeds**: Real-time full-text search, XML Sitemap, and RSS 2.0 feed.

---

## 2. Technology Stack

- **Framework**: Next.js 14 (App Router, Server & Client Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with dark/light mode and custom editorial tokens
- **Database & ORM**: Prisma ORM with SQLite (zero-config local) or PostgreSQL
- **Security & Auth**: Secure HTTP-only cookies, JSON Web Tokens (JWT), bcrypt password hashing, server-side RBAC
- **Media Engine**: HTML5 responsive video player, local upload storage (`/public/uploads`) with MIME validation
- **Automation & Testing**: End-to-end automated test runner

---

## 3. Demo Accounts (Local Development)

The database comes pre-seeded with 4 standard role-based accounts:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Admin** | `admin@antigravitynews.com` | `Admin@123` | Full CMS governance, user roles, metrics, settings |
| **Editor** | `editor@antigravitynews.com` | `Editor@123` | Review submissions, approve & publish stories, moderate comments |
| **Contributor** | `reporter@antigravitynews.com` | `Reporter@123` | Submit stories, photos, and videos for editorial review |
| **Reader** | `reader@antigravitynews.com` | `Reader@123` | Read news, like stories, save bookmarks, post comments & replies |

---

## 4. Quickstart & Local Setup

### Prerequisites
- Node.js v18+ (tested on Node v20 LTS)
- npm v10+

### Step-by-Step Commands

```bash
# 1. Navigate to the project directory
cd C:\Users\Administrator\.gemini\antigravity\scratch\antigravity-news

# 2. Install dependencies
npm install

# 3. Initialize database & seed rich multilingual content
npx prisma generate
npx prisma db push
node prisma/seed.js

# 4. Run automated tests (17 passed out of 17)
node scripts/test-runner.js

# 5. Start the production server
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 5. Main Route Directory

### Public News Portal
- `/[lang]` — Multilingual Editorial Homepage (`/en`, `/hi`, `/kn`, `/ta`, `/te`, `/ml`, `/bn`, `/mr`, `/gu`, `/pa`, `/ur`)
- `/[lang]/[category]` — Category news feed (e.g. `/en/world`, `/en/technology`, `/en/business`, `/en/sports`)
- `/[lang]/[category]/[slug]` — Full Article Details page (e.g. `/en/world/global-leaders-unite-for-greener-tomorrow-climate-summit`)
- `/[lang]/video` — Video News Portal
- `/[lang]/live-tv` — 24/7 Live Broadcast stream and TV schedule
- `/[lang]/search` — Full-text search with category and date filters
- `/[lang]/submit-news` — Contributor & Citizen Journalist submission form
- `/[lang]/bookmarks` — Saved stories collection
- `/[lang]/profile` — User profile, submissions, and comment history
- `/[lang]/auth/signin` — Sign in with quick-fill demo buttons
- `/[lang]/auth/signup` — User registration
- `/[lang]/about` — Editorial mission and news bureaus
- `/[lang]/editorial-policy` — Fact-checking standards and ethics code
- `/[lang]/contact` — Newsroom directory and whistleblower tips
- `/[lang]/privacy` — Data protection and privacy policy
- `/[lang]/terms` — Terms of use

### Editorial CMS
- `/admin` — Editorial metrics & platform overview
- `/admin/articles` — Article manager and breaking news controls
- `/admin/submissions` — Submission review queue (Approve & Publish / Reject / Revise)
- `/admin/comments` — Comment moderation & flagged report triage
- `/admin/users` — User governance & RBAC role assignments

### Feeds & APIs
- `/api/sitemap` — XML sitemap
- `/api/rss` — RSS 2.0 XML feed
- `/api/search` — JSON search endpoint
- `/api/upload` — Multipart image and video upload endpoint
