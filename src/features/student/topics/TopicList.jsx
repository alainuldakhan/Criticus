import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ragStudentApi } from '../../../api/ragStudent';
import Alert from '../../../components/ui/Alert';

const DEFAULT_FILTERS = {
  page: 1,
  pageSize: 10,
};

const TopicList = () => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [searchTerm, setSearchTerm] = useState('');

  const query = useQuery({
    queryKey: ['student', 'topics', filters],
    queryFn: () =>
      ragStudentApi.listTopics({
        page: filters.page,
        pageSize: filters.pageSize,
      }),
    keepPreviousData: true,
  });

  const topics = query.data?.items ?? [];
  const total = query.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));

  // Filter by search term
  const filteredTopics = topics.filter(topic =>
    !searchTerm || topic.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (direction) => {
    setFilters((prev) => ({
      ...prev,
      page: Math.max(1, Math.min(prev.page + direction, totalPages)),
    }));
  };

  return (
    <div className="panel panel--glass">
      <header className="panel__header">
        <h1 className="panel__title panel__title--gradient">Доступные темы</h1>
      </header>

      {/* Search */}
      <div className="students-filters" style={{ marginBottom: '2rem' }}>
        <label className="form__field">
          <span>Поиск по названию</span>
          <input
            type="search"
            placeholder="Введите название темы..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
      </div>

      {query.isLoading && <p>Загрузка тем…</p>}
      {query.isError && (
        <Alert tone="error">{query.error?.message || 'Не удалось загрузить темы.'}</Alert>
      )}

      {!query.isLoading && filteredTopics.length === 0 && (
        <div className="empty-state">
          <div className="empty-state__icon">📝</div>
          <p className="empty-state__text">Темы пока не найдены</p>
          <p className="empty-state__hint">
            {searchTerm ? 'Попробуйте изменить поисковый запрос' : 'Преподаватель ещё не создал темы для изучения'}
          </p>
        </div>
      )}

      {!query.isLoading && filteredTopics.length > 0 && (
        <>
          <div className="classes-grid">
            {filteredTopics.map((topic) => (
              <div key={topic.id} className="class-card">
                <div className="class-card__header">
                  <div className="class-card__info">
                    <h3 className="class-card__name">{topic.title ?? 'Без названия'}</h3>
                  </div>
                </div>

                <div className="class-card__stats">
                  <div className="class-card__stat">
                    <span className="class-card__stat-icon">❓</span>
                    <span className="class-card__stat-value">
                      {topic.questions?.length || 0} вопрос{(topic.questions?.length || 0) === 1 ? '' : (topic.questions?.length || 0) < 5 ? 'а' : 'ов'}
                    </span>
                  </div>
                  <div className="class-card__stat">
                    <span className="class-card__stat-icon">📅</span>
                    <span className="class-card__stat-value">
                      {new Date(topic.createdUtc).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </div>

                <div className="class-card__footer">
                  <Link to={`/student/topics/${topic.id}`} className="class-card__link">
                    Начать сессию →
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
