import { useMemo, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Alert from '../../components/ui/Alert';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Logo from '../../components/ui/Logo';
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

  // Typing effect state
  const [displayText, setDisplayText] = useState('');
  const fullText = "С возвращением";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setDisplayText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(timer);
    }, 100);
    return () => clearInterval(timer);
  }, []);

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
    <div className="page page--centered auth-page">
      <div className="auth-card-glass">
        <div className="auth-header">
          <Logo size="large" className="mb-6" />
          <h1 className="auth-title min-h-[40px]">
            {displayText}
            <span className="animate-pulse">|</span>
          </h1>
          <p className="auth-subtitle">
            Введите ваши данные для доступа к персональному пространству
          </p>
        </div>

        {redirectHint && <Alert tone="info" className="mb-6">{redirectHint}</Alert>}
        {error && <Alert tone="error" title="Не удалось войти" className="mb-6">{error}</Alert>}

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


          <Input
            label="Пароль"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            minLength={6}
            placeholder="••••••"
            containerClassName="mb-6"
            rightElement={
              <button
                type="button"
                className="password-toggle-icon"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            }
          />

          <div className="flex items-center justify-between mb-8">
            <label className="form__checkbox">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
              />
              <span>Запомнить меня</span>
            </label>

            <Link to="/auth/reset" className="text-sm font-medium hover:underline">
              Забыли пароль?
            </Link>
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
            Войти
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Нет аккаунта? <Link to="/auth/register" className="font-bold hover:underline">Создать</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
