import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { studentsApi } from '../../../api/students';
import Alert from '../../../components/ui/Alert';

const StudentProfile = () => {
  const { studentId } = useParams();
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState(null);
  const [resetResult, setResetResult] = useState(null);

  const query = useQuery({
    queryKey: ['teacher', 'students', studentId],
    queryFn: () => studentsApi.getById(studentId),
  });

  const deactivateMutation = useMutation({
    mutationFn: () => studentsApi.deactivate(studentId),
    onSuccess: () => {
      setFeedback({ tone: 'success', message: 'Student deactivated.' });
      queryClient.invalidateQueries({ queryKey: ['teacher', 'students', studentId] });
    },
    onError: (error) => {
      const message = error?.response?.data?.error || error?.message || 'Failed to deactivate.';
      setFeedback({ tone: 'error', message });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: () => studentsApi.resetPassword(studentId),
    onSuccess: (data) => {
      setResetResult(data);
      setFeedback({ tone: 'success', message: 'Temporary password generated.' });
    },
    onError: (error) => {
      const message = error?.response?.data?.error || error?.message || 'Failed to reset password.';
      setFeedback({ tone: 'error', message });
    },
  });

  const student = query.data;
  const fullName = useMemo(() => {
    if (!student) return '';
    const combined = [student.firstName, student.lastName].filter(Boolean).join(' ');
    return combined || 'Unnamed student';
  }, [student]);

  if (query.isLoading) {
    return (
      <div className="panel">
        <p>Loading student…</p>
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="panel">
        <Alert tone="error">{query.error?.message || 'Failed to load student.'}</Alert>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="panel">
        <Alert tone="warning">Student not found.</Alert>
      </div>
    );
  }

  return (
    <div className="panel">
      <header className="panel__header panel__header--split">
        <div>
          <h1>{fullName}</h1>
          <p>
            Email {student.email ?? '—'} • Status {student.isActive ? 'Active' : 'Inactive'} • ID
            {` ${student.userId}`}
          </p>
        </div>
        <div className="panel__actions">
          <button
            type="button"
            className="ghost-button"
            onClick={() => resetPasswordMutation.mutate()}
            disabled={resetPasswordMutation.isPending}
          >
            {resetPasswordMutation.isPending ? 'Resetting…' : 'Reset password'}
          </button>
          <button
            type="button"
            className="ghost-button ghost-button--danger"
            onClick={() => deactivateMutation.mutate()}
            disabled={deactivateMutation.isPending || !student.isActive}
          >
            {deactivateMutation.isPending ? 'Deactivating…' : 'Deactivate student'}
          </button>
        </div>
      </header>

      {feedback && <Alert tone={feedback.tone}>{feedback.message}</Alert>}
      {resetResult?.tempPassword && (
        <Alert tone="info">
          Temporary password: <strong>{resetResult.tempPassword}</strong>
        </Alert>
      )}

      <section className="panel__section">
        <h2>Profile details</h2>
        <div className="detail-grid">
          <div>
            <span className="detail-label">First name</span>
            <span>{student.firstName ?? '—'}</span>
          </div>
          <div>
            <span className="detail-label">Last name</span>
            <span>{student.lastName ?? '—'}</span>
          </div>
          <div>
            <span className="detail-label">Email</span>
            <span>{student.email ?? '—'}</span>
          </div>
        </div>
      </section>

      <section className="panel__section">
        <h2>Class memberships</h2>
        {student.classes?.length ? (
          <ul className="chip-list">
            {student.classes.map((klass) => (
              <li key={klass.id ?? klass.classId} className="chip">
                {klass.name ?? klass.className ?? klass.id ?? klass.classId}
              </li>
            ))}
          </ul>
        ) : (
          <p>No classes yet.</p>
        )}
      </section>
    </div>
  );
};

export default StudentProfile;
