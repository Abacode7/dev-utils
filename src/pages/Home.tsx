import React from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../styles/icons';

const Home: React.FC = () => {
  const tools = [
    {
      name: 'JSON Validator',
      description: 'Validate and format JSON with syntax highlighting and real-time error detection.',
      path: '/json-validator',
      icon: Icons.Json,
      colorClasses: {
        border: 'border-blue-200 hover:border-blue-300',
        iconBg: 'bg-blue-100 group-hover:bg-blue-500',
        text: 'text-blue-600',
      },
    },
    {
      name: 'JSON Minifier',
      description: 'Compress JSON by removing whitespace with size comparison metrics.',
      path: '/json-minifier',
      icon: Icons.Compress,
      colorClasses: {
        border: 'border-cyan-200 hover:border-cyan-300',
        iconBg: 'bg-cyan-100 group-hover:bg-cyan-500',
        text: 'text-cyan-600',
      },
    },
    {
      name: 'JWT Decoder',
      description: 'Decode and analyze JWT tokens with signature verification.',
      path: '/jwt-decoder',
      icon: Icons.Jwt,
      colorClasses: {
        border: 'border-violet-200 hover:border-violet-300',
        iconBg: 'bg-violet-100 group-hover:bg-violet-500',
        text: 'text-violet-600',
      },
    },
    {
      name: 'Jasypt Encryption',
      description: 'Encrypt and decrypt text using production-grade Jasypt algorithms.',
      path: '/jasypt',
      icon: Icons.Encrypt,
      colorClasses: {
        border: 'border-emerald-200 hover:border-emerald-300',
        iconBg: 'bg-emerald-100 group-hover:bg-emerald-500',
        text: 'text-emerald-600',
      },
    }
  ];

  const features = [
    {
      icon: Icons.Shield,
      title: '100% Local',
      description: 'All processing happens in your browser',
    },
    {
      icon: Icons.Lock,
      title: 'No Data Collection',
      description: 'Your data never leaves your device',
    },
    {
      icon: Icons.Check,
      title: 'Enterprise Ready',
      description: 'Production-grade security tools',
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Hero Section */}
      <section style={{ borderBottom: '1px solid var(--border-default)' }}>
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Open Source Developer Tools
          </div>
          <h1 className="text-5xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Developer Utilities
          </h1>
          <p className="mt-6 text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Professional tools for JSON processing, JWT analysis, and encryption.
            All processing happens locally in your browser.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-5">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <Link
                key={tool.path}
                to={tool.path}
                className="group block"
              >
                <div
                  className={`
                    relative overflow-hidden rounded-2xl border p-6
                    ${tool.colorClasses.border}
                    shadow-sm hover:shadow-lg
                    transition-all duration-300 ease-out
                    hover:-translate-y-1
                  `}
                  style={{ background: 'var(--bg-primary)' }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`
                      flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
                      ${tool.colorClasses.iconBg}
                      transition-colors duration-300
                    `}>
                      <IconComponent
                        size={24}
                        className={`${tool.colorClasses.text} group-hover:text-white transition-colors duration-300`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {tool.name}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {tool.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      <Icons.ArrowRight size={20} className={tool.colorClasses.text} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Features */}
        <div className="mt-20 pt-12" style={{ borderTop: '1px solid var(--border-default)' }}>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
                    style={{ background: 'var(--bg-tertiary)' }}
                  >
                    <IconComponent size={24} className="text-neutral-500" />
                  </div>
                  <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
