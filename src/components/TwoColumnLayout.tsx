import React from 'react';
import { useResponsive } from '../hooks/useResponsive';

interface TwoColumnLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  sidebarWidth?: 'sm' | 'md' | 'lg';
  collapsible?: boolean;
  className?: string;
}

const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({
  children,
  sidebar,
  sidebarWidth = 'md',
  collapsible = true,
  className = '',
}) => {
  const { isMobile } = useResponsive();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(!isMobile);

  const sidebarWidthClasses = {
    sm: 'w-64',
    md: 'w-80',
    lg: 'w-96',
  };

  // Auto-close sidebar on mobile when route changes
  React.useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`flex h-full min-h-screen bg-background-primary ${className}`}>
      {/* Sidebar */}
      <div
        className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'}
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          ${sidebarWidthClasses[sidebarWidth]}
          transition-transform duration-300 ease-in-out
          bg-surface-secondary border-r border-border-primary
          shadow-lg lg:shadow-none
        `}
      >
        {/* Sidebar Header */}
        {collapsible && (
          <div className="flex items-center justify-between p-4 border-b border-border-primary">
            <h2 className="text-lg font-semibold text-text-primary font-display">
              Tools
            </h2>
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-primary transition-colors"
                aria-label="Close sidebar"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto">
          {sidebar}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header with Sidebar Toggle */}
        {isMobile && collapsible && (
          <div className="flex items-center p-4 border-b border-border-primary bg-surface-primary">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors mr-3"
              aria-label="Open sidebar"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-text-primary font-display">
              Developer Tools
            </h1>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoColumnLayout;