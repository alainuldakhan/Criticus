import { useStudentTopics } from '../../../hooks/useTopics';
import { useSimpleSearch } from '../../../hooks/useSearch';
import { usePagination } from '../../../hooks/usePagination';
import { routes } from '../../../constants/routes';
import { topicService } from '../../../services/topicService';
import { formatDate } from '../../../lib/formatters';
import { Link } from 'react-router-dom';
import Alert from '../../../components/ui/Alert';

const TopicList = () => {
  // Pagination state
  const pagination = usePagination({ initialPage: 1, pageSize: 10 });

  // Fetch topics
  const { topics, total, isLoading, isError, error } = useStudentTopics({
    page: pagination.currentPage,
    pageSize: pagination.pageSize,
  });

  // Update pagination total when topics load
  const totalPages = Math.max(1, Math.ceil(total / pagination.pageSize));

  // Search functionality
  const {
    searchTerm,
    filteredItems: filteredTopics,
    handleSearchChange,
  } = useSimpleSearch(topics, topicService.filterTopicsBySearch);

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
            onChange={handleSearchChange}
          />
        </label>
      </div>

      {isLoading && <p>Загрузка тем…</p>}
      {isError && (
        <Alert tone="error">{error?.message || 'Не удалось загрузить темы.'}</Alert>
      )}

      {!isLoading && filteredTopics.length === 0 && (
        <div className="empty-state">
          <div className="empty-state__icon">📝</div>
          <p className="empty-state__text">Темы пока не найдены</p>
          <p className="empty-state__hint">
            {searchTerm ? 'Попробуйте изменить поисковый запрос' : 'Преподаватель ещё не создал темы для изучения'}
          </p>
        </div>
      )}

      {!isLoading && filteredTopics.length > 0 && (
        <>
          <div className="classes-grid">
            {filteredTopics.map((topic) => (
              <div key={topic.id} className="class-card">
                <div className="class-card__header">
                  <div className="class-card__info">
                    <h3 className="class-card__name">{topicService.getTopicTitle(topic)}</h3>
                  </div>
                </div>

                <div className="class-card__stats">
                  <div className="class-card__stat">
                    <span className="class-card__stat-icon">❓</span>
                    <span className="class-card__stat-value">
                      {topicService.formatQuestionCount(topicService.getQuestionCount(topic))}
                    </span>
                  </div>
                  <div className="class-card__stat">
                    <span className="class-card__stat-icon">📅</span>
                    <span className="class-card__stat-value">
                      {formatDate(topic.createdUtc)}
                    </span>
                  </div>
                </div>

                <div className="class-card__footer">
                  <Link to={routes.student.topicDetail(topic.id)} className="class-card__link">
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
              onClick={pagination.previousPage}
              disabled={!pagination.canGoPrevious}
            >
              ← Назад
            </button>
            <span className="pagination__info">
              Страница {pagination.currentPage} из {totalPages}
            </span>
            <button
              type="button"
              className="ghost-button"
              onClick={pagination.nextPage}
              disabled={!pagination.canGoNext || pagination.currentPage >= totalPages}
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
