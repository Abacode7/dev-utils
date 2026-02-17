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
    { path: '/json-validator', label: 'JSON Validator', icon: Icons.Json },
    { path: '/json-minifier', label: 'JSON Minifier', icon: Icons.Compress },
    { path: '/jwt-decoder', label: 'JWT Decoder', icon: Icons.Jwt },
    { path: '/jasypt', label: 'Jasypt', icon: Icons.Encrypt },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className="backdrop-blur-lg border-b sticky top-0 z-50 bg-white/80 dark:bg-[#09090b]/80"
      style={{ borderColor: 'var(--border-default)' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Icons.Home size={18} className="text-white" />
            </div>
            <span className="text-lg font-semibold text-neutral-900 dark:text-white tracking-tight">
              DevUtils
            </span>
          </Link>

          {/* Desktop Navigation */}
          {!isHome && (
            <nav className="hidden md:flex items-center gap-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                    transition-colors duration-150
                    ${isActive(item.path)
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }
                  `}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Mobile menu button */}
            {isMobile && !isHome && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Toggle mobile menu"
              >
                <Icons.Menu size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobile && isMobileMenuOpen && !isHome && (
          <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 py-3">
            <nav className="flex flex-col gap-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-colors duration-150
                    ${isActive(item.path)
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }
                  `}
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
