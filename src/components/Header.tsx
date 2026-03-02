import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { Icons } from '../styles/icons';
import { useResponsive } from '../hooks/useResponsive';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isMobile } = useResponsive();
  const location = useLocation();

  const isHome = location.pathname === '/';

  const navigationItems = [
    { path: '/json-validator', label: 'JSON Validator', icon: Icons.Json, color: 'pink' },
    { path: '/json-minifier', label: 'JSON Minifier', icon: Icons.Compress, color: 'teal' },
    { path: '/jwt-decoder', label: 'JWT Decoder', icon: Icons.Jwt, color: 'mauve' },
    { path: '/jasypt', label: 'Jasypt', icon: Icons.Encrypt, color: 'green' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const getActiveStyles = (color: string) => ({
    background: `var(--${color})`,
    color: 'var(--crust)',
  });

  return (
    <header className="glass-strong border-b border-surface1/50 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-mauve to-pink flex items-center justify-center shadow-lg group-hover:shadow-glow-mauve transition-shadow duration-300">
                <Icons.Home size={18} className="text-crust" />
              </div>
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-mauve to-pink opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300" />
            </div>
            <span className="text-lg font-bold text-text tracking-tight">
              DevUtils
            </span>
          </Link>

          {/* Desktop Navigation */}
          {!isHome && (
            <nav className="hidden md:flex items-center gap-1.5">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium
                    transition-all duration-200
                    ${isActive(item.path)
                      ? ''
                      : 'text-subtext1 hover:text-text hover:bg-surface0/50'
                    }
                  `}
                  style={isActive(item.path) ? getActiveStyles(item.color) : undefined}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Mobile menu button */}
            {isMobile && !isHome && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2.5 rounded-xl text-subtext1 hover:text-text hover:bg-surface0/50 transition-all duration-200"
                aria-label="Toggle mobile menu"
              >
                <Icons.Menu size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobile && isMobileMenuOpen && !isHome && (
          <div className="md:hidden border-t border-surface1/50 py-3 animate-slide-down">
            <nav className="flex flex-col gap-1.5">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                    transition-all duration-200
                    ${isActive(item.path)
                      ? ''
                      : 'text-subtext1 hover:text-text hover:bg-surface0/50'
                    }
                  `}
                  style={isActive(item.path) ? getActiveStyles(item.color) : undefined}
                >
                  <item.icon size={18} />
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
