import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { classesApi } from '../../../api/classes';
import Alert from '../../../components/ui/Alert';
import ClassDetailHeader from '../../../features/teacher/classes/ClassDetailHeader';
import ClassMembers from '../../../features/teacher/classes/ClassMembers';

const TeacherClassDetailPage = () => {
  const { classId } = useParams();

  const {
    data: klass,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['teacher', 'classes', classId],
    queryFn: () => classesApi.getById(classId),
  });

  if (isLoading) {
    return (
      <section className="page">
        <p>Loading class details…</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="page">
        <Alert tone="error">{error?.message || 'Failed to load class details.'}</Alert>
      </section>
    );
  }

  if (!klass) {
    return (
      <section className="page">
        <Alert tone="warning">Class not found or no longer available.</Alert>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="panel">
        <ClassDetailHeader klass={klass} />

        <section className="panel__section">
          <h2>Quick links</h2>
          <div className="link-grid">
            <Link to={`/teacher/invitations?classId=${klass.id}`} className="card-link">
              Invite students
            </Link>
            <Link to={`/teacher/rag?classId=${klass.id}`} className="card-link">
              View RAG sessions
            </Link>
          </div>
        </section>

        <ClassMembers classId={klass.id} />
      </div>
    </section>
  );
};

export default TeacherClassDetailPage;
