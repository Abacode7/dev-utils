import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import TwoColumnLayout from '../components/TwoColumnLayout';
import ToolSidebar from '../components/ToolSidebar';
import StepIndicator from '../components/StepIndicator';
import CopyButton from '../components/CopyButton';
import FileUpload from '../components/FileUpload';
import URLInput from '../components/URLInput';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui';
import { useDebounce } from '../hooks/useDebounce';

interface ValidationResult {
  isValid: boolean;
  error?: string;
  formatted?: string;
}

const JsonValidator: React.FC = () => {
  const [input, setInput] = useState('{\n  "name": "example",\n  "value": 123\n}');
  const [validation, setValidation] = useState<ValidationResult>({ isValid: true });
  const [indentSize, setIndentSize] = useState(2);
  const [indentType, setIndentType] = useState<'spaces' | 'tabs'>('spaces');
  const [currentStep] = useState('input');
  const debouncedInput = useDebounce(input, 300);

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
      status: (input.trim() ? (validation.isValid ? 'completed' : 'error') : 'pending') as 'pending' | 'current' | 'completed' | 'error',
    },
    {
      id: 'format',
      title: 'Format',
      description: 'Pretty print JSON',
      status: (validation.isValid && validation.formatted ? 'completed' : 'pending') as 'pending' | 'current' | 'completed' | 'error',
    },
    {
      id: 'copy',
      title: 'Copy',
      description: 'Copy formatted result',
      status: 'pending' as 'pending' | 'current' | 'completed' | 'error',
    },
  ];

  const validateAndFormat = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      const indentChar = indentType === 'tabs' ? '\t' : ' '.repeat(indentSize);
      const formatted = JSON.stringify(parsed, null, indentChar);
      setValidation({ isValid: true, formatted });
    } catch (error) {
      setValidation({ 
        isValid: false, 
        error: error instanceof Error ? error.message : 'Invalid JSON'
      });
    }
  };

  useEffect(() => {
    if (debouncedInput.trim()) {
      validateAndFormat(debouncedInput);
    } else {
      setValidation({ isValid: true });
    }
  }, [debouncedInput, indentSize, indentType]);

  const handleInputChange = (value: string | undefined) => {
    const newValue = value || '';
    setInput(newValue);
  };

  const handleFileContent = (content: string) => {
    setInput(content);
    validateAndFormat(content);
  };

  const handleClear = () => {
    setInput('');
    setValidation({ isValid: true });
  };

  const handleMinify = () => {
    if (validation.isValid && input.trim()) {
      try {
        const parsed = JSON.parse(input);
        const minified = JSON.stringify(parsed);
        setInput(minified);
        setValidation({ isValid: true, formatted: minified });
      } catch {
        // Should not happen if validation passed
      }
    }
  };

  return (
    <TwoColumnLayout
      sidebar={<ToolSidebar />}
      sidebarWidth="md"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-border-primary bg-surface-primary p-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-text-primary mb-2 font-display">
              JSON Validator & Formatter
            </h1>
            <p className="text-text-secondary">
              Validate, format, and beautify your JSON data with real-time feedback
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
            {/* Input Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Input Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <FileUpload onFileContent={handleFileContent} className="flex-shrink-0" />
                  <URLInput onURLContent={handleFileContent} className="flex-1 min-w-0" />
                </div>
                
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-text-secondary">Indent:</label>
                    <select
                      value={indentType}
                      onChange={(e) => setIndentType(e.target.value as 'spaces' | 'tabs')}
                      className="px-3 py-1.5 border border-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface-primary text-text-primary"
                    >
                      <option value="spaces">Spaces</option>
                      <option value="tabs">Tabs</option>
                    </select>
                    {indentType === 'spaces' && (
                      <select
                        value={indentSize}
                        onChange={(e) => setIndentSize(Number(e.target.value))}
                        className="px-3 py-1.5 border border-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface-primary text-text-primary"
                      >
                        <option value={2}>2</option>
                        <option value={4}>4</option>
                      </select>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleClear}
                      className="px-4 py-1.5 bg-neutral-500 text-white rounded-md hover:bg-neutral-600 transition-colors font-medium"
                    >
                      Clear
                    </button>
                    <button
                      onClick={handleMinify}
                      disabled={!validation.isValid || !input.trim()}
                      className="px-4 py-1.5 bg-warning-500 text-white rounded-md hover:bg-warning-600 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      Minify
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Editor Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Input Editor */}
              <Card className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Input JSON</CardTitle>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      validation.isValid 
                        ? 'bg-success-100 text-success-700' 
                        : 'bg-error-100 text-error-700'
                    }`}>
                      {validation.isValid ? 'Valid JSON' : 'Invalid JSON'}
                    </span>
                  </div>
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
                  {!validation.isValid && (
                    <div className="mt-3 p-3 bg-error-50 border border-error-200 rounded-md text-error-700">
                      <strong>Error:</strong> {validation.error}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Output Editor */}
              <Card className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Formatted Output</CardTitle>
                    <CopyButton 
                      text={validation.formatted || ''} 
                      className="text-sm"
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1 border border-border-primary rounded-lg overflow-hidden">
                    <Editor
                      height="400px"
                      language="json"
                      value={validation.formatted || ''}
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

export default JsonValidator;