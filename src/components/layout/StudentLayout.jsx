import { NavLink, Outlet } from 'react-router-dom';

const sectionLinkClass = ({ isActive }) =>
  isActive ? 'section-layout__link active' : 'section-layout__link';

const StudentLayout = () => {
  return (
    <div className="section-layout">
      <aside className="section-layout__sidebar">
        <h2 className="section-layout__title">Студенческая зона</h2>
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
