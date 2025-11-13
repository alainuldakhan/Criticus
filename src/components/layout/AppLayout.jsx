import { NavLink, Outlet, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Logo from '../ui/Logo';

const navClassName = ({ isActive }) =>
  isActive ? 'app-shell__nav-link app-shell__nav-link--active' : 'app-shell__nav-link';

const AppLayout = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const isTeacher = user.roles?.includes('Teacher');
  const isStudent = user.roles?.includes('Student');

  return (
    <div className="app-shell">
      <header className="app-shell__header" role="banner">
        <div className="app-shell__header-inner">
          <Logo className="app-shell__logo" size="default" />

          <nav className="app-shell__nav" aria-label="Основная навигация">
            <NavLink to="/" className={navClassName}>
              Главная
            </NavLink>
            {isStudent && (
              <NavLink to="/student/topics" className={navClassName}>
                Темы
              </NavLink>
            )}
            {isTeacher && (
              <NavLink to="/teacher/classes" className={navClassName}>
                Классы
              </NavLink>
            )}
            {isStudent && (
              <NavLink to="/student/sessions" className={navClassName}>
                Сессии
              </NavLink>
            )}
            {isStudent && (
              <NavLink to="/student/reports" className={navClassName}>
                Отчёты
              </NavLink>
            )}
          </nav>

          <div className="app-shell__actions">
            {isLoading && <span className="app-shell__loading">Проверка доступа…</span>}
            {!isLoading && isAuthenticated && (
              <>
                <span className="app-shell__user" aria-label="Email текущего пользователя">
                  {user.email}
                </span>
                <NavLink to="/profile" className="ghost-button ghost-button--light app-shell__action-btn">
                  Профиль
                </NavLink>
                <NavLink to="/auth/logout" className="button button--compact app-shell__action-btn">
                  Выйти
                </NavLink>
              </>
            )}
            {!isLoading && !isAuthenticated && (
              <>
                <NavLink to="/auth/login" className="ghost-button ghost-button--light app-shell__action-btn">
                  Войти
                </NavLink>
                <NavLink to="/auth/register" className="button button--compact app-shell__action-btn">
                  Регистрация
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="app-shell__main">
        <Outlet />
      </main>
      <footer className="app-shell__footer" aria-label="Site footer">
        <div className="footer__columns">
          <div className="footer__brand">
            <Logo className="footer__logo" size="small" />
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
    </div>
  );
};

export default AppLayout;
