import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import TeacherLayout from '../components/layout/TeacherLayout';
import StudentLayout from '../components/layout/StudentLayout';
import HomePage from '../pages/home/HomePage';
import NotFoundPage from '../pages/not-found/NotFoundPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import LogoutPage from '../pages/auth/LogoutPage';
import TeacherDashboardPage from '../pages/teacher/TeacherDashboardPage';
import TeacherClassesPage from '../pages/teacher/classes/TeacherClassesPage';
import TeacherClassDetailPage from '../pages/teacher/classes/TeacherClassDetailPage';
import TeacherStudentsPage from '../pages/teacher/students/TeacherStudentsPage';
import TeacherStudentDetailPage from '../pages/teacher/students/TeacherStudentDetailPage';
import TeacherInvitationsPage from '../pages/teacher/invitations/TeacherInvitationsPage';
import TeacherRagSessionsPage from '../pages/teacher/rag/TeacherRagSessionsPage';
import TeacherTopicsPage from '../pages/teacher/topics/TeacherTopicsPage';
import TeacherTopicDetailPage from '../pages/teacher/topics/TeacherTopicDetailPage';
import StudentDashboardPage from '../pages/student/StudentDashboardPage';
import StudentTopicsPage from '../pages/student/topics/StudentTopicsPage';
import StudentTopicDetailPage from '../pages/student/topics/StudentTopicDetailPage';
import StudentSessionsPage from '../pages/student/sessions/StudentSessionsPage';
import StudentSessionDetailPage from '../pages/student/sessions/StudentSessionDetailPage';
import StudentReportsPage from '../pages/student/reports/StudentReportsPage';
import ProfilePage from '../pages/me/ProfilePage';
import ProtectedRoute from './ProtectedRoute';

const AppRouter = () => (
  <BrowserRouter>
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
  </BrowserRouter>
);

export default AppRouter;
