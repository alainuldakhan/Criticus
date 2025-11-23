import React, { forwardRef } from 'react';
import '../../styles/global.css';

const Input = forwardRef(({
    label,
    error,
    icon,
    rightElement,
    className = '',
    containerClassName = '',
    type = 'text',
    id,
    ...props
}, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substr(2, 9);

    return (
        <div className={`form__field ${containerClassName}`}>
            {label && (
                <label htmlFor={inputId}>
                    <span>{label}</span>
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="input__icon-wrapper">
                        {icon}
                    </div>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    type={type}
                    className={`${className} ${error ? 'input--error' : ''} ${icon ? 'input--with-icon' : ''} ${rightElement ? 'input--with-right-element' : ''}`}
                    {...props}
                />
                {rightElement}
            </div>
            {error && <span className="form__error">{error}</span>}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
