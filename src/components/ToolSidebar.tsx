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

  return (
    <div
      className={`h-full border-r ${className}`}
      style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-default)' }}
    >
      <div className="p-6">
        <div className="space-y-6">
          {Object.entries(groupedTools).map(([category, categoryTools]) => (
            <div key={category}>
              <h3
                className="text-xs font-semibold uppercase tracking-wider mb-3 px-3"
                style={{ color: 'var(--text-tertiary)' }}
              >
                {category}
              </h3>
              <div className="space-y-1">
                {categoryTools.map((tool) => {
                  const IconComponent = tool.icon;
                  const isActive = location.pathname === tool.path;

                  return (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className={`
                        flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors duration-150
                        ${isActive
                          ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                          : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        }
                      `}
                      aria-label={`Navigate to ${tool.name} tool`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <IconComponent
                        size={18}
                        className={isActive ? 'text-white dark:text-neutral-900' : 'text-neutral-500 dark:text-neutral-400'}
                      />
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
