import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import AuthCard from '../../components/auth/AuthCard';
import Alert from '../../components/ui/Alert';
import { getPersistPreference } from '../../state/authStorage';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: getPersistPreference() === 'local',
  });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const redirectHint = useMemo(() => {
    const from = location.state?.from?.pathname;
    if (!from) return null;
    if (from.startsWith('/teacher')) return 'Войдите, чтобы получить доступ к рабочему пространству учителя.';
    if (from.startsWith('/student')) return 'Войдите, чтобы продолжить учебную сессию.';
    return 'Войдите, чтобы вернуться на предыдущую страницу.';
  }, [location.state]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((previous) => ({ ...previous, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    const result = await login(
      { email: form.email, password: form.password },
      { persist: form.remember }
    );
    if (result.ok) {
      const redirectTo = location.state?.from?.pathname ?? '/';
      navigate(redirectTo, { replace: true });
    } else {
      const message =
        result.error?.response?.data?.error || result.error?.message || 'Ошибка входа';
      setError(message);
    }
  };

  return (
    <div className="page page--centered">
      <AuthCard
        title="С возвращением"
        subtitle="Введите ваши данные для доступа к персональному пространству."
        footer={
          <p>
            Нет аккаунта? <Link to="/auth/register">Создать</Link>
          </p>
        }
      >
        {redirectHint && <Alert tone="info">{redirectHint}</Alert>}

        {error && <Alert tone="error" title="Не удалось войти">{error}</Alert>}

        <form className="form" onSubmit={handleSubmit}>
          <label className="form__field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </label>
          <label className="form__field">
            <span>Пароль</span>
            <div className="form__password">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                minLength={6}
                placeholder="••••••"
              />
              <button
                type="button"
                className="ghost-button"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? 'Скрыть' : 'Показать'}
              </button>
            </div>
          </label>
          <label className="form__checkbox">
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
            />
            <span>Оставаться в системе на этом устройстве</span>
          </label>
          <div className="form__actions">
            <button type="submit" className="button" disabled={isLoading}>
              {isLoading ? 'Вход…' : 'Войти'}
            </button>
            <Link to="/auth/reset" className="ghost-link">
              Забыли пароль?
            </Link>
          </div>
        </form>
      </AuthCard>
    </div>
  );
};

export default LoginPage;
