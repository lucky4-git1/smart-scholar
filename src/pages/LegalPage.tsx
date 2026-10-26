import React from 'react';
import { useLocation } from 'react-router-dom';
import { ShieldCheck, FileText, Lock, RefreshCw, CheckCircle2 } from 'lucide-react';

export const LegalPage: React.FC = () => {
  const location = useLocation();
  const path = location.pathname.replace(/^\//, '');

  const getContent = () => {
    switch (path) {
      case 'privacy':
        return {
          title: 'Privacy Policy',
          subtitle: 'Last updated: October 2026 · GDPR & Academic Data Privacy Standards',
          sections: [
            {
              heading: '1. Information We Collect',
              text: 'Smart Scholars collects minimal personal information necessary to deliver research integrity services: account email addresses, institutional affiliations, and user-initiated query strings (ISSN, DOI, Journal URL). We never sell user search logs.',
            },
            {
              heading: '2. Public Registry Interaction',
              text: 'Queries for journal trustworthiness and DOI resolution are forwarded to official public APIs (Crossref, OpenAlex, DOAJ). These requests contain only the queried bibliographic identifier and polite contact headers.',
            },
            {
              heading: '3. Data Security & Storage',
              text: 'All account credentials are protected using salted bcrypt hashes. Sensitive administrative sessions utilize HTTP-only, secure cookies with samesite isolation.',
            },
          ],
        };
      case 'terms':
        return {
          title: 'Terms of Service',
          subtitle: 'Effective: October 2026',
          sections: [
            {
              heading: '1. Independent Evaluative Service',
              text: 'Smart Scholars provides algorithmic research integrity ratings, technical website audits, and DOI resolution diagnostics. Our assessments are analytical metrics based on verifiable public evidence and do not constitute legal advice or formal index accreditation.',
            },
            {
              heading: '2. Acceptable Use & SSRF Restrictions',
              text: 'Users agree not to submit private network addresses (RFC 1918), loopback destinations, or non-public domains to our crawling engine. The platform automatically validates and restricts requests that violate network safety rules.',
            },
          ],
        };
      case 'trust-and-security':
        return {
          title: 'Trust & Security Architecture',
          subtitle: 'Platform Defense & Data Integrity Protocol',
          sections: [
            {
              heading: '1. Server-Side SSRF Defense',
              text: 'All journal crawl targets are subjected to DNS resolution checks prior to fetching. Private IP addresses (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.0/8, 169.254.169.254) are rejected unconditionally.',
            },
            {
              heading: '2. Deterministic Scoring Integrity',
              text: 'Trust ratings cannot be arbitrarily modified or purchased. Scores are calculated deterministically from documented, versioned rules using traceable bibliographic evidence.',
            },
          ],
        };
      case 'accessibility':
        return {
          title: 'Accessibility Statement',
          subtitle: 'Conformity with WCAG 2.1 Level AA Guidelines',
          sections: [
            {
              heading: '1. Visual & Contrast Standards',
              text: 'Smart Scholars adheres to strict anti-slop visual craft guidelines. Typography uses high-contrast text tokens, monospaced tabular numbers for bibliographic identifiers, and clear focus indicators on all interactive elements.',
            },
            {
              heading: '2. Keyboard & Screen Reader Support',
              text: 'All primary workflows (Journal Check, Audit Submission, DOI Doctor, Dossier Management) are fully operable via standard keyboard navigation and accessible ARIA landmarks.',
            },
          ],
        };
      case 'release-notes':
        return {
          title: 'Release Notes',
          subtitle: 'Smart Scholars Platform Changelog',
          sections: [
            {
              heading: 'Version 1.2.0-2026 (Current)',
              text: '• Full implementation of 5-Pillar Journal Trust Rating (121 criteria).\n• Real-time DOI Doctor with Crossref 5-field metadata matrix.\n• SSRF-guarded automated website audit engine.\n• Institutional Research Integrity Desk with CSV batch screening.\n• GetIndexed directory covering DOAJ, Scopus, PMC, and Web of Science.',
            },
          ],
        };
      default:
        return {
          title: path.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
          subtitle: 'Smart Scholars Platform Policy',
          sections: [
            {
              heading: 'Policy Information',
              text: `Detailed compliance and operational disclosures regarding ${path.replace(/-/g, ' ')}. For specific questions, contact integrity@smartscholars.in.`,
            },
          ],
        };
    }
  };

  const content = getContent();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div>
        <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
          Compliance & Transparency
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-zinc-100 mt-1">
          {content.title}
        </h1>
        <p className="text-xs text-[#8C8375] font-mono mt-1">
          {content.subtitle}
        </p>
      </div>

      <div className="space-y-6">
        {content.sections.map((sec, idx) => (
          <div key={idx} className="ss-card p-6 space-y-2">
            <h2 className="font-display font-bold text-base text-zinc-100">
              {sec.heading}
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed whitespace-pre-line">
              {sec.text}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};
