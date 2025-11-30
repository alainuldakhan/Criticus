import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useClasses, useCreateClass } from '../../../hooks/useClasses';
import { useForm } from '../../../hooks/useForm';
import { formDefaults } from '../../../constants/formDefaults';
import { routes } from '../../../constants/routes';
import { classService } from '../../../services/classService';
import Alert from '../../../components/ui/Alert';

const ClassList = () => {
  const [feedback, setFeedback] = useState(null);

  // Fetch classes with business logic
  const { classes, groupedClasses, stats, isLoading, isError, error, isEmpty } = useClasses();

  // Create class mutation
  const createMutation = useCreateClass({
    onSuccess: () => {
      setFeedback({ tone: 'success', message: 'Класс успешно создан.' });
      resetForm();
    },
    onError: (err) => {
      const message = err?.response?.data?.error || err.message || 'Не удалось создать класс.';
      setFeedback({ tone: 'error', message });
    },
  });

  // Form management
  const { values: form, handleChange, handleSubmit, resetForm } = useForm(
    formDefaults.class,
    async (formData) => {
      const validation = classService.validateClassForm(formData);
      if (!validation.isValid) {
        const firstError = Object.values(validation.errors)[0];
        setFeedback({ tone: 'error', message: firstError });
        return;
      }
      await createMutation.mutateAsync(formData);
    }
  );

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
              <div className="stat-card-compact__value">{stats.totalClasses}</div>
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

          {isEmpty && (
            <div className="empty-state">
              <div className="empty-state__icon">📚</div>
              <p className="empty-state__text">Классов пока нет</p>
              <p className="empty-state__hint">Создайте первый класс, чтобы начать работу</p>
            </div>
          )}

          {!isLoading && !isError && classes.length > 0 && (
            <div className="classes-container">
              {groupedClasses.map(([year, items]) => (
                <div key={year} className="classes-year-group">
                  <div className="classes-year-label">
                    {classService.getYearLabel(year)}
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
                              {classService.formatStudentCount(klass.studentCount ?? 0)}
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
                            to={routes.teacher.classDetail(klass.id)}
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
