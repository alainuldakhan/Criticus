import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const slides = [
  {
    title: 'Инструмент сократического диалога',
    copy: 'Запускайте наборы вопросов, которые поощряют обоснованное рассуждение с подсказками в реальном времени.',
    accent: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
  },
  {
    title: 'Совместное размышление',
    copy: 'Приглашайте одноклассников комментировать ответы и выделять сильные аргументы вместе.',
    accent: 'linear-gradient(135deg, #f97316, #fb7185)',
  },
  {
    title: 'Информативные отчёты',
    copy: 'Просматривайте обобщённые ИИ отзывы, которые определяют области роста для каждого ученика.',
    accent: 'linear-gradient(135deg, #a855f7, #6366f1)',
  },
];

const quickLinks = [
  {
    title: 'Запланировать сессию',
    copy: 'Учителя могут ставить в очередь RAG сессии, адаптированные под цели класса.',
    to: '/teacher/rag',
    tone: 'teacher',
  },
  {
    title: 'Продолжить обучение',
    copy: 'Ученики возобновляют последнюю адаптивную сессию или изучают новые темы.',
    to: '/student/sessions',
    tone: 'student',
  },
  {
    title: 'Пригласить одноклассника',
    copy: 'Отправьте персонализированную ссылку для безопасного добавления новых участников.',
    to: '/teacher/invitations',
    tone: 'teacher',
  },
];

const HomePage = () => {
  const { user } = useAuth();
  const [activeSlide, setActiveSlide] = useState(0);
  const isTeacher = user.roles?.includes('Teacher');
  const isStudent = user.roles?.includes('Student');

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="page home">
      <div className="home__hero">
        <div className="home__hero-text">
          <h1>Развиваем критическое мышление</h1>
          <p>
            Направляем учеников средней школы через целенаправленную практику. Наш адаптивный RAG движок
            объединяет опыт учителя с обратной связью от ИИ для улучшения классных дискуссий.
          </p>
          <div className="home__hero-actions">
            {isTeacher ? (
              <Link to="/teacher" className="button">
                Перейти в центр учителя
              </Link>
            ) : (
              <Link to="/auth/register" className="button">
                Начать как учитель
              </Link>
            )}
            {isStudent ? (
              <Link to="/student" className="ghost-button ghost-button--light">
                Продолжить обучение
              </Link>
            ) : (
              <Link to="/auth/login" className="ghost-button ghost-button--light">
                Вход для ученика
              </Link>
            )}
          </div>
        </div>
        <div className="home__hero-card">
          <h2>В центре внимания сегодня</h2>
          <p>
            "Как мы можем оценивать источники при исследовании изменения климата?" Бросьте вызов своему классу
            с кураторской сессией и отслеживайте индивидуальные пути рассуждений в реальном времени.
          </p>
          <Link to="/student/topics" className="ghost-link" style={{ marginTop: '0.5rem' }}>
            Изучить темы →
          </Link>
        </div>
      </div>

      <div className="home__carousel" role="region" aria-live="polite">
        {slides.map((slide, index) => (
          <article
            key={slide.title}
            className={`home__slide ${index === activeSlide ? 'home__slide--active' : ''}`}
          >
            <div className="home__slide-content">
              <h2>{slide.title}</h2>
              <p>{slide.copy}</p>
            </div>
          </article>
        ))}
        <div className="home__carousel-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={index === activeSlide ? 'dot dot--active' : 'dot'}
              onClick={() => setActiveSlide(index)}
              aria-label={`Показать слайд ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="home__quick-links">
        {quickLinks
          .filter((link) =>
            link.tone === 'teacher' ? isTeacher : link.tone === 'student' ? isStudent : true
          )
          .map((link) => (
            <Link key={link.title} to={link.to} className="home__quick-link">
              <h3>{link.title}</h3>
              <p>{link.copy}</p>
              <span className="home__quick-link-cta">Открыть →</span>
            </Link>
          ))}
      </div>
    </section>
  );
};

export default HomePage;
