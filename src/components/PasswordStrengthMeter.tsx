import React from 'react';
import { type PasswordStrength } from '../utils/jasypt';

interface PasswordStrengthMeterProps {
  strength: PasswordStrength;
  className?: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ strength, className = '' }) => {
  const getStrengthColor = (score: number) => {
    if (score === 0) return 'bg-gray-200';
    if (score === 1) return 'bg-red-500';
    if (score === 2) return 'bg-orange-500';
    if (score === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return 'Very Weak';
    if (score === 1) return 'Weak';
    if (score === 2) return 'Fair';
    if (score === 3) return 'Good';
    return 'Strong';
  };

  const getTextColor = (score: number) => {
    if (score === 0) return 'text-gray-600';
    if (score === 1) return 'text-red-600';
    if (score === 2) return 'text-orange-600';
    if (score === 3) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Password Strength</span>
        <span className={`text-sm font-medium ${getTextColor(strength.score)}`}>
          {getStrengthText(strength.score)}
        </span>
      </div>
      
      <div className="flex space-x-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-2 flex-1 rounded ${
              level <= strength.score ? getStrengthColor(strength.score) : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      
      {strength.feedback.length > 0 && (
        <div className="space-y-1">
          {strength.feedback.map((feedback, index) => (
            <div
              key={index}
              className={`text-xs ${
                strength.isStrong && feedback === 'Strong password'
                  ? 'text-green-600'
                  : 'text-gray-600'
              }`}
            >
              {strength.isStrong && feedback === 'Strong password' ? '✓' : '•'} {feedback}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;