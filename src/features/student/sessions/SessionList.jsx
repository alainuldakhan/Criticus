import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ragStudentApi } from '../../../api/ragStudent';
import Alert from '../../../components/ui/Alert';

const DEFAULT_FILTERS = {
  page: 1,
  pageSize: 10,
};

const SessionList = () => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, completed, in-progress

  const query = useQuery({
    queryKey: ['student', 'sessions', filters],
    queryFn: () =>
      ragStudentApi.listSessions({
        page: filters.page,
        pageSize: filters.pageSize,
      }),
    keepPreviousData: true,
  });

  const sessions = query.data?.items ?? [];
  const total = query.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));

  // Filter by search term and status
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = !searchTerm || session.topicTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'completed' && session.evaluated) ||
      (statusFilter === 'in-progress' && !session.evaluated);

    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const completedCount = sessions.filter(s => s.evaluated).length;
  const inProgressCount = sessions.filter(s => !s.evaluated).length;

  const handlePageChange = (direction) => {
    setFilters((prev) => ({
      ...prev,
      page: Math.max(1, Math.min(prev.page + direction, totalPages)),
    }));
  };

  return (
    <div className="panel panel--glass">
      <header className="panel__header">
        <h1 className="panel__title panel__title--gradient">Ваши сессии</h1>
      </header>

      {/* Stats */}
      {!query.isLoading && total > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="stat-card-compact" style={{ padding: '1rem' }}>
            <div className="stat-card-compact__info">
              <div className="stat-card-compact__value">{total}</div>
              <div className="stat-card-compact__label">Всего</div>
            </div>
          </div>
          <div className="stat-card-compact" style={{ padding: '1rem' }}>
            <div className="stat-card-compact__info">
              <div className="stat-card-compact__value">{completedCount}</div>
              <div className="stat-card-compact__label">Завершено</div>
            </div>
          </div>
          <div className="stat-card-compact" style={{ padding: '1rem' }}>
            <div className="stat-card-compact__info">
              <div className="stat-card-compact__value">{inProgressCount}</div>
              <div className="stat-card-compact__label">В процессе</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="students-filters" style={{ marginBottom: '2rem' }}>
        <label className="form__field">
          <span>Поиск по теме</span>
          <input
            type="search"
            placeholder="Введите название темы..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>

        <label className="form__field">
          <span>Статус</span>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Все сессии</option>
            <option value="completed">Завершенные</option>
            <option value="in-progress">В процессе</option>
          </select>
        </label>
      </div>

      {query.isLoading && <p>Загрузка сессий…</p>}
      {query.isError && (
        <Alert tone="error">{query.error?.message || 'Не удалось загрузить сессии.'}</Alert>
      )}

      {!query.isLoading && filteredSessions.length === 0 && (
        <div className="empty-state">
          <div className="empty-state__icon">🎯</div>
          <p className="empty-state__text">Сессий не найдено</p>
          <p className="empty-state__hint">
            {searchTerm || statusFilter !== 'all'
              ? 'Попробуйте изменить фильтры'
              : 'Начните новую сессию выбрав тему'}
          </p>
        </div>
      )}

      {!query.isLoading && filteredSessions.length > 0 && (
        <>
          <div className="students-grid">
            {filteredSessions.map((session) => (
              <Link
                key={session.id}
                to={`/student/sessions/${session.id}`}
                className="student-card"
                style={{ textDecoration: 'none', cursor: 'pointer' }}
              >
                <div className="student-card__header">
                  <div
                    className="student-card__avatar"
                    style={{ backgroundColor: session.evaluated ? '#10b981' : '#f59e0b' }}
                  >
                    {session.evaluated ? '✓' : '⏱'}
                  </div>
                  <div className="student-card__info">
                    <h3 className="student-card__name">{session.topicTitle ?? 'Тема'}</h3>
                    <p className="student-card__email">
                      {new Date(session.startedUtc).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="student-card__badges">
                  {session.evaluated ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      background: 'rgba(16, 185, 129, 0.1)',
                      borderRadius: '8px',
                      color: '#10b981',
                      fontWeight: 500,
                      fontSize: '0.875rem'
                    }}>
                      <span>🎯</span>
                      <span>Оценка: {session.totalScore ?? 'Ожидается'}</span>
                    </div>
                  ) : (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      background: 'rgba(245, 158, 11, 0.1)',
                      borderRadius: '8px',
                      color: '#f59e0b',
                      fontWeight: 500,
                      fontSize: '0.875rem'
                    }}>
                      <span>⏱</span>
                      <span>В процессе</span>
                    </div>
                  )}
                </div>

                <div className="student-card__footer">
                  <span className="student-card__link">
                    {session.evaluated ? 'Посмотреть результаты' : 'Продолжить'} →
                  </span>
                </div>
              </Link>
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

export default SessionList;
