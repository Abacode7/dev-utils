import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { Icons } from '../styles/icons';

const Header: React.FC = () => {
  return (
    <header className="bg-surface-primary border-b border-border-primary shadow-sm">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors font-display"
        >
          <Icons.Home size={24} />
          <span>DevUtils</span>
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <Link 
            to="/json-validator" 
            className="text-text-secondary hover:text-primary-600 transition-colors font-medium"
          >
            JSON Validator
          </Link>
          <Link 
            to="/json-minifier" 
            className="text-text-secondary hover:text-primary-600 transition-colors font-medium"
          >
            JSON Minifier
          </Link>
          <Link 
            to="/jwt-decoder" 
            className="text-text-secondary hover:text-primary-600 transition-colors font-medium"
          >
            JWT Decoder
          </Link>
          <Link 
            to="/jasypt" 
            className="text-text-secondary hover:text-primary-600 transition-colors font-medium"
          >
            Jasypt
          </Link>
        </nav>
        
        <div className="flex items-center space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;