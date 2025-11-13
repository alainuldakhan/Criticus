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
      setFeedback({ tone: 'success', message: 'Invitation created successfully.' });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.title ||
        error?.message ||
        'Failed to create invitation.';
      setFeedback({ tone: 'error', message });
    },
  });

  const handleCreate = (event) => {
    event.preventDefault();
    if (!selectedClassId) {
      setFeedback({ tone: 'error', message: 'Select a class first.' });
      return;
    }
    mutation.mutate({ classId: selectedClassId, payload: { emailHint } });
  };

  const handleCopy = async () => {
    if (!inviteResult?.inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteResult.inviteUrl);
      setFeedback({ tone: 'success', message: 'Invite link copied to clipboard.' });
    } catch (error) {
      setFeedback({
        tone: 'error',
        message: 'Unable to copy automatically. Please copy the link manually.',
      });
    }
  };

  const sortedClasses = useMemo(() => {
    return (classes ?? []).slice().sort((a, b) => a.name.localeCompare(b.name));
  }, [classes]);

  return (
    <div className="panel">
      <header className="panel__header">
        <h1>Class invitations</h1>
        <p>
          Generate invite links for students or guardians. Links expire automatically and
          must be accepted before the class gains new members.
        </p>
      </header>

      <section className="panel__section">
        <h2>Select a class</h2>
        <label className="form__field">
          <span>Class</span>
          <select
            value={selectedClassId}
            onChange={(event) => setSelectedClassId(event.target.value)}
            disabled={isLoadingClasses}
          >
            <option value="">Choose a class…</option>
            {sortedClasses.map((klass) => (
              <option key={klass.id} value={klass.id}>
                {klass.name}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="panel__section">
        <h2>Create invitation</h2>
        <p>
          Optionally provide an email hint to remember who this invite was generated for.
          Use the invite link to allow students to set up their account or join the class.
        </p>

        {feedback && <Alert tone={feedback.tone}>{feedback.message}</Alert>}

        <form className="form" onSubmit={handleCreate}>
          <label className="form__field">
            <span>Email hint (optional)</span>
            <input
              type="email"
              placeholder="student@example.com"
              value={emailHint}
              onChange={(event) => setEmailHint(event.target.value)}
            />
          </label>
          <button type="submit" className="button" disabled={mutation.isPending}>
            {mutation.isPending ? 'Creating…' : 'Generate invite'}
          </button>
        </form>
      </section>

      {inviteResult && (
        <section className="panel__section">
          <h2>Invite link</h2>
          <p>
            Share this link securely. It expires on{' '}
            <strong>{new Date(inviteResult.expiresUtc).toLocaleString()}</strong>.
          </p>
          <div className="invite-preview">
            <code>{inviteResult.inviteUrl}</code>
            <button type="button" className="ghost-button" onClick={handleCopy}>
              Copy link
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default InviteManager;
