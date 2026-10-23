# Implementation Plan: Smart Scholars Platform

## Phase 1: Foundation & Project Scaffolding
- Initialize Node.js TypeScript project with Vite, React, Express backend.
- Configure Tailwind CSS, Bootstrap 5 utilities, Syne & Martian Mono typography.
- Setup Prisma ORM connected to PostgreSQL.
- Create full normalized database schema with Prisma migrations and seed scripts.

## Phase 2: Core Backend Engine & Public Data Adapters
- Safe HTTP fetcher with strict SSRF defense (blocking 127.0.0.1, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.169.254).
- Crossref Adapter (`https://api.crossref.org/works`, `https://api.crossref.org/journals`).
- OpenAlex Adapter (`https://api.openalex.org/sources`, `https://api.openalex.org/works`).
- DOAJ Adapter (`https://doaj.org/api/v2/search/journals`).
- DOI Resolution Checker (`https://doi.org/api/handles` and HTTP HEAD/GET).
- Preservation Check Adapter (Internet Archive Wayback Machine API).

## Phase 3: Explainable Trust Rating & Audit Engines
- 5-Pillar deterministic scoring engine (100-point total, weighted criteria).
- Journal Web Audit Engine: Page crawler, HTML metadata parser, policy detection (editorial board, peer review, APC, plagiarism, ethics, copyright).
- Severity categorizer (Critical, Warning, Informational) with actionable remediation advice.

## Phase 4: DOI Doctor & Indexing Workflow
- Single & Batch DOI syntax validation and HTTP resolution.
- Census reconciliation module: compare article list with registered metadata.
- Digital preservation verifier.
- Indexing Services Directory (Scopus, WoS, DOAJ, PubMed Central, etc.) with eligibility requirements.
- Indexing Application Dossier tracker.

## Phase 5: Institutional, Portfolio & Administrative Workspaces
- Institutional Research Integrity Desk: journal watchlists, faculty publication verification, batch CSV upload.
- Portfolio Console: multi-journal monitoring, aggregate health metrics, dead link detection.
- Admin dashboard: user/org management, job queues, external API health monitor, audit logs.
- Grounded Research Integrity AI Assistant with fallback deterministic knowledge base.

## Phase 6: Public Routes, Navigation & Visual Craft
- Full suite of public routes: `/`, `/services`, `/how-it-works`, `/about`, `/contact`, `/faq`, `/newsroom`, `/reviews`, `/privacy`, `/terms`, `/status`, etc.
- Responsive mobile and desktop navigation with brand beacon.
- Rich search bar supporting ISSN, DOI, Title, and Journal URL.

## Phase 7: Verification, Automated Testing & Documentation
- Unit tests: Scoring engine, DOI parser, SSRF filter, grade mappings.
- Integration tests: Auth API, journal search endpoint, audit trigger.
- E2E tests: Search flow, audit report review, user registration, portfolio overview.
- Build production bundle, verify clean compilation, and output detailed deployment guide.
