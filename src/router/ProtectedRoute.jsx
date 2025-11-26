import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children, requiredRoles }) => {
  // ВРЕМЕННО ЗАКОММЕНТИРОВАНО ДЛЯ ДОСТУПА БЕЗ АВТОРИЗАЦИИ
  // const { isAuthenticated, isLoading, user } = useAuth();
  // const location = useLocation();

  // if (isLoading) {
  //   return <div className="page page--centered">Checking permissions…</div>;
  // }

  // if (!isAuthenticated) {
  //   return <Navigate to="/auth/login" replace state={{ from: location }} />;
  // }

  // if (
  //   requiredRoles &&
  //   requiredRoles.length > 0 &&
  //   !requiredRoles.some((role) => user.roles?.includes(role))
  // ) {
  //   return <Navigate to="/" replace ]/>;
  // }

  return children;
};

export default ProtectedRoute;
