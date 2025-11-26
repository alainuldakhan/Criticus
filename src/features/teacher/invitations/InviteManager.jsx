import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { classesApi } from '../../../api/classes';
import { invitationsApi } from '../../../api/invitations';
import Alert from '../../../components/ui/Alert';

const InviteManager = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialClassId = searchParams.get('classId') ?? '';

  const [selectedClassId, setSelectedClassId] = useState(initialClassId);
  const [emailHint, setEmailHint] = useState('');
  const [inviteResult, setInviteResult] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (selectedClassId) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('classId', selectedClassId);
        return next;
      }, { replace: true });
    }
  }, [selectedClassId, setSearchParams]);

  const { data: classes, isLoading: isLoadingClasses } = useQuery({
    queryKey: ['teacher', 'classes'],
    queryFn: classesApi.list,
  });

  const mutation = useMutation({
    mutationFn: ({ classId, payload }) => invitationsApi.create(classId, payload),
    onSuccess: (data) => {
      setInviteResult(data);
      setFeedback({ tone: 'success', message: 'Приглашение успешно создано.' });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.title ||
        error?.message ||
        'Не удалось создать приглашение.';
      setFeedback({ tone: 'error', message });
    },
  });

  const handleCreate = (event) => {
    event.preventDefault();
    if (!selectedClassId) {
      setFeedback({ tone: 'error', message: 'Сначала выберите класс.' });
      return;
    }
    mutation.mutate({ classId: selectedClassId, payload: { emailHint } });
  };

  const handleCopy = async () => {
    if (!inviteResult?.inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteResult.inviteUrl);
      setFeedback({ tone: 'success', message: 'Ссылка-приглашение скопирована в буфер обмена.' });
    } catch (error) {
      setFeedback({
        tone: 'error',
        message: 'Не удалось скопировать автоматически. Пожалуйста, скопируйте ссылку вручную.',
      });
    }
  };

  const sortedClasses = useMemo(() => {
    return (classes ?? []).slice().sort((a, b) => a.name.localeCompare(b.name));
  }, [classes]);

  return (
    <div className="panel panel--glass">
      <header className="panel__header">
        <h1 className="panel__title panel__title--gradient">Приглашения в класс</h1>
      </header>

      {feedback && <Alert tone={feedback.tone}>{feedback.message}</Alert>}

      <section className="panel__section">
        <form className="form" onSubmit={handleCreate}>
          <label className="form__field">
            <span>Класс</span>
            <select
              value={selectedClassId}
              onChange={(event) => setSelectedClassId(event.target.value)}
              disabled={isLoadingClasses}
            >
              <option value="">Выберите класс…</option>
              {sortedClasses.map((klass) => (
                <option key={klass.id} value={klass.id}>
                  {klass.name}
                </option>
              ))}
            </select>
          </label>

          <label className="form__field">
            <span>Email</span>
            <input
              type="email"
              placeholder="student@example.com"
              value={emailHint}
              onChange={(event) => setEmailHint(event.target.value)}
            />
          </label>

          <button type="submit" className="button" disabled={mutation.isPending}>
            {mutation.isPending ? 'Создание…' : 'Создать приглашение'}
          </button>
        </form>
      </section>

      {inviteResult && (
        <section className="panel__section">
          <h2 className="panel__subtitle">Пригласительная ссылка создана!</h2>

          <div className="invite-result-card">
            <div className="invite-result-card__header">
              <div className="invite-result-card__icon">✉️</div>
              <div className="invite-result-card__info">
                <h3 className="invite-result-card__title">Готово к отправке</h3>
                {inviteResult.emailHint && (
                  <p className="invite-result-card__hint">Для: {inviteResult.emailHint}</p>
                )}
              </div>
            </div>

            <div className="invite-result-card__expiry">
              <span className="invite-result-card__expiry-icon">⏱️</span>
              <span className="invite-result-card__expiry-text">
                Истекает {new Date(inviteResult.expiresUtc).toLocaleString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>

            <div className="invite-result-card__url">
              <code className="invite-result-card__code">{inviteResult.inviteUrl}</code>
            </div>

            <button
              type="button"
              className="invite-result-card__copy-btn"
              onClick={handleCopy}
            >
              <span className="invite-result-card__copy-icon">📋</span>
              Скопировать ссылку
            </button>


          </div>
        </section>
      )}
    </div>
  );
};

export default InviteManager;
