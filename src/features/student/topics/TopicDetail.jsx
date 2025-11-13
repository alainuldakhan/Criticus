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
    <div className="panel">
      <header className="panel__header">
        <div>
          <h1>{topic.title ?? 'Без названия'}</h1>
          <p>Создано {new Date(topic.createdUtc).toLocaleString('ru-RU')}</p>
        </div>
      </header>

      {feedback && <Alert tone={feedback.tone}>{feedback.message}</Alert>}

      {topic.conspect && (
        <section className="panel__section">
          <h2>Конспект</h2>
          <div className="conspect-preview">
            <pre>{topic.conspect}</pre>
          </div>
        </section>
      )}

      <section className="panel__section">
        <h2>Вопросы</h2>
        {topic.questions?.length ? (
          <ol className="question-list">
            {topic.questions.map((question) => (
              <li key={question.id}>
                <p>{question.text ?? 'Вопрос'}</p>
                {question.generated?.answer && (
                  <details>
                    <summary>Пример ответа</summary>
                    <p>{question.generated.answer}</p>
                  </details>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <p>Для этой темы вопросы пока не доступны.</p>
        )}
      </section>

      <section className="panel__section">
        <div className="form__actions">
          <button
            type="button"
            className="button"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Запуск…' : 'Начать сессию'}
          </button>
        </div>
      </section>
    </div>
  );
};

export default TopicDetail;
