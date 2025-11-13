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

  const handlePageChange = (direction) => {
    setFilters((prev) => ({
      ...prev,
      page: Math.max(1, Math.min(prev.page + direction, totalPages)),
    }));
  };

  return (
    <div className="panel">
      <header className="panel__header">
        <h1>Доступные темы</h1>
        <p>Выберите тему для запуска новой адаптивной сессии и улучшения своих навыков.</p>
      </header>

      {query.isLoading && <p>Загрузка тем…</p>}
      {query.isError && (
        <Alert tone="error">{query.error?.message || 'Не удалось загрузить темы.'}</Alert>
      )}

      {!query.isLoading && topics.length === 0 && <p>Темы пока не найдены.</p>}

      {!query.isLoading && topics.length > 0 && (
        <div className="table">
          <div className="table__head">
            <span>Название</span>
            <span>Создано</span>
            <span />
          </div>
          {topics.map((topic) => (
            <div key={topic.id} className="table__row">
              <span>{topic.title ?? 'Без названия'}</span>
              <span>{new Date(topic.createdUtc).toLocaleDateString('ru-RU')}</span>
              <span>
                <Link to={`/student/topics/${topic.id}`} className="ghost-link">
                  Подробнее
                </Link>
              </span>
            </div>
          ))}
        </div>
      )}

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
    </div>
  );
};

export default TopicList;
