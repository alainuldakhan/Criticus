import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import AuthCard from '../../components/auth/AuthCard';
import Alert from '../../components/ui/Alert';
import { getPersistPreference } from '../../state/authStorage';

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, isLoading } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    remember: getPersistPreference() === 'local',
  });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const passwordMismatch = useMemo(
    () => form.password && form.confirmPassword && form.password !== form.confirmPassword,
    [form.password, form.confirmPassword]
  );

  const signUpSuccessDestination = useMemo(() => {
    const redirect = location.state?.from?.pathname;
    if (!redirect) return 'После создания аккаунта вы попадёте на главную страницу.';
    return `После регистрации мы вернём вас на ${redirect}.`;
  }, [location.state]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((previous) => ({ ...previous, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    if (passwordMismatch) {
      setError('Пароли не совпадают.');
      return;
    }

    const payload = {
      email: form.email,
      password: form.password,
      firstName: form.firstName || undefined,
      lastName: form.lastName || undefined,
    };

    const result = await register(payload, { persist: form.remember });
    if (result.ok) {
      navigate('/', { replace: true });
    } else {
      const message =
        result.error?.response?.data?.error || result.error?.message || 'Ошибка регистрации';
      setError(message);
    }
  };

  return (
    <div className="page page--centered">
      <AuthCard
        title="Создайте аккаунт"
        subtitle="По умолчанию вы начнёте как ученик. Права учителя предоставляются администратором школы."
        footer={
          <p>
            Уже есть аккаунт? <Link to="/auth/login">Войти</Link>
          </p>
        }
      >
        <Alert tone="info">
          {signUpSuccessDestination}
          <br />
          Нужен доступ учителя? Попросите существующего учителя пригласить вас или обратитесь в поддержку.
        </Alert>

        {error && <Alert tone="error" title="Не удалось создать аккаунт">{error}</Alert>}

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
          <div className="form__row">
            <label className="form__field">
              <span>Имя</span>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Алексей"
              />
            </label>
            <label className="form__field">
              <span>Фамилия</span>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Иванов"
              />
            </label>
          </div>
          <label className="form__field">
            <span>Пароль</span>
            <div className="form__password">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="Не менее 6 символов"
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
          <label className="form__field">
            <span>Подтвердите пароль</span>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete="new-password"
              aria-invalid={passwordMismatch}
              aria-describedby={passwordMismatch ? 'password-mismatch' : undefined}
            />
          </label>
          {passwordMismatch && (
            <p className="form__error" id="password-mismatch">
              Пароли должны совпадать.
            </p>
          )}
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
              {isLoading ? 'Создание…' : 'Создать аккаунт'}
            </button>
          </div>
        </form>
      </AuthCard>
    </div>
  );
};

export default RegisterPage;
