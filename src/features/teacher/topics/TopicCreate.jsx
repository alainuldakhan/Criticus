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
      <div className="panel panel--glass">
        <header className="panel__header">
          <h1 className="panel__title panel__title--gradient">Создание темы</h1>
        </header>
        <div className="panel__section">
          <RagLoader
            message="Генерация темы с помощью ИИ..."
            subMessage={
              form.generateConspect
                ? 'ИИ генерирует конспект и примеры ответов. Это может занять 2-3 минуты.'
                : 'ИИ генерирует примеры ответов. Это может занять 2-3 минуты.'
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="panel panel--glass">
      <header className="panel__header">
        <h1 className="panel__title panel__title--gradient">Создать новую тему</h1>
      </header>

      {feedback && <Alert tone={feedback.tone}>{feedback.message}</Alert>}

      <form className="form" onSubmit={handleSubmit} style={{ display: 'grid', gap: '2rem' }}>
        {/* Название темы */}
        <div className="students-form">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #000000 0%, #404040 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              flexShrink: 0
            }}>
              📝
            </div>
            <h3 className="panel__subtitle" style={{ margin: 0 }}>Основная информация</h3>
          </div>
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
        </div>

        {/* Вопросы */}
        <div className="students-form">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                flexShrink: 0
              }}>
                ❓
              </div>
              <div>
                <h3 className="panel__subtitle" style={{ margin: 0 }}>Вопросы</h3>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#737373' }}>Всего: {form.questions.length}</p>
              </div>
            </div>
            <button
              type="button"
              className="ghost-button"
              onClick={handleAddQuestion}
            >
              + Добавить вопрос
            </button>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {form.questions.map((question, index) => (
              <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <label className="form__field">
                    <span>Вопрос {index + 1}</span>
                    <textarea
                      value={question}
                      onChange={(event) => handleQuestionChange(index, event.target.value)}
                      placeholder="Введите текст вопроса..."
                      rows={3}
                    />
                  </label>
                </div>
                {form.questions.length > 1 && (
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => handleRemoveQuestion(index)}
                    style={{ marginTop: '1.8rem' }}
                  >
                    Удалить
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Конспект */}
        <div className="students-form">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              flexShrink: 0
            }}>
              📚
            </div>
            <h3 className="panel__subtitle" style={{ margin: 0 }}>Конспект</h3>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
            border: '2px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '16px',
            padding: '1.5rem',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                }}>
                  🤖
                </div>
                <div>
                  <label htmlFor="generateConspect" style={{
                    cursor: 'pointer',
                    margin: 0,
                    fontWeight: 600,
                    fontSize: '1rem',
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    Автоматически сгенерировать конспект с помощью модели
                  </label>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#737373' }}>
                    Модель проанализирует тему и создаст детальный конспект
                  </p>
                </div>
              </div>

              <label className="ai-toggle" style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="generateConspect"
                  id="generateConspect"
                  checked={form.generateConspect}
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
                <div style={{
                  width: '56px',
                  height: '32px',
                  borderRadius: '16px',
                  background: form.generateConspect
                    ? 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'
                    : '#e5e7eb',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  boxShadow: form.generateConspect
                    ? '0 4px 12px rgba(99, 102, 241, 0.4)'
                    : 'none'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    position: 'absolute',
                    top: '4px',
                    left: form.generateConspect ? '28px' : '4px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem'
                  }}>
                    {form.generateConspect && '✨'}
                  </div>
                </div>
              </label>
            </div>
          </div>

          {!form.generateConspect && (
            <label className="form__field" style={{ marginTop: '1rem' }}>
              <span>Текст конспекта</span>
              <textarea
                name="conspect"
                value={form.conspect}
                onChange={handleChange}
                placeholder="Введите текст конспекта (лекционные заметки, ключевые моменты)..."
                rows={8}
              />
            </label>
          )}
        </div>

        {/* Кнопки */}
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

