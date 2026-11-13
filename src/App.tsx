import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';

// 17 Pages
import { LandingPage } from './pages/LandingPage';
import { PricingPage } from './pages/PricingPage';
import { LoginPage } from './pages/LoginPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage';
import { DashboardPage } from './pages/DashboardPage';
import { CourseModulesPage } from './pages/CourseModulesPage';
import { TopicLearningPage } from './pages/TopicLearningPage';
import { CodingPracticePage } from './pages/CodingPracticePage';
import { OnlineCompilerPage } from './pages/OnlineCompilerPage';
import { SubmissionResultPage } from './pages/SubmissionResultPage';
import { ProgressDashboardPage } from './pages/ProgressDashboardPage';
import { PdfMaterialsPage } from './pages/PdfMaterialsPage';
import { InterviewPrepPage } from './pages/InterviewPrepPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { StudentProfilePage } from './pages/StudentProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminLoginPage } from './pages/AdminLoginPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          {/* Public & Landing */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />

          {/* Student Hub */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/progress" element={<ProgressDashboardPage />} />
          <Route path="/profile" element={<StudentProfilePage />} />

          {/* Curriculum & Learning */}
          <Route path="/modules" element={<CourseModulesPage />} />
          <Route path="/modules/:slug" element={<CourseModulesPage />} />
          <Route path="/topics/:slug" element={<TopicLearningPage />} />
          <Route path="/materials" element={<PdfMaterialsPage />} />

          {/* Coding Practice & Monaco Compiler */}
          <Route path="/practice" element={<CodingPracticePage />} />
          <Route path="/compiler" element={<OnlineCompilerPage />} />
          <Route path="/submissions" element={<SubmissionResultPage />} />

          {/* Technical Preparation */}
          <Route path="/interview" element={<InterviewPrepPage />} />
          <Route path="/assessments" element={<AssessmentPage />} />

          {/* Dedicated Admin Portal & Authentication */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin-login" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin" element={<AdminDashboardPage />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
