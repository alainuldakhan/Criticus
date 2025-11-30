import React, { Component } from 'react';
import { logger } from '../lib/logger';
import './ErrorBoundary.css';

/**
 * Error Boundary component to catch React errors
 * Prevents app crashes and shows fallback UI
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error, errorInfo) {
        logger.error('React Error Boundary caught an error', {
            error,
            errorInfo,
            componentStack: errorInfo.componentStack,
        });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <div className="error-boundary__container">
                        <div className="error-boundary__icon">⚠️</div>
                        <h1 className="error-boundary__title">Что-то пошло не так</h1>
                        <p className="error-boundary__message">
                            Произошла непредвиденная ошибка. Мы уже работаем над её исправлением.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="error-boundary__details">
                                <summary>Детали ошибки (только в dev режиме)</summary>
                                <pre className="error-boundary__stack">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}

                        <div className="error-boundary__actions">
                            <button
                                className="button"
                                onClick={this.handleReset}
                                type="button"
                            >
                                Попробовать снова
                            </button>
                            <button
                                className="button button--secondary"
                                onClick={() => window.location.href = '/'}
                                type="button"
                            >
                                Вернуться на главную
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
