import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { ragStudentApi } from '../../../api/ragStudent';
import Alert from '../../../components/ui/Alert';

const TopicDetail = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState(null);

  const query = useQuery({
    queryKey: ['student', 'topics', topicId],
    queryFn: () => ragStudentApi.getTopic(topicId),
  });

  const mutation = useMutation({
    mutationFn: () => ragStudentApi.createSession({ topicId }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['student', 'sessions'] });
      navigate(`/student/sessions/${data.id}`);
    },
    onError: (error) => {
      const message = error?.response?.data?.error || error?.message || 'Не удалось начать сессию.';
      setFeedback({ tone: 'error', message });
    },
  });

  if (query.isLoading) {
    return (
      <div className="panel">
        <p>Загрузка темы…</p>
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="panel">
        <Alert tone="error">{query.error?.message || 'Не удалось загрузить тему.'}</Alert>
      </div>
    );
  }

  const topic = query.data;
  if (!topic) {
    return (
      <div className="panel">
        <Alert tone="warning">Тема не найдена.</Alert>
      </div>
    );
  }

  return (
    <div className="panel panel--glass">
      <header className="panel__header">
        <h1 className="panel__title panel__title--gradient">{topic.title ?? 'Без названия'}</h1>
        <p style={{ color: '#737373', marginTop: '0.5rem' }}>
          Создано {new Date(topic.createdUtc).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </p>
      </header>

      {feedback && <Alert tone={feedback.tone}>{feedback.message}</Alert>}

      {/* Questions Count Badge */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="stat-card-compact" style={{ display: 'inline-flex', padding: '0.75rem 1.5rem' }}>
          <span style={{ marginRight: '0.5rem' }}>❓</span>
          <span style={{ fontWeight: 600 }}>{topic.questions?.length || 0} вопросов</span>
        </div>
      </div>

      {topic.conspect && (
        <div className="students-form" style={{ marginBottom: '2rem' }}>
          <h2 className="panel__subtitle" style={{ marginBottom: '1rem' }}>📚 Конспект</h2>
          <div style={{
            padding: '1.5rem',
            background: 'rgba(0, 0, 0, 0.02)',
            borderRadius: '12px',
            lineHeight: '1.8',
            whiteSpace: 'pre-wrap',
            fontFamily: 'inherit'
          }}>
            {topic.conspect}
          </div>
        </div>
      )}

      <div className="students-form">
        <h2 className="panel__subtitle" style={{ marginBottom: '1rem' }}>❓ Вопросы</h2>
        {topic.questions?.length ? (
          <ol style={{
            listStyle: 'none',
            // counter-reset: 'question-counter', // This is CSS, not JSX style
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {topic.questions.map((question, index) => (
              <li key={question.id} style={{
                padding: '1.5rem',
                background: 'rgba(0, 0, 0, 0.02)',
                borderRadius: '12px',
                // counterIncrement: 'question-counter', // This is CSS, not JSX style
                position: 'relative'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start'
                }}>
                  <span style={{
                    minWidth: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.875rem'
                  }}>
                    {index + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 500, fontSize: '1rem' }}>
                      {question.text ?? 'Вопрос'}
                    </p>
                    {question.generated?.answer && (
                      <details style={{ marginTop: '1rem' }}>
                        <summary style={{
                          cursor: 'pointer',
                          color: '#6366f1',
                          fontWeight: 500,
                          fontSize: '0.875rem'
                        }}>
                          Показать пример ответа
                        </summary>
                        <p style={{
                          marginTop: '0.75rem',
                          padding: '1rem',
                          background: 'white',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          lineHeight: '1.6'
                        }}>
                          {question.generated.answer}
                        </p>
                      </details>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p style={{ color: '#737373' }}>Для этой темы вопросы пока не доступны.</p>
        )}
      </div>

      {/* CTA Button */}
      <div style={{
        marginTop: '3rem',
        padding: '2rem',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
        borderRadius: '16px',
        textAlign: 'center'
      }}>
        <button
          type="button"
          className="button"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          style={{
            fontSize: '1.125rem',
            padding: '1rem 3rem',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            border: 'none',
            cursor: mutation.isPending ? 'not-allowed' : 'pointer'
          }}
        >
          {mutation.isPending ? '🚀 Запуск сессии...' : '🚀 Начать сессию'}
        </button>
      </div>
    </div>
  );
};

export default TopicDetail;
