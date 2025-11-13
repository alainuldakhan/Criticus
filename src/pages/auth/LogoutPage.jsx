import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import AuthCard from '../../components/auth/AuthCard';

const LogoutPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      await logout();
      navigate('/', { replace: true });
    };
    performLogout();
  }, [logout, navigate]);

  return (
    <div className="page page--centered">
      <AuthCard title="Выход из системы" subtitle="Очистка сессии и перенаправление на главную страницу." />
    </div>
  );
};

export default LogoutPage;
