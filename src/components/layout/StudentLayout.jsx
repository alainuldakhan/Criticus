import { NavLink, Outlet } from 'react-router-dom';

const sectionLinkClass = ({ isActive }) =>
  isActive ? 'section-layout__link section-layout__link--active' : 'section-layout__link';

const StudentLayout = () => {
  return (
    <div className="section-layout section-layout--glass">
      <aside className="section-layout__sidebar section-layout__sidebar--glass">
        <h2 className="section-layout__title section-layout__title--gradient">
          Панель студента
        </h2>
        <nav className="section-layout__nav" aria-label="Навигация студента">
          <NavLink end to="/student" className={sectionLinkClass}>
            Обзор
          </NavLink>
          <NavLink to="topics" className={sectionLinkClass}>
            Темы
          </NavLink>
          <NavLink to="sessions" className={sectionLinkClass}>
            Сессии
          </NavLink>
          <NavLink to="reports" className={sectionLinkClass}>
            Отчёты
          </NavLink>
        </nav>
      </aside>
      <div className="section-layout__content">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentLayout;
