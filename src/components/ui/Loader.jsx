const Loader = ({ size = 'md', message = 'Загрузка...' }) => {
  const sizeClasses = {
    sm: 'loader--sm',
    md: 'loader--md',
    lg: 'loader--lg',
  };

  return (
    <div className={`loader ${sizeClasses[size]}`} role="status" aria-live="polite">
      <div className="loader__spinner" aria-hidden="true">
        <div className="loader__dot"></div>
        <div className="loader__dot"></div>
        <div className="loader__dot"></div>
      </div>
      {message && <span className="loader__message">{message}</span>}
    </div>
  );
};

export default Loader;
