import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';

// Pages
import { HomePage } from './pages/HomePage';
import { JournalCheckPage } from './pages/JournalCheckPage';
import { JournalResultsPage } from './pages/JournalResultsPage';
import { JournalAuditPage } from './pages/JournalAuditPage';
import { AuditFindingsPage } from './pages/AuditFindingsPage';
import { AuditRepairPlanPage } from './pages/AuditRepairPlanPage';
import { DoiDoctorPage } from './pages/DoiDoctorPage';
import { DoiCensusPage } from './pages/DoiCensusPage';
import { DoiPreservationPage } from './pages/DoiPreservationPage';
import { IndexingDirectoryPage } from './pages/IndexingDirectoryPage';
import { IndexingApplicationsPage } from './pages/IndexingApplicationsPage';
import { InstitutionDashboardPage } from './pages/InstitutionDashboardPage';
import { InstitutionWatchlistPage } from './pages/InstitutionWatchlistPage';
import { InstitutionBatchPage } from './pages/InstitutionBatchPage';
import { PortfolioDashboardPage } from './pages/PortfolioDashboardPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ServicesPage } from './pages/ServicesPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { NewsroomPage } from './pages/NewsroomPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { StatusPage } from './pages/StatusPage';
import { LegalPage } from './pages/LegalPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#0A0908] text-[#FAF7F2]">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              {/* Public Core */}
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/newsroom" element={<NewsroomPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/status" element={<StatusPage />} />

              {/* Journal Assessment & Audit */}
              <Route path="/journal-check" element={<JournalCheckPage />} />
              <Route path="/journal-check/results/:id" element={<JournalResultsPage />} />
              <Route path="/journal-audit" element={<JournalAuditPage />} />
              <Route path="/journal-audit/:id/findings" element={<AuditFindingsPage />} />
              <Route path="/journal-audit/:id/repair-plan" element={<AuditRepairPlanPage />} />

              {/* DOI Doctor */}
              <Route path="/doi-doctor" element={<DoiDoctorPage />} />
              <Route path="/doi-doctor/doi-check" element={<DoiDoctorPage />} />
              <Route path="/doi-doctor/census" element={<DoiCensusPage />} />
              <Route path="/doi-doctor/preservation" element={<DoiPreservationPage />} />

              {/* Indexing Workflow */}
              <Route path="/indexing" element={<Navigate to="/indexing/directory" replace />} />
              <Route path="/indexing/directory" element={<IndexingDirectoryPage />} />
              <Route path="/indexing/applications" element={<IndexingApplicationsPage />} />

              {/* Institutional & Portfolio Workspaces */}
              <Route path="/institution/dashboard" element={<InstitutionDashboardPage />} />
              <Route path="/institution/watchlist" element={<InstitutionWatchlistPage />} />
              <Route path="/institution/batch-evaluation" element={<InstitutionBatchPage />} />
              <Route path="/portfolio/dashboard" element={<PortfolioDashboardPage />} />
              <Route path="/portfolio/journals" element={<PortfolioDashboardPage />} />

              {/* Account & Administration */}
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<UserDashboardPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />

              {/* Legal & Compliance Routes */}
              <Route path="/privacy" element={<LegalPage />} />
              <Route path="/terms" element={<LegalPage />} />
              <Route path="/cookies" element={<LegalPage />} />
              <Route path="/trust-and-security" element={<LegalPage />} />
              <Route path="/accessibility" element={<LegalPage />} />
              <Route path="/data-deletion" element={<LegalPage />} />
              <Route path="/refunds" element={<LegalPage />} />
              <Route path="/service-delivery" element={<LegalPage />} />
              <Route path="/release-notes" element={<LegalPage />} />
              <Route path="/roadmap" element={<LegalPage />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
          <AiAssistantDrawer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};
export default App;
