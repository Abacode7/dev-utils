import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { Button } from './ui';
import { Icons } from '../styles/icons';

const ThemeToggle: React.FC = () => {
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  const getIcon = () => {
    if (theme === 'system') {
      return resolvedTheme === 'dark' ? Icons.Moon : Icons.Sun;
    }
    return theme === 'dark' ? Icons.Moon : Icons.Sun;
  };

  const getLabel = () => {
    if (theme === 'system') {
      return `System (${resolvedTheme})`;
    }
    return theme === 'dark' ? 'Dark' : 'Light';
  };

  const IconComponent = getIcon();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} mode`}
      title={`Current: ${getLabel()}`}
    >
      <IconComponent size={18} />
    </Button>
  );
};

export default ThemeToggle;