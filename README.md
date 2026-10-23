# Smart Scholars Platform

A production-oriented full-stack research integrity, journal trust rating, and DOI diagnostic platform inspired by [smartscholars.in](https://smartscholars.in/). Built in accordance with strict **Anti-AI-Slop** design principles: high information density, deep obsidian surfaces, warm sand accents, monospaced bibliographic figures, and deterministic scoring backed by real public registry evidence.

---

## 1. Quick Start

### Prerequisites
- Node.js v20+ or v24+
- npm v10+

### Installation & Database Setup
```bash
# 1. Install dependencies
npm install

# 2. Push database schema (SQLite dev.db zero-config default)
npx prisma db push

# 3. Seed active methodology version, indexing directories, and verified journals
npx tsx prisma/seed.ts

# 4. Build both frontend and backend bundles
npm run build

# 5. Start production server
npm start
```
The server will boot on `http://localhost:5000`.

### Development Mode
To run client and server with hot reloading:
```bash
npm run dev
```
- Client (Vite): `http://localhost:3000`
- API Backend (Express): `http://localhost:5000`

---

## 2. Default Seed Accounts

| Role | Email | Password | Access Scope |
|---|---|---|---|
| **Chief Integrity Officer (Admin)** | `admin@smartscholars.in` | `Admin@SmartScholars2026` | Full platform admin, user roles, system health, audit logs |
| **Institutional Auditor** | `auditor@oxford-research.ac.uk` | `Researcher@2026` | Institutional watchlists, batch evaluations, dossiers |

---

## 3. Architecture & Key Modules

```
src/
├── components/          # Anti-AI-slop design system (Navbar, Footer, Badges, Integrity AI Drawer)
├── context/             # AuthContext (JWT + HTTP-only session cookies)
├── pages/               # Functional pages matching all reference subdomains
│   ├── HomePage.tsx               # 5-Pillar standard explanation & live search
│   ├── JournalCheckPage.tsx       # Live journal search & on-demand evaluation
│   ├── JournalResultsPage.tsx     # 5-Pillar score breakdown, criteria, export
│   ├── JournalAuditPage.tsx       # SSRF-guarded 121-criterion site crawler
│   ├── AuditFindingsPage.tsx      # Filterable findings (Critical, Warning, Info)
│   ├── AuditRepairPlanPage.tsx    # Prioritized repair blueprints & code snippets
│   ├── DoiDoctorPage.tsx          # Resolution testing & 5-field Crossref matrix
│   ├── DoiCensusPage.tsx          # CSV article inventory reconciliation
│   ├── DoiPreservationPage.tsx    # Wayback Machine digital archiving check
│   ├── IndexingDirectoryPage.tsx  # DOAJ, Scopus, WoS, PMC directory
│   ├── IndexingApplicationsPage.tsx# Index application dossier tracker
│   ├── InstitutionDashboardPage.tsx# Research Integrity Desk
│   ├── InstitutionWatchlistPage.tsx# Approved & flagged serial lists
│   ├── InstitutionBatchPage.tsx   # CSV faculty publication screening
│   ├── PortfolioDashboardPage.tsx # Multi-journal portfolio monitoring
│   ├── AdminDashboardPage.tsx     # User & role management, system health
│   ├── LoginPage.tsx / RegisterPage.tsx
│   ├── ServicesPage.tsx / HowItWorksPage.tsx / AboutPage.tsx / ContactPage.tsx
│   ├── FaqPage.tsx / NewsroomPage.tsx / ReviewsPage.tsx / StatusPage.tsx
│   └── LegalPage.tsx (Privacy, Terms, Cookies, Trust & Security, Accessibility)
server/
├── adapters/            # Crossref, OpenAlex, DOAJ, DOI Resolver, Wayback
├── middleware/          # SSRF defense, rate limiting, JWT auth & RBAC
├── services/            # Deterministic 5-pillar scoring, crawler, DOI doctor, AI assistant
├── api/v1/              # RESTful API controllers
prisma/
└── schema.prisma        # Normalized schema with 26 models
```

---

## 4. Testing & Verification

Run the automated test suite:
```bash
npm test
```
The test suite validates:
- **Unit**: 5-Pillar deterministic scoring, red flag deductions, DOI syntax parsing, SSRF URL validator.
- **Integration**: Auth registration/login, RBAC protections, journal assessment persistence, report exports, audit initiation, DOI resolution, CSV census reconciliation, and institutional watchlist operations.
- **Results**: 23 passed (100% success rate).
