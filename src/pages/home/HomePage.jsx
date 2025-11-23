import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/ui/Button';

const HomePage = () => {
  const { user } = useAuth();
  const isTeacher = user.roles?.includes('Teacher');
  const isStudent = user.roles?.includes('Student');

  return (
    <section className="page home">
      <div className="home__hero">
        <div className="home__hero-content">
          <h1 className="home__title">
            Развиваем <span className="text-gradient">критическое мышление</span>
          </h1>
          <p className="home__subtitle">
            Направляем учеников средней школы через целенаправленную практику. Наш адаптивный RAG движок
            объединяет опыт учителя с обратной связью от ИИ.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
