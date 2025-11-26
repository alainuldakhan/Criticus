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
    <div className="panel panel--glass">
      <header className="panel__header">
        <h1 className="panel__title panel__title--gradient">Сессии класса</h1>
      </header>

      <div className="students-filters" style={{ marginBottom: '2rem' }}>
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
      </div>

      {/* Stats */}
      {selectedClassId && !sessionsQuery.isLoading && total > 0 && (
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

      {!selectedClassId && (
        <div className="empty-state">
          <div className="empty-state__icon">🎓</div>
          <p className="empty-state__text">Выберите класс</p>
          <p className="empty-state__hint">Выберите класс для просмотра истории сессий</p>
        </div>
      )}

      {selectedClassId && sessionsQuery.isLoading && <p>Загрузка сессий…</p>}

      {selectedClassId && sessionsQuery.isError && (
        <Alert tone="error">
          {sessionsQuery.error?.message || 'Не удалось загрузить сессии класса.'}
        </Alert>
      )}

      {selectedClassId && !sessionsQuery.isLoading && sessions.length === 0 && (
        <div className="empty-state">
          <div className="empty-state__icon">📝</div>
          <p className="empty-state__text">Сессии не найдены</p>
          <p className="empty-state__hint">Для этого класса сессии пока не записаны</p>
        </div>
      )}

      {selectedClassId && !sessionsQuery.isLoading && sessions.length > 0 && (
        <>
          <div className="students-grid">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="student-card"
                onClick={() => onSelectSession(session.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="student-card__header">
                  <div className="student-card__avatar" style={{ backgroundColor: '#6366f1' }}>
                    {session.studentId?.substring(0, 2).toUpperCase() || '??'}
                  </div>
                  <div className="student-card__info">
                    <h3 className="student-card__name">{session.studentId}</h3>
                    <p className="student-card__email">{session.topicTitle ?? 'Тема'}</p>
                  </div>
                </div>

                <div className="student-card__badges">
                  <div className="class-card__stat">
                    <span className="class-card__stat-icon">📅</span>
                    <span className="class-card__stat-value">
                      {new Date(session.startedUtc).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <div className="class-card__stat">
                    <span className="class-card__stat-icon">🎯</span>
                    <span className="class-card__stat-value">
                      {session.totalScore ?? 'Ожидается'}
                    </span>
                  </div>
                </div>

                <div className="student-card__footer">
                  <span className="student-card__link">Посмотреть детали →</span>
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

export default ClassSessions;
