import { NavLink, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import Logo from '../ui/Logo';
import Loader from '../ui/Loader';
import Breadcrumb from '../ui/Breadcrumb';

const navClassName = ({ isActive }) =>
  isActive ? 'app-shell__nav-link app-shell__nav-link--active' : 'app-shell__nav-link';

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuth();
  const isTeacher = user.roles?.includes('Teacher');
  const isStudent = user.roles?.includes('Student');

  const getHomeLink = () => {
    if (isTeacher) return '/teacher';
    if (isStudent) return '/student';
    return '/';
  };

  const isHomePage = location.pathname === '/';
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    navigate('/auth/logout');
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="app-shell">
      <header className="app-shell__header" role="banner">
        <div className="app-shell__header-inner">
          <Logo className="app-shell__logo" size="default" />

          <nav className="app-shell__nav" aria-label="Основная навигация">
            <NavLink to={getHomeLink()} className={navClassName} end>
              Главная
            </NavLink>
          </nav>

          <div className="app-shell__actions">
            {isLoading && <Loader size="sm" message="Проверка доступа..." />}
            {!isLoading && isAuthenticated && (
              <>
                <span className="app-shell__user" aria-label="Роль пользователя">
                  {isTeacher ? '👨‍🏫' : '👨‍🎓'}
                </span>
                <NavLink to="/profile" className="ghost-button ghost-button--light app-shell__action-btn">
                  Профиль
                </NavLink>
                <button onClick={handleLogoutClick} className="button button--compact app-shell__action-btn">
                  Выйти
                </button>
              </>
            )}
            {!isLoading && !isAuthenticated && (
              <>
                <NavLink to="/auth/login" className="app-shell__nav-link app-shell__nav-link--highlight">
                  Войти
                </NavLink>
                <NavLink to="/auth/register" className="app-shell__nav-link app-shell__nav-link--highlight">
                  Регистрация
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="app-shell__main">
        {!isHomePage && <Breadcrumb />}
        <Outlet />
      </main>
      {isHomePage && (
        <footer className="app-shell__footer" aria-label="Site footer">
          <div className="footer__columns">
            <div className="footer__brand">
              <Logo className="footer__logo" size="small" />
              <p>Платформа для развития критического мышления</p>
            </div>
            <div className="footer__column">
              <h4>Для учителей</h4>
              <Link to="/teacher/classes">Управление классами</Link>
              <Link to="/teacher/invitations">Пригласить учеников</Link>
              <Link to="/teacher/rag">RAG аналитика</Link>
            </div>
            <div className="footer__column">
              <h4>Для учеников</h4>
              <Link to="/student/topics">Просмотр тем</Link>
              <Link to="/student/sessions">Ваши сессии</Link>
              <Link to="/student/reports">Отчёты о прогрессе</Link>
            </div>
            <div className="footer__column">
              <h4>Поддержка</h4>
              <a href="mailto:support@criticus.edu">support@criticus.edu</a>
              <a href="https://example.com/handbook" target="_blank" rel="noreferrer">
                Руководство по использованию
              </a>
              <a href="https://example.com/privacy" target="_blank" rel="noreferrer">
                Конфиденциальность и безопасность
              </a>
            </div>
          </div>
        </footer>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={handleLogoutCancel}>
          <div className="modal modal--sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">Подтверждение выхода</h2>
            </div>
            <div className="modal__content">
              <p>Вы уверены, что хотите выйти?</p>
            </div>
            <div className="modal__footer">
              <button onClick={handleLogoutCancel} className="ghost-button">
                Отмена
              </button>
              <button onClick={handleLogoutConfirm} className="button">
                Выйти
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppLayout;
