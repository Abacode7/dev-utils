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
      accentColor: 'pink',
      glowClass: 'hover:shadow-glow-pink',
      borderClass: 'hover:border-pink',
      iconBg: 'bg-pink/10 group-hover:bg-pink/20',
      iconColor: 'text-pink',
    },
    {
      name: 'JSON Minifier',
      description: 'Compress JSON by removing whitespace with size comparison metrics.',
      path: '/json-minifier',
      icon: Icons.Compress,
      accentColor: 'teal',
      glowClass: 'hover:shadow-glow-teal',
      borderClass: 'hover:border-teal',
      iconBg: 'bg-teal/10 group-hover:bg-teal/20',
      iconColor: 'text-teal',
    },
    {
      name: 'JWT Decoder',
      description: 'Decode and analyze JWT tokens with signature verification.',
      path: '/jwt-decoder',
      icon: Icons.Jwt,
      accentColor: 'mauve',
      glowClass: 'hover:shadow-glow-mauve',
      borderClass: 'hover:border-mauve',
      iconBg: 'bg-mauve/10 group-hover:bg-mauve/20',
      iconColor: 'text-mauve',
    },
    {
      name: 'Jasypt Encryption',
      description: 'Encrypt and decrypt text using production-grade Jasypt algorithms.',
      path: '/jasypt',
      icon: Icons.Encrypt,
      accentColor: 'green',
      glowClass: 'hover:shadow-glow-green',
      borderClass: 'hover:border-green',
      iconBg: 'bg-green/10 group-hover:bg-green/20',
      iconColor: 'text-green',
    }
  ];

  const features = [
    {
      icon: Icons.Shield,
      title: '100% Local',
      description: 'All processing happens in your browser',
      gradient: 'from-teal/20 to-sky/20',
    },
    {
      icon: Icons.Lock,
      title: 'No Data Collection',
      description: 'Your data never leaves your device',
      gradient: 'from-mauve/20 to-pink/20',
    },
    {
      icon: Icons.Check,
      title: 'Enterprise Ready',
      description: 'Production-grade security tools',
      gradient: 'from-green/20 to-teal/20',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-pink/20 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-mauve/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal/10 rounded-full blur-3xl animate-glow-pulse" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass mb-8 animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green"></span>
            </span>
            <span className="text-sm font-medium text-subtext1">Open Source Developer Tools</span>
          </div>

          {/* Main heading */}
          <h1
            className="text-6xl md:text-7xl font-bold tracking-tight mb-6 animate-slide-up opacity-0"
            style={{ animationDelay: '0.2s' }}
          >
            <span className="text-text">Developer</span>
            <br />
            <span className="gradient-text-animated">Utilities</span>
          </h1>

          {/* Description */}
          <p
            className="text-xl md:text-2xl text-subtext1 max-w-2xl mx-auto leading-relaxed animate-slide-up opacity-0"
            style={{ animationDelay: '0.3s' }}
          >
            Professional tools for JSON processing, JWT analysis, and encryption.
            <span className="block mt-2 text-subtext0">All processing happens locally in your browser.</span>
          </p>

          {/* Quick action buttons */}
          <div
            className="flex flex-wrap justify-center gap-4 mt-10 animate-slide-up opacity-0"
            style={{ animationDelay: '0.4s' }}
          >
            <Link
              to="/json-validator"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-mauve text-crust font-semibold
                       transition-all duration-300 hover:scale-105 hover:shadow-glow-mauve"
            >
              Get Started
              <Icons.ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass font-semibold text-text
                       transition-all duration-300 hover:bg-surface1/50"
            >
              <Icons.Globe size={18} />
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="relative max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          {tools.map((tool, index) => {
            const IconComponent = tool.icon;
            return (
              <Link
                key={tool.path}
                to={tool.path}
                className="group block animate-slide-up opacity-0"
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                <div
                  className={`
                    relative overflow-hidden rounded-2xl p-6
                    glass border border-surface1/50
                    ${tool.glowClass} ${tool.borderClass}
                    transition-all duration-500 ease-out
                    hover:-translate-y-2 hover:scale-[1.02]
                  `}
                >
                  {/* Hover glow effect */}
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    style={{
                      background: `radial-gradient(circle at 50% 50%, var(--${tool.accentColor}) 0%, transparent 70%)`,
                      opacity: 0,
                      filter: 'blur(60px)',
                    }}
                  />

                  <div className="relative flex items-start gap-5">
                    {/* Icon */}
                    <div className={`
                      flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center
                      ${tool.iconBg}
                      border border-transparent group-hover:border-current/20
                      transition-all duration-300
                    `}>
                      <IconComponent
                        size={26}
                        className={`${tool.iconColor} transition-transform duration-300 group-hover:scale-110`}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-text group-hover:text-rosewater transition-colors">
                        {tool.name}
                      </h3>
                      <p className="mt-2 text-sm text-subtext0 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                      <div className={`w-10 h-10 rounded-xl ${tool.iconBg} flex items-center justify-center`}>
                        <Icons.ArrowRight size={18} className={tool.iconColor} />
                      </div>
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(90deg, transparent 0%, var(--${tool.accentColor}) 50%, transparent 100%)` }}
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Features */}
        <div className="mt-24">
          <div
            className="text-center mb-12 animate-slide-up opacity-0"
            style={{ animationDelay: '0.9s' }}
          >
            <h2 className="text-2xl font-bold text-text mb-3">Built for Privacy</h2>
            <p className="text-subtext0">Your data stays on your device. Always.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 rounded-2xl glass border border-surface1/30 animate-slide-up opacity-0"
                  style={{ animationDelay: `${1 + index * 0.1}s` }}
                >
                  <div
                    className={`
                      inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5
                      bg-gradient-to-br ${feature.gradient}
                      border border-surface1/50
                    `}
                  >
                    <IconComponent size={24} className="text-text" />
                  </div>
                  <h3 className="text-base font-bold text-text mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-subtext0 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer accent */}
        <div className="mt-24 text-center animate-fade-in opacity-0" style={{ animationDelay: '1.3s' }}>
          <div className="inline-flex items-center gap-3 text-sm text-subtext0">
            <span className="w-12 h-px bg-gradient-to-r from-transparent to-surface1" />
            <span>Crafted with care for developers</span>
            <span className="w-12 h-px bg-gradient-to-l from-transparent to-surface1" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
