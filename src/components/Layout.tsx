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
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </ErrorBoundary>
      <KeyboardShortcutsHelp />
    </div>
  );
};

export default Layout;