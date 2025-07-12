import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CardHeader, 
  CardTitle, 
  CardDescription,
  AnimatedCard,
  Heading,
  Text,
  WelcomeCard,
  OnboardingTour,
  SecurityBadge,
  Tooltip,
  HelpButton
} from '../components/ui';
import { Icons } from '../styles/icons';

const Home: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // For debugging: force show welcome card (remove this line in production)
    localStorage.removeItem('devutils-visited');
    setShowWelcome(true);
  }, []);

  const handleGetStarted = () => {
    setShowWelcome(false);
    setShowOnboarding(true);
    localStorage.setItem('devutils-visited', 'true');
  };

  const handleSkipWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('devutils-visited', 'true');
  };

  const onboardingSteps = [
    {
      id: 'tools-overview',
      title: 'Developer Tools Overview',
      description: 'These are professional-grade tools for JSON processing, JWT analysis, and secure encryption.',
      position: 'center' as const
    },
    {
      id: 'security-trust',
      title: 'Enterprise Security',
      description: 'All processing happens locally in your browser. Your data never leaves your device.',
      position: 'center' as const
    },
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Click on any tool card to begin. Each tool has guided workflows and helpful tooltips.',
      position: 'center' as const
    }
  ];

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
      <div className="text-center mb-8 space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Heading 
            size="h1" 
            gradient="enterprise"
            className="animate-fade-in"
          >
            Developer Utilities
          </Heading>
          <Tooltip content="Learn more about our enterprise-grade security and features">
            <HelpButton 
              onClick={() => setShowOnboarding(true)}
              className="ml-2"
            />
          </Tooltip>
        </div>
        
        <Text 
          size="base" 
          color="secondary" 
          className="animate-slide-in max-w-xl mx-auto"
        >
          Professional JSON, JWT, and encryption tools with enterprise security
        </Text>
        
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <SecurityBadge variant="secure" size="sm">
            100% Local
          </SecurityBadge>
          <SecurityBadge variant="encrypted" size="sm">
            Zero Data Collection
          </SecurityBadge>
          <SecurityBadge variant="verified" size="sm">
            Enterprise Ready
          </SecurityBadge>
        </div>
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
                className="h-full border-border-primary hover:border-primary-200 glass-card"
                animation="hover"
                shadow="glass"
                withRipple
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`${tool.color} p-3 rounded-xl btn-enterprise shadow-lg`}>
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

      {/* Welcome Card for First-Time Users */}
      {showWelcome && (
        <WelcomeCard
          title="Welcome to Developer Utilities"
          description="Professional-grade tools designed for developers who demand security, reliability, and beautiful interfaces."
          features={[
            "100% client-side processing",
            "Enterprise-grade security",
            "Beautiful, responsive interface",
            "No data collection or tracking"
          ]}
          onGetStarted={handleGetStarted}
          onSkip={handleSkipWelcome}
          illustration={<Icons.Enterprise size={64} className="text-primary-500" />}
        />
      )}

      {/* Onboarding Tour */}
      <OnboardingTour
        steps={onboardingSteps}
        isActive={showOnboarding}
        onComplete={() => setShowOnboarding(false)}
        onSkip={() => setShowOnboarding(false)}
        showProgress={true}
        showSkip={true}
      />
    </div>
  );
};

export default Home;