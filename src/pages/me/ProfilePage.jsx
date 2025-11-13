import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../../api/me';
import useAuth from '../../hooks/useAuth';
import Alert from '../../components/ui/Alert';
import Loader from '../../components/ui/Loader';

const emptyProfile = {
  firstName: '',
  lastName: '',
  birthDate: '',
  avatarUrl: '',
  bio: '',
};

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const { user, refresh } = useAuth();
  const [profile, setProfile] = useState(emptyProfile);
  const [feedback, setFeedback] = useState(null);

  const query = useQuery({
    queryKey: ['me', 'profile'],
    queryFn: profileApi.getProfile,
  });

  useEffect(() => {
    if (query.data) {
      setProfile({
        firstName: query.data.firstName ?? '',
        lastName: query.data.lastName ?? '',
        birthDate: query.data.birthDate ? new Date(query.data.birthDate).toISOString().slice(0, 10) : '',
        avatarUrl: query.data.avatarUrl ?? '',
        bio: query.data.bio ?? '',
      });
    }
  }, [query.data]);

  const mutation = useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['me', 'profile'], data);
      setFeedback({ tone: 'success', message: 'Профиль успешно обновлён.' });
      refresh();
    },
    onError: (error) => {
      const message = error?.response?.data?.error || error?.message || 'Не удалось обновить профиль.';
      setFeedback({ tone: 'error', message });
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      firstName: profile.firstName || null,
      lastName: profile.lastName || null,
      birthDate: profile.birthDate ? new Date(profile.birthDate).toISOString() : null,
      avatarUrl: profile.avatarUrl || null,
      bio: profile.bio || null,
    };
    mutation.mutate(payload);
  };

  const handleReset = () => {
    if (query.data) {
      setProfile({
        firstName: query.data.firstName ?? '',
        lastName: query.data.lastName ?? '',
        birthDate: query.data.birthDate ? new Date(query.data.birthDate).toISOString().slice(0, 10) : '',
        avatarUrl: query.data.avatarUrl ?? '',
        bio: query.data.bio ?? '',
      });
    } else {
      setProfile(emptyProfile);
    }
    setFeedback(null);
  };

  const roleSummary = useMemo(() => {
    if (!user.roles?.length) return 'Роли ещё не назначены.';
    return user.roles.map(role => role === 'Teacher' ? 'Учитель' : role === 'Student' ? 'Ученик' : role).join(', ');
  }, [user.roles]);

  return (
    <section className="page">
      <div className="panel">
        <header className="panel__header">
          <h1>Мой профиль</h1>
          <p>Обновите личную информацию, которая доступна вашим классам и опекунам.</p>
        </header>

        <section className="panel__section">
          <h2>Обзор аккаунта</h2>
          <div className="detail-grid">
            <div>
              <span className="detail-label">Email</span>
              <span>{user.email ?? 'Неизвестно'}</span>
            </div>
            <div>
              <span className="detail-label">ID пользователя</span>
              <span>{user.userId}</span>
            </div>
            <div>
              <span className="detail-label">Роли</span>
              <span>{roleSummary}</span>
            </div>
          </div>
        </section>

        <section className="panel__section">
          <h2>Личные данные</h2>

          {query.isLoading && <Loader message="Загрузка профиля…" />}
          {query.isError && (
            <Alert tone="error">{query.error?.message || 'Не удалось загрузить профиль.'}</Alert>
          )}
          {feedback && <Alert tone={feedback.tone}>{feedback.message}</Alert>}

          {!query.isLoading && (
            <form className="form" onSubmit={handleSubmit}>
              <div className="form__row">
                <label className="form__field">
                  <span>Имя</span>
                  <input
                    type="text"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleChange}
                    placeholder="Алексей"
                  />
                </label>
                <label className="form__field">
                  <span>Фамилия</span>
                  <input
                    type="text"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleChange}
                    placeholder="Иванов"
                  />
                </label>
              </div>

              <div className="form__row">
                <label className="form__field">
                  <span>Дата рождения</span>
                  <input
                    type="date"
                    name="birthDate"
                    value={profile.birthDate}
                    onChange={handleChange}
                    max={new Date().toISOString().slice(0, 10)}
                  />
                </label>
                <label className="form__field">
                  <span>URL аватара</span>
                  <input
                    type="url"
                    name="avatarUrl"
                    value={profile.avatarUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </label>
              </div>

              <label className="form__field">
                <span>О себе</span>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  maxLength={1024}
                  placeholder="Расскажите одноклассникам о своих интересах и целях."
                  rows={5}
                />
                <span className="helper-text">{profile.bio.length}/1024 символов</span>
              </label>

              <div className="form__actions">
                <button type="submit" className="button" disabled={mutation.isPending}>
                  {mutation.isPending ? 'Сохранение…' : 'Сохранить изменения'}
                </button>
                <button type="button" className="ghost-button" onClick={handleReset}>
                  Сбросить
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </section>
  );
};

export default ProfilePage;
