import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icons } from '../styles/icons';

interface ToolInfo {
  name: string;
  description: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  category: string;
}

interface ToolSidebarProps {
  className?: string;
}

const ToolSidebar: React.FC<ToolSidebarProps> = ({
  className = '',
}) => {
  const location = useLocation();

  const tools: ToolInfo[] = [
    {
      name: 'JSON Validator',
      description: 'Validate and format JSON',
      path: '/json-validator',
      icon: Icons.Json,
      category: 'Data Processing'
    },
    {
      name: 'JSON Minifier',
      description: 'Compress JSON data',
      path: '/json-minifier',
      icon: Icons.Compress,
      category: 'Data Processing'
    },
    {
      name: 'JWT Decoder',
      description: 'Decode JWT tokens',
      path: '/jwt-decoder',
      icon: Icons.Jwt,
      category: 'Security'
    },
    {
      name: 'Jasypt Encryption',
      description: 'Encrypt and decrypt text',
      path: '/jasypt',
      icon: Icons.Encrypt,
      category: 'Security'
    }
  ];

  const groupedTools = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, ToolInfo[]>);

  // Get tool accent color
  const getToolAccent = (path: string) => {
    switch (path) {
      case '/json-validator': return 'var(--pink)';
      case '/json-minifier': return 'var(--teal)';
      case '/jwt-decoder': return 'var(--mauve)';
      case '/jasypt': return 'var(--green)';
      default: return 'var(--mauve)';
    }
  };

  return (
    <div
      className={`h-full ${className}`}
      style={{ background: 'transparent' }}
    >
      <div className="px-4 py-2">
        <div className="space-y-6">
          {Object.entries(groupedTools).map(([category, categoryTools]) => (
            <div key={category}>
              <h3
                className="text-[11px] font-semibold uppercase tracking-widest mb-3 px-3"
                style={{ color: 'var(--overlay1)' }}
              >
                {category}
              </h3>
              <div className="space-y-1">
                {categoryTools.map((tool) => {
                  const IconComponent = tool.icon;
                  const isActive = location.pathname === tool.path;
                  const accentColor = getToolAccent(tool.path);

                  return (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className="flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative"
                      style={{
                        background: isActive ? 'var(--surface0)' : 'transparent',
                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                        boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'var(--surface0)';
                          e.currentTarget.style.transform = 'translateX(4px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }
                      }}
                      aria-label={`Navigate to ${tool.name} tool`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full"
                          style={{ background: accentColor }}
                        />
                      )}
                      <div
                        className="p-1.5 rounded-lg transition-all duration-200"
                        style={{
                          background: isActive ? `color-mix(in srgb, ${accentColor} 15%, transparent)` : 'transparent',
                        }}
                      >
                        <IconComponent
                          size={16}
                          style={{ color: isActive ? accentColor : 'var(--overlay1)' }}
                        />
                      </div>
                      <span className="text-sm font-medium">{tool.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToolSidebar;
