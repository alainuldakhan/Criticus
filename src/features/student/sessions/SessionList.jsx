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

  const handlePageChange = (direction) => {
    setFilters((prev) => ({
      ...prev,
      page: Math.max(1, Math.min(prev.page + direction, totalPages)),
    }));
  };

  return (
    <div className="panel">
      <header className="panel__header">
        <h1>Ваши сессии</h1>
        <p>Продолжите незавершённые сессии или просмотрите завершённые оценки.</p>
      </header>

      {query.isLoading && <p>Загрузка сессий…</p>}
      {query.isError && (
        <Alert tone="error">{query.error?.message || 'Не удалось загрузить сессии.'}</Alert>
      )}

      {!query.isLoading && sessions.length === 0 && <p>Сессий пока нет.</p>}

      {!query.isLoading && sessions.length > 0 && (
        <div className="table">
          <div className="table__head">
            <span>Тема</span>
            <span>Начало</span>
            <span>Статус</span>
            <span />
          </div>
          {sessions.map((session) => (
            <div key={session.id} className="table__row">
              <span>{session.topicTitle ?? 'Тема'}</span>
              <span>{new Date(session.startedUtc).toLocaleString('ru-RU')}</span>
              <span>{session.evaluated ? `Оценка: ${session.totalScore ?? 'Ожидается'}` : 'В процессе'}</span>
              <span>
                <Link to={`/student/sessions/${session.id}`} className="ghost-link">
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

export default SessionList;
