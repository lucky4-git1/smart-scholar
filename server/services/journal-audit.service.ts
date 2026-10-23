import { prisma } from '../database/prisma';
import { safeFetch } from '../middleware/security';

export interface AuditFindingItem {
  category: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  description: string;
  affectedUrl?: string;
  evidenceSnippet?: string;
  ruleKey: string;
}

export interface RepairItem {
  priority: number;
  title: string;
  actionPlan: string;
  codeTemplate?: string;
}

export class JournalAuditService {
  /**
   * Run a comprehensive technical and policy audit on a target journal website
   */
  static async runAudit(auditJobId: string): Promise<void> {
    const job = await prisma.auditJob.findUnique({
      where: { id: auditJobId },
    });

    if (!job) return;

    try {
      await prisma.auditJob.update({
        where: { id: auditJobId },
        data: {
          status: 'CRAWLING',
          startedAt: new Date(),
          progressPercent: 20,
        },
      });

      // 1. Safe fetch homepage
      const targetUrl = job.targetUrl;
      const res = await safeFetch(targetUrl);
      const html = await res.text();
      const lowerHtml = html.toLowerCase();

      await prisma.auditJob.update({
        where: { id: auditJobId },
        data: {
          status: 'ANALYZING',
          progressPercent: 50,
          totalPagesParsed: 1,
        },
      });

      const findings: AuditFindingItem[] = [];
      const repairPlans: RepairItem[] = [];

      // --- 2. Evaluate Policy Disclosures ---

      // 2.1 Editorial Board Check
      const hasEditorialBoard =
        lowerHtml.includes('editorial board') ||
        lowerHtml.includes('editors') ||
        lowerHtml.includes('editorial team') ||
        lowerHtml.includes('editor-in-chief');

      if (!hasEditorialBoard) {
        findings.push({
          category: 'EDITORIAL_BOARD',
          severity: 'CRITICAL',
          title: 'No Transparent Editorial Board Page Detected',
          description: 'Indexing services (Scopus, DOAJ, WoS) require a visible editorial board page with verified academic affiliations, institutional emails, and editorial roles.',
          affectedUrl: targetUrl,
          ruleKey: 'AUDIT_RULE_EDITORIAL_BOARD_MISSING',
        });
        repairPlans.push({
          priority: 1,
          title: 'Establish a Dedicated Editorial Board Page',
          actionPlan: 'Create a permanent, publicly linked `/editorial-board` page listing the Editor-in-Chief and Associate Editors, including their primary university affiliations, ORCIDs, and institutional email addresses.',
          codeTemplate: '<section class="editorial-board">\n  <h2>Editorial Board</h2>\n  <div class="editor">\n    <h3>Prof. Jane Doe, Ph.D. — Editor-in-Chief</h3>\n    <p>Department of Molecular Biology, University of Oxford</p>\n    <p>ORCID: 0000-0002-1825-0097</p>\n  </div>\n</section>',
        });
      } else {
        findings.push({
          category: 'EDITORIAL_BOARD',
          severity: 'INFO',
          title: 'Editorial Board Disclosures Detected',
          description: 'Editorial board references found on the website. Verify that all listed members hold active institutional email addresses.',
          affectedUrl: targetUrl,
          ruleKey: 'AUDIT_RULE_EDITORIAL_BOARD_FOUND',
        });
      }

      // 2.2 Peer Review Model
      const hasPeerReview =
        lowerHtml.includes('peer review') ||
        lowerHtml.includes('double-blind') ||
        lowerHtml.includes('single-blind') ||
        lowerHtml.includes('review process');

      if (!hasPeerReview) {
        findings.push({
          category: 'PEER_REVIEW',
          severity: 'CRITICAL',
          title: 'Missing Published Peer Review Workflow',
          description: 'Lack of an explicit, step-by-step peer review workflow is an automatic disqualifier for DOAJ and Web of Science evaluation.',
          affectedUrl: targetUrl,
          ruleKey: 'AUDIT_RULE_PEER_REVIEW_MISSING',
        });
        repairPlans.push({
          priority: 1,
          title: 'Publish an Explicit Peer-Review Policy',
          actionPlan: 'Detail your exact review workflow: initial editorial screening, minimum number of independent peer reviewers (typically 2), reviewer turnaround times, and appeals process.',
        });
      }

      // 2.3 Publication Ethics & Plagiarism
      const hasEthics =
        lowerHtml.includes('publication ethics') ||
        lowerHtml.includes('cope') ||
        lowerHtml.includes('committee on publication ethics') ||
        lowerHtml.includes('plagiarism');

      if (!hasEthics) {
        findings.push({
          category: 'POLICIES',
          severity: 'WARNING',
          title: 'Publication Ethics Statement Not Explicitly Prominent',
          description: 'The journal does not explicitly cite COPE guidelines or explain malpractice countermeasures.',
          affectedUrl: targetUrl,
          ruleKey: 'AUDIT_RULE_ETHICS_POLICY_UNCLEAR',
        });
        repairPlans.push({
          priority: 2,
          title: 'Adopt and Publish COPE Publication Ethics Guidelines',
          actionPlan: 'Add a dedicated Publication Ethics & Malpractice Statement outlining author responsibilities, duplicate submission prohibition, and retraction guidelines.',
        });
      }

      // 2.4 APC / Fee Transparency
      const hasApcMention =
        lowerHtml.includes('article processing charge') ||
        lowerHtml.includes('apc') ||
        lowerHtml.includes('publication fee') ||
        lowerHtml.includes('no fee') ||
        lowerHtml.includes('free of charge') ||
        lowerHtml.includes('diamond open access');

      if (!hasApcMention) {
        findings.push({
          category: 'APC',
          severity: 'CRITICAL',
          title: 'Article Processing Charges (APC) Undisclosed',
          description: 'DOAJ and Scopus strictly mandate that fees (or the explicit absence of fees) must be stated prior to manuscript submission.',
          affectedUrl: targetUrl,
          ruleKey: 'AUDIT_RULE_APC_UNDISCLOSED',
        });
        repairPlans.push({
          priority: 1,
          title: 'Publish Transparent Article Processing Charges',
          actionPlan: 'State publication charges unambiguously on an `/apc` or `/fees` page. If publishing is free, clearly declare: "This journal does not charge author processing fees (Diamond Open Access)."',
        });
      }

      // 2.5 DOI Implementation Check
      const hasDoiMention =
        lowerHtml.includes('doi.org') ||
        lowerHtml.includes('doi:') ||
        lowerHtml.includes('10.');

      if (!hasDoiMention) {
        findings.push({
          category: 'DOI_IMPLEMENTATION',
          severity: 'WARNING',
          title: 'No Digital Object Identifier (DOI) Links Found on Homepage',
          description: 'No active Crossref or DataCite DOI hyperlinks detected in recent article listings.',
          affectedUrl: targetUrl,
          ruleKey: 'AUDIT_RULE_DOI_ABSENT',
        });
        repairPlans.push({
          priority: 2,
          title: 'Implement Persistent DOI Links on Article Landing Pages',
          actionPlan: 'Ensure all published articles display full resolver URLs in the format `https://doi.org/10.xxxx/yyyy` rather than just plaintext DOI strings.',
        });
      }

      // 2.6 Digital Preservation
      const hasPreservation =
        lowerHtml.includes('clockss') ||
        lowerHtml.includes('portico') ||
        lowerHtml.includes('pkp preservation network') ||
        lowerHtml.includes('internet archive') ||
        lowerHtml.includes('archiving');

      if (!hasPreservation) {
        findings.push({
          category: 'PRESERVATION',
          severity: 'WARNING',
          title: 'No Long-Term Archival Preservation Policy Mentioned',
          description: 'Long-term digital archiving arrangements (CLOCKSS, Portico, PKP PN) protect content in perpetuity and are required for the DOAJ Seal.',
          affectedUrl: targetUrl,
          ruleKey: 'AUDIT_RULE_PRESERVATION_MISSING',
        });
        repairPlans.push({
          priority: 3,
          title: 'Enroll in a Permanent Archival Service',
          actionPlan: 'If using OJS, enable the free PKP Preservation Network plugin. Alternatively, establish a deposit agreement with Internet Archive or Portico.',
        });
      }

      // 2.7 Open Access Licensing
      const hasCcLicense =
        lowerHtml.includes('creativecommons.org') ||
        lowerHtml.includes('cc by') ||
        lowerHtml.includes('open access');

      if (!hasCcLicense) {
        findings.push({
          category: 'POLICIES',
          severity: 'CRITICAL',
          title: 'Missing Creative Commons Licensing Specification',
          description: 'Open access journals must specify the exact license under which articles are published (e.g., CC BY 4.0).',
          affectedUrl: targetUrl,
          ruleKey: 'AUDIT_RULE_LICENSE_MISSING',
        });
        repairPlans.push({
          priority: 1,
          title: 'Adopt and Display a Creative Commons License',
          actionPlan: 'Add CC BY 4.0 licensing declarations to the footer, author instructions, and article metadata.',
        });
      }

      // Count severities
      const criticalCount = findings.filter(f => f.severity === 'CRITICAL').length;
      const warningCount = findings.filter(f => f.severity === 'WARNING').length;
      const infoCount = findings.filter(f => f.severity === 'INFO').length;

      // Compute readiness score
      let score = 100 - (criticalCount * 22) - (warningCount * 8);
      score = Math.max(10, Math.min(98, score));

      // Persist findings and repair plans
      await prisma.$transaction([
        prisma.auditFinding.createMany({
          data: findings.map(f => ({
            auditJobId,
            category: f.category,
            severity: f.severity,
            title: f.title,
            description: f.description,
            affectedUrl: f.affectedUrl,
            ruleKey: f.ruleKey,
          })),
        }),
        prisma.repairRecommendation.createMany({
          data: repairPlans.map(r => ({
            auditJobId,
            priority: r.priority,
            title: r.title,
            actionPlan: r.actionPlan,
            codeTemplate: r.codeTemplate,
          })),
        }),
        prisma.auditJob.update({
          where: { id: auditJobId },
          data: {
            status: 'COMPLETED',
            progressPercent: 100,
            totalFindings: findings.length,
            criticalCount,
            warningCount,
            infoCount,
            score,
            completedAt: new Date(),
          },
        }),
      ]);
    } catch (err: any) {
      console.error(`Audit Job ${auditJobId} failed:`, err);
      await prisma.auditJob.update({
        where: { id: auditJobId },
        data: {
          status: 'FAILED',
          errorMessage: err.message || 'Audit crawl failure.',
          completedAt: new Date(),
        },
      });
    }
  }
}
