# Reference Audit: Smart Scholars Platform

**Audit Date:** October 2026  
**Reference Target:** `https://smartscholars.in/` & Associated Subdomains  
**Design Philosophy:** Anti-AI-Slop, High Information Density, Tactile Research Integrity Platform  

---

## 1. Domain & Subdomain Ecosystem

| Host / Subdomain | Target Title & Header | Core Purpose & Observed Functional Scope | Auth & Access Level |
|---|---|---|---|
| `smartscholars.in` | Smart Scholars — the Journal Trust Rating | Hub for journal trustworthiness scoring, public search, five-pillar methodology explanation, directory of products, trust indicators, announcements, pricing. | Public |
| `scholar.smartscholars.in` | Journal Check · Scholar Shield | Researcher-focused journal verification. Queries title, ISSN, DOI prefix, publisher URL against Crossref, OpenAlex, DOAJ, ISSN Portal. Displays risk flags and trust ratings. | Public search; Saved checks / alerts require account |
| `institutions.smartscholars.in` | Research Integrity Desk | University / institutional oversight. Batch evaluation of publications via CSV, faculty submission tracking, verification against official indexes, audit history, committee reporting. | Authenticated / Organization Role |
| `partners.smartscholars.in` | Portfolio Console | Portfolio management for society publishers, university presses, and journal sponsors. Aggregate journal health, DOI resolution tracking, preservation gap alerts. | Authenticated / Organization Role |
| `journals.smartscholars.in` | Journals | Editor/Publisher portal for aligning journals to indexing standards, managing editorial policies, and initiating technical health audits. | Authenticated / Editor Role |
| `members.smartscholars.in` | DOI Members — the repair layer | Long-term DOI monitoring, broken resolution repair, schema compliance, Crossref deposit updates. | Authenticated |
| `journalevaluate.smartscholars.in` | Journal Indexing Readiness Audit | 121-criterion technical crawler assessing policy disclosure, editorial transparency, APC clarity, peer-review disclosures, preservation, license schemas. Generates step-by-step repair checklists. | Public initiation / Authenticated audit reports |
| `getindexed.smartscholars.in` | GetIndexed — Database Readiness & Applications | Multi-index readiness evaluator (Scopus, Web of Science, DOAJ, PubMed Central). Tracks stage-by-stage application dossier preparation, verification evidence, and deadlines. | Public directory; Authenticated application dossiers |
| `doidoctor.smartscholars.in` | DOI Doctor | Automated DOI resolution verifier, Crossref XML metadata validator, dead article link detector, digital preservation registry check (Internet Archive, Portico, PKP PN). | Public single check; Authenticated batch census & monitoring |

---

## 2. Information Architecture & Navigation

### Primary Public Navigation
- **Brand Identity**: Smart Scholars wordmark with verified beacon emblem.
- **Top Links**:
  - `Home` (`/`)
  - `Services` (`/services`)
  - `Journal Check` (`/journal-check`)
  - `Journal Audit` (`/journal-audit`)
  - `DOI Doctor` (`/doi-doctor`)
  - `GetIndexed` (`/indexing`)
  - `Institutional Desk` (`/institution/dashboard`)
  - `Portfolio Console` (`/portfolio/dashboard`)
  - `Newsroom` (`/newsroom`)
  - `Reviews` (`/reviews`)
  - `How We Work` (`/how-it-works`)
  - `About` (`/about`)
  - `Contact` (`/contact`)
- **Account Actions**:
  - `Sign In` (`/auth/login`)
  - `Create Account` (`/auth/register`)
  - User avatar dropdown with profile, organizations, settings, admin (if permitted), and sign out.

### Footer & Legal Navigation
- Policy: Privacy Policy (`/privacy`), Terms of Service (`/terms`), Cookie Policy (`/cookies`), Trust & Security (`/trust-and-security`), Accessibility (`/accessibility`), Data Deletion (`/data-deletion`), Refund Policy (`/refunds`), Service Delivery (`/service-delivery`).
- Transparency: System Status (`/status`), Release Notes (`/release-notes`), Roadmap (`/roadmap`), FAQ (`/faq`).

---

## 3. Visual & Aesthetic Architecture

Observed and adopted design principles:
- **Palette**:
  - Base: Deep Espresso / Obsidian (`#0A0908` background, `#141210` card surface, `#1E1B18` elevated surface).
  - Borders: Crisp sub-pixel `#2C2723`.
  - Primary Warm Accents: Desert Sand (`#E3BC9A`), Champagne Light (`#FFF3E6`), Sienna (`#D2691E`).
  - Integrity & Trust Accents: Verified Emerald / Jade (`#14B8A6`, `#052B26` badge tint), Warning Amber (`#F59E0B`), Critical Ruby (`#EF4444`).
- **Typography**:
  - Display / Headings: `Syne` (distinctive modern academic geometry, tracking-tight).
  - Registry IDs, DOIs, ISSNs, Metrics: `Martian Mono` / `ui-monospace` (tabular numbers, legible uppercase code tags).
  - Body: Modern clean sans-serif (`Inter` / system-ui) with deliberate line height (1.6) and high WCAG contrast.
- **Anti-AI-Slop Guardrails**:
  - No generic purple radial glow backgrounds.
  - No decorative meaningless charts or fake metric bars.
  - Every badge is backed by a verified registry timestamp or explicit missing state.
  - Tabular, high-density display of research metadata.
