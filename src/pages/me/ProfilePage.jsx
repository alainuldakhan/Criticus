import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth';
import Alert from '../../components/ui/Alert';
import { useAuth } from '../../hooks/useAuth';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const updateMutation = useMutation({
    mutationFn: (data) => authApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      setFeedback({ tone: 'success', message: 'Профиль успешно обновлён' });
      setIsEditing(false);
    },
    onError: (error) => {
      setFeedback({
        tone: 'error',
        message: error?.response?.data?.error || 'Не удалось обновить профиль'
      });
    },
  });

  const passwordMutation = useMutation({
    mutationFn: (data) => authApi.changePassword(data),
    onSuccess: () => {
      setFeedback({ tone: 'success', message: 'Пароль успешно изменён' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    },
    onError: (error) => {
      setFeedback({
        tone: 'error',
        message: error?.response?.data?.error || 'Не удалось изменить пароль'
      });
    },
  });

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setFeedback({ tone: 'error', message: 'Пароли не совпадают' });
      return;
    }
    passwordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="page">
      <div className="panel panel--glass" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <header className="panel__header">
          <h1 className="panel__title panel__title--gradient">Профиль</h1>
        </header>

        {feedback && <Alert tone={feedback.tone}>{feedback.message}</Alert>}

        {/* User Info Section */}
        <div className="students-form" style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            marginBottom: '2rem',
            padding: '2rem',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
            borderRadius: '16px'
          }}>
            {/* Avatar */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '2rem',
              fontWeight: 'bold',
              flexShrink: 0
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>

            {/* User details */}
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>
                {user?.name || 'Пользователь'}
              </h2>
              <p style={{ margin: '0.25rem 0 0 0', color: '#737373' }}>
                {user?.email}
              </p>
              <p style={{
                margin: '0.5rem 0 0 0',
                fontSize: '0.875rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#6366f1',
                display: 'inline-block',
                fontWeight: 500
              }}>
                {user?.role === 'teacher' ? '👨‍🏫 Преподаватель' : '👨‍🎓 Студент'}
              </p>
            </div>
          </div>

          {/* Profile Edit Form */}
          <h2 className="panel__subtitle" style={{ marginBottom: '1rem' }}>Личная информация</h2>

          {!isEditing ? (
            <div style={{
              padding: '1.5rem',
              background: 'rgba(0, 0, 0, 0.02)',
              borderRadius: '12px'
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.875rem', color: '#737373', marginBottom: '0.25rem' }}>Имя</div>
                <div style={{ fontSize: '1rem', fontWeight: 500 }}>{user?.name || '—'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#737373', marginBottom: '0.25rem' }}>Email</div>
                <div style={{ fontSize: '1rem', fontWeight: 500 }}>{user?.email}</div>
              </div>
              <button
                type="button"
                className="ghost-button"
                onClick={() => setIsEditing(true)}
                style={{ marginTop: '1rem' }}
              >
                Редактировать
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="form">
              <label className="form__field">
                <span>Имя</span>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </label>

              <label className="form__field">
                <span>Email</span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </label>

              <div className="form__actions">
                <button
                  type="submit"
                  className="button"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? 'Сохранение...' : 'Сохранить'}
                </button>
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ name: user?.name || '', email: user?.email || '' });
                  }}
                >
                  Отмена
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Change Password Section */}
        <div className="students-form" style={{ marginBottom: '2rem' }}>
          <h2 className="panel__subtitle" style={{ marginBottom: '1rem' }}>Изменить пароль</h2>

          <form onSubmit={handleChangePassword} className="form">
            <label className="form__field">
              <span>Текущий пароль</span>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
              />
            </label>

            <label className="form__field">
              <span>Новый пароль</span>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                minLength={6}
              />
            </label>

            <label className="form__field">
              <span>Подтвердите новый пароль</span>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
                minLength={6}
              />
            </label>

            <div className="form__actions">
              <button
                type="submit"
                className="button"
                disabled={passwordMutation.isPending}
              >
                {passwordMutation.isPending ? 'Изменение...' : 'Изменить пароль'}
              </button>
            </div>
          </form>
        </div>

        {/* Logout Section */}
        <div style={{
          padding: '2rem',
          background: 'rgba(239, 68, 68, 0.05)',
          borderRadius: '16px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: 600 }}>
            Выйти из аккаунта
          </h3>
          <p style={{ margin: '0 0 1.5rem 0', color: '#737373', fontSize: '0.875rem' }}>
            Вы будете перенаправлены на главную страницу
          </p>
          <button
            type="button"
            className="button"
            onClick={handleLogout}
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              border: 'none'
            }}
          >
            🚪 Выйти
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
