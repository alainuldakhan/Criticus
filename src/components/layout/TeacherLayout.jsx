import { NavLink, Outlet } from 'react-router-dom';

const sectionLinkClass = ({ isActive }) =>
  isActive ? 'section-layout__link active' : 'section-layout__link';

const TeacherLayout = () => {
  return (
    <div className="section-layout">
      <aside className="section-layout__sidebar">
        <h2 className="section-layout__title">Инструменты преподавателя</h2>
        <nav className="section-layout__nav" aria-label="Навигация преподавателя">
          <NavLink end to="/teacher" className={sectionLinkClass}>
            Обзор
          </NavLink>
          <NavLink to="classes" className={sectionLinkClass}>
            Классы
          </NavLink>
          <NavLink to="students" className={sectionLinkClass}>
            Студенты
          </NavLink>
          <NavLink to="invitations" className={sectionLinkClass}>
            Приглашения
          </NavLink>
          <NavLink to="topics" className={sectionLinkClass}>
            RAG Темы
          </NavLink>
          <NavLink to="rag" className={sectionLinkClass}>
            RAG Аналитика
          </NavLink>
        </nav>
      </aside>
      <div className="section-layout__content">
        <Outlet />
      </div>
    </div>
  );
};

export default TeacherLayout;
