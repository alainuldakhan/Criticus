import React from 'react';
import '../../styles/global.css';

const Card = ({ children, className = '', title, footer, ...props }) => {
    return (
        <div className={`card ${className}`} {...props}>
            {title && (
                <div className="card__header">
                    <h3 className="card__title">{title}</h3>
                </div>
            )}
            <div className="card__content">
                {children}
            </div>
            {footer && (
                <div className="card__footer">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;
