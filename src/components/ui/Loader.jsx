const Loader = ({ message = 'Loading…' }) => {
  return (
    <div className="loader" role="status" aria-live="polite">
      <span className="loader__spinner" aria-hidden="true" />
      <span className="loader__message">{message}</span>
    </div>
  );
};

export default Loader;
