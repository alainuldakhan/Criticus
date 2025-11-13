import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { ragStudentApi } from '../../../api/ragStudent';
import Alert from '../../../components/ui/Alert';
import RagLoader from '../../../components/ui/RagLoader';

const SessionDetail = () => {
  const { sessionId } = useParams();
  const queryClient = useQueryClient();
  const [answers, setAnswers] = useState(new Map());
  const [feedback, setFeedback] = useState(null);

  const query = useQuery({
    queryKey: ['student', 'sessions', sessionId],
    queryFn: () => ragStudentApi.getSession(sessionId),
  });

  const submitMutation = useMutation({
    mutationFn: (payload) => ragStudentApi.submitAnswers(sessionId, payload),
    onSuccess: () => {
      setFeedback({ tone: 'success', message: 'Ответы отправлены.' });
      queryClient.invalidateQueries({ queryKey: ['student', 'sessions', sessionId] });
    },
    onError: (error) => {
      const message = error?.response?.data?.error || error?.message || 'Не удалось отправить ответы.';
      setFeedback({ tone: 'error', message });
    },
  });

  const evaluateMutation = useMutation({
    mutationFn: () => ragStudentApi.evaluate(sessionId),
    onSuccess: () => {
      setFeedback({ tone: 'success', message: 'Оценка запрошена. Проверьте позже.' });
      queryClient.invalidateQueries({ queryKey: ['student', 'sessions', sessionId] });
    },
    onError: (error) => {
      const message = error?.response?.data?.error || error?.message || 'Не удалось запросить оценку.';
      setFeedback({ tone: 'error', message });
    },
  });

  const reportQuery = useQuery({
    queryKey: ['student', 'sessions', sessionId, 'report'],
    queryFn: () => ragStudentApi.getReport(sessionId),
    enabled: Boolean(query.data?.evaluation),
  });

  const session = query.data;

  const currentAnswers = useMemo(() => {
    if (!session?.responses) return answers;
    const map = new Map(answers);
    session.responses.forEach((response) => {
      // Если ответ уже был отправлен, сохраняем его
      map.set(response.questionId, response.answer ?? '');
    });
    return map;
  }, [session, answers]);

  const handleAnswerChange = (questionId, generatedId, answerText) => {
    setAnswers((prev) => new Map(prev).set(questionId, answerText));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!session?.topic?.questions) return;
    
    // Проверяем, что все вопросы отвечены
    const unansweredQuestions = session.topic.questions.filter(
      (question) => !currentAnswers.get(question.id)
    );
    
    if (unansweredQuestions.length > 0) {
      setFeedback({
        tone: 'error',
        message: `Пожалуйста, ответьте на все ${session.topic.questions.length} вопросов перед отправкой.`,
      });
      return;
    }
    
    const payload = {
      answers: session.topic.questions.map((question) => ({
        questionId: question.id,
        answer: currentAnswers.get(question.id) ?? '',
      })),
    };
    submitMutation.mutate(payload);
  };

  if (query.isLoading) {
    return (
      <div className="panel">
        <p>Загрузка сессии…</p>
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="panel">
        <Alert tone="error">{query.error?.message || 'Не удалось загрузить сессию.'}</Alert>
      </div>
    );
  }

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
          <h1>Оценка ответов</h1>
          <p>ИИ обрабатывает вашу оценку...</p>
        </header>
        <div className="panel__section">
          <RagLoader
            message="Оценка ваших ответов с помощью ИИ..."
            subMessage="ИИ анализирует ваши ответы и генерирует подробный отчёт об оценке. Это может занять 2-3 минуты."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <header className="panel__header">
        <h1>{session.topic?.title ?? 'Сессия'}</h1>
        <p>Начато {new Date(session.startedUtc).toLocaleString('ru-RU')}</p>
      </header>

      {feedback && <Alert tone={feedback.tone}>{feedback.message}</Alert>}

      <form className="form" onSubmit={handleSubmit}>
        <div className="question-stack">
          {session.topic?.questions?.map((question, index) => {
            const generatedOptions = question.generated || [];
            const selectedAnswer = currentAnswers.get(question.id);
            
            return (
              <div key={question.id} className="question-card">
                <h3>
                  Вопрос {index + 1}
                </h3>
                <p className="question-text">{question.text}</p>
                
                {generatedOptions.length > 0 ? (
                  <div className="answer-options">
                    <p className="answer-options__label">Выберите ваш ответ:</p>
                    {(() => {
                      const isSubmitted = session.responses?.some(
                        (r) => r.questionId === question.id
                      );
                      return (
                        <>
                          {generatedOptions.map((option) => {
                            const isSelected = selectedAnswer === option.text;
                            return (
                              <label
                                key={option.id}
                                className={`answer-option ${isSelected ? 'answer-option--selected' : ''} ${
                                  isSubmitted ? 'answer-option--disabled' : ''
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${question.id}`}
                                  value={option.id}
                                  checked={isSelected}
                                  onChange={() => handleAnswerChange(question.id, option.id, option.text)}
                                  disabled={isSubmitted}
                                />
                                <div className="answer-option__content">
                                  <div className="answer-option__text">{option.text}</div>
                                </div>
                              </label>
                            );
                          })}
                          {isSubmitted && (
                            <p className="answer-options__submitted">✓ Ответ отправлен</p>
                          )}
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="answer-options">
                    <p className="answer-options__label">Варианты ответов для этого вопроса пока не доступны.</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="form__actions">
          <button
            type="submit"
            className="button"
            disabled={
              submitMutation.isPending ||
              session.topic?.questions?.some((q) => !currentAnswers.get(q.id)) ||
              session.responses?.length > 0
            }
          >
            {submitMutation.isPending
              ? 'Отправка…'
              : session.responses?.length > 0
              ? 'Ответы уже отправлены'
              : 'Отправить ответы'}
          </button>
          <button
            type="button"
            className="ghost-button"
            onClick={() => evaluateMutation.mutate()}
            disabled={
              evaluateMutation.isPending ||
              !session.topic?.questions?.length ||
              !session.responses?.length ||
              session.responses?.length !== session.topic?.questions?.length
            }
          >
            {evaluateMutation.isPending ? 'Оценка…' : 'Запросить оценку'}
          </button>
        </div>
      </form>

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
              subMessage="Получение подробного анализа ваших ответов."
            />
          )}
          {reportQuery.isError && (
            <Alert tone="error">
              {reportQuery.error?.message || 'Не удалось загрузить отчёт.'}
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

export default SessionDetail;
