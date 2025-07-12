import React from 'react';
import Header from './Header';
import ErrorBoundary from './ErrorBoundary';
import KeyboardShortcutsHelp from './KeyboardShortcutsHelp';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background-primary">
      <Header />
      <ErrorBoundary>
        <main className="w-full px-8 sm:px-12 md:px-16 lg:px-24 py-12">
          {children}
        </main>
      </ErrorBoundary>
      <KeyboardShortcutsHelp />
    </div>
  );
};

export default Layout;