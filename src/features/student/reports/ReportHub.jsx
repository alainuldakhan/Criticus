import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ragStudentApi } from '../../../api/ragStudent';
import Alert from '../../../components/ui/Alert';

const DEFAULT_FILTERS = {
  page: 1,
  pageSize: 10,
};

const ReportHub = () => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const query = useQuery({
    queryKey: ['student', 'reports', filters],
    queryFn: () =>
      ragStudentApi.listSessions({
        page: filters.page,
        pageSize: filters.pageSize,
      }),
    keepPreviousData: true,
  });

  const sessions = (query.data?.items ?? []).filter((session) => session.evaluated);
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
        <h1>Отчёты о результатах</h1>
        <p>Просматривайте прошлые оценки, изучайте сильные стороны и возвращайтесь к областям для улучшения.</p>
      </header>

      {query.isLoading && <p>Загрузка отчётов…</p>}
      {query.isError && (
        <Alert tone="error">{query.error?.message || 'Не удалось загрузить отчёты.'}</Alert>
      )}

      {!query.isLoading && sessions.length === 0 && <p>Оценённых сессий пока нет.</p>}

      {!query.isLoading && sessions.length > 0 && (
        <div className="table">
          <div className="table__head">
            <span>Тема</span>
            <span>Оценка</span>
            <span>Дата</span>
          </div>
          {sessions.map((session) => (
            <div key={session.id} className="table__row">
              <span>{session.topicTitle ?? 'Тема'}</span>
              <span>{session.totalScore ?? 'Ожидается'}</span>
              <span>{new Date(session.startedUtc).toLocaleDateString('ru-RU')}</span>
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

export default ReportHub;
