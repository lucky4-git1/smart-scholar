import { config } from '../config';
import { prisma } from '../database/prisma';

export interface AssistantMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class AiAssistantService {
  /**
   * Deterministic knowledge base answering platform, methodology, and remediation queries
   */
  private static answerDeterministic(query: string, context?: string): string {
    const q = query.toLowerCase();

    if (q.includes('methodology') || q.includes('score') || q.includes('points') || q.includes('pillars')) {
      return (
        '**Smart Scholars 5-Pillar Scoring Methodology (v1.2.0-2026)**\n\n' +
        'Our assessment calculates a deterministic 100-point score across five evidence pillars:\n' +
        '1. **Identity & Governance (25 pts)**: Verified ISSN on CIEPS, corporate entity registration, transparent institutional affiliations.\n' +
        '2. **Editorial Integrity (25 pts)**: Verifiable peer-review workflow, COPE ethics conformity, automated plagiarism screening disclosures.\n' +
        '3. **Technical Standing (20 pts)**: Active Crossref/DataCite DOI resolution, machine-readable licensing (CC BY), XML/JATS schema compliance.\n' +
        '4. **Preservation & Access (15 pts)**: Long-term archival escrow (Portico, CLOCKSS, PKP PN, Internet Archive), clear APC schedule or Diamond OA.\n' +
        '5. **Reach & Citation Transparency (15 pts)**: Documented citations in OpenAlex, Crossref reference distribution, international editorial diversity.\n\n' +
        '**Grade Thresholds**: A+ (90-100), A (80-89), B (70-79), C (55-69), D (40-54), RED FLAG (<40 or multiple critical misconduct signals).'
      );
    }

    if (q.includes('red flag') || q.includes('predatory')) {
      return (
        '**Understanding Red Flag Indicators**\n\n' +
        'A Red Flag rating is triggered when deterministic evidence signals severe integrity or misrepresentation risks, such as:\n' +
        '• Guaranteed rapid publication turnaround (e.g., < 5 business days) bypassing meaningful peer review.\n' +
        '• Fake or borrowed ISSN numbers not registered in the official CIEPS portal.\n' +
        '• Fabricated indexing claims (e.g. claiming Scopus/WoS inclusion when missing from active lists).\n' +
        '• High proportion of broken or non-resolving DOIs.\n\n' +
        'Red flags immediately deduct 15–30 points and cap the journal rating.'
      );
    }

    if (q.includes('scopus') || q.includes('web of science') || q.includes('index') || q.includes('doaj')) {
      return (
        '**Indexing Readiness & Requirements**\n\n' +
        'To apply successfully to major indexing databases:\n' +
        '• **DOAJ**: Requires active ISSN, CC licensing on all full text, documented archiving agreement, and transparent APC policy.\n' +
        '• **Scopus**: Minimum 2-year publishing history, diverse international editorial board, English abstracts/keywords, and punctuality.\n' +
        '• **Web of Science Core Collection**: Must pass all 24 Essential Quality Criteria regarding editorial rigor, DOI persistence, and scholarly impact.\n\n' +
        'You can generate a step-by-step readiness audit in the **Journal Audit** module or prepare your application dossier in **GetIndexed**.'
      );
    }

    if (q.includes('doi') || q.includes('crossref') || q.includes('broken')) {
      return (
        '**DOI Doctor & Resolution Maintenance**\n\n' +
        'DOI Doctor verifies that your digital object identifiers resolve properly (HTTP 200/301) and checks your registered Crossref metadata completeness:\n' +
        '• Abstract completeness\n' +
        '• Reference list linking\n' +
        '• Machine-readable license URLs\n' +
        '• Funder registry awards\n\n' +
        'Use the **DOI Doctor** tool to check individual DOIs or upload an article CSV for census reconciliation.'
      );
    }

    return (
      '**Smart Scholars Research Integrity Assistant**\n\n' +
      'I can assist you with:\n' +
      '• Explaining the 5-Pillar Journal Trust Rating and criteria point values\n' +
      '• Interpreting Journal Audit findings and remediation steps\n' +
      '• Guidance on DOAJ, Scopus, and Web of Science indexing criteria\n' +
      '• Diagnosing DOI resolution and Crossref metadata completeness\n\n' +
      (context ? `*Active context: ${context}*\n\n` : '') +
      'Please ask a specific question regarding journal assessment, audit findings, or indexing preparation.'
    );
  }

  /**
   * Answer a user query, using Gemini API if key is configured, or honest deterministic engine fallback
   */
  static async askAssistant(query: string, context?: string): Promise<{ reply: string; source: 'GEMINI' | 'DETERMINISTIC_ENGINE' }> {
    if (!config.geminiApiKey || config.geminiApiKey.trim() === '') {
      return {
        reply: this.answerDeterministic(query, context),
        source: 'DETERMINISTIC_ENGINE',
      };
    }

    try {
      const systemPrompt =
        'You are the Smart Scholars Research Integrity Assistant. Ground your responses strictly in academic integrity best practices, DOAJ/COPE/Scopus standards, and the Smart Scholars 5-Pillar methodology (Identity, Editorial, Technical, Preservation, Reach). Distinguish facts from suggestions. Never invent metrics.';

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.geminiApiKey}`;
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${systemPrompt}\n\nContext: ${context || 'None'}\n\nUser Question: ${query}` },
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
        return {
          reply: this.answerDeterministic(query, context),
          source: 'DETERMINISTIC_ENGINE',
        };
      }

      const json = await res.json();
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text;

      return {
        reply: text || this.answerDeterministic(query, context),
        source: 'GEMINI',
      };
    } catch {
      return {
        reply: this.answerDeterministic(query, context),
        source: 'DETERMINISTIC_ENGINE',
      };
    }
  }
}
