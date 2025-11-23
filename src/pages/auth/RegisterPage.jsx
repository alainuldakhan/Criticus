import { useMemo, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Alert from '../../components/ui/Alert';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Logo from '../../components/ui/Logo';
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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Typing effect state
  const [displayText, setDisplayText] = useState('');
  const fullText = "Создайте аккаунт";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setDisplayText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(timer);
    }, 100);
    return () => clearInterval(timer);
  }, []);

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

  const eyeIcon = (show) => (
    show ? (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ) : (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  );

  return (
    <div className="page page--centered auth-page">
      <div className="auth-layout-grid">
        <div className="auth-card-glass">
          <div className="auth-header">
            <Logo size="large" className="mb-6" />
            <h1 className="auth-title min-h-[40px]">
              {displayText}
              <span className="animate-pulse">|</span>
            </h1>
          </div>

          {error && <Alert tone="error" title="Не удалось создать аккаунт" className="mb-6">{error}</Alert>}

          <form className="form" onSubmit={handleSubmit}>
            <Input
              label="Почта"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              placeholder="you@example.com"
              containerClassName="mb-4"
            />

            <div className="form__row mb-4">
              <Input
                label="Имя"
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Алексей"
              />
              <Input
                label="Фамилия"
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Иванов"
              />
            </div>

            <Input
              label="Пароль"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="Не менее 6 символов"
              containerClassName="mb-4"
              rightElement={
                <button
                  type="button"
                  className="password-toggle-icon"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                >
                  {eyeIcon(showPassword)}
                </button>
              }
            />

            <Input
              label="Подтвердите пароль"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete="new-password"
              error={passwordMismatch ? 'Пароли должны совпадать.' : undefined}
              containerClassName="mb-6"
              rightElement={
                <button
                  type="button"
                  className="password-toggle-icon"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? 'Скрыть пароль' : 'Показать пароль'}
                >
                  {eyeIcon(showConfirmPassword)}
                </button>
              }
            />

            <label className="form__checkbox mb-8">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
              />
              <span>Запомнить меня</span>
            </label>

            <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
              Создать аккаунт
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              Уже есть аккаунт? <Link to="/auth/login" className="font-bold hover:underline">Войти</Link>
            </p>
          </div>
        </div>

        <div className="auth-info-side-card">
          <h3 className="auth-info-title">Информация</h3>
          <div className="auth-info-section">
            <p>По умолчанию вы начнёте как <strong>ученик</strong>. Права учителя предоставляются администратором школы</p>
          </div>
          <div className="auth-info-section">
            <p>{signUpSuccessDestination}</p>
          </div>
          <div className="auth-info-section">
            <p><strong>Нужен доступ учителя?</strong> Попросите существующего учителя пригласить вас или обратитесь в поддержку.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
