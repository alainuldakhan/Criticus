import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { ragTeacherApi } from '../../../api/ragTeacher';
import Alert from '../../../components/ui/Alert';

const TopicDetail = () => {
  const { topicId } = useParams();

  const query = useQuery({
    queryKey: ['teacher', 'topics', topicId],
    queryFn: () => ragTeacherApi.getTopic(topicId),
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

      <section className="panel__section">
        <h2>Вопросы</h2>
        {topic.questions?.length ? (
          <ol className="question-list">
            {topic.questions.map((question, index) => (
              <li key={question.id}>
                <p>{question.text ?? 'Вопрос'}</p>
                {question.generated?.answer && (
                  <details>
                    <summary>Сгенерированные пункты ответа</summary>
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

      {topic.conspect && (
        <section className="panel__section">
          <h2>Конспект</h2>
          <div className="conspect-preview">
            <pre>{topic.conspect}</pre>
          </div>
        </section>
      )}
    </div>
  );
};

export default TopicDetail;

