import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { classesApi } from '../../../api/classes';
import Alert from '../../../components/ui/Alert';

const initialForm = (klass) => ({
  name: klass?.name ?? '',
  grade: klass?.grade ?? '',
  year: klass?.year ?? '',
});

const ClassDetailHeader = ({ klass }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(initialForm(klass));

  useEffect(() => {
    setForm(initialForm(klass));
    setFeedback(null);
    setIsEditing(false);
  }, [klass]);

  const updateMutation = useMutation({
    mutationFn: (payload) => classesApi.update(klass.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher', 'classes', klass.id] });
      queryClient.invalidateQueries({ queryKey: ['teacher', 'classes'] });
      setFeedback({ tone: 'success', message: 'Class details updated.' });
      setIsEditing(false);
    },
    onError: (error) => {
      const message = error?.response?.data?.error || error?.message || 'Failed to update class.';
      setFeedback({ tone: 'error', message });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => classesApi.remove(klass.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher', 'classes'] });
      navigate('/teacher/classes', { replace: true });
    },
    onError: (err) => {
      const message =
        err?.response?.data?.error === 'class_not_empty'
          ? 'Cannot delete a class that still has members. Remove members first.'
          : err?.response?.data?.error || err?.message || 'Failed to delete class.';
      setFeedback({ tone: 'error', message });
    },
  });

  const handleDelete = () => {
    const confirmation = window.confirm(
      'Are you sure you want to delete this class? This action cannot be undone.'
    );
    if (confirmation) {
      deleteMutation.mutate();
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateMutation.mutate({
      name: form.name.trim(),
      grade: form.grade === '' ? null : Number.parseInt(form.grade, 10),
      year: form.year === '' ? null : Number.parseInt(form.year, 10),
    });
  };

  return (
    <header className="panel__header panel__header--split">
      <div className="panel__header-summary">
        {isEditing ? (
          <form className="form class-edit-form" onSubmit={handleSubmit}>
            <label className="form__field">
              <span>Name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                minLength={2}
                maxLength={200}
                required
              />
            </label>
            <div className="form__row">
              <label className="form__field">
                <span>Grade</span>
                <input
                  type="number"
                  name="grade"
                  value={form.grade ?? ''}
                  onChange={handleChange}
                  min="1"
                  max="12"
                  placeholder="e.g. 7"
                />
              </label>
              <label className="form__field">
                <span>Year</span>
                <input
                  type="number"
                  name="year"
                  value={form.year ?? ''}
                  onChange={handleChange}
                  min="2000"
                  max="2099"
                  placeholder="e.g. 2025"
                />
              </label>
            </div>
            <div className="form__actions">
              <button type="submit" className="button" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Saving…' : 'Save changes'}
              </button>
              <button
                type="button"
                className="ghost-button"
                onClick={() => {
                  setIsEditing(false);
                  setForm(initialForm(klass));
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <h1>{klass.name}</h1>
            <p>
              Grade {klass.grade ?? '—'} • Year {klass.year ?? '—'} • Class ID {klass.id}
            </p>
          </>
        )}
      </div>
      <div className="panel__actions">
        {!isEditing && (
          <button type="button" className="ghost-button" onClick={() => setIsEditing(true)}>
            Edit details
          </button>
        )}
        <button
          type="button"
          className="ghost-button ghost-button--danger"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? 'Deleting…' : 'Delete class'}
        </button>
      </div>
      {feedback && <Alert tone={feedback.tone}>{feedback.message}</Alert>}
    </header>
  );
};

export default ClassDetailHeader;
