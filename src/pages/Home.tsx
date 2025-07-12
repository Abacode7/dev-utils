import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CardHeader, 
  CardTitle, 
  CardDescription,
  AnimatedCard,
  Heading,
  Text,
  StatusMessage
} from '../components/ui';
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
      <div className="text-center mb-12 space-y-6">
        <Heading 
          size="h1" 
          gradient="enterprise"
          className="animate-fade-in"
        >
          Developer Utilities
        </Heading>
        <Text 
          size="lg" 
          color="secondary" 
          className="animate-slide-in"
        >
          Enterprise-grade tools for developers - JSON validation, JWT decoding, and secure encryption
        </Text>
        
        <StatusMessage 
          variant="info" 
          className="max-w-xl mx-auto animate-bounce-in"
          icon={<Icons.Enterprise className="w-5 h-5" />}
        >
          <strong>Production Ready:</strong> Professional UI with glassmorphism effects and smooth animations.
        </StatusMessage>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {tools.map((tool) => {
          const IconComponent = tool.icon;
          return (
            <Link
              key={tool.path}
              to={tool.path}
              className="block"
            >
              <AnimatedCard 
                className="h-full border-border-primary hover:border-primary-200"
                animation="hover"
                shadow="lg"
                withRipple
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`${tool.color} p-3 rounded-xl bg-gradient-to-br from-surface-secondary to-surface-tertiary shadow-elevation1`}>
                      <IconComponent size={24} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold">{tool.name}</CardTitle>
                      <CardDescription className="mt-1 text-text-tertiary">
                        {tool.description}
                      </CardDescription>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Icons.Play size={16} className="text-primary-500" />
                    </div>
                  </div>
                </CardHeader>
              </AnimatedCard>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Home;