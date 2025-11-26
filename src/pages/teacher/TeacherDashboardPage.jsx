import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../../api/dashboard';
import { classesApi } from '../../api/classes';
import { studentsApi } from '../../api/students';

const TeacherDashboardPage = () => {
  const { data: overviewData, isLoading: isLoadingOverview } = useQuery({
    queryKey: ['teacher', 'dashboard', 'overview'],
    queryFn: dashboardApi.getOverview,
  });

  const { data: classesData } = useQuery({
    queryKey: ['teacher', 'classes'],
    queryFn: classesApi.list,
  });

  const { data: studentsData } = useQuery({
    queryKey: ['teacher', 'students', { page: 1, pageSize: 1 }],
    queryFn: () => studentsApi.search({ page: 1, pageSize: 1 }),
  });

  const { data: activities, isLoading: isLoadingActivities } = useQuery({
    queryKey: ['teacher', 'dashboard', 'activities'],
    queryFn: () => dashboardApi.getRecentActivities({ limit: 3 }),
  });

  const { data: events, isLoading: isLoadingEvents } = useQuery({
    queryKey: ['teacher', 'dashboard', 'events'],
    queryFn: dashboardApi.getUpcomingEvents,
  });

  const { data: topStudents, isLoading: isLoadingTopStudents } = useQuery({
    queryKey: ['teacher', 'dashboard', 'top-students'],
    queryFn: () => dashboardApi.getTopStudents({ limit: 3, period: 'month' }),
  });

  // Вычисленные значения
  const totalClasses = classesData?.length ?? 0;
  const totalStudents = studentsData?.total ?? 0;
  const weeklyStats = overviewData?.weeklyStats ?? {
    newStudents: 0,
    completedSessions: 0,
    activeClasses: 0,
    avgEngagement: 0,
  };

  // Форматирование даты для недельного периода
  const getWeekRange = () => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const formatDate = (date) => {
      return `${date.getDate()} ${date.toLocaleDateString('ru-RU', { month: 'long' })}`;
    };

    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  return (
    <section className="page teacher-dashboard teacher-dashboard--creative">
      <div className="teacher-dashboard__hero">
        <h1 className="teacher-dashboard__hero-title">
          Управляйте
          <span className="teacher-dashboard__hero-accent"> образовательным процессом</span>
        </h1>
      </div>

      {/* Недельная статистика */}
      <div className="weekly-stats">
        <div className="weekly-stats__header">
          <h2 className="weekly-stats__title">📅 Эта неделя</h2>
          <span className="weekly-stats__period">{getWeekRange()}</span>
        </div>
        <div className="weekly-stats__grid">
          <div className="weekly-stat">
            <div className="weekly-stat__value">
              {isLoadingOverview ? '...' : `+${weeklyStats.newStudents}`}
            </div>
            <div className="weekly-stat__label">Новых студентов</div>
          </div>
          <div className="weekly-stat">
            <div className="weekly-stat__value">
              {isLoadingOverview ? '...' : weeklyStats.completedSessions}
            </div>
            <div className="weekly-stat__label">Завершено сессий</div>
          </div>
          <div className="weekly-stat">
            <div className="weekly-stat__value">
              {isLoadingOverview ? '...' : weeklyStats.activeClasses}
            </div>
            <div className="weekly-stat__label">Активных классов</div>
          </div>
          <div className="weekly-stat">
            <div className="weekly-stat__value">
              {isLoadingOverview ? '...' : `${weeklyStats.avgEngagement}%`}
            </div>
            <div className="weekly-stat__label">Средняя вовлечённость</div>
          </div>
        </div>
      </div>

      <div className="teacher-dashboard__stats-featured">
        <div className="stat-card-featured">
          <div className="stat-card-featured__header">
            <span className="stat-card-featured__icon">🏫</span>
            <span className="stat-card-featured__label">Активные классы</span>
          </div>
          <div className="stat-card-featured__value">{totalClasses}</div>
          <div className="stat-card-featured__footer">
            <Link to="/teacher/classes" className="stat-card-featured__link">
              Управление →
            </Link>
          </div>
        </div>

        <div className="stat-card-featured">
          <div className="stat-card-featured__header">
            <span className="stat-card-featured__icon">👨‍🎓</span>
            <span className="stat-card-featured__label">Студенты</span>
          </div>
          <div className="stat-card-featured__value">{totalStudents}</div>
          <div className="stat-card-featured__footer">
            <Link to="/teacher/students" className="stat-card-featured__link">
              Просмотр →
            </Link>
          </div>
        </div>

        <div className="stat-card-compact-grid">
          <div className="stat-card-compact">
            <span className="stat-card-compact__icon">🎯</span>
            <div className="stat-card-compact__info">
              <div className="stat-card-compact__value">
                {overviewData?.totalSessions ?? '—'}
              </div>
              <div className="stat-card-compact__label">Сессии</div>
            </div>
          </div>

          <div className="stat-card-compact">
            <span className="stat-card-compact__icon">📖</span>
            <div className="stat-card-compact__info">
              <div className="stat-card-compact__value">
                {overviewData?.totalTopics ?? '—'}
              </div>
              <div className="stat-card-compact__label">Темы</div>
            </div>
          </div>
        </div>
      </div>

      {/* Мотивационная цитата */}
      <div className="inspiration-quote">
        <div className="inspiration-quote__icon">✨</div>
        <div className="inspiration-quote__content">
          <p className="inspiration-quote__text">
            "Образование — это не наполнение ведра, а зажигание огня."
          </p>
          <p className="inspiration-quote__author">— Уильям Батлер Йейтс</p>
        </div>
      </div>

      {/* Двухколоночная секция */}
      <div className="dashboard-twin-section">
        {/* Последние активности */}
        <div className="dashboard-card">
          <h3 className="dashboard-card__title">🔔 Последние события</h3>
          {isLoadingActivities ? (
            <p>Загрузка...</p>
          ) : activities && activities.length > 0 ? (
            <div className="activity-feed">
              {activities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-item__dot"></div>
                  <div className="activity-item__content">
                    <p className="activity-item__text">{activity.text}</p>
                    <span className="activity-item__time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="dashboard-card__empty">Пока нет событий</p>
          )}
          <Link to="/teacher/rag" className="dashboard-card__link">
            Вся активность →
          </Link>
        </div>

        {/* Предстоящие события */}
        <div className="dashboard-card">
          <h3 className="dashboard-card__title">📅 Предстоящие события</h3>
          {isLoadingEvents ? (
            <p>Загрузка...</p>
          ) : events && events.length > 0 ? (
            <div className="events-list">
              {events.map((event) => (
                <div key={event.id} className="event-item">
                  <div className="event-item__date">
                    <div className="event-item__day">{event.date}</div>
                    <div className="event-item__time">{event.time}</div>
                  </div>
                  <div className="event-item__title">{event.title}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="dashboard-card__empty">Нет предстоящих событий</p>
          )}
          <button className="dashboard-card__link">Добавить событие →</button>
        </div>
      </div>

      {/* Топ студенты */}
      <div className="dashboard-card dashboard-card--full">
        <h3 className="dashboard-card__title">🏆 Топ студенты этого месяца</h3>
        {isLoadingTopStudents ? (
          <p>Загрузка...</p>
        ) : topStudents && topStudents.length > 0 ? (
          <div className="leaderboard">
            {topStudents.map((student, index) => (
              <div key={student.id} className="leaderboard-item">
                <div className="leaderboard-item__rank">{index + 1}</div>
                <div className="leaderboard-item__info">
                  <div className="leaderboard-item__name">{student.name}</div>
                  <div className="leaderboard-item__class">Класс {student.class}</div>
                </div>
                <div className="leaderboard-item__score">{student.score}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="dashboard-card__empty">Нет данных о студентах</p>
        )}
        <Link to="/teacher/students" className="dashboard-card__link">
          Все студенты →
        </Link>
      </div>

      <div className="teacher-dashboard__actions-creative">
        <h2 className="teacher-dashboard__actions-title">
          Быстрый доступ
          <span className="teacher-dashboard__actions-decoration"></span>
        </h2>

        <div className="quick-actions-creative">
          <Link to="/teacher/classes" className="quick-action-creative quick-action-creative--primary">
            <div className="quick-action-creative__number">01</div>
            <div className="quick-action-creative__content">
              <h3 className="quick-action-creative__title">Управление классами</h3>
              <p className="quick-action-creative__desc">Создавайте и организуйте группы</p>
            </div>
            <div className="quick-action-creative__arrow">→</div>
          </Link>

          <Link to="/teacher/invitations" className="quick-action-creative">
            <div className="quick-action-creative__number">02</div>
            <div className="quick-action-creative__content">
              <h3 className="quick-action-creative__title">Приглашения</h3>
              <p className="quick-action-creative__desc">Добавьте новых студентов</p>
            </div>
            <div className="quick-action-creative__arrow">→</div>
          </Link>

          <Link to="/teacher/topics" className="quick-action-creative">
            <div className="quick-action-creative__number">03</div>
            <div className="quick-action-creative__content">
              <h3 className="quick-action-creative__title">Темы</h3>
              <p className="quick-action-creative__desc">Создайте учебный материал</p>
            </div>
            <div className="quick-action-creative__arrow">→</div>
          </Link>

          <Link to="/teacher/rag" className="quick-action-creative">
            <div className="quick-action-creative__number">04</div>
            <div className="quick-action-creative__content">
              <h3 className="quick-action-creative__title">Аналитика</h3>
              <p className="quick-action-creative__desc">Отслеживайте прогресс</p>
            </div>
            <div className="quick-action-creative__arrow">→</div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TeacherDashboardPage;
