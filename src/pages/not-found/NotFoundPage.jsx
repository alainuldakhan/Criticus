import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <section className="page page--centered">
      <h1>Страница не найдена</h1>
      <Link to="/" className="button">
        Вернуться на главную
      </Link>
    </section>
  );
};

export default NotFoundPage;
