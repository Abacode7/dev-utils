import React, { useState } from 'react';

interface SecureInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  showToggle?: boolean;
  disabled?: boolean;
  className?: string;
  onGenerate?: () => void;
}

const SecureInput: React.FC<SecureInputProps> = ({
  value,
  onChange,
  placeholder = 'Enter password...',
  label,
  showToggle = true,
  disabled = false,
  className = '',
  onGenerate
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleToggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type={isVisible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed font-mono text-sm"
          style={{ 
            fontFamily: isVisible ? 'ui-monospace, monospace' : 'text-security-disc, monospace',
            WebkitTextSecurity: isVisible ? 'none' : 'disc'
          } as React.CSSProperties}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Clear"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          {showToggle && (
            <button
              type="button"
              onClick={handleToggleVisibility}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title={isVisible ? 'Hide password' : 'Show password'}
            >
              {isVisible ? (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L15.536 15.536m-4.242-4.242L9.464 9.464" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
      
      {onGenerate && (
        <button
          type="button"
          onClick={onGenerate}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          Generate secure password
        </button>
      )}
    </div>
  );
};

export default SecureInput;