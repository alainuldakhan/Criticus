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

  return (
    <div className="panel">
      <header className="panel__header">
        <div>
          <h1>Ваши классы</h1>
          <p>Организуйте группы по учебному году, отслеживайте состав и просматривайте детали.</p>
        </div>
      </header>

      <section className="panel__section">
        <h2>Создать новый класс</h2>
        <p>Укажите название класса и опциональные данные о классе/годе.</p>

        {feedback && <Alert tone={feedback.tone}>{feedback.message}</Alert>}

        <form className="form" onSubmit={handleSubmit}>
          <label className="form__field">
            <span>Название класса</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Например: Критическое мышление 7А"
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
      </section>

      <section className="panel__section">
        <h2>Список классов</h2>
        {isLoading && <p>Загрузка классов…</p>}
        {isError && <Alert tone="error">{error?.message || 'Не удалось загрузить классы.'}</Alert>}
        {emptyState && <p>Классов пока нет. Создайте класс для начала работы.</p>}

        {!isLoading && !isError && classes.length > 0 && (
          <div className="table">
            <div className="table__head">
              <span>Название</span>
              <span>Класс</span>
              <span>Год</span>
              <span>Детали</span>
            </div>
            {groupedByYear.map(([year, items]) => (
              <div key={year} className="table__group">
                <div className="table__group-label">{year === 'No year' ? 'Год не указан' : year}</div>
                {items.map((klass) => (
                  <div key={klass.id} className="table__row">
                    <span>{klass.name}</span>
                    <span>{klass.grade ?? '—'}</span>
                    <span>{klass.year ?? '—'}</span>
                    <span>
                      <Link to={`/teacher/classes/${klass.id}`} className="ghost-link">
                        Подробнее
                      </Link>
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ClassList;
