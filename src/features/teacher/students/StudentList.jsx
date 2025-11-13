import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from '../../../api/students';
import { classesApi } from '../../../api/classes';
import Alert from '../../../components/ui/Alert';

const DEFAULT_FILTERS = {
  q: '',
  classId: '',
  page: 1,
  pageSize: 10,
};

const DEFAULT_FORM = {
  email: '',
  firstName: '',
  lastName: '',
  password: '',
};

const StudentList = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [feedback, setFeedback] = useState(null);
  const [createResult, setCreateResult] = useState(null);

  const { data: classes } = useQuery({
    queryKey: ['teacher', 'classes'],
    queryFn: classesApi.list,
  });

  const studentsQuery = useQuery({
    queryKey: ['teacher', 'students', filters],
    queryFn: () =>
      studentsApi.search({
        q: filters.q || undefined,
        classId: filters.classId || undefined,
        page: filters.page,
        pageSize: filters.pageSize,
      }),
    keepPreviousData: true,
  });

  const createMutation = useMutation({
    mutationFn: (payload) => studentsApi.create(payload),
    onSuccess: (data) => {
      setCreateResult(data);
      setFeedback({ tone: 'success', message: 'Student created successfully.' });
      setForm(DEFAULT_FORM);
      queryClient.invalidateQueries({ queryKey: ['teacher', 'students'] });
    },
    onError: (error) => {
      const message = error?.response?.data?.error || error?.message || 'Failed to create student.';
      setFeedback({ tone: 'error', message });
    },
  });

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handlePageChange = (direction) => {
    setFilters((prev) => ({ ...prev, page: Math.max(1, prev.page + direction) }));
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.email.trim()) {
      setFeedback({ tone: 'error', message: 'Email is required.' });
      return;
    }

    const payload = {
      email: form.email.trim(),
      password: form.password || undefined,
      firstName: form.firstName || undefined,
      lastName: form.lastName || undefined,
      classes: filters.classId ? [filters.classId] : undefined,
    };

    createMutation.mutate(payload);
  };

  const classOptions = useMemo(() => {
    return (classes ?? []).slice().sort((a, b) => a.name.localeCompare(b.name));
  }, [classes]);

  const students = studentsQuery.data?.items ?? [];
  const total = studentsQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));

  return (
    <div className="panel">
      <header className="panel__header">
        <h1>Students directory</h1>
        <p>
          Search across your managed cohort, onboard new students, and jump directly into
          detailed profiles.
        </p>
      </header>

      <section className="panel__section">
        <h2>Search filters</h2>
        <div className="filter-grid">
          <label className="form__field">
            <span>Search</span>
            <input
              type="search"
              name="q"
              placeholder="Name or email"
              value={filters.q}
              onChange={handleFilterChange}
            />
          </label>
          <label className="form__field">
            <span>Class</span>
            <select name="classId" value={filters.classId} onChange={handleFilterChange}>
              <option value="">All classes</option>
              {classOptions.map((klass) => (
                <option key={klass.id} value={klass.id}>
                  {klass.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="panel__section">
        <h2>Create student</h2>
        <p>
          Provide an email to invite a new student. You can optionally set a temporary
          password or add them directly to the selected class.
        </p>

        {feedback && <Alert tone={feedback.tone}>{feedback.message}</Alert>}
        {createResult?.tempPassword && (
          <Alert tone="info">
            Temporary password: <strong>{createResult.tempPassword}</strong>
          </Alert>
        )}

        <form className="form" onSubmit={handleSubmit}>
          <label className="form__field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleFormChange}
              required
              placeholder="student@example.com"
            />
          </label>
          <div className="form__row">
            <label className="form__field">
              <span>First name</span>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleFormChange}
              />
            </label>
            <label className="form__field">
              <span>Last name</span>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleFormChange}
              />
            </label>
          </div>
          <label className="form__field">
            <span>Temporary password (optional)</span>
            <input
              type="text"
              name="password"
              value={form.password}
              onChange={handleFormChange}
              placeholder="Auto-generate if left blank"
            />
          </label>
          <button type="submit" className="button" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Creating…' : 'Create student'}
          </button>
        </form>
      </section>

      <section className="panel__section">
        <h2>Results ({total})</h2>

        {studentsQuery.isLoading && <p>Loading students…</p>}
        {studentsQuery.isError && (
          <Alert tone="error">
            {studentsQuery.error?.message || 'Failed to load students.'}
          </Alert>
        )}

        {!studentsQuery.isLoading && students.length === 0 && <p>No students found.</p>}

        {!studentsQuery.isLoading && students.length > 0 && (
          <div className="table">
            <div className="table__head">
              <span>Name</span>
              <span>Email</span>
              <span>Classes</span>
              <span />
            </div>
            {students.map((student) => (
              <div key={student.userId} className="table__row">
                <span>
                  {student.firstName || student.lastName
                    ? `${student.firstName ?? ''} ${student.lastName ?? ''}`.trim() || '—'
                    : '—'}
                </span>
                <span>{student.email}</span>
                <span>
                  {student.classes?.length
                    ? student.classes.map((c) => c.name ?? c.id).join(', ')
                    : '—'}
                </span>
                <span>
                  <Link to={`/teacher/students/${student.userId}`} className="ghost-link">
                    View profile
                  </Link>
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="pagination">
          <button
            type="button"
            className="ghost-button"
            onClick={() => handlePageChange(-1)}
            disabled={filters.page === 1}
          >
            Previous
          </button>
          <span>
            Page {filters.page} of {totalPages}
          </span>
          <button
            type="button"
            className="ghost-button"
            onClick={() => handlePageChange(1)}
            disabled={filters.page >= totalPages}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
};

export default StudentList;
