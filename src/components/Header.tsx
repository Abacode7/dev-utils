import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { Icons } from '../styles/icons';
import { useResponsive } from '../hooks/useResponsive';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isMobile } = useResponsive();
  const location = useLocation();

  const navigationItems = [
    { path: '/json-validator', label: 'JSON Validator', icon: Icons.Json },
    { path: '/json-minifier', label: 'JSON Minifier', icon: Icons.Compress },
    { path: '/jwt-decoder', label: 'JWT Decoder', icon: Icons.Jwt },
    { path: '/jasypt', label: 'Jasypt', icon: Icons.Encrypt },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-surface-primary border-b border-border-primary shadow-sm sticky top-0 z-header">
      <div className="w-full px-8 sm:px-12 md:px-16 lg:px-24">
        <div className="flex items-center justify-between py-4">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors font-display"
          >
            <Icons.Home size={24} />
            <span className="hidden xs:inline">DevUtils</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors font-medium ${
                  isActive(item.path)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-text-secondary hover:text-primary-600 hover:bg-neutral-50'
                }`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            
            {/* Mobile menu button */}
            {isMobile && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-text-secondary hover:text-primary-600 hover:bg-neutral-50 transition-colors touch-friendly"
                aria-label="Toggle mobile menu"
              >
                <Icons.Menu size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobile && isMobileMenuOpen && (
          <div className="md:hidden border-t border-border-primary bg-surface-secondary">
            <nav className="px-8 sm:px-12 md:px-16 lg:px-24 py-4 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors font-medium touch-friendly ${
                    isActive(item.path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-text-secondary hover:text-primary-600 hover:bg-neutral-50'
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;