import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icons } from '../styles/icons';

interface ToolInfo {
  name: string;
  description: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  category: string;
  features: string[];
  complexity: 'Basic' | 'Intermediate' | 'Advanced';
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
      description: 'Validate and format JSON with syntax highlighting',
      path: '/json-validator',
      icon: Icons.Json,
      category: 'Data Processing',
      features: ['Syntax Validation', 'Auto-formatting', 'Error Detection', 'File Upload'],
      complexity: 'Basic'
    },
    {
      name: 'JSON Minifier',
      description: 'Compress JSON by removing whitespace',
      path: '/json-minifier',
      icon: Icons.Compress,
      category: 'Data Processing',
      features: ['Size Reduction', 'Download Output', 'Comparison View', 'Batch Processing'],
      complexity: 'Basic'
    },
    {
      name: 'JWT Decoder',
      description: 'Decode and analyze JWT tokens',
      path: '/jwt-decoder',
      icon: Icons.Jwt,
      category: 'Security',
      features: ['Token Parsing', 'Signature Verification', 'Expiry Validation', 'Header Analysis'],
      complexity: 'Intermediate'
    },
    {
      name: 'Jasypt Encryption',
      description: 'Encrypt and decrypt text using Jasypt',
      path: '/jasypt',
      icon: Icons.Encrypt,
      category: 'Security',
      features: ['AES Encryption', 'Password Strength', 'Algorithm Selection', 'Secure Comparison'],
      complexity: 'Advanced'
    }
  ];

  const getCurrentTool = () => {
    return tools.find(tool => tool.path === location.pathname);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Basic':
        return 'text-success-600 bg-success-50';
      case 'Intermediate':
        return 'text-warning-600 bg-warning-50';
      case 'Advanced':
        return 'text-error-600 bg-error-50';
      default:
        return 'text-neutral-600 bg-neutral-50';
    }
  };

  const groupedTools = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, ToolInfo[]>);

  const currentToolInfo = getCurrentTool();

  return (
    <div className={`h-full flex flex-col glass-card shadow-glass ${className}`}>
      {/* Tool Navigation */}
      <div className="flex-1 p-6">
        <div className="space-y-6">
          {Object.entries(groupedTools).map(([category, categoryTools]) => (
            <div key={category} className="animate-slide-in">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-3 font-display text-gradient-enterprise">
                {category}
              </h3>
              <div className="space-y-2">
                {categoryTools.map((tool) => {
                  const IconComponent = tool.icon;
                  const isActive = location.pathname === tool.path;
                  
                  return (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className={`
                        group flex items-start space-x-3 p-3 rounded-lg transition-all duration-200 glass-elevated
                        ${isActive 
                          ? 'btn-enterprise shadow-glow animate-glow-pulse' 
                          : 'btn-glass hover:shadow-glass'
                        }
                      `}
                      aria-label={`Navigate to ${tool.name} tool`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <div className={`
                        p-2 rounded-md transition-colors
                        ${isActive 
                          ? 'bg-primary-100 text-primary-600' 
                          : 'bg-surface-primary text-text-secondary group-hover:text-primary-600 group-hover:bg-primary-50'
                        }
                      `}>
                        <IconComponent size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className={`
                            text-sm font-bold truncate font-display
                            ${isActive ? 'text-white' : 'text-text-primary group-hover:text-primary-600'}
                          `}>
                            {tool.name}
                          </h4>
                          <span className={`
                            px-2 py-0.5 text-xs font-medium rounded-full
                            ${getComplexityColor(tool.complexity)}
                          `}>
                            {tool.complexity}
                          </span>
                        </div>
                        <p className="text-xs text-text-tertiary mt-1 line-clamp-2">
                          {tool.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Tool Context */}
      {currentToolInfo && (
        <div className="border-t border-border-primary p-6 glass-elevated animate-slide-in">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 btn-enterprise rounded-md shadow-glow">
                <currentToolInfo.icon size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-primary font-display">
                  {currentToolInfo.name}
                </h3>
                <p className="text-xs text-text-tertiary">
                  {currentToolInfo.category}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
                Features
              </h4>
              <div className="space-y-1">
                {currentToolInfo.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary-400 rounded-full flex-shrink-0"></div>
                    <span className="text-xs text-text-secondary">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-border-secondary">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-tertiary">Complexity Level</span>
                <span className={`
                  px-2 py-1 font-medium rounded-full
                  ${getComplexityColor(currentToolInfo.complexity)}
                `}>
                  {currentToolInfo.complexity}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="border-t border-border-primary p-6 glass-card">
        <div className="space-y-3 animate-slide-in">
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider font-display">
            Quick Actions
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <button 
              className="btn-glass flex items-center justify-center space-x-1 px-3 py-2 text-xs font-medium rounded-md transition-all"
              aria-label="Open help documentation"
            >
              <Icons.Help size={12} />
              <span>Help</span>
            </button>
            <button 
              className="btn-glass flex items-center justify-center space-x-1 px-3 py-2 text-xs font-medium rounded-md transition-all"
              aria-label="Open application settings"
            >
              <Icons.Settings size={12} />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolSidebar;