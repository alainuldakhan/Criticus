import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ragTeacherApi } from '../../../api/ragTeacher';
import Alert from '../../../components/ui/Alert';

const DEFAULT_FILTERS = {
  page: 1,
  pageSize: 10,
};

const TopicList = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const query = useQuery({
    queryKey: ['teacher', 'topics', filters],
    queryFn: () =>
      ragTeacherApi.listTopics({
        page: filters.page,
        pageSize: filters.pageSize,
      }),
    keepPreviousData: true,
  });

  const topics = query.data?.items ?? [];
  const total = query.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));

  const handlePageChange = (direction) => {
    setFilters((prev) => ({
      ...prev,
      page: Math.max(1, Math.min(prev.page + direction, totalPages)),
    }));
  };

  return (
    <div className="panel panel--glass">
      <header className="panel__header panel__header--split">
        <div>
          <h1 className="panel__title panel__title--gradient">Созданные темы</h1>
        </div>
        <div className="panel__actions">
          <button
            type="button"
            className="button"
            onClick={() => navigate('/teacher/topics/create')}
          >
            Создать тему
          </button>
        </div>
      </header>

      {/* Stats */}
      {!query.isLoading && total > 0 && (
        <div className="classes-stats">
          <div className="stat-card-compact">
            <span className="stat-card-compact__icon">📚</span>
            <div className="stat-card-compact__info">
              <div className="stat-card-compact__value">{total}</div>
              <div className="stat-card-compact__label">Всего тем</div>
            </div>
          </div>
        </div>
      )}

      {query.isLoading && <p>Загрузка тем…</p>}
      {query.isError && (
        <Alert tone="error">{query.error?.message || 'Не удалось загрузить темы.'}</Alert>
      )}

      {!query.isLoading && topics.length === 0 && (
        <div className="empty-state">
          <div className="empty-state__icon">📝</div>
          <p className="empty-state__text">Темы пока не созданы</p>
          <p className="empty-state__hint">Создайте первую тему для учебных сессий</p>
        </div>
      )}

      {!query.isLoading && topics.length > 0 && (
        <>
          <div className="classes-grid">
            {topics.map((topic) => (
              <div key={topic.id} className="class-card">
                <div className="class-card__header">
                  <div className="class-card__icon">📖</div>
                  <div className="class-card__info">
                    <h3 className="class-card__name">{topic.title ?? 'Без названия'}</h3>
                  </div>
                </div>

                <div className="class-card__stats">
                  <div className="class-card__stat">
                    <span className="class-card__stat-icon">📅</span>
                    <span className="class-card__stat-value">
                      {new Date(topic.createdUtc).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <div className="class-card__footer">
                  <Link to={`/teacher/topics/${topic.id}`} className="class-card__link">
                    Подробнее →
                  </Link>
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

export default TopicList;
