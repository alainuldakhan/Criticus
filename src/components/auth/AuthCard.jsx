const AuthCard = ({ title, subtitle, children, footer }) => {
  return (
    <section className="auth-card" aria-live="polite">
      <header className="auth-card__header">
        <h1>{title}</h1>
        {subtitle && <p className="auth-card__subtitle">{subtitle}</p>}
      </header>
      <div className="auth-card__content">{children}</div>
      {footer && <footer className="auth-card__footer">{footer}</footer>}
    </section>
  );
};

export default AuthCard;
