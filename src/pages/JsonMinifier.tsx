import { useState } from 'react';
import Editor from '@monaco-editor/react';
import TwoColumnLayout from '../components/TwoColumnLayout';
import ToolSidebar from '../components/ToolSidebar';
import StepIndicator from '../components/StepIndicator';
import CopyButton from '../components/CopyButton';
import FileUpload from '../components/FileUpload';
import URLInput from '../components/URLInput';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui';

interface MinifyResult {
  isValid: boolean;
  error?: string;
  minified?: string;
  originalSize: number;
  minifiedSize: number;
  compressionRatio: number;
}

const JsonMinifier: React.FC = () => {
  const [input, setInput] = useState('{\n  "name": "example",\n  "description": "This is a sample JSON object",\n  "nested": {\n    "array": [1, 2, 3, 4, 5],\n    "boolean": true,\n    "null": null\n  }\n}');
  const [result, setResult] = useState<MinifyResult>({ 
    isValid: true, 
    originalSize: 0, 
    minifiedSize: 0, 
    compressionRatio: 0 
  });
  const [currentStep] = useState('input');

  const steps = [
    {
      id: 'input',
      title: 'Input JSON',
      description: 'Enter or upload JSON data',
      status: (input.trim() ? 'completed' : 'current') as 'pending' | 'current' | 'completed' | 'error',
    },
    {
      id: 'validate',
      title: 'Validate',
      description: 'Check JSON syntax',
      status: (input.trim() ? (result.isValid ? 'completed' : 'error') : 'pending') as 'pending' | 'current' | 'completed' | 'error',
    },
    {
      id: 'minify',
      title: 'Minify',
      description: 'Compress JSON',
      status: (result.isValid && result.minified ? 'completed' : 'pending') as 'pending' | 'current' | 'completed' | 'error',
    },
    {
      id: 'download',
      title: 'Download',
      description: 'Save minified result',
      status: 'pending' as 'pending' | 'current' | 'completed' | 'error',
    },
  ];

  const calculateSizes = (original: string, minified: string) => {
    const originalSize = new Blob([original]).size;
    const minifiedSize = new Blob([minified]).size;
    const compressionRatio = originalSize > 0 ? ((originalSize - minifiedSize) / originalSize) * 100 : 0;
    
    return { originalSize, minifiedSize, compressionRatio };
  };

  const minifyJson = (jsonString: string) => {
    if (!jsonString.trim()) {
      setResult({ isValid: true, originalSize: 0, minifiedSize: 0, compressionRatio: 0 });
      return;
    }

    try {
      const parsed = JSON.parse(jsonString);
      const minified = JSON.stringify(parsed);
      const sizes = calculateSizes(jsonString, minified);
      
      setResult({
        isValid: true,
        minified,
        ...sizes
      });
    } catch (error) {
      setResult({
        isValid: false,
        error: error instanceof Error ? error.message : 'Invalid JSON',
        originalSize: new Blob([jsonString]).size,
        minifiedSize: 0,
        compressionRatio: 0
      });
    }
  };

  const handleInputChange = (value: string | undefined) => {
    const newValue = value || '';
    setInput(newValue);
    minifyJson(newValue);
  };

  const handleFileContent = (content: string) => {
    setInput(content);
    minifyJson(content);
  };

  const handleClear = () => {
    setInput('');
    setResult({ isValid: true, originalSize: 0, minifiedSize: 0, compressionRatio: 0 });
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadMinified = () => {
    if (result.minified) {
      const blob = new Blob([result.minified], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'minified.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <TwoColumnLayout
      sidebar={<ToolSidebar />}
      sidebarWidth="md"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-border-primary bg-surface-primary p-6 glass-card">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-text-primary mb-2 font-display text-gradient-enterprise animate-fade-in">
              JSON Minifier
            </h1>
            <p className="text-text-secondary text-lg animate-slide-in">
              Compress your JSON by removing unnecessary whitespace and formatting
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex-shrink-0 bg-surface-secondary border-b border-border-primary p-6">
          <div className="max-w-5xl mx-auto">
            <StepIndicator
              steps={steps}
              currentStep={currentStep}
              size="sm"
              orientation="horizontal"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Input Controls & Stats */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Input Options & Compression Stats</CardTitle>
                  <button
                    onClick={handleClear}
                    className="px-4 py-1.5 bg-neutral-500 text-white rounded-md hover:bg-neutral-600 transition-colors font-medium"
                  >
                    Clear
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <FileUpload onFileContent={handleFileContent} className="flex-shrink-0" />
                  <URLInput onURLContent={handleFileContent} className="flex-1 min-w-0" />
                </div>
                
                <div className="flex flex-wrap gap-4 items-center">
                  <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                    result.isValid 
                      ? 'bg-success-100 text-success-700' 
                      : 'bg-error-100 text-error-700'
                  }`}>
                    {result.isValid ? 'Valid JSON' : 'Invalid JSON'}
                  </span>
                  
                  {result.isValid && result.originalSize > 0 && (
                    <div className="flex items-center space-x-4 text-sm text-text-secondary">
                      <span>Original: <span className="font-medium">{formatBytes(result.originalSize)}</span></span>
                      <span>Minified: <span className="font-medium">{formatBytes(result.minifiedSize)}</span></span>
                      <span className="font-semibold text-success-600">
                        Saved: {result.compressionRatio.toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Editor Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Input Editor */}
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Input JSON</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1 border border-border-primary rounded-lg overflow-hidden">
                    <Editor
                      height="400px"
                      language="json"
                      value={input}
                      onChange={handleInputChange}
                      theme="vs-light"
                      options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                        wordWrap: 'on',
                        automaticLayout: true,
                      }}
                    />
                  </div>
                  {!result.isValid && (
                    <div className="mt-3 p-3 bg-error-50 border border-error-200 rounded-md text-error-700">
                      <strong>Error:</strong> {result.error}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Output Editor */}
              <Card className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Minified JSON</CardTitle>
                    <div className="flex space-x-2">
                      <CopyButton 
                        text={result.minified || ''} 
                        className="text-sm"
                      />
                      <button
                        onClick={downloadMinified}
                        disabled={!result.minified}
                        className="px-3 py-1.5 bg-success-500 text-white rounded-md hover:bg-success-600 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1 border border-border-primary rounded-lg overflow-hidden">
                    <Editor
                      height="400px"
                      language="json"
                      value={result.minified || ''}
                      options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                        wordWrap: 'on',
                        automaticLayout: true,
                      }}
                      theme="vs-light"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TwoColumnLayout>
  );
};

export default JsonMinifier;