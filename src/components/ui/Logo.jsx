import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ showText = true, className = '', size = 'default' }) => {

  const logoContent = (
    <>
      <svg
        className={`logo__icon logo__icon--${size}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="lightGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        {/* Brain shape representing thinking */}
        <path
          d="M100 30 C85 30, 70 35, 60 45 C50 55, 45 70, 45 85 C45 100, 50 115, 60 125 C70 135, 85 140, 100 140 C115 140, 130 135, 140 125 C150 115, 155 100, 155 85 C155 70, 150 55, 140 45 C130 35, 115 30, 100 30 Z"
          fill="url(#brainGradient)"
          stroke="#4f46e5"
          strokeWidth="2"
        />

        {/* Neural network nodes representing connections */}
        <circle cx="85" cy="70" r="4" fill="#ffffff" opacity="0.9" />
        <circle cx="115" cy="70" r="4" fill="#ffffff" opacity="0.9" />
        <circle cx="100" cy="85" r="4" fill="#ffffff" opacity="0.9" />
        <circle cx="90" cy="100" r="4" fill="#ffffff" opacity="0.9" />
        <circle cx="110" cy="100" r="4" fill="#ffffff" opacity="0.9" />

        {/* Connection lines */}
        <line x1="85" y1="70" x2="100" y2="85" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />
        <line x1="115" y1="70" x2="100" y2="85" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />
        <line x1="100" y1="85" x2="90" y2="100" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />
        <line x1="100" y1="85" x2="110" y2="100" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />

        {/* Lightbulb representing ideas/insights */}
        <path d="M100 145 L95 155 L105 155 Z" fill="url(#lightGradient)" />
        <rect x="92" y="155" width="16" height="8" rx="2" fill="url(#lightGradient)" />

        {/* Sparkles representing critical insights */}
        <path
          d="M65 50 L67 55 L72 53 L67 58 L65 63 L63 58 L58 53 L63 55 Z"
          fill="#fbbf24"
          opacity="0.8"
        />
        <path
          d="M135 50 L137 55 L142 53 L137 58 L135 63 L133 58 L128 53 L133 55 Z"
          fill="#fbbf24"
          opacity="0.8"
        />
        <path
          d="M50 100 L52 105 L57 103 L52 108 L50 113 L48 108 L43 103 L48 105 Z"
          fill="#60a5fa"
          opacity="0.7"
        />
        <path
          d="M150 100 L152 105 L157 103 L152 108 L150 113 L148 108 L143 103 L148 105 Z"
          fill="#60a5fa"
          opacity="0.7"
        />
      </svg>
      {showText && <span className="logo__text">Criticus</span>}
    </>
  );


  return <div className={`logo ${className}`}>{logoContent}</div>;
};

export default Logo;

