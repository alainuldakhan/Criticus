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
      setFeedback({ tone: 'success', message: 'Студент успешно создан.' });
      setForm(DEFAULT_FORM);
      queryClient.invalidateQueries({ queryKey: ['teacher', 'students'] });
    },
    onError: (error) => {
      const message = error?.response?.data?.error || error?.message || 'Не удалось создать студента.';
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
      setFeedback({ tone: 'error', message: 'Email обязателен.' });
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

  // Helper function to generate initials and color from name/email
  const getAvatarData = (student) => {
    const name = `${student.firstName || ''} ${student.lastName || ''}`.trim();
    const initials = name
      ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
      : (student.email?.[0] || '?').toUpperCase();

    // Generate consistent color from email
    const colors = [
      '#1e40af', '#7c3aed', '#be123c', '#ca8a04', '#0891b2',
      '#4f46e5', '#9333ea', '#dc2626', '#ea580c', '#16a34a'
    ];
    const index = student.email ? student.email.charCodeAt(0) % colors.length : 0;

    return { initials, color: colors[index] };
  };

  return (
    <div className="panel panel--glass">
      <header className="panel__header">
        <h1 className="panel__title panel__title--gradient">Каталог студентов</h1>
        <p className="panel__description">
          Ищите в вашем классе, добавляйте новых студентов и просматривайте профили
        </p>
      </header>

      {/* Stats Summary */}
      {!studentsQuery.isLoading && total > 0 && (
        <div className="students-stats">
          <div className="stat-card-compact">
            <span className="stat-card-compact__icon">👨‍🎓</span>
            <div className="stat-card-compact__info">
              <div className="stat-card-compact__value">{total}</div>
              <div className="stat-card-compact__label">Всего студентов</div>
            </div>
          </div>
          <div className="stat-card-compact">
            <span className="stat-card-compact__icon">🎯</span>
            <div className="stat-card-compact__info">
              <div className="stat-card-compact__value">{students.length}</div>
              <div className="stat-card-compact__label">На этой странице</div>
            </div>
          </div>
        </div>
      )}

      {/* Two-column layout */}
      <div className="students-layout">
        {/* Sidebar with filters & form */}
        <aside className="students-sidebar">
          {/* Filters */}
          <div className="students-filters">
            <h2 className="panel__subtitle">Фильтры поиска</h2>
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
              <label className="form__field">
                <span>Поиск</span>
                <input
                  type="search"
                  name="q"
                  placeholder="Имя или email"
                  value={filters.q}
                  onChange={handleFilterChange}
                />
              </label>
              <label className="form__field">
                <span>Класс</span>
                <select name="classId" value={filters.classId} onChange={handleFilterChange}>
                  <option value="">Все классы</option>
                  {classOptions.map((klass) => (
                    <option key={klass.id} value={klass.id}>
                      {klass.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Create Form */}
          <div className="students-form">
            <h2 className="panel__subtitle">Создать студента</h2>

            {feedback && <Alert tone={feedback.tone}>{feedback.message}</Alert>}
            {createResult?.tempPassword && (
              <Alert tone="info">
                Временный пароль: <strong>{createResult.tempPassword}</strong>
              </Alert>
            )}

            <form className="form" onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
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
                  <span>Имя</span>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleFormChange}
                  />
                </label>
                <label className="form__field">
                  <span>Фамилия</span>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleFormChange}
                  />
                </label>
              </div>
              <label className="form__field">
                <span>Временный пароль</span>
                <input
                  type="text"
                  name="password"
                  value={form.password}
                  onChange={handleFormChange}
                  placeholder="Оставьте пустым для автогенерации"
                />
              </label>
              <button type="submit" className="button" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Создание…' : 'Создать студента'}
              </button>
            </form>
          </div>
        </aside>

        {/* Main content with student cards */}
        <main className="students-main-content">
          <h2 className="panel__subtitle">Результаты ({total})</h2>

          {studentsQuery.isLoading && <p>Загрузка студентов…</p>}
          {studentsQuery.isError && (
            <Alert tone="error">
              {studentsQuery.error?.message || 'Не удалось загрузить студентов.'}
            </Alert>
          )}

          {!studentsQuery.isLoading && students.length === 0 && (
            <div className="empty-state">
              <div className="empty-state__icon">👥</div>
              <p className="empty-state__text">Студенты не найдены</p>
              <p className="empty-state__hint">Попробуйте изменить фильтры или создайте нового студента</p>
            </div>
          )}

          {!studentsQuery.isLoading && students.length > 0 && (
            <>
              <div className="students-grid">
                {students.map((student) => {
                  const avatar = getAvatarData(student);
                  const name = `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Студент';

                  return (
                    <div key={student.userId} className="student-card">
                      <div className="student-card__header">
                        <div
                          className="student-card__avatar"
                          style={{ backgroundColor: avatar.color }}
                        >
                          {avatar.initials}
                        </div>
                        <div className="student-card__info">
                          <h3 className="student-card__name">{name}</h3>
                          <p className="student-card__email">{student.email}</p>
                        </div>
                      </div>

                      {student.classes && student.classes.length > 0 && (
                        <div className="student-card__badges">
                          {student.classes.map((c, idx) => (
                            <span key={idx} className="student-card__badge">
                              {c.name ?? c.id}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="student-card__footer">
                        <Link to={`/teacher/students/${student.userId}`} className="student-card__link">
                          Просмотр профиля →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pagination">
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => handlePageChange(-1)}
                  disabled={filters.page === 1}
                >
                  ← Предыдущая
                </button>
                <span className="pagination__info">
                  Страница {filters.page} из {totalPages}
                </span>
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => handlePageChange(1)}
                  disabled={filters.page >= totalPages}
                >
                  Следующая →
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentList;
