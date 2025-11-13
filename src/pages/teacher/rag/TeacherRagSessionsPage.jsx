import { useState } from 'react';
import ClassSessions from '../../../features/teacher/rag/ClassSessions';
import StudentSessions from '../../../features/teacher/rag/StudentSessions';
import SessionInspector from '../../../features/teacher/rag/SessionInspector';

const TeacherRagSessionsPage = () => {
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  return (
    <section className="page">
      <div className="rag-grid">
        <div className="rag-grid__column">
          <ClassSessions onSelectSession={setSelectedSessionId} />
          <StudentSessions onSelectSession={setSelectedSessionId} />
        </div>
        <div className="rag-grid__column rag-grid__column--detail">
          <SessionInspector sessionId={selectedSessionId} />
        </div>
      </div>
    </section>
  );
};

export default TeacherRagSessionsPage;
