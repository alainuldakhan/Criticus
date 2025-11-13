import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ragTeacherApi } from '../../../api/ragTeacher';
import Alert from '../../../components/ui/Alert';
import RagLoader from '../../../components/ui/RagLoader';

const TopicCreate = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState(null);
  const [form, setForm] = useState({
    title: '',
    questions: [''],
    conspect: '',
    generateConspect: false,
  });

  const createMutation = useMutation({
    mutationFn: (payload) => ragTeacherApi.createTopic(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['teacher', 'topics'] });
      setFeedback({ tone: 'success', message: 'Тема успешно создана.' });
      setTimeout(() => {
        navigate(`/teacher/topics/${data.id}`);
      }, 1500);
    },
    onError: (error) => {
      const message = error?.response?.data?.error || error?.message || 'Не удалось создать тему.';
      setFeedback({ tone: 'error', message });
    },
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleQuestionChange = (index, value) => {
    setForm((prev) => {
      const questions = [...prev.questions];
      questions[index] = value;
      return { ...prev, questions };
    });
  };

  const handleAddQuestion = () => {
    setForm((prev) => ({
      ...prev,
      questions: [...prev.questions, ''],
    }));
  };

  const handleRemoveQuestion = (index) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!form.title.trim()) {
      setFeedback({ tone: 'error', message: 'Название темы обязательно.' });
      return;
    }

    const validQuestions = form.questions.filter((q) => q.trim());
    if (validQuestions.length === 0) {
      setFeedback({ tone: 'error', message: 'Необходим хотя бы один вопрос.' });
      return;
    }

    if (!form.generateConspect && !form.conspect.trim()) {
      setFeedback({ tone: 'error', message: 'Укажите конспект или включите автоматическую генерацию.' });
      return;
    }

    const payload = {
      title: form.title.trim(),
      questions: validQuestions,
      conspect: form.generateConspect ? undefined : form.conspect.trim() || undefined,
      generateConspect: form.generateConspect,
    };

    createMutation.mutate(payload);
  };

  if (createMutation.isPending) {
    return (
      <div className="panel">
        <header className="panel__header">
          <h1>Создание темы</h1>
          <p>ИИ обрабатывает ваш запрос...</p>
        </header>
        <div className="panel__section">
          <RagLoader
            message="Генерация темы с помощью ИИ..."
            subMessage={
              form.generateConspect
                ? 'ИИ генерирует конспект и примеры ответов для каждого вопроса. Это может занять 2-3 минуты.'
                : 'ИИ генерирует примеры ответов для каждого вопроса. Это может занять 2-3 минуты.'
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <header className="panel__header">
        <h1>Создать новую тему</h1>
        <p>Определите тему с вопросами. При необходимости укажите конспект или позвольте ИИ сгенерировать его.</p>
      </header>

      {feedback && <Alert tone={feedback.tone}>{feedback.message}</Alert>}

      <form className="form" onSubmit={handleSubmit}>
        <label className="form__field">
          <span>Название темы</span>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Например: Введение в машинное обучение"
          />
        </label>

        <section className="panel__section">
          <div className="form__field-header">
            <h3>Вопросы</h3>
            <button
              type="button"
              className="ghost-button"
              onClick={handleAddQuestion}
            >
              Добавить вопрос
            </button>
          </div>
          {form.questions.map((question, index) => (
            <div key={index} className="form__field form__field--with-action">
              <label>
                <span>Вопрос {index + 1}</span>
                <textarea
                  value={question}
                  onChange={(event) => handleQuestionChange(index, event.target.value)}
                  placeholder="Введите текст вопроса..."
                  rows={3}
                />
              </label>
              {form.questions.length > 1 && (
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => handleRemoveQuestion(index)}
                >
                  Удалить
                </button>
              )}
            </div>
          ))}
        </section>

        <section className="panel__section">
          <label className="form__field">
            <div className="form__checkbox-wrapper">
              <input
                type="checkbox"
                name="generateConspect"
                checked={form.generateConspect}
                onChange={handleChange}
              />
              <span>Автоматически сгенерировать конспект с помощью ИИ</span>
            </div>
            <p className="form__hint">
              Если включено, ИИ сгенерирует конспект на основе темы и вопросов.
              В противном случае укажите свой конспект ниже.
            </p>
          </label>

          {!form.generateConspect && (
            <label className="form__field">
              <span>Конспект</span>
              <textarea
                name="conspect"
                value={form.conspect}
                onChange={handleChange}
                placeholder="Введите текст конспекта (лекционные заметки, ключевые моменты и т.д.)..."
                rows={8}
              />
              <p className="form__hint">
                Укажите подробные лекционные заметки или ключевые моменты, которые будут использоваться для оценки ответов студентов.
              </p>
            </label>
          )}
        </section>

        <div className="form__actions">
          <button type="submit" className="button" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Создание…' : 'Создать тему'}
          </button>
          <button
            type="button"
            className="ghost-button"
            onClick={() => navigate(-1)}
            disabled={createMutation.isPending}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default TopicCreate;

