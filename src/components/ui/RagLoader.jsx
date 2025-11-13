import Loader from './Loader';

const RagLoader = ({ message, subMessage }) => {
  return (
    <div className="rag-loader">
      <Loader message={message || 'Обработка RAG запроса…'} />
      {subMessage && <p className="rag-loader__submessage">{subMessage}</p>}
      <div className="rag-loader__info">
        <p>Это может занять 2-3 минуты. Пожалуйста, подождите...</p>
      </div>
    </div>
  );
};

export default RagLoader;

