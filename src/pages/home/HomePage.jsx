import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { homeApi } from '../../api';

const HomePage = () => {
  const { user } = useAuth();
  const isTeacher = user?.roles?.includes('Teacher');
  const isStudent = user?.roles?.includes('Student');
  const [visibleSections, setVisibleSections] = useState({});
  const sectionsRef = useRef({});

  // State for dynamic data
  const [statistics, setStatistics] = useState({
    studentsCount: 0,
    teachersCount: 0,
    topicsCount: 0,
    successRate: 0,
  });

  // Static data for features and benefits
  const [features] = useState([
    {
      id: '1',
      title: 'Адаптивный AI движок',
      description: 'Персонализированная обратная связь на основе анализа ответов и прогресса каждого ученика',
      icon: 'clock',
      order: 1,
    },
    {
      id: '2',
      title: 'Критическое мышление',
      description: 'Фокус на развитии аналитических навыков через систематическую практику и рефлексию',
      icon: 'check',
      order: 2,
    },
    {
      id: '3',
      title: 'Персонализация',
      description: 'Индивидуальный подход к каждому ученику с учетом его уровня и темпа обучения',
      icon: 'users',
      order: 3,
    },
  ]);

  const [benefits] = useState([
    {
      id: '1',
      category: 'teachers',
      title: 'Для учителей',
      items: [
        'Автоматизация проверки и оценки работ',
        'Детальная аналитика прогресса учеников',
        'Готовые учебные материалы и темы',
        'Экономия времени на рутинных задачах',
        'Индивидуальные планы обучения',
      ],
      order: 1,
    },
    {
      id: '2',
      category: 'students',
      title: 'Для учеников',
      items: [
        'Интерактивное и увлекательное обучение',
        'Мгновенная обратная связь по ответам',
        'Развитие критического мышления',
        'Обучение в комфортном темпе',
        'Отслеживание собственного прогресса',
      ],
      order: 2,
    },
  ]);

  const [isLoading, setIsLoading] = useState(true);

  // Load statistics from backend
  useEffect(() => {
    const loadStatistics = async () => {
      try {
        setIsLoading(true);
        const data = await homeApi.getStatistics();
        setStatistics(data);
      } catch (err) {
        console.error('Failed to load statistics:', err);
        // Fallback values
        setStatistics({
          studentsCount: 40,
          teachersCount: 5,
          topicsCount: 50,
          successRate: 93,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadStatistics();
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(sectionsRef.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Counter animation
  const useCounter = (end, duration = 2000, isVisible) => {
    const [count, setCount] = useState(0);
    const countRef = useRef(0);

    useEffect(() => {
      if (!isVisible) return;

      const startTime = Date.now();
      const timer = setInterval(() => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        const current = Math.floor(progress * end);

        if (current !== countRef.current) {
          countRef.current = current;
          setCount(current);
        }

        if (progress === 1) {
          clearInterval(timer);
        }
      }, 16);

      return () => clearInterval(timer);
    }, [end, duration, isVisible]);

    return count;
  };

  const statsVisible = visibleSections['stats'];
  const studentsCount = useCounter(statistics.studentsCount, 2000, statsVisible);
  const teachersCount = useCounter(statistics.teachersCount, 2000, statsVisible);
  const topicsCount = useCounter(statistics.topicsCount, 2000, statsVisible);
  const successRate = useCounter(statistics.successRate, 2000, statsVisible);

  // Icon mapping for features
  const getFeatureIcon = (iconName) => {
    const icons = {
      clock: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
      check: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      users: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      activity: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    };

    return icons[iconName] || icons.clock;
  };

  return (
    <section className="page home">
      {/* Floating decorative elements */}
      <div className="home__floating-shapes">
        <div className="floating-shape floating-shape--1"></div>
        <div className="floating-shape floating-shape--2"></div>
        <div className="floating-shape floating-shape--3"></div>
      </div>

      {/* Hero Section */}
      <div
        className="home__hero"
        id="hero"
        ref={(el) => (sectionsRef.current['hero'] = el)}
      >
        <div className={`home__hero-content ${visibleSections['hero'] ? 'fade-in-up' : ''}`}>
          <h1 className="home__title">
            Развиваем <span className="text-gradient">критическое мышление</span>
          </h1>
          <p className="home__subtitle">
            Направляем учеников средней школы через целенаправленную практику. Наш адаптивный RAG движок
            объединяет опыт учителя с обратной связью от ИИ.
          </p>
          <div className="home__actions">
            {isTeacher && (
              <Link to="/classes" className="button">
                Мои классы
              </Link>
            )}
            {isStudent && (
              <Link to="/topics" className="button">
                Начать обучение
              </Link>
            )}
            {!user && (
              <>
                <Link to="/login" className="button">
                  Войти
                </Link>
                <Link to="/register" className="ghost-button--light">
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div
        className="home__stats"
        id="stats"
        ref={(el) => (sectionsRef.current['stats'] = el)}
      >
        <div className={`stats-grid ${visibleSections['stats'] ? 'fade-in-up' : ''}`}>
          <div className="stat-card">
            <div className="stat-card__value">
              {isLoading ? '...' : `${studentsCount}+`}
            </div>
            <div className="stat-card__label">Активных студентов</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value">
              {isLoading ? '...' : `${teachersCount}+`}
            </div>
            <div className="stat-card__label">Преподавателей</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value">
              {isLoading ? '...' : `${topicsCount}+`}
            </div>
            <div className="stat-card__label">Учебных тем</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value">
              {isLoading ? '...' : `${successRate}%`}
            </div>
            <div className="stat-card__label">Успеваемость</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div
        className="home__features"
        id="features"
        ref={(el) => (sectionsRef.current['features'] = el)}
      >
        <h2 className={`home__section-title ${visibleSections['features'] ? 'fade-in-up' : ''}`}>
          Ключевые возможности
        </h2>
        <div className={`home__features-grid ${visibleSections['features'] ? 'fade-in-up' : ''}`}>
          {isLoading ? (
            // Loading skeleton
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="feature-card">
                <div className="feature-card__icon">
                  <div style={{ width: '24px', height: '24px', background: 'rgba(0,0,0,0.1)', borderRadius: '4px' }}></div>
                </div>
                <h3 className="feature-card__title">Загрузка...</h3>
                <p className="feature-card__description">
                  Пожалуйста, подождите
                </p>
              </div>
            ))
          ) : (
            features
              .sort((a, b) => a.order - b.order)
              .map((feature) => (
                <div key={feature.id} className="feature-card">
                  <div className="feature-card__icon">
                    {getFeatureIcon(feature.icon)}
                  </div>
                  <h3 className="feature-card__title">{feature.title}</h3>
                  <p className="feature-card__description">
                    {feature.description}
                  </p>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Benefits Section */}
      <div
        className="home__benefits"
        id="benefits"
        ref={(el) => (sectionsRef.current['benefits'] = el)}
      >
        <h2 className={`home__section-title ${visibleSections['benefits'] ? 'fade-in-up' : ''}`}>
          Преимущества платформы
        </h2>
        <div className={`benefits-grid ${visibleSections['benefits'] ? 'fade-in-up' : ''}`}>
          {isLoading ? (
            // Loading skeleton
            Array(2).fill(0).map((_, i) => (
              <div key={i} className="benefit-card">
                <h3 className="benefit-card__title">Загрузка...</h3>
                <ul className="benefit-card__list">
                  <li>Пожалуйста, подождите</li>
                </ul>
              </div>
            ))
          ) : (
            benefits
              .sort((a, b) => a.order - b.order)
              .map((benefit) => (
                <div key={benefit.id} className="benefit-card">
                  <h3 className="benefit-card__title">{benefit.title}</h3>
                  <ul className="benefit-card__list">
                    {benefit.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div
        className="home__cta"
        id="cta"
        ref={(el) => (sectionsRef.current['cta'] = el)}
      >
        <div className={`cta-content ${visibleSections['cta'] ? 'fade-in-up' : ''}`}>
          <h2 className="cta-content__title">
            Готовы начать?
          </h2>
          <p className="cta-content__description">
            Присоединяйтесь к сообществу педагогов и учеников, развивающих критическое мышление
          </p>
          <div className="cta-content__actions">
            <Link to="/auth/login" className="button button--large">
              Войти как учитель
            </Link>
            <Link to="/auth/login" className="button button--large">
              Войти как студент
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
