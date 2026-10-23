# System Architecture: Smart Scholars Platform

```
+-----------------------------------------------------------------------------------------+
|                                    USER INTERFACE                                       |
|  React 18 + TypeScript + Vite + React Router + Bootstrap 5 Layout + Tailwind CSS Tokens |
|  Syne (Display) + Martian Mono (Registry Data) + Anti-AI-Slop Micro-Interactions        |
+-----------------------------------------------------------------------------------------+
                                           |
                                      REST JSON
                                           |
+-----------------------------------------------------------------------------------------+
|                                NODE.JS / EXPRESS BACKEND                                |
|  - Rate Limiting & SSRF Guard (Private IP blocking, DNS rebind prevention)             |
|  - Auth & Session / RBAC Middleware (Organization, Roles: Admin, Editor, Institution)   |
|  - Zod Request Validation                                                               |
|  - Explainable 5-Pillar Journal Trust Rating Engine                                     |
|  - Autonomous Journal Webpage Audit Engine (Safe Crawler & Heuristics)                  |
|  - DOI Doctor & Census Matching Engine                                                  |
|  - Background Job Queue (Async assessment & batch jobs with status polling)             |
+-----------------------------------------------------------------------------------------+
              |                                            |
      DATABASE PERSISTENCE                        EXTERNAL ADAPTER LAYER
  Prisma ORM with PostgreSQL                      (Timeouts, Circuit Breakers, Caching)
  - Users, Sessions, Orgs                         - Crossref REST API (api.crossref.org)
  - Journals, Identifiers                         - OpenAlex API (api.openalex.org)
  - Assessments, CriteriaResults                  - DOAJ API (doaj.org/api)
  - AuditJobs, AuditFindings                      - ISSN Portal & ROR Adapters
  - DOIRecords, MetadataSnapshots                 - DOI HTTP Resolver (doi.org)
  - IndexingApplications                          - Preservation Registries (Wayback / PKP)
  - Watchlists, Portfolios                        - Grounded AI Assistant (Gemini / Fallback)
```

## 1. Core Principles
1. **Explainable Deterministic Scoring**: No opaque AI hallucinations for journal grades. Trust ratings are computed via 121 explicitly codified rules mapped across 5 pillars (Identity 25%, Editorial 25%, Technical 20%, Preservation 15%, Reach 15%).
2. **SSRF & Network Safety**: Any URL submitted for journal audits or DOI checking is resolved and verified against IP blacklists (RFC 1918 private subnets, loopback `127.0.0.1`, link-local `169.254.169.254`, AWS/GCP cloud metadata services).
3. **Multi-Tenant Isolation**: Organizations own Watchlists, Portfolios, and Indexing Applications. Users belong to Organizations with specific roles (`OWNER`, `MEMBER`, `AUDITOR`, `ADMIN`).
4. **Resilient Public Adapters**: External registries (Crossref, OpenAlex, DOAJ) are accessed via dedicated adapter classes with strict timeouts (7s), cached responses (TTL 12h), and structured fallback responses on failure.
5. **High-Craft Aesthetics**: Adheres to the `impeccable-taste` standard: deep obsidian/espresso `#0A0908`, warm sand `#E3BC9A`, jade `#14B8A6`, crisp subpixel borders, tabular numbers, and zero decorative AI fluff.
