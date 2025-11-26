import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { classesApi } from '../../../api/classes';
import Alert from '../../../components/ui/Alert';
import Loader from '../../../components/ui/Loader';

const defaultForm = { emails: '' };

const ClassMembers = ({ classId }) => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(defaultForm);
  const [feedback, setFeedback] = useState(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState(new Set());
  const [studentSearch, setStudentSearch] = useState('');

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['teacher', 'classes', classId, 'members'],
    queryFn: () => classesApi.listMembers(classId),
  });

  const {
    data: allStudents,
    isLoading: isLoadingStudents,
    isError: isStudentsError,
    error: studentsError,
  } = useQuery({
    queryKey: ['teacher', 'classes', 'allStudents'],
    queryFn: classesApi.allStudents,
  });

  const addMembersMutation = useMutation({
    mutationFn: (payload) => classesApi.addMembers(classId, payload),
    onSuccess: (res) => {
      setFeedback({ tone: 'success', message: `Added ${res.added} member(s).` });
      setForm(defaultForm);
      setSelectedStudentIds(new Set());
      queryClient.invalidateQueries({ queryKey: ['teacher', 'classes', classId, 'members'] });
    },
    onError: (err) => {
      const message = err?.response?.data?.error || err?.message || 'Failed to add members.';
      setFeedback({ tone: 'error', message });
    },
  });

  const removeMutation = useMutation({
    mutationFn: ({ userId }) => classesApi.removeMember(classId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher', 'classes', classId, 'members'] });
    },
  });

  const handleSubmitEmails = (event) => {
    event.preventDefault();
    const emails = form.emails
      .split(',')
      .map((email) => email.trim())
      .filter(Boolean);

    if (emails.length === 0) {
      setFeedback({ tone: 'error', message: 'Enter at least one email.' });
      return;
    }
    addMembersMutation.mutate({ emails });
  };

  const handleRemove = (userId) => {
    const confirmed = window.confirm('Remove this member from the class?');
    if (confirmed) {
      removeMutation.mutate({ userId });
    }
  };

  const members = data ?? [];
  const students = useMemo(() => members.filter((m) => m.roleInClass === 'Student'), [members]);

  const availableStudents = useMemo(() => {
    if (!allStudents) return [];
    const term = studentSearch.trim().toLowerCase();
    return allStudents
      .map((student) => {
        const firstName = student.firstName ?? student.FirstName ?? '';
        const lastName = student.lastName ?? student.LastName ?? '';
        const email = student.email ?? student.Email ?? '';
        return {
          ...student,
          firstName,
          lastName,
          email,
          label: [firstName, lastName].filter(Boolean).join(' ') || student.userId,
        };
      })
      .filter((student) =>
        term.length === 0
          ? true
          : [student.label, student.email ?? '', student.userId]
            .join(' ')
            .toLowerCase()
            .includes(term)
      )
      .filter((student) => !students.some((m) => m.userId === student.userId));
  }, [allStudents, studentSearch, students]);

  const toggleSelected = (userId) => {
    setSelectedStudentIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const handleAddSelected = () => {
    if (selectedStudentIds.size === 0) {
      setFeedback({ tone: 'error', message: 'Select at least one student to add.' });
      return;
    }
    addMembersMutation.mutate({ userIds: Array.from(selectedStudentIds) });
  };

  return (
    <section className="panel__section">
      <h2>Class members</h2>
      <p>
        Invite existing users by email or add students you already manage. Students added here
        gain immediate access to the class.
      </p>

      {feedback && <Alert tone={feedback.tone}>{feedback.message}</Alert>}

      <div className="panel__subsection">
        <h3>Add managed students</h3>
        {isLoadingStudents && <Loader message="Loading student directory…" />}
        {isStudentsError && (
          <Alert tone="error">
            {studentsError?.message || 'Unable to load student directory.'}
          </Alert>
        )}
        {!isLoadingStudents && !isStudentsError && (
          <>
            <div className="form__row">
              <label className="form__field">
                <span>Search</span>
                <input
                  type="search"
                  placeholder="Search by name or email"
                  value={studentSearch}
                  onChange={(event) => setStudentSearch(event.target.value)}
                />
              </label>
            </div>
            <div className="selector-list">
              {availableStudents.length === 0 ? (
                <p>No additional students available.</p>
              ) : (
                availableStudents.map((student) => (
                  <label key={student.userId} className="selector-list__item">
                    <input
                      type="checkbox"
                      checked={selectedStudentIds.has(student.userId)}
                      onChange={() => toggleSelected(student.userId)}
                    />
                    <div>
                      <div className="selector-list__primary">{student.label}</div>
                      <div className="selector-list__secondary">{student.email ?? 'No email on file'}</div>
                    </div>
                  </label>
                ))
              )}
            </div>
            <button
              type="button"
              className="ghost-button"
              onClick={handleAddSelected}
              disabled={addMembersMutation.isPending}
            >
              {addMembersMutation.isPending ? 'Adding…' : 'Add selected students'}
            </button>
          </>
        )}
      </div>

      <div className="panel__subsection">
        <h3>Add by email</h3>
        <form className="form" onSubmit={handleSubmitEmails}>
          <label className="form__field">
            <span>Student emails</span>
            <input
              type="text"
              name="emails"
              value={form.emails}
              onChange={(event) => setForm({ emails: event.target.value })}
              placeholder="Separate multiple emails with commas"
            />
          </label>
          <button type="submit" className="button" disabled={addMembersMutation.isPending}>
            {addMembersMutation.isPending ? 'Adding…' : 'Add members'}
          </button>
        </form>
      </div>

      <div className="panel__section-divider" />

      {isLoading && <p>Loading class members…</p>}
      {isError && <Alert tone="error">{error?.message || 'Failed to load members.'}</Alert>}
      {!isLoading && !isError && members.length === 0 && <p>No members yet.</p>}

      {!isLoading && !isError && members.length > 0 && (
        <div className="table">
          <div className="table__head">
            <span>User ID</span>
            <span>Role</span>
            <span>Joined</span>
            <span />
          </div>
          {students.map((member) => (
            <div key={member.userId} className="table__row">
              <span>{member.userId}</span>
              <span>{member.roleInClass}</span>
              <span>{new Date(member.joinedUtc).toLocaleDateString()}</span>
              <span>
                <button
                  type="button"
                  className="ghost-button ghost-button--danger"
                  onClick={() => handleRemove(member.userId)}
                  disabled={removeMutation.isPending}
                >
                  Remove
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ClassMembers;
