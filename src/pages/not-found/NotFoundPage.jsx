import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <section className="page page--centered">
      <h1>Страница не найдена</h1>
      <p>Запрашиваемый ресурс не существует или был перемещён.</p>
      <Link to="/" className="button">
        Вернуться на главную
      </Link>
    </section>
  );
};

export default NotFoundPage;
