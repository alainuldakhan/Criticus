const toneMap = {
  info: 'alert--info',
  error: 'alert--error',
  success: 'alert--success',
  warning: 'alert--warning',
};

const Alert = ({ tone = 'info', title, children }) => {
  const toneClass = toneMap[tone] ?? toneMap.info;
  return (
    <div className={`alert ${toneClass}`} role={tone === 'error' ? 'alert' : 'status'}>
      {title && <div className="alert__title">{title}</div>}
      {children && <div className="alert__body">{children}</div>}
    </div>
  );
};

export default Alert;
