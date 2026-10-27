import { config } from '../config';
import { prisma } from '../database/prisma';

export interface AssistantMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class AiAssistantService {
  /**
   * Deterministic knowledge base answering platform, methodology, journal records, and remediation queries
   */
  private static async answerDeterministic(query: string, context?: string): Promise<string> {
    const q = query.toLowerCase().trim();

    // 1. Check for specific journal search or ISSN in query
    try {
      // Look for ISSN format XXXX-XXXX or 8 alphanumeric chars
      const issnMatch = query.match(/\b\d{4}-?\d{3}[\dX]\b/i);
      let matchedJournal = null;

      if (issnMatch) {
        const rawIssn = issnMatch[0].length === 8 ? `${issnMatch[0].slice(0, 4)}-${issnMatch[0].slice(4)}` : issnMatch[0];
        const identifier = await prisma.journalIdentifier.findFirst({
          where: { value: rawIssn },
          include: { journal: { include: { identifiers: true } } },
        });
        if (identifier) matchedJournal = identifier.journal;
      }

      // If no ISSN match, check for prominent journal titles in database
      if (!matchedJournal) {
        // Strip common question phrases to extract candidate title
        const stripped = q
          .replace(/^(is|check|tell me about|what is|search|review|status of|do you have|can you check)\s+/i, '')
          .replace(/\s+(indexed|in registry|safe|legit|predatory|scopus|trusted)\??$/i, '')
          .trim();

        if (stripped.length >= 3) {
          matchedJournal = await prisma.journal.findFirst({
            where: {
              OR: [
                { title: { contains: stripped } },
                { publisher: { contains: stripped } },
              ],
            },
            include: { identifiers: true },
          });
        }
      }

      if (matchedJournal) {
        const issns = matchedJournal.identifiers
          .filter(i => i.type.includes('ISSN'))
          .map(i => `${i.type.replace('ISSN_', '')}: ${i.value}`)
          .join(', ') || 'None recorded';

        return (
          `**Registry Verification: ${matchedJournal.title}**\n\n` +
          `• **Publisher**: ${matchedJournal.publisher || 'Unknown'}\n` +
          `• **Trust Grade**: **${matchedJournal.currentGrade || 'PENDING'}** (${matchedJournal.currentScore !== null ? `${matchedJournal.currentScore}/100` : 'Under Assessment'})\n` +
          `• **Identifiers**: ${issns}\n` +
          `• **Open Access Model**: ${matchedJournal.oaType || 'Standard'}\n` +
          `• **DOAJ Inclusion**: ${matchedJournal.doajIndexed ? 'Yes (Verified)' : 'Not Listed'}\n` +
          `• **Crossref Resolution**: ${matchedJournal.crossrefActive ? 'Active & Monitored' : 'Inactive / Unverified'}\n\n` +
          `To view the full 5-Pillar itemized audit and verified bibliographic evidence for this serial, search for it on the **Journal Check** page.`
        );
      }
    } catch (dbErr) {
      // Continue to deterministic rules if database search encounters an error
      console.warn('AiAssistant database lookup fallback:', dbErr);
    }

    // 2. Greetings & Introductions
    if (/^(hi|hello|hey|greetings|good\s+(morning|afternoon|evening)|who are you|what can you do)/i.test(q)) {
      return (
        '**Welcome to the Smart Scholars Research Integrity Assistant.**\n\n' +
        'I am an evidence-grounded academic intelligence guide built on our 121-criterion audit standard. Here is how I can assist you:\n\n' +
        '• **Evaluate Journals**: Ask me to check any journal by name or ISSN (e.g. *\"Check Nature\"* or *\"0028-0836\"*).\n' +
        '• **Methodology**: Ask how the **5-Pillar Score (100 pts)** and letter grades (A+ to RED FLAG) are calculated.\n' +
        '• **Predatory Warning Signals**: Learn how to identify hijacked journals, fake editorial boards, and hijacked DOIs.\n' +
        '• **Indexing Roadmap**: Step-by-step criteria for admission into **DOAJ**, **Scopus**, and **Web of Science**.\n' +
        '• **DOI Diagnostics**: How to detect 404 landing pages, unlinked citations, and missing Crossref metadata.'
      );
    }

    // 3. Pricing / Cost / Free Access
    if (q.includes('free') || q.includes('cost') || q.includes('price') || q.includes('charge') || q.includes('pay') || q.includes('subscription')) {
      return (
        '**Smart Scholars Access & Pricing Model**\n\n' +
        '• **For Individual Researchers & Authors**: 100% Free. You can perform unlimited Journal Trust checks, DOI inspections, and view full 5-pillar evidence dossiers at zero cost.\n' +
        '• **For Editors & Small Publishers**: Free page-level Indexing Audits (up to 121 criteria) to identify missing Dublin Core metadata, CC licenses, and broken links.\n' +
        '• **For Institutions & University Presses**: Enterprise subscriptions provide portfolio surveillance, automated Crossref census reconciliations, API keys, and white-label trust badges.'
      );
    }

    // 4. Scoring Methodology & 5 Pillars
    if (q.includes('methodology') || q.includes('score') || q.includes('points') || q.includes('pillar') || q.includes('grade') || q.includes('calculate')) {
      return (
        '**Smart Scholars 5-Pillar Scoring Methodology (Standard v1.2.0-2026)**\n\n' +
        'Each journal is evaluated on an objective 100-point deterministic scale across 5 core pillars:\n\n' +
        '1. **Identity & Governance (25 pts)**: Verified ISSN on CIEPS/ISSN Portal, corporate entity transparency, registered publisher ROR ID, and physical editorial office verification.\n' +
        '2. **Editorial Integrity (25 pts)**: Verifiable peer-review process (blind, double-blind, or open), COPE compliance disclosures, plagiarism screening policies, and active editorial board affiliations.\n' +
        '3. **Technical Standing (20 pts)**: Machine-readable licensing (Creative Commons metadata), functional Crossref/DataCite DOI resolution, and standard JATS/XML schema availability.\n' +
        '4. **Preservation & Access (15 pts)**: Certified long-term digital archiving in Portico, CLOCKSS, PKP PN, or national libraries, plus explicit Article Processing Charge (APC) schedules.\n' +
        '5. **Reach & Citation Transparency (15 pts)**: OpenAlex citation dispersion, Crossref reference distribution, and international diversity among contributing authors.\n\n' +
        '**Grade Bands**: A+ (90-100), A (80-89), B (70-79), C (55-69), D (40-54), RED FLAG (<40 or critical misconduct signals).'
      );
    }

    // 5. Red Flag & Predatory Indicators
    if (q.includes('red flag') || q.includes('predatory') || q.includes('scam') || q.includes('fake') || q.includes('hijack') || q.includes('clone')) {
      return (
        '**Recognizing Predatory & Hijacked Journals**\n\n' +
        'Our system flags high-risk serials using verifiable deterministic evidence:\n\n' +
        '• **Unrealistic Turnaround**: Guaranteed peer review or acceptance within 24 to 72 hours.\n' +
        '• **Bogus Metrics**: Advertising unverified metrics such as \"Universal Impact Factor\", \"Global Impact Factor\", or \"Index Copernicus Score\" disguised as JCR metrics.\n' +
        '• **Hijacked Domains**: Expired web domains bought by third parties impersonating legitimate print-only or defunct scholarly journals.\n' +
        '• **Fictitious Editorial Boards**: Listing reputable scholars without their knowledge or consent, or omitting institutional emails.\n' +
        '• **Ghost ISSNs**: Displaying an ISSN that belongs to a different title or is marked inactive in the CIEPS register.\n\n' +
        '*A single verified misconduct finding results in an immediate \"RED FLAG\" cap on the journal.*'
      );
    }

    // 6. Indexing Readiness (DOAJ, Scopus, Web of Science, UGC-CARE)
    if (q.includes('scopus') || q.includes('web of science') || q.includes('wos') || q.includes('doaj') || q.includes('index') || q.includes('ugc') || q.includes('pubmed')) {
      return (
        '**Indexing Readiness Standards & Roadmap**\n\n' +
        '• **Directory of Open Access Journals (DOAJ)**:\n' +
        '  - Requires an active, registered ISSN.\n' +
        '  - Explicit Creative Commons license terms displayed on every published article.\n' +
        '  - Machine-readable digital archiving policy in place (e.g. Portico, CLOCKSS, Internet Archive).\n' +
        '  - Zero publication fees charged for submitting without upfront disclosure.\n\n' +
        '• **Scopus (CSAB Selection)**:\n' +
        '  - Minimum 2 continuous years of publication history.\n' +
        '  - English titles, abstracts, and author affiliations for all papers.\n' +
        '  - Geographic diversity in editorial board members and authors.\n' +
        '  - Punctual publication frequency according to announced schedule.\n\n' +
        '• **Web of Science (Clarivate Core Collection)**:\n' +
        '  - Must pass 24 essential quality criteria (ethical peer review, content clarity, DOI persistence).\n\n' +
        'Use the **Journal Audit** tool to scan your journal’s website for automated readiness score.'
      );
    }

    // 7. DOI Doctor, Crossref & Preservation
    if (q.includes('doi') || q.includes('crossref') || q.includes('broken') || q.includes('portico') || q.includes('clockss') || q.includes('census')) {
      return (
        '**DOI Doctor & Resolution Diagnostics**\n\n' +
        'Smart Scholars DOI Doctor conducts deep health audits on digital object identifiers:\n\n' +
        '• **HTTP Resolution Check**: Confirms that `doi.org/10.xxxx/...` handles redirect with HTTP 301/302 to an active HTTP 200 article landing page without redirect loops or 404 errors.\n' +
        '• **Metadata Completeness**: Validates that Crossref deposits include abstract text, full author ORCIDs, license URLs, and reference lists (I4OC compliant).\n' +
        '• **Archive Escrow Verification**: Confirms whether articles are actively preserved in dark archives like Portico, CLOCKSS, or PKP Preservation Network.\n' +
        '• **Article Census**: Upload a CSV of your journal’s published DOIs in **DOI Census** to generate a bulk resolution report.'
      );
    }

    // 8. Open Access & Licensing (Creative Commons)
    if (q.includes('open access') || q.includes('license') || q.includes('cc by') || q.includes('copyright') || q.includes('diamond') || q.includes('apc')) {
      return (
        '**Open Access Models & Licensing Standards**\n\n' +
        '• **Diamond / Platinum OA**: Zero fees for authors and zero paywalls for readers. Funded by academic institutions, societies, or grants.\n' +
        '• **Gold OA**: Articles are immediately free to read under an open license, supported by an Article Processing Charge (APC).\n' +
        '• **Green OA**: Author self-archiving of preprint or postprint in an institutional repository.\n' +
        '• **Licensing Recommendations**: The gold standard for open science is **CC BY 4.0** (Creative Commons Attribution), which allows maximum reuse with attribution and satisfies Plan S and DOAJ criteria.'
      );
    }

    // 9. Default Fallback
    return (
      '**Smart Scholars Research Integrity Assistant**\n\n' +
      'I can guide you on any aspect of academic publishing integrity:\n\n' +
      '• **Verify a Journal**: Enter any journal title or ISSN (e.g. \"*Check Lancet*\" or \"*Check 0028-0836*\") to view verified registry records.\n' +
      '• **Scoring Rules**: Ask about the 5-Pillar 100-point scoring algorithm.\n' +
      '• **Predatory Signals**: Ask about red flags, hijacked domains, or fake impact factors.\n' +
      '• **Indexing Roadmap**: Inquire about requirements for DOAJ, Scopus, or Web of Science inclusion.\n' +
      '• **DOI Health**: Ask how to audit broken DOI links and Crossref metadata.\n\n' +
      (context ? `*Active Page Context: ${context}*\n\n` : '') +
      'How may I assist your research evaluation today?'
    );
  }

  /**
   * Answer a user query, using Gemini API if key is configured, or honest deterministic engine fallback
   */
  static async askAssistant(query: string, context?: string): Promise<{ reply: string; source: 'GEMINI' | 'DETERMINISTIC_ENGINE' }> {
    if (!config.geminiApiKey || config.geminiApiKey.trim() === '') {
      const deterministicAnswer = await this.answerDeterministic(query, context);
      return {
        reply: deterministicAnswer,
        source: 'DETERMINISTIC_ENGINE',
      };
    }

    try {
      const systemPrompt =
        'You are the Smart Scholars Research Integrity Assistant. Ground your responses strictly in academic integrity best practices, DOAJ/COPE/Scopus standards, and the Smart Scholars 5-Pillar methodology (Identity, Editorial, Technical, Preservation, Reach). Distinguish facts from suggestions. Never invent metrics. Keep responses structured, professional, and concise with Markdown formatting.';

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.geminiApiKey}`;
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${systemPrompt}\n\nContext: ${context || 'General'}\n\nUser Question: ${query}` },
            ],
          },
        ],
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const fallback = await this.answerDeterministic(query, context);
        return {
          reply: fallback,
          source: 'DETERMINISTIC_ENGINE',
        };
      }

      const json = await res.json();
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        const fallback = await this.answerDeterministic(query, context);
        return {
          reply: fallback,
          source: 'DETERMINISTIC_ENGINE',
        };
      }

      return {
        reply: text,
        source: 'GEMINI',
      };
    } catch {
      const fallback = await this.answerDeterministic(query, context);
      return {
        reply: fallback,
        source: 'DETERMINISTIC_ENGINE',
      };
    }
  }
}
