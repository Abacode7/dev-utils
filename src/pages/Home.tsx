import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui';
import { Icons } from '../styles/icons';

const Home: React.FC = () => {
  const tools = [
    {
      name: 'JSON Validator',
      description: 'Validate and format JSON with syntax highlighting and real-time error detection.',
      path: '/json-validator',
      icon: Icons.Json,
    },
    {
      name: 'JSON Minifier',
      description: 'Compress JSON by removing whitespace with size comparison metrics.',
      path: '/json-minifier',
      icon: Icons.Compress,
    },
    {
      name: 'JWT Decoder',
      description: 'Decode and analyze JWT tokens with signature verification.',
      path: '/jwt-decoder',
      icon: Icons.Jwt,
    },
    {
      name: 'Jasypt Encryption',
      description: 'Encrypt and decrypt text using production-grade Jasypt algorithms.',
      path: '/jasypt',
      icon: Icons.Encrypt,
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="border-b border-neutral-100">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl font-semibold text-neutral-900 tracking-tight">
            Developer Utilities
          </h1>
          <p className="mt-4 text-lg text-neutral-500 max-w-xl mx-auto">
            Professional tools for JSON processing, JWT analysis, and encryption. All processing happens locally in your browser.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-4">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <Link
                key={tool.path}
                to={tool.path}
                className="block group"
              >
                <Card variant="interactive" size="none" className="h-full">
                  <CardHeader className="p-5">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center group-hover:bg-neutral-900 transition-colors duration-150">
                        <IconComponent size={20} className="text-neutral-600 group-hover:text-white transition-colors duration-150" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-semibold text-neutral-900 group-hover:text-neutral-700">
                          {tool.name}
                        </CardTitle>
                        <CardDescription className="mt-1 text-sm text-neutral-500 line-clamp-2">
                          {tool.description}
                        </CardDescription>
                      </div>
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <Icons.Play size={16} className="text-neutral-400" />
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Features */}
        <div className="mt-12 pt-12 border-t border-neutral-100">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-sm font-medium text-neutral-900">100% Local</div>
              <div className="mt-1 text-sm text-neutral-500">Client-side processing</div>
            </div>
            <div>
              <div className="text-sm font-medium text-neutral-900">No Data Collection</div>
              <div className="mt-1 text-sm text-neutral-500">Your data stays private</div>
            </div>
            <div>
              <div className="text-sm font-medium text-neutral-900">Enterprise Ready</div>
              <div className="mt-1 text-sm text-neutral-500">Production-grade tools</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
