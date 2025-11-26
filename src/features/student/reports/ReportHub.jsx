import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ragStudentApi } from '../../../api/ragStudent';
import Alert from '../../../components/ui/Alert';

const DEFAULT_FILTERS = {
  page: 1,
  pageSize: 20,
};

const ReportHub = () => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date'); // date, score

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

  // Only show evaluated sessions
  const evaluatedSessions = sessions.filter(s => s.evaluated);

  // Filter and sort
  const filteredSessions = evaluatedSessions
    .filter(session =>
      !searchTerm || session.topicTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'score') {
        return (b.totalScore ?? 0) - (a.totalScore ?? 0);
      }
      // sort by date (newest first)
      return new Date(b.startedUtc) - new Date(a.startedUtc);
    });

  // Calculate stats
  const avgScore = evaluatedSessions.length > 0
    ? (evaluatedSessions.reduce((sum, s) => sum + (s.totalScore ?? 0), 0) / evaluatedSessions.length).toFixed(1)
    : '—';

  const highestScore = evaluatedSessions.length > 0
    ? Math.max(...evaluatedSessions.map(s => s.totalScore ?? 0))
    : 0;

  const handlePageChange = (direction) => {
    setFilters((prev) => ({
      ...prev,
      page: Math.max(1, Math.min(prev.page + direction, totalPages)),
    }));
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#f59e0b'; // orange
    return '#ef4444'; // red
  };

  const getScoreGrade = (score) => {
    if (score >= 90) return 'Отлично';
    if (score >= 75) return 'Хорошо';
    if (score >= 60) return 'Удовлетворительно';
    return 'Требует улучшения';
  };

  return (
    <div className="panel panel--glass">
      <header className="panel__header">
        <h1 className="panel__title panel__title--gradient">Мои отчёты</h1>
      </header>

      {/* Stats */}
      {!query.isLoading && evaluatedSessions.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="stat-card-compact" style={{ padding: '1.5rem' }}>
            <div className="stat-card-compact__info">
              <div className="stat-card-compact__value">{evaluatedSessions.length}</div>
              <div className="stat-card-compact__label">Завершено сессий</div>
            </div>
          </div>
          <div className="stat-card-compact" style={{ padding: '1.5rem' }}>
            <div className="stat-card-compact__info">
              <div className="stat-card-compact__value">{avgScore}</div>
              <div className="stat-card-compact__label">Средняя оценка</div>
            </div>
          </div>
          <div className="stat-card-compact" style={{ padding: '1.5rem' }}>
            <div className="stat-card-compact__info">
              <div className="stat-card-compact__value">{highestScore}</div>
              <div className="stat-card-compact__label">Лучший результат</div>
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
          <span>Сортировка</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">По дате (новые сначала)</option>
            <option value="score">По оценке (лучшие сначала)</option>
          </select>
        </label>
      </div>

      {query.isLoading && <p>Загрузка отчётов…</p>}
      {query.isError && (
        <Alert tone="error">{query.error?.message || 'Не удалось загрузить отчёты.'}</Alert>
      )}

      {!query.isLoading && evaluatedSessions.length === 0 && (
        <div className="empty-state">
          <div className="empty-state__icon">📊</div>
          <p className="empty-state__text">Отчётов пока нет</p>
          <p className="empty-state__hint">Завершите хотя бы одну сессию чтобы увидеть отчёт</p>
        </div>
      )}

      {!query.isLoading && filteredSessions.length === 0 && evaluatedSessions.length > 0 && (
        <div className="empty-state">
          <div className="empty-state__icon">🔍</div>
          <p className="empty-state__text">Ничего не найдено</p>
          <p className="empty-state__hint">Попробуйте изменить поисковый запрос</p>
        </div>
      )}

      {!query.isLoading && filteredSessions.length > 0 && (
        <>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {filteredSessions.map((session) => (
              <Link
                key={session.id}
                to={`/student/sessions/${session.id}`}
                style={{
                  textDecoration: 'none',
                  display: 'block',
                  padding: '1.5rem',
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                  {/* Left: Topic info */}
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#000' }}>
                      {session.topicTitle ?? 'Тема'}
                    </h3>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#737373' }}>
                      {new Date(session.startedUtc).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  {/* Right: Score */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '0.5rem'
                  }}>
                    <div style={{
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: getScoreColor(session.totalScore ?? 0)
                    }}>
                      {session.totalScore ?? 0}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      background: `${getScoreColor(session.totalScore ?? 0)}15`,
                      color: getScoreColor(session.totalScore ?? 0)
                    }}>
                      {getScoreGrade(session.totalScore ?? 0)}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ marginTop: '1rem' }}>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${session.totalScore ?? 0}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${getScoreColor(session.totalScore ?? 0)} 0%, ${getScoreColor(session.totalScore ?? 0)}dd 100%)`,
                      borderRadius: '4px',
                      transition: 'width 0.8s ease'
                    }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination" style={{ marginTop: '2rem' }}>
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
          )}
        </>
      )}
    </div>
  );
};

export default ReportHub;
