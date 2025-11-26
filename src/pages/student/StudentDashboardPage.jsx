import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ragStudentApi } from '../../api/ragStudent';
import Alert from '../../components/ui/Alert';

const StudentDashboardPage = () => {
  // Fetch topics
  const topicsQuery = useQuery({
    queryKey: ['student', 'topics', { page: 1, pageSize: 100 }],
    queryFn: () => ragStudentApi.listTopics({ page: 1, pageSize: 100 }),
  });

  // Fetch sessions
  const sessionsQuery = useQuery({
    queryKey: ['student', 'sessions', { page: 1, pageSize: 10 }],
    queryFn: () => ragStudentApi.listSessions({ page: 1, pageSize: 10 }),
  });

  const topics = topicsQuery.data?.items ?? [];
  const sessions = sessionsQuery.data?.items ?? [];
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(s => s.evaluated).length;
  const inProgressSessions = sessions.filter(s => !s.evaluated).length;

  // Calculate average score
  const evaluatedSessions = sessions.filter(s => s.evaluated && s.totalScore != null);
  const averageScore = evaluatedSessions.length > 0
    ? (evaluatedSessions.reduce((sum, s) => sum + s.totalScore, 0) / evaluatedSessions.length).toFixed(1)
    : '—';
  const averageScoreNum = averageScore !== '—' ? parseFloat(averageScore) : 0;

  // Calculate completion percentage
  const completionPercentage = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

  // Get last 7 evaluated sessions for mini chart
  const lastEvaluatedSessions = sessions
    .filter(s => s.evaluated && s.totalScore != null)
    .slice(0, 7)
    .reverse();

  const recentSessions = sessions.slice(0, 5);

  return (
    <section className="page">
      {/* Hero Section */}
      <div className="dashboard-hero">
        <div className="dashboard-hero__content">
          <h1 className="dashboard-hero__title">
            <span className="text-gradient">Панель студента</span>
          </h1>
          <p className="dashboard-hero__subtitle">
            Отслеживайте свой прогресс и развивайте навыки критического мышления
          </p>
        </div>
      </div>

      {/* Statistics with Visual Progress */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {/* Total Sessions */}
        <div className="stat-card-compact" style={{ padding: '1.5rem' }}>
          <div className="stat-card-compact__info" style={{ marginBottom: '1rem' }}>
            <div className="stat-card-compact__value">{totalSessions}</div>
            <div className="stat-card-compact__label">Всего сессий</div>
          </div>
          {/* Mini bar chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '40px' }}>
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${Math.max(20, Math.random() * 100)}%`,
                  background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0.1) 100%)',
                  borderRadius: '2px 2px 0 0'
                }}
              />
            ))}
          </div>
        </div>

        {/* Completed Sessions */}
        <div className="stat-card-compact" style={{ padding: '1.5rem' }}>
          <div className="stat-card-compact__info" style={{ marginBottom: '1rem' }}>
            <div className="stat-card-compact__value">{completedSessions}</div>
            <div className="stat-card-compact__label">Завершено</div>
          </div>
          {/* Progress bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.75rem', color: '#737373' }}>
              <span>Прогресс</span>
              <span>{completionPercentage}%</span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${completionPercentage}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                borderRadius: '4px',
                transition: 'width 1s ease'
              }} />
            </div>
          </div>
        </div>

        {/* Average Score */}
        <div className="stat-card-compact" style={{ padding: '1.5rem' }}>
          <div className="stat-card-compact__info" style={{ marginBottom: '1rem' }}>
            <div className="stat-card-compact__value">{averageScore}</div>
            <div className="stat-card-compact__label">Средняя оценка</div>
          </div>
          {/* Circular progress mini */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ position: 'relative', width: '50px', height: '50px' }}>
              <svg style={{ transform: 'rotate(-90deg)' }} width="50" height="50">
                <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(0, 0, 0, 0.1)" strokeWidth="4" />
                <circle
                  cx="25"
                  cy="25"
                  r="20"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${(averageScoreNum / 100) * 125.6} 125.6`}
                  style={{ transition: 'stroke-dasharray 1s ease' }}
                />
              </svg>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#737373' }}>
              {evaluatedSessions.length} оценен{evaluatedSessions.length === 1 ? 'а' : evaluatedSessions.length < 5 ? 'ы' : 'о'}
            </div>
          </div>
        </div>

        {/* Available Topics */}
        <div className="stat-card-compact" style={{ padding: '1.5rem' }}>
          <div className="stat-card-compact__info" style={{ marginBottom: '1rem' }}>
            <div className="stat-card-compact__value">{topics.length}</div>
            <div className="stat-card-compact__label">Доступных тем</div>
          </div>
          {/* Topics progress */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.75rem', color: '#737373' }}>
              <span>Изучено</span>
              <span>{completedSessions > 0 ? new Set(sessions.filter(s => s.evaluated).map(s => s.topicTitle)).size : 0}/{topics.length}</span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${topics.length > 0 ? Math.round((new Set(sessions.filter(s => s.evaluated).map(s => s.topicTitle)).size / topics.length) * 100) : 0}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)',
                borderRadius: '4px',
                transition: 'width 1s ease'
              }} />
            </div>
          </div>
        </div>
      </div>



      {/* Recent Sessions */}
      {recentSessions.length > 0 && (
        <div className="panel panel--glass" style={{ marginTop: '2rem' }}>
          <header className="panel__header">
            <h2 className="panel__subtitle">Последние сессии</h2>
          </header>

          <div className="activity-feed">
            {recentSessions.map((session) => (
              <Link
                key={session.id}
                to={`/student/sessions/${session.id}`}
                className="activity-item"
              >
                <div className="activity-item__icon" style={{ backgroundColor: session.evaluated ? '#10b981' : '#f59e0b' }}>
                  {session.evaluated ? '✓' : '⏱'}
                </div>
                <div className="activity-item__content">
                  <div className="activity-item__title">{session.topicTitle ?? 'Тема'}</div>
                  <div className="activity-item__meta">
                    {new Date(session.startedUtc).toLocaleDateString('ru-RU')} •{' '}
                    {session.evaluated ? `Оценка: ${session.totalScore ?? 'Ожидается'}` : 'В процессе'}
                  </div>
                </div>
                <div className="activity-item__action">→</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Loading/Error States */}
      {(topicsQuery.isLoading || sessionsQuery.isLoading) && (
        <p style={{ marginTop: '2rem' }}>Загрузка данных…</p>
      )}

      {(topicsQuery.isError || sessionsQuery.isError) && (
        <Alert tone="error" style={{ marginTop: '2rem' }}>
          Не удалось загрузить некоторые данные. Попробуйте обновить страницу.
        </Alert>
      )}
    </section>
  );
};

export default StudentDashboardPage;
