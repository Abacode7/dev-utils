import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icons } from '../styles/icons';

interface ToolInfo {
  name: string;
  description: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  category: string;
  shortcut: string;
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
      category: 'Data Processing',
      shortcut: '⌘1',
    },
    {
      name: 'JSON Minifier',
      description: 'Compress JSON data',
      path: '/json-minifier',
      icon: Icons.Compress,
      category: 'Data Processing',
      shortcut: '⌘2',
    },
    {
      name: 'JWT Decoder',
      description: 'Decode JWT tokens',
      path: '/jwt-decoder',
      icon: Icons.Jwt,
      category: 'Security',
      shortcut: '⌘3',
    },
    {
      name: 'Jasypt Encryption',
      description: 'Encrypt and decrypt text',
      path: '/jasypt',
      icon: Icons.Encrypt,
      category: 'Security',
      shortcut: '⌘4',
    }
  ];

  const groupedTools = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, ToolInfo[]>);

  // Get tool accent color and glow
  const getToolStyles = (path: string) => {
    switch (path) {
      case '/json-validator': return { color: 'var(--pink)', glow: 'var(--glow-pink)' };
      case '/json-minifier': return { color: 'var(--teal)', glow: 'var(--glow-teal)' };
      case '/jwt-decoder': return { color: 'var(--mauve)', glow: 'var(--glow-mauve)' };
      case '/jasypt': return { color: 'var(--green)', glow: 'var(--glow-green)' };
      default: return { color: 'var(--mauve)', glow: 'var(--glow-mauve)' };
    }
  };

  return (
    <div
      className={`h-full ${className}`}
      style={{ background: 'transparent' }}
    >
      <div className="px-5 py-4">
        <div className="space-y-8">
          {Object.entries(groupedTools).map(([category, categoryTools]) => (
            <div key={category}>
              {/* Category header with subtle divider */}
              <div className="flex items-center gap-3 mb-4 px-3">
                <h3
                  className="text-[11px] font-bold uppercase tracking-widest"
                  style={{ color: 'var(--overlay1)' }}
                >
                  {category}
                </h3>
                <div className="flex-1 h-px" style={{ background: 'var(--surface1)' }} />
              </div>

              <div className="space-y-2">
                {categoryTools.map((tool) => {
                  const IconComponent = tool.icon;
                  const isActive = location.pathname === tool.path;
                  const styles = getToolStyles(tool.path);

                  return (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className="flex items-center gap-3 px-3 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden"
                      style={{
                        background: isActive
                          ? `color-mix(in srgb, ${styles.color} 12%, transparent)`
                          : 'transparent',
                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                        boxShadow: isActive ? styles.glow : 'none',
                        border: isActive
                          ? `1px solid color-mix(in srgb, ${styles.color} 25%, transparent)`
                          : '1px solid transparent',
                      }}
                      aria-label={`Navigate to ${tool.name} tool`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {/* Active glow background */}
                      {isActive && (
                        <div
                          className="absolute inset-0 opacity-30 pointer-events-none"
                          style={{
                            background: `radial-gradient(circle at 0% 50%, ${styles.color} 0%, transparent 60%)`,
                          }}
                        />
                      )}

                      {/* Active indicator bar with glow */}
                      {isActive && (
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
                          style={{
                            background: styles.color,
                            boxShadow: `0 0 12px ${styles.color}`,
                          }}
                        />
                      )}

                      {/* Icon container */}
                      <div
                        className="relative p-2 rounded-xl transition-all duration-300 group-hover:scale-110"
                        style={{
                          background: isActive
                            ? `color-mix(in srgb, ${styles.color} 20%, transparent)`
                            : 'var(--surface0)',
                        }}
                      >
                        <IconComponent
                          size={18}
                          style={{ color: isActive ? styles.color : 'var(--overlay1)' }}
                        />
                      </div>

                      {/* Tool name */}
                      <span
                        className="flex-1 text-sm font-medium transition-colors duration-200"
                        style={{ color: isActive ? 'var(--text)' : 'var(--subtext1)' }}
                      >
                        {tool.name}
                      </span>

                      {/* Keyboard shortcut hint */}
                      <span
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{
                          background: 'var(--surface0)',
                          color: 'var(--subtext0)',
                        }}
                      >
                        {tool.shortcut}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Quick tips at bottom */}
        <div
          className="mt-10 pt-6"
          style={{ borderTop: '1px solid var(--surface1)' }}
        >
          <div className="px-3">
            <p className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color: 'var(--overlay0)' }}>
              Quick Tips
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--subtext0)' }}>
                <kbd
                  className="px-1.5 py-0.5 rounded text-[10px] font-mono"
                  style={{ background: 'var(--surface0)', color: 'var(--subtext1)' }}
                >
                  ?
                </kbd>
                <span>View all shortcuts</span>
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--subtext0)' }}>
                <kbd
                  className="px-1.5 py-0.5 rounded text-[10px] font-mono"
                  style={{ background: 'var(--surface0)', color: 'var(--subtext1)' }}
                >
                  ⌘K
                </kbd>
                <span>Quick navigation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolSidebar;
