# Feature Matrix & Implementation Status

| Feature ID | Feature Description | User Persona | Status | Primary Route / API | Verification Notes |
|---|---|---|---|---|---|
| **FEAT-01** | Unified Public Homepage with 5-Pillar Methodology | All | Implemented | `/` | Responsive, Syne/Martian Mono typography, dynamic live metrics |
| **FEAT-02** | Live Journal Search (Title, ISSN, DOI, URL) | Authors / Editors | Implemented | `/journal-check`, `/api/v1/journals/search` | Crossref & OpenAlex integrated query with local cache |
| **FEAT-03** | 5-Pillar Journal Trust Rating Engine (100 pts) | All | Implemented | `/journal-check/results/:id`, `/api/v1/assessments/:id` | Deterministic scoring across 5 pillars, rule audit breakdown |
| **FEAT-04** | Evidence Records & Provenance Display | All | Implemented | `/journal-check/results/:id` | Source adapters, HTTP response status, timestamps |
| **FEAT-05** | Downloadable Assessment Summary & Report | Researchers | Implemented | `/journal-check/results/:id/export` | Clean printable view and JSON export with methodology hash |
| **FEAT-06** | Journal Indexing Readiness Audit Pipeline | Editors / Publishers | Implemented | `/journal-audit`, `/journal-audit/:id` | SSRF-safe URL crawler, 121 criteria mapping, finding severity |
| **FEAT-07** | Audit Findings & Repair Checklist | Editors | Implemented | `/journal-audit/:id/findings`, `/journal-audit/:id/repair-plan` | Filterable by severity (Critical, Warning, Info), status tracking |
| **FEAT-08** | DOI Doctor: Single & Bulk Resolution Checker | All | Implemented | `/doi-doctor`, `/doi-doctor/doi-check` | Resolves `doi.org/10.xxxx`, Crossref metadata extraction |
| **FEAT-09** | DOI Doctor: Metadata Census & Reconciliation | Publishers / Portfolios | Implemented | `/doi-doctor/census`, `/api/v1/doi/census` | CSV inventory matching against registered Crossref records |
| **FEAT-10** | Digital Preservation Registry Verifier | Publishers | Implemented | `/doi-doctor/preservation` | Internet Archive, Portico, PKP PN status verification |
| **FEAT-11** | GetIndexed: Indexing Services Directory | Editors | Implemented | `/indexing/directory` | Scope, requirements, fees, application URLs for 12+ indexes |
| **FEAT-12** | Indexing Application Dossier Tracker | Editors | Implemented | `/indexing/applications`, `/indexing/applications/:id` | Step-by-step submission preparation, evidence attachment |
| **FEAT-13** | Institutional Research Integrity Desk | Universities | Implemented | `/institution/dashboard` | Journal watchlists, verified publication screening |
| **FEAT-14** | Institutional Batch Evaluation (CSV) | Universities | Implemented | `/institution/batch-evaluation` | Batch parser with Crossref validation and risk flags |
| **FEAT-15** | Portfolio Console (Multi-Journal Oversight) | Sponsors / Presses | Implemented | `/portfolio/dashboard`, `/portfolio/journals` | Aggregate DOI health, dead URL tracking, exportable JSON/CSV |
| **FEAT-16** | Authentication & RBAC (Role Based Access Control) | All Roles | Implemented | `/auth/*`, `/account/*`, `/api/v1/auth/*` | Secure session cookies, bcrypt, User/Org/Role isolation |
| **FEAT-17** | Administration & Job Monitoring Console | Admins | Implemented | `/admin`, `/api/v1/admin/*` | User management, background job health, adapter status |
| **FEAT-18** | Research Integrity AI Assistant (Grounded) | All | Implemented | Accessible side-panel / modal | Deterministic grounding, honest missing-key fallback |
| **FEAT-19** | Legal, Compliance & Information Pages | All | Implemented | `/about`, `/contact`, `/services`, `/faq`, `/privacy`, `/terms`, etc. | Complete copy, contact form, system status |
| **FEAT-20** | Health & Readiness Monitoring | DevOps | Implemented | `/api/health`, `/api/ready` | Checks database connection, external adapter reachability |
