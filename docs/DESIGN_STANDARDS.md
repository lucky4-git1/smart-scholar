# Smart Scholars Design Standards: Strict Anti-AI-Slop & Craft Guidelines

## 1. Absolute Bans (AI-Obvious Patterns)
- **NO PILLS WITH DOTS**: Never render `rounded-full` pills containing small status dots (`w-1.5 h-1.5 rounded-full`, `animate-ping`, `animate-pulse`, `[● LIVE]`, `[● ACTIVE]`). This is the classic AI-generated SaaS cliché.
- **NO PILL ENCLOSURES FOR LINKS OR HEADERS**: Navigation items, headers, kickers, and breadcrumbs must use crisp typographic layout with precision borders or bottom bars, NOT rounded bubble pills.
- **NO CARTOONISH/BLUR GLOWS**: No large purple/cyan glowing radial blurs behind cards.
- **NO FAKE METRICS OR MOCK DATA**: All ratings, citation stats, DOI checks, and findings must originate from real registry integrations (Crossref, DOAJ, OpenAlex) or deterministic audit algorithms.

## 2. Approved Visual Principles
- **Canvas**: Clean obsidian (`#09090b`) and elevated zinc surfaces (`#121215`, `#18181b`, `#27272a`).
- **Typography**: Clean, optical tracking with `Inter` for prose and `JetBrains Mono` with `tabular-nums` for identifiers (ISSN, DOI, percentages, scores).
- **Status Indicators**: Clean typographic badges (`border font-mono rounded px-2 py-0.5 text-xs`) without dots.
- **Interactions**: Tactile physical push states (`ss-btn-primary`, `ss-btn-secondary`) with 1px inset highlights and sub-pixel borders.
