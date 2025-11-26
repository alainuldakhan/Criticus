import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { classesApi } from '../../../api/classes';
import Alert from '../../../components/ui/Alert';

const defaultFormState = {
  name: '',
  grade: '',
  year: '',
};

const ClassList = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(defaultFormState);
  const [feedback, setFeedback] = useState(null);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['teacher', 'classes'],
    queryFn: classesApi.list,
  });

  const createMutation = useMutation({
    mutationFn: classesApi.create,
    onSuccess: () => {
      setFeedback({ tone: 'success', message: 'Класс успешно создан.' });
      setForm(defaultFormState);
      queryClient.invalidateQueries({ queryKey: ['teacher', 'classes'] });
    },
    onError: (err) => {
      const message = err?.response?.data?.error || err.message || 'Не удалось создать класс.';
      setFeedback({ tone: 'error', message });
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setFeedback({ tone: 'error', message: 'Название класса обязательно.' });
      return;
    }

    createMutation.mutate({
      name: form.name.trim(),
      grade: form.grade ? Number.parseInt(form.grade, 10) : undefined,
      year: form.year ? Number.parseInt(form.year, 10) : undefined,
    });
  };

  const classes = data ?? [];
  const emptyState = !isLoading && classes.length === 0;

  const groupedByYear = useMemo(() => {
    const groups = new Map();
    classes.forEach((klass) => {
      const key = klass.year ?? 'No year';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(klass);
    });
    return Array.from(groups.entries()).sort((a, b) => {
      if (a[0] === 'No year') return 1;
      if (b[0] === 'No year') return -1;
      return Number(b[0]) - Number(a[0]);
    });
  }, [classes]);

  // Вычисляем статистику
  const totalClasses = classes.length;
  const totalStudents = classes.reduce((sum, klass) => sum + (klass.studentCount ?? 0), 0);
  const avgClassSize = totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0;

  return (
    <div className="panel panel--glass">
      <header className="panel__header">
        <div>
          <h1 className="panel__title panel__title--gradient">Ваши классы</h1>
          <p className="panel__description">Создавайте и организуйте группы по учебному году, отслеживайте студентов и просматривайте детали</p>
        </div>
      </header>

      {/* Summary Statistics */}
      {!isLoading && classes.length > 0 && (
        <div className="classes-stats">
          <div className="stat-card-compact">
            <span className="stat-card-compact__icon">🏫</span>
            <div className="stat-card-compact__info">
              <div className="stat-card-compact__value">{totalClasses}</div>
              <div className="stat-card-compact__label">Всего классов</div>
            </div>
          </div>
        </div>
      )}

      {/* Two-column layout */}
      <div className="classes-layout">
        {/* Form Sidebar */}
        <aside className="classes-form-sidebar">
          <h2 className="panel__subtitle">Создать новый класс</h2>
          {feedback && <Alert tone={feedback.tone}>{feedback.message}</Alert>}

          <form className="form" onSubmit={handleSubmit}>
            <label className="form__field">
              <br></br>
              <span>Название класса</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Например: Критическое мышление"
              />
            </label>
            <div className="form__row">
              <label className="form__field">
                <span>Класс</span>
                <input
                  type="number"
                  name="grade"
                  min="1"
                  max="12"
                  value={form.grade}
                  onChange={handleChange}
                  placeholder="например: 7"
                />
              </label>
              <label className="form__field">
                <span>Год</span>
                <input
                  type="number"
                  name="year"
                  min="2000"
                  max="2099"
                  value={form.year}
                  onChange={handleChange}
                  placeholder="например: 2025"
                />
              </label>
            </div>
            <button type="submit" className="button" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Создание…' : 'Создать класс'}
            </button>
          </form>
        </aside>

        {/* Main Content */}
        <main className="classes-main-content">
          <h2 className="panel__subtitle">Список классов</h2>

          {isLoading && <p>Загрузка классов…</p>}
          {isError && <Alert tone="error">{error?.message || 'Не удалось загрузить классы.'}</Alert>}

          {emptyState && (
            <div className="empty-state">
              <div className="empty-state__icon">📚</div>
              <p className="empty-state__text">Классов пока нет</p>
              <p className="empty-state__hint">Создайте первый класс, чтобы начать работу</p>
            </div>
          )}

          {!isLoading && !isError && classes.length > 0 && (
            <div className="classes-container">
              {groupedByYear.map(([year, items]) => (
                <div key={year} className="classes-year-group">
                  <div className="classes-year-label">
                    {year === 'No year' ? 'Год не указан' : `Учебный год: ${year}`}
                  </div>
                  <div className="classes-grid">
                    {items.map((klass) => (
                      <div key={klass.id} className="class-card">
                        <div className="class-card__header">
                          <div className="class-card__icon">🎓</div>
                          <div className="class-card__info">
                            <h3 className="class-card__name">{klass.name}</h3>
                            {klass.grade && (
                              <span className="class-card__badge">{klass.grade} класс</span>
                            )}
                          </div>
                        </div>

                        <div className="class-card__stats">
                          <div className="class-card__stat">
                            <span className="class-card__stat-icon">👥</span>
                            <span className="class-card__stat-value">
                              {klass.studentCount ?? 0} студентов
                            </span>
                          </div>
                          {klass.year && (
                            <div className="class-card__stat">
                              <span className="class-card__stat-icon">📅</span>
                              <span className="class-card__stat-value">{klass.year}</span>
                            </div>
                          )}
                        </div>

                        <div className="class-card__footer">
                          <Link
                            to={`/teacher/classes/${klass.id}`}
                            className="class-card__link"
                          >
                            Подробнее →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ClassList;
