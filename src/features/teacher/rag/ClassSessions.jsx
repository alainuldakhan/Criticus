import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { classesApi } from '../../../api/classes';
import { ragTeacherApi } from '../../../api/ragTeacher';
import Alert from '../../../components/ui/Alert';

const DEFAULT_FILTERS = {
  page: 1,
  pageSize: 10,
};

const ClassSessions = ({ onSelectSession }) => {
  const [selectedClassId, setSelectedClassId] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const classesQuery = useQuery({
    queryKey: ['teacher', 'classes'],
    queryFn: classesApi.list,
  });

  const sessionsQuery = useQuery({
    queryKey: ['teacher', 'rag', 'class', selectedClassId, filters],
    queryFn: () =>
      ragTeacherApi.listClassSessions(selectedClassId, {
        page: filters.page,
        pageSize: filters.pageSize,
      }),
    enabled: Boolean(selectedClassId),
    keepPreviousData: true,
  });

  useEffect(() => {
    setFilters(DEFAULT_FILTERS);
  }, [selectedClassId]);

  const classOptions = useMemo(() => {
    return (classesQuery.data ?? []).slice().sort((a, b) => a.name.localeCompare(b.name));
  }, [classesQuery.data]);

  const sessions = sessionsQuery.data?.items ?? [];
  const total = sessionsQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));

  const handlePageChange = (direction) => {
    setFilters((prev) => ({
      ...prev,
      page: Math.max(1, Math.min(prev.page + direction, totalPages)),
    }));
  };

  return (
    <div className="panel">
      <header className="panel__header">
        <h1>Сессии класса</h1>
        <p>Просмотрите сессии, созданные студентами в каждом из ваших классов.</p>
      </header>

      <section className="panel__section">
        <label className="form__field">
          <span>Класс</span>
          <select
            value={selectedClassId}
            onChange={(event) => setSelectedClassId(event.target.value)}
          >
            <option value="">Выберите класс…</option>
            {classOptions.map((klass) => (
              <option key={klass.id} value={klass.id}>
                {klass.name}
              </option>
            ))}
          </select>
        </label>
      </section>

      {!selectedClassId && <p>Выберите класс для просмотра истории сессий.</p>}

      {selectedClassId && sessionsQuery.isLoading && <p>Загрузка сессий…</p>}

      {selectedClassId && sessionsQuery.isError && (
        <Alert tone="error">
          {sessionsQuery.error?.message || 'Не удалось загрузить сессии класса.'}
        </Alert>
      )}

      {selectedClassId && !sessionsQuery.isLoading && sessions.length === 0 && (
        <p>Для этого класса сессии пока не найдены.</p>
      )}

      {selectedClassId && !sessionsQuery.isLoading && sessions.length > 0 && (
        <div className="table">
          <div className="table__head">
            <span>Студент</span>
            <span>Тема</span>
            <span>Начало</span>
            <span>Оценка</span>
          </div>
          {sessions.map((session) => (
            <button
              key={session.id}
              className="table__row table__row--button"
              type="button"
              onClick={() => onSelectSession(session.id)}
            >
              <span>{session.studentId}</span>
              <span>{session.topicTitle ?? 'Тема'}</span>
              <span>{new Date(session.startedUtc).toLocaleString('ru-RU')}</span>
              <span>{session.totalScore ?? 'Ожидается'}</span>
            </button>
          ))}
        </div>
      )}

      {selectedClassId && (
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

export default ClassSessions;
