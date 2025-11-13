import { useLocation, useNavigate } from 'react-router-dom';
import TopicCreate from '../../../features/teacher/topics/TopicCreate';
import TopicList from '../../../features/teacher/topics/TopicList';

const TeacherTopicsPage = () => {
  const location = useLocation();
  const isCreatePage = location.pathname.includes('/create');

  if (isCreatePage) {
    return (
      <section className="page">
        <TopicCreate />
      </section>
    );
  }

  return (
    <section className="page">
      <TopicList />
    </section>
  );
};

export default TeacherTopicsPage;

