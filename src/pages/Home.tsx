import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../styles/icons';

// Floating code snippet component for hero background
const FloatingCodeSnippet: React.FC<{
  code: string;
  delay: number;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  size?: 'sm' | 'md' | 'lg';
}> = ({ code, delay, position, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-1',
    md: 'text-xs px-3 py-2',
    lg: 'text-sm px-4 py-3',
  };

  return (
    <div
      className={`absolute font-mono ${sizeClasses[size]} rounded-lg glass opacity-40 animate-float pointer-events-none select-none`}
      style={{
        ...position,
        animationDelay: `${delay}s`,
        animationDuration: '8s',
      }}
    >
      <span className="text-pink">{code}</span>
    </div>
  );
};

// Animated bracket component
const AnimatedBracket: React.FC<{
  type: 'open' | 'close';
  delay: number;
  position: { top?: string; bottom?: string; left?: string; right?: string };
}> = ({ type, delay, position }) => (
  <div
    className="absolute text-4xl font-bold opacity-20 animate-float pointer-events-none select-none"
    style={{
      ...position,
      animationDelay: `${delay}s`,
      animationDuration: '6s',
      color: 'var(--mauve)',
    }}
  >
    {type === 'open' ? '{' : '}'}
  </div>
);

const Home: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      {/* Hero Section - Redesigned with asymmetric layout */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        {/* Animated gradient orbs - Enhanced */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-pink/25 rounded-full blur-[100px] animate-float" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-mauve/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-3s' }} />
          <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-teal/15 rounded-full blur-[80px] animate-glow-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue/10 rounded-full blur-[60px] animate-float" style={{ animationDelay: '-5s' }} />
        </div>

        {/* Floating code snippets - Background decoration */}
        {mounted && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
            <FloatingCodeSnippet
              code='{ "key": "value" }'
              delay={0}
              position={{ top: '15%', left: '8%' }}
              size="md"
            />
            <FloatingCodeSnippet
              code="eyJhbGciOiJIUzI1..."
              delay={2}
              position={{ top: '25%', right: '10%' }}
              size="sm"
            />
            <FloatingCodeSnippet
              code="ENC(AES256...)"
              delay={4}
              position={{ bottom: '30%', left: '5%' }}
              size="sm"
            />
            <FloatingCodeSnippet
              code='"valid": true'
              delay={1}
              position={{ bottom: '20%', right: '12%' }}
              size="md"
            />

            {/* Floating brackets */}
            <AnimatedBracket type="open" delay={0.5} position={{ top: '20%', left: '15%' }} />
            <AnimatedBracket type="close" delay={1.5} position={{ top: '35%', right: '18%' }} />
            <AnimatedBracket type="open" delay={2.5} position={{ bottom: '25%', right: '8%' }} />
            <AnimatedBracket type="close" delay={3.5} position={{ bottom: '40%', left: '12%' }} />
          </div>
        )}

        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24 w-full">
          {/* Asymmetric grid layout */}
          <div className="grid md:grid-cols-12 gap-8 items-center">
            {/* Left side - Main content (heavier visual weight) */}
            <div className="md:col-span-7 text-center md:text-left">
              {/* Badge */}
              <div
                className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass mb-8 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}
                style={{ animationDelay: '0.1s' }}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green"></span>
                </span>
                <span className="text-sm font-medium text-subtext1">Open Source Developer Tools</span>
              </div>

              {/* Main heading with enhanced typography */}
              <h1
                className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 ${mounted ? 'animate-slide-up' : ''} opacity-0`}
                style={{ animationDelay: '0.2s', lineHeight: 0.95 }}
              >
                <span className="text-text block">Developer</span>
                <span className="gradient-text-animated block mt-1">Utilities</span>
              </h1>

              {/* Description with better hierarchy */}
              <p
                className={`text-lg md:text-xl text-subtext1 max-w-xl leading-relaxed ${mounted ? 'animate-slide-up' : ''} opacity-0`}
                style={{ animationDelay: '0.3s' }}
              >
                Professional tools for <span className="text-pink font-semibold">JSON processing</span>,{' '}
                <span className="text-mauve font-semibold">JWT analysis</span>, and{' '}
                <span className="text-green font-semibold">encryption</span>.
              </p>
              <p
                className={`text-base text-subtext0 mt-3 ${mounted ? 'animate-slide-up' : ''} opacity-0`}
                style={{ animationDelay: '0.35s' }}
              >
                All processing happens locally in your browser — your data never leaves your device.
              </p>

              {/* Quick action buttons */}
              <div
                className={`flex flex-wrap justify-center md:justify-start gap-4 mt-10 ${mounted ? 'animate-slide-up' : ''} opacity-0`}
                style={{ animationDelay: '0.4s' }}
              >
                <Link
                  to="/json-validator"
                  className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-mauve text-crust font-semibold
                           transition-all duration-300 hover:scale-105 hover:shadow-glow-mauve"
                >
                  Get Started
                  <Icons.ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl glass font-semibold text-text
                           transition-all duration-300 hover:bg-surface1/50"
                >
                  <Icons.Globe size={18} />
                  View on GitHub
                </a>
              </div>
            </div>

            {/* Right side - Tool preview cards (lighter weight) */}
            <div className="md:col-span-5 hidden md:block">
              <div
                className={`relative ${mounted ? 'animate-slide-up' : ''} opacity-0`}
                style={{ animationDelay: '0.5s' }}
              >
                {/* Stacked preview cards */}
                <div className="relative h-80">
                  {/* Card 1 - JSON */}
                  <div className="absolute top-0 right-0 w-64 glass rounded-2xl p-4 transform rotate-3 hover:rotate-0 transition-transform duration-300 border border-pink/20">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-pink/20 flex items-center justify-center">
                        <Icons.Json size={16} className="text-pink" />
                      </div>
                      <span className="text-sm font-semibold text-text">JSON Validator</span>
                    </div>
                    <div className="font-mono text-xs text-subtext1 bg-surface0/50 rounded-lg p-3">
                      <span className="text-pink">{'{'}</span>
                      <span className="text-teal">"valid"</span>
                      <span className="text-subtext0">: </span>
                      <span className="text-green">true</span>
                      <span className="text-pink">{'}'}</span>
                    </div>
                  </div>

                  {/* Card 2 - JWT */}
                  <div className="absolute top-20 right-16 w-56 glass rounded-2xl p-4 transform -rotate-2 hover:rotate-0 transition-transform duration-300 border border-mauve/20">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-mauve/20 flex items-center justify-center">
                        <Icons.Jwt size={16} className="text-mauve" />
                      </div>
                      <span className="text-sm font-semibold text-text">JWT Decoder</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="px-2 py-1 text-[10px] rounded bg-red/20 text-red font-mono">header</span>
                      <span className="px-2 py-1 text-[10px] rounded bg-mauve/20 text-mauve font-mono">payload</span>
                      <span className="px-2 py-1 text-[10px] rounded bg-blue/20 text-blue font-mono">sig</span>
                    </div>
                  </div>

                  {/* Card 3 - Encryption */}
                  <div className="absolute top-44 right-8 w-52 glass rounded-2xl p-4 transform rotate-1 hover:rotate-0 transition-transform duration-300 border border-green/20">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-green/20 flex items-center justify-center">
                        <Icons.Encrypt size={16} className="text-green" />
                      </div>
                      <span className="text-sm font-semibold text-text">Jasypt</span>
                    </div>
                    <div className="text-xs text-subtext0">
                      <span className="text-green font-semibold">AES-256-GCM</span> encryption
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div
            className={`absolute bottom-8 left-1/2 -translate-x-1/2 ${mounted ? 'animate-fade-in' : ''} opacity-0 hidden md:flex flex-col items-center gap-2`}
            style={{ animationDelay: '1s' }}
          >
            <span className="text-xs text-subtext0 tracking-wider uppercase">Explore Tools</span>
            <div className="w-6 h-10 rounded-full border-2 border-surface2 flex justify-center pt-2">
              <div className="w-1.5 h-3 rounded-full bg-mauve animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid - Differentiated Cards */}
      <section className="relative max-w-6xl mx-auto px-6 py-16" id="tools">
        {/* Section header */}
        <div
          className={`text-center mb-12 ${mounted ? 'animate-slide-up' : ''} opacity-0`}
          style={{ animationDelay: '0.6s' }}
        >
          <h2 className="text-3xl font-bold text-text mb-3">Choose Your Tool</h2>
          <p className="text-subtext0">Each tool is designed for a specific workflow</p>
        </div>

        {/* Featured tool (JSON Validator) - larger card */}
        <div className="mb-6">
          <Link
            to="/json-validator"
            className={`group block ${mounted ? 'animate-slide-up' : ''} opacity-0`}
            style={{ animationDelay: '0.7s' }}
          >
            <div className="relative overflow-hidden rounded-3xl p-8 glass border border-pink/20 hover:border-pink/40 hover:shadow-glow-pink transition-all duration-500 ease-out hover:-translate-y-1">
              {/* Background pattern - JSON brackets */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
                <div className="absolute -right-10 -top-10 text-[200px] font-bold text-pink leading-none">{'{'}</div>
                <div className="absolute -left-10 -bottom-10 text-[200px] font-bold text-pink leading-none">{'}'}</div>
              </div>

              {/* Animated hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'radial-gradient(circle at 30% 50%, rgba(234, 118, 203, 0.1) 0%, transparent 50%)' }} />

              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                {/* Left content */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-pink/15 flex items-center justify-center group-hover:scale-110 group-hover:bg-pink/25 transition-all duration-300">
                      <Icons.Json size={28} className="text-pink" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-pink uppercase tracking-wider">Featured Tool</span>
                      <h3 className="text-2xl font-bold text-text">JSON Validator</h3>
                    </div>
                  </div>
                  <p className="text-subtext0 leading-relaxed mb-6">
                    Validate and format JSON with syntax highlighting, real-time error detection, and intelligent formatting options.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-pink font-medium">
                    <span>Start validating</span>
                    <Icons.ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>

                {/* Right side - Live preview mockup */}
                <div className="hidden md:block">
                  <div className="bg-surface0/50 rounded-2xl p-4 font-mono text-sm border border-surface1/50">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 rounded-full bg-red/60" />
                      <div className="w-3 h-3 rounded-full bg-yellow/60" />
                      <div className="w-3 h-3 rounded-full bg-green/60" />
                    </div>
                    <div className="space-y-1 text-xs">
                      <div><span className="text-pink">{'{'}</span></div>
                      <div className="pl-4"><span className="text-teal">"name"</span><span className="text-subtext0">:</span> <span className="text-peach">"DevUtils"</span><span className="text-subtext0">,</span></div>
                      <div className="pl-4"><span className="text-teal">"version"</span><span className="text-subtext0">:</span> <span className="text-peach">"1.0.0"</span><span className="text-subtext0">,</span></div>
                      <div className="pl-4"><span className="text-teal">"valid"</span><span className="text-subtext0">:</span> <span className="text-green">true</span></div>
                      <div><span className="text-pink">{'}'}</span></div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="px-2 py-1 rounded-full bg-green/15 text-green text-[10px] font-semibold">✓ Valid JSON</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Other tools - 3 column grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* JSON Minifier */}
          <Link
            to="/json-minifier"
            className={`group block ${mounted ? 'animate-slide-up' : ''} opacity-0`}
            style={{ animationDelay: '0.8s' }}
          >
            <div className="relative overflow-hidden rounded-2xl p-6 h-full glass border border-teal/20 hover:border-teal/40 hover:shadow-glow-teal transition-all duration-500 ease-out hover:-translate-y-2">
              {/* Compression visualization pattern */}
              <div className="absolute top-4 right-4 flex items-center gap-1 opacity-20 group-hover:opacity-40 transition-opacity">
                <div className="w-8 h-2 bg-teal rounded" />
                <Icons.ArrowRight size={12} className="text-teal" />
                <div className="w-4 h-2 bg-teal rounded" />
              </div>

              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-teal/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icons.Compress size={24} className="text-teal" />
                </div>
                <h3 className="text-lg font-bold text-text mb-2">JSON Minifier</h3>
                <p className="text-sm text-subtext0 leading-relaxed mb-4">
                  Compress JSON by removing whitespace with size comparison metrics.
                </p>
                {/* Mini visualization */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-surface0/50 border border-surface1/30">
                  <div className="text-center">
                    <div className="text-lg font-bold text-subtext1">2.4kb</div>
                    <div className="text-[10px] text-subtext0">Original</div>
                  </div>
                  <Icons.ArrowRight size={14} className="text-teal" />
                  <div className="text-center">
                    <div className="text-lg font-bold text-teal">1.2kb</div>
                    <div className="text-[10px] text-subtext0">Minified</div>
                  </div>
                  <div className="ml-auto px-2 py-1 rounded-full bg-teal/15 text-teal text-[10px] font-semibold">
                    -50%
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* JWT Decoder */}
          <Link
            to="/jwt-decoder"
            className={`group block ${mounted ? 'animate-slide-up' : ''} opacity-0`}
            style={{ animationDelay: '0.9s' }}
          >
            <div className="relative overflow-hidden rounded-2xl p-6 h-full glass border border-mauve/20 hover:border-mauve/40 hover:shadow-glow-mauve transition-all duration-500 ease-out hover:-translate-y-2">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-mauve/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icons.Jwt size={24} className="text-mauve" />
                </div>
                <h3 className="text-lg font-bold text-text mb-2">JWT Decoder</h3>
                <p className="text-sm text-subtext0 leading-relaxed mb-4">
                  Decode and analyze JWT tokens with signature verification.
                </p>
                {/* Token segment visualization */}
                <div className="space-y-2">
                  <div className="flex gap-1 text-[10px] font-mono">
                    <span className="flex-1 px-2 py-1.5 rounded-l-lg bg-red/15 text-red truncate">eyJhbGciOiJI...</span>
                    <span className="text-subtext0">.</span>
                  </div>
                  <div className="flex gap-1 text-[10px] font-mono">
                    <span className="flex-1 px-2 py-1.5 bg-mauve/15 text-mauve truncate">eyJzdWIiOiIx...</span>
                    <span className="text-subtext0">.</span>
                  </div>
                  <div className="flex gap-1 text-[10px] font-mono">
                    <span className="flex-1 px-2 py-1.5 rounded-r-lg bg-blue/15 text-blue truncate">SflKxwRJSMeK...</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Jasypt Encryption */}
          <Link
            to="/jasypt"
            className={`group block ${mounted ? 'animate-slide-up' : ''} opacity-0`}
            style={{ animationDelay: '1s' }}
          >
            <div className="relative overflow-hidden rounded-2xl p-6 h-full glass border border-green/20 hover:border-green/40 hover:shadow-glow-green transition-all duration-500 ease-out hover:-translate-y-2">
              {/* Lock icon animation hint */}
              <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-50 transition-opacity">
                <Icons.Lock size={20} className="text-green group-hover:hidden" />
                <Icons.Shield size={20} className="text-green hidden group-hover:block" />
              </div>

              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-green/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icons.Encrypt size={24} className="text-green" />
                </div>
                <h3 className="text-lg font-bold text-text mb-2">Jasypt Encryption</h3>
                <p className="text-sm text-subtext0 leading-relaxed mb-4">
                  Encrypt and decrypt text using production-grade algorithms.
                </p>
                {/* Encryption visualization */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-subtext0">Input:</span>
                    <span className="text-xs font-mono text-text">secret_data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-subtext0">Output:</span>
                    <span className="text-xs font-mono text-green truncate">ENC(AeS256...)</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="px-2 py-1 rounded bg-green/15 text-green text-[10px] font-semibold">AES-256</span>
                    <span className="px-2 py-1 rounded bg-green/15 text-green text-[10px] font-semibold">PBKDF2</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Features - Enhanced */}
        <div className="mt-24">
          <div
            className={`text-center mb-12 ${mounted ? 'animate-slide-up' : ''} opacity-0`}
            style={{ animationDelay: '1.1s' }}
          >
            <h2 className="text-3xl font-bold text-text mb-3">Built for Privacy</h2>
            <p className="text-subtext0">Your data stays on your device. Always.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className={`group text-center p-8 rounded-2xl glass border border-surface1/30 hover:border-surface2/50 transition-all duration-300 hover:-translate-y-1 ${mounted ? 'animate-slide-up' : ''} opacity-0`}
                  style={{ animationDelay: `${1.2 + index * 0.1}s` }}
                >
                  <div
                    className={`
                      inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6
                      bg-gradient-to-br ${feature.gradient}
                      border border-surface1/50
                      group-hover:scale-110 transition-transform duration-300
                    `}
                  >
                    <IconComponent size={28} className="text-text" />
                  </div>
                  <h3 className="text-lg font-bold text-text mb-3">
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

        {/* Enhanced Footer */}
        <footer
          className={`mt-24 pt-12 border-t border-surface1/30 ${mounted ? 'animate-fade-in' : ''} opacity-0`}
          style={{ animationDelay: '1.5s' }}
        >
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* Left - Branding */}
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <div className="w-8 h-8 rounded-lg logo-container flex items-center justify-center">
                  <Icons.DevUtils size={16} className="text-white" />
                </div>
                <span className="font-bold text-text">DevUtils</span>
              </div>
              <p className="text-sm text-subtext0">Professional developer tools</p>
            </div>

            {/* Center - Keyboard shortcuts hint */}
            <div className="text-center">
              <div className="inline-flex items-center gap-4 text-sm text-subtext0">
                <div className="flex items-center gap-1.5">
                  <kbd className="px-2 py-1 rounded bg-surface0 text-xs font-mono border border-surface1">⌘</kbd>
                  <kbd className="px-2 py-1 rounded bg-surface0 text-xs font-mono border border-surface1">K</kbd>
                  <span className="ml-1 text-subtext0">Quick nav</span>
                </div>
                <span className="text-surface2">|</span>
                <div className="flex items-center gap-1.5">
                  <kbd className="px-2 py-1 rounded bg-surface0 text-xs font-mono border border-surface1">?</kbd>
                  <span className="ml-1 text-subtext0">Shortcuts</span>
                </div>
              </div>
            </div>

            {/* Right - Links */}
            <div className="flex items-center gap-4 justify-center md:justify-end">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-surface0/50 transition-colors text-subtext0 hover:text-text"
                aria-label="View on GitHub"
              >
                <Icons.Globe size={20} />
              </a>
              <span className="text-xs text-subtext0 font-mono">v1.0.0</span>
            </div>
          </div>

          {/* Bottom tagline */}
          <div className="mt-8 pb-8 text-center">
            <div className="inline-flex items-center gap-3 text-sm text-subtext0">
              <span className="w-12 h-px bg-gradient-to-r from-transparent to-surface1" />
              <span className="flex items-center gap-2">
                Crafted with care for developers
                <span className="animate-pulse text-pink">♥</span>
              </span>
              <span className="w-12 h-px bg-gradient-to-l from-transparent to-surface1" />
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default Home;
