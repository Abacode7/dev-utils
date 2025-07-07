import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui';
import { Icons } from '../styles/icons';

const Home: React.FC = () => {
  const tools = [
    {
      name: 'JSON Validator & Formatter',
      description: 'Validate and format JSON with syntax highlighting',
      path: '/json-validator',
      icon: Icons.Json,
      color: 'text-primary-600'
    },
    {
      name: 'JSON Minifier',
      description: 'Compress JSON by removing whitespace',
      path: '/json-minifier',
      icon: Icons.Compress,
      color: 'text-secondary-600'
    },
    {
      name: 'JWT Decoder',
      description: 'Decode and analyze JWT tokens',
      path: '/jwt-decoder',
      icon: Icons.Jwt,
      color: 'text-warning-600'
    },
    {
      name: 'Jasypt Encryption',
      description: 'Encrypt and decrypt text using Jasypt',
      path: '/jasypt',
      icon: Icons.Encrypt,
      color: 'text-success-600'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-text-primary mb-4 font-display">
          Developer Utilities
        </h1>
        <p className="text-lg text-text-secondary">
          Essential tools for developers - JSON validation, JWT decoding, and more
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {tools.map((tool) => {
          const IconComponent = tool.icon;
          return (
            <Link
              key={tool.path}
              to={tool.path}
              className="block transition-all duration-200 hover:scale-105"
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-200 border-border-primary hover:border-primary-200">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`${tool.color} p-2 rounded-lg bg-surface-secondary`}>
                      <IconComponent size={24} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {tool.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Home;