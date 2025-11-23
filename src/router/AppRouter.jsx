import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import AppLayout from '../components/layout/AppLayout';
import TeacherLayout from '../components/layout/TeacherLayout';
import StudentLayout from '../components/layout/StudentLayout';
import Loader from '../components/ui/Loader';
import ProtectedRoute from './ProtectedRoute';

// Lazy load pages
const HomePage = lazy(() => import('../pages/home/HomePage'));
const NotFoundPage = lazy(() => import('../pages/not-found/NotFoundPage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const LogoutPage = lazy(() => import('../pages/auth/LogoutPage'));
const TeacherDashboardPage = lazy(() => import('../pages/teacher/TeacherDashboardPage'));
const TeacherClassesPage = lazy(() => import('../pages/teacher/classes/TeacherClassesPage'));
const TeacherClassDetailPage = lazy(() => import('../pages/teacher/classes/TeacherClassDetailPage'));
const TeacherStudentsPage = lazy(() => import('../pages/teacher/students/TeacherStudentsPage'));
const TeacherStudentDetailPage = lazy(() => import('../pages/teacher/students/TeacherStudentDetailPage'));
const TeacherInvitationsPage = lazy(() => import('../pages/teacher/invitations/TeacherInvitationsPage'));
const TeacherRagSessionsPage = lazy(() => import('../pages/teacher/rag/TeacherRagSessionsPage'));
const TeacherTopicsPage = lazy(() => import('../pages/teacher/topics/TeacherTopicsPage'));
const TeacherTopicDetailPage = lazy(() => import('../pages/teacher/topics/TeacherTopicDetailPage'));
const StudentDashboardPage = lazy(() => import('../pages/student/StudentDashboardPage'));
const StudentTopicsPage = lazy(() => import('../pages/student/topics/StudentTopicsPage'));
const StudentTopicDetailPage = lazy(() => import('../pages/student/topics/StudentTopicDetailPage'));
const StudentSessionsPage = lazy(() => import('../pages/student/sessions/StudentSessionsPage'));
const StudentSessionDetailPage = lazy(() => import('../pages/student/sessions/StudentSessionDetailPage'));
const StudentReportsPage = lazy(() => import('../pages/student/reports/StudentReportsPage'));
const ProfilePage = lazy(() => import('../pages/me/ProfilePage'));

const AppRouter = () => (
  <BrowserRouter>
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><Loader /></div>}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />

          <Route path="auth">
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="logout" element={<LogoutPage />} />
          </Route>

          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="teacher/*"
            element={
              <ProtectedRoute requiredRoles={['Teacher']}>
                <TeacherLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<TeacherDashboardPage />} />
            <Route path="classes" element={<TeacherClassesPage />} />
            <Route path="classes/:classId" element={<TeacherClassDetailPage />} />
            <Route path="students" element={<TeacherStudentsPage />} />
            <Route path="students/:studentId" element={<TeacherStudentDetailPage />} />
            <Route path="invitations" element={<TeacherInvitationsPage />} />
            <Route path="rag" element={<TeacherRagSessionsPage />} />
            <Route path="topics" element={<TeacherTopicsPage />} />
            <Route path="topics/create" element={<TeacherTopicsPage />} />
            <Route path="topics/:topicId" element={<TeacherTopicDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route
            path="student/*"
            element={
              <ProtectedRoute requiredRoles={['Student']}>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentDashboardPage />} />
            <Route path="topics" element={<StudentTopicsPage />} />
            <Route path="topics/:topicId" element={<StudentTopicDetailPage />} />
            <Route path="sessions" element={<StudentSessionsPage />} />
            <Route path="sessions/:sessionId" element={<StudentSessionDetailPage />} />
            <Route path="reports" element={<StudentReportsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default AppRouter;
