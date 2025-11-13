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
    <div className="panel">
      <header className="panel__header">
        <h1>Сессии студента</h1>
        <p>Детальный просмотр прогресса и оценок отдельного студента.</p>
      </header>

      <section className="panel__section">
        <div className="filter-grid">
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
      </section>

      {!filters.studentId && <p>Выберите студента для просмотра его сессий.</p>}

      {filters.studentId && sessionsQuery.isLoading && <p>Загрузка сессий…</p>}

      {filters.studentId && sessionsQuery.isError && (
        <Alert tone="error">
          {sessionsQuery.error?.message || 'Не удалось загрузить сессии студента.'}
        </Alert>
      )}

      {filters.studentId && !sessionsQuery.isLoading && sessions.length === 0 && (
        <p>Для этого студента сессии пока не записаны.</p>
      )}

      {filters.studentId && !sessionsQuery.isLoading && sessions.length > 0 && (
        <div className="table">
          <div className="table__head">
            <span>Тема</span>
            <span>Начало</span>
            <span>Оценка</span>
            <span />
          </div>
          {sessions.map((session) => (
            <div key={session.id} className="table__row">
              <span>{session.topicTitle ?? 'Тема'}</span>
              <span>{new Date(session.startedUtc).toLocaleString('ru-RU')}</span>
              <span>{session.totalScore ?? 'Ожидается'}</span>
              <span>
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => onSelectSession(session.id)}
                >
                  Просмотр
                </button>
              </span>
            </div>
          ))}
        </div>
      )}

      {filters.studentId && (
        <div className="pagination">
          <button
            type="button"
            className="ghost-button"
            onClick={() => handlePageChange(-1)}
            disabled={filters.page === 1}
          >
            Назад
          </button>
          <span>
            Страница {filters.page} из {totalPages}
          </span>
          <button
            type="button"
            className="ghost-button"
            onClick={() => handlePageChange(1)}
            disabled={filters.page >= totalPages}
          >
            Вперёд
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentSessions;
