import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ragTeacherApi } from '../../../api/ragTeacher';
import Alert from '../../../components/ui/Alert';
import RagLoader from '../../../components/ui/RagLoader';

const SessionInspector = ({ sessionId }) => {
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState(null);

  const sessionQuery = useQuery({
    queryKey: ['teacher', 'rag', 'session', sessionId],
    queryFn: () => ragTeacherApi.getSession(sessionId),
    enabled: Boolean(sessionId),
  });

  const evaluateMutation = useMutation({
    mutationFn: () => ragTeacherApi.evaluate(sessionId),
    onSuccess: () => {
      setFeedback({ tone: 'success', message: 'Оценка успешно запрошена.' });
      queryClient.invalidateQueries({ queryKey: ['teacher', 'rag', 'session', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['teacher', 'rag', 'class'] });
      queryClient.invalidateQueries({ queryKey: ['teacher', 'rag', 'student'] });
    },
    onError: (error) => {
      const message = error?.response?.data?.error || error?.message || 'Не удалось выполнить оценку.';
      setFeedback({ tone: 'error', message });
    },
  });

  const reportQuery = useQuery({
    queryKey: ['teacher', 'rag', 'session', sessionId, 'report'],
    queryFn: () => ragTeacherApi.getReport(sessionId),
    enabled: Boolean(sessionId && sessionQuery.data?.evaluation),
  });

  if (!sessionId) {
    return (
      <div className="panel">
        <p>Выберите сессию для просмотра деталей.</p>
      </div>
    );
  }

  if (sessionQuery.isLoading) {
    return (
      <div className="panel">
        <p>Загрузка сессии…</p>
      </div>
    );
  }

  if (sessionQuery.isError) {
    return (
      <div className="panel">
        <Alert tone="error">
          {sessionQuery.error?.message || 'Не удалось загрузить сессию.'}
        </Alert>
      </div>
    );
  }

  const session = sessionQuery.data;
  if (!session) {
    return (
      <div className="panel">
        <Alert tone="warning">Сессия не найдена.</Alert>
      </div>
    );
  }

  // Показываем полный экран загрузки при evaluate
  if (evaluateMutation.isPending) {
    return (
      <div className="panel">
        <header className="panel__header">
          <h1>Оценка ответов студента</h1>
          <p>ИИ обрабатывает оценку...</p>
        </header>
        <div className="panel__section">
          <RagLoader
            message="Оценка ответов студента с помощью ИИ..."
            subMessage="ИИ анализирует ответы студента и генерирует подробный отчёт об оценке. Это может занять 2-3 минуты."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <header className="panel__header panel__header--split">
        <div>
          <h1>{session.topic?.title ?? 'Сессия'}</h1>
          <p>
            Студент {session.studentId} • Начато {new Date(session.startedUtc).toLocaleString('ru-RU')}
          </p>
        </div>
        <div className="panel__actions">
          <button
            type="button"
            className="ghost-button"
            onClick={() => evaluateMutation.mutate()}
            disabled={evaluateMutation.isPending || !session.responses?.length}
          >
            {evaluateMutation.isPending ? 'Оценка…' : 'Запустить оценку'}
          </button>
        </div>
      </header>

      {feedback && <Alert tone={feedback.tone}>{feedback.message}</Alert>}

      <section className="panel__section">
        <h2>Ответы студента</h2>
        <div className="question-stack">
          {session.topic?.questions?.map((question, index) => {
            const response = session.responses?.find((r) => r.questionId === question.id);
            return (
              <div key={question.id} className="question-card">
                <h3>
                  Вопрос {index + 1}
                </h3>
                <p>{question.text}</p>
                <div>
                  <span className="detail-label">Ответ студента</span>
                  <p>{response?.answer ?? 'Ответа пока нет.'}</p>
                </div>
                {question.generated?.answer && (
                  <details>
                    <summary>Ожидаемые пункты</summary>
                    <p>{question.generated.answer}</p>
                  </details>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {session.evaluation && (
        <section className="panel__section">
          <div className="evaluation-header">
            <h2>Результаты оценки</h2>
            {session.evaluation.totalScore !== null && session.evaluation.totalScore !== undefined && (
              <div className="score-badge">
                <div className="score-badge__value">{session.evaluation.totalScore}</div>
                <div className="score-badge__label">Общий балл</div>
              </div>
            )}
          </div>
          
          {reportQuery.isLoading && (
            <RagLoader
              message="Загрузка отчёта об оценке..."
              subMessage="Получение подробного анализа ответов студента."
            />
          )}
          {reportQuery.isError && (
            <Alert tone="error">
              {reportQuery.error?.message || 'Не удалось загрузить отчёт об оценке.'}
            </Alert>
          )}
          {reportQuery.data && (
            <div className="report-container">
              {typeof reportQuery.data === 'object' && (
                <div className="report-summary">
                  {reportQuery.data.summary && (
                    <div className="report-summary-card">
                      <div className="report-summary-card__header">
                        <h3>Общее резюме</h3>
                      </div>
                      <div className="report-summary-card__content">
                        <p>{reportQuery.data.summary}</p>
                      </div>
                    </div>
                  )}
                  {reportQuery.data.questions && Array.isArray(reportQuery.data.questions) && (
                    <div className="report-questions">
                      <h3 className="report-questions__title">Анализ по вопросам</h3>
                      <div className="report-questions__list">
                        {reportQuery.data.questions.map((q, idx) => {
                          const question = session.topic?.questions?.[idx];
                          const score = q.score !== undefined && q.score !== null ? q.score : null;
                          const scorePercentage = score !== null ? Math.min(100, Math.max(0, score)) : null;
                          
                          return (
                            <div key={idx} className="report-question-card">
                              <div className="report-question-card__header">
                                <h4 className="report-question-card__title">
                                  Вопрос {idx + 1}
                                  {question?.text && (
                                    <span className="report-question-card__question-text">
                                      {question.text}
                                    </span>
                                  )}
                                </h4>
                                {score !== null && (
                                  <div className="report-question-card__score">
                                    <div className="score-indicator">
                                      <div className="score-indicator__value">{score}</div>
                                      <div className="score-indicator__bar">
                                        <div
                                          className="score-indicator__fill"
                                          style={{
                                            width: `${scorePercentage}%`,
                                            backgroundColor:
                                              scorePercentage >= 80
                                                ? '#22c55e'
                                                : scorePercentage >= 60
                                                ? '#eab308'
                                                : '#ef4444',
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              {q.feedback && (
                                <div className="report-question-card__feedback">
                                  <div className="feedback-label">Обратная связь:</div>
                                  <div className="feedback-content">{q.feedback}</div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <details className="report-json-toggle">
                <summary>Просмотр сырых JSON данных</summary>
                <pre className="report-preview">{JSON.stringify(reportQuery.data, null, 2)}</pre>
              </details>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default SessionInspector;
