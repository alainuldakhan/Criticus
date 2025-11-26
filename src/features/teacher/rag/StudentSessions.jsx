import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { studentsApi } from '../../../api/students';
import { ragTeacherApi } from '../../../api/ragTeacher';
import Alert from '../../../components/ui/Alert';

const DEFAULT_FILTERS = {
  page: 1,
  pageSize: 10,
  studentId: '',
};

const StudentSessions = ({ onSelectSession }) => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [searchTerm, setSearchTerm] = useState('');

  const studentsQuery = useQuery({
    queryKey: ['teacher', 'students', 'all'],
    queryFn: () =>
      studentsApi.search({
        page: 1,
        pageSize: 50,
      }),
  });

  const sessionsQuery = useQuery({
    queryKey: ['teacher', 'rag', 'student', filters],
    queryFn: () =>
      ragTeacherApi.listStudentSessions(filters.studentId, {
        page: filters.page,
        pageSize: filters.pageSize,
      }),
    enabled: Boolean(filters.studentId),
    keepPreviousData: true,
  });

  const studentOptions = useMemo(() => {
    const items = studentsQuery.data?.items ?? [];
    if (!searchTerm) return items;
    return items.filter((item) => {
      const haystack = `${item.firstName ?? ''} ${item.lastName ?? ''} ${item.email ?? ''}`.toLowerCase();
      return haystack.includes(searchTerm.toLowerCase());
    });
  }, [studentsQuery.data, searchTerm]);

  const sessions = sessionsQuery.data?.items ?? [];
  const total = sessionsQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));

  const handleSelectStudent = (event) => {
    setFilters((prev) => ({ ...prev, studentId: event.target.value, page: 1 }));
  };

  const handlePageChange = (direction) => {
    setFilters((prev) => ({
      ...prev,
      page: Math.max(1, Math.min(prev.page + direction, totalPages)),
    }));
  };

  return (
    <div className="panel panel--glass">
      <header className="panel__header">
        <h1 className="panel__title panel__title--gradient">Сессии студента</h1>
      </header>

      <div className="students-filters" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <label className="form__field">
            <span>Поиск студентов</span>
            <input
              type="search"
              placeholder="Имя или email"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>
          <label className="form__field">
            <span>Выберите студента</span>
            <select value={filters.studentId} onChange={handleSelectStudent}>
              <option value="">Выберите студента…</option>
              {studentOptions.map((student) => (
                <option key={student.userId} value={student.userId}>
                  {student.firstName || student.lastName
                    ? `${student.firstName ?? ''} ${student.lastName ?? ''}`.trim()
                    : student.email}{' '}
                  ({student.email})
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Stats */}
      {filters.studentId && !sessionsQuery.isLoading && total > 0 && (
        <div className="classes-stats">
          <div className="stat-card-compact">
            <span className="stat-card-compact__icon">📊</span>
            <div className="stat-card-compact__info">
              <div className="stat-card-compact__value">{total}</div>
              <div className="stat-card-compact__label">Всего сессий</div>
            </div>
          </div>
        </div>
      )}

      {!filters.studentId && (
        <div className="empty-state">
          <div className="empty-state__icon">👤</div>
          <p className="empty-state__text">Выберите студента</p>
          <p className="empty-state__hint">Выберите студента для просмотра его сессий</p>
        </div>
      )}

      {filters.studentId && sessionsQuery.isLoading && <p>Загрузка сессий…</p>}

      {filters.studentId && sessionsQuery.isError && (
        <Alert tone="error">
          {sessionsQuery.error?.message || 'Не удалось загрузить сессии студента.'}
        </Alert>
      )}

      {filters.studentId && !sessionsQuery.isLoading && sessions.length === 0 && (
        <div className="empty-state">
          <div className="empty-state__icon">📝</div>
          <p className="empty-state__text">Сессии не найдены</p>
          <p className="empty-state__hint">Для этого студента сессии пока не записаны</p>
        </div>
      )}

      {filters.studentId && !sessionsQuery.isLoading && sessions.length > 0 && (
        <>
          <div className="students-grid">
            {sessions.map((session) => (
              <div key={session.id} className="student-card" style={{ cursor: 'pointer' }} onClick={() => onSelectSession(session.id)}>
                <div className="student-card__header">
                  <div className="student-card__avatar" style={{ backgroundColor: '#a855f7' }}>
                    {session.topicTitle?.substring(0, 2).toUpperCase() || '📚'}
                  </div>
                  <div className="student-card__info">
                    <h3 className="student-card__name">{session.topicTitle ?? 'Тема'}</h3>
                    <p className="student-card__email">
                      {new Date(session.startedUtc).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>

                <div className="student-card__badges">
                  <div className="class-card__stat">
                    <span className="class-card__stat-icon">🎯</span>
                    <span className="class-card__stat-value">
                      {session.totalScore ?? 'Ожидается'}
                    </span>
                  </div>
                </div>

                <div className="student-card__footer">
                  <span className="student-card__link">Просмотр →</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              type="button"
              className="ghost-button"
              onClick={() => handlePageChange(-1)}
              disabled={filters.page === 1}
            >
              ← Назад
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
              Вперёд →
            </button>
          </div>
        </>
      )}


    </div>
  );
};

export default StudentSessions;
