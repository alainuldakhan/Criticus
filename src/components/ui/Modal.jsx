import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import '../../styles/global.css';

const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'modal--sm',
        md: 'modal--md',
        lg: 'modal--lg',
        xl: 'modal--xl',
    };

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div
                className={`modal ${sizeClasses[size] || sizeClasses.md}`}
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                <div className="modal__header">
                    <h3 className="modal__title">{title}</h3>
                    <button className="modal__close" onClick={onClose} aria-label="Close modal">
                        &times;
                    </button>
                </div>
                <div className="modal__content">
                    {children}
                </div>
                {footer && (
                    <div className="modal__footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default Modal;
