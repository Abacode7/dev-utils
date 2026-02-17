import { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import TwoColumnLayout from '../components/TwoColumnLayout';
import ToolSidebar from '../components/ToolSidebar';
import CopyButton from '../components/CopyButton';
import FileUpload from '../components/FileUpload';
import URLInput from '../components/URLInput';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../components/ui';
import { Icons } from '../styles/icons';
import { useDebounce } from '../hooks/useDebounce';
import { useTheme } from '../hooks/useTheme';

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
  const debouncedInput = useDebounce(input, 300);
  const { resolvedTheme } = useTheme();
  const monacoTheme = resolvedTheme === 'dark' ? 'vs-dark' : 'vs-light';

  const validateAndFormat = useCallback((jsonString: string) => {
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
  }, [indentType, indentSize]);

  useEffect(() => {
    if (debouncedInput.trim()) {
      validateAndFormat(debouncedInput);
    } else {
      setValidation({ isValid: true });
    }
  }, [debouncedInput, indentSize, indentType, validateAndFormat]);

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
      <div className="h-full flex flex-col" style={{ background: 'var(--bg-primary)' }}>
        {/* Header */}
        <div className="border-b px-8 py-6" style={{ borderColor: 'var(--border-default)' }}>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>JSON Validator</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Validate, format, and beautify your JSON data with real-time feedback.
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl space-y-6">
            {/* Controls */}
            <Card size="sm">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-4">
                  <FileUpload onFileContent={handleFileContent} className="flex-shrink-0" />
                  <URLInput onURLContent={handleFileContent} className="flex-1 min-w-[200px]" />

                  <div className="flex items-center gap-2 ml-auto">
                    <select
                      value={indentType}
                      onChange={(e) => setIndentType(e.target.value as 'spaces' | 'tabs')}
                      className="px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700"
                    >
                      <option value="spaces">Spaces</option>
                      <option value="tabs">Tabs</option>
                    </select>
                    {indentType === 'spaces' && (
                      <select
                        value={indentSize}
                        onChange={(e) => setIndentSize(Number(e.target.value))}
                        className="px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700"
                      >
                        <option value={2}>2 spaces</option>
                        <option value={4}>4 spaces</option>
                      </select>
                    )}
                    <Button variant="outline" size="sm" onClick={handleMinify} disabled={!validation.isValid || !input.trim()}>
                      Minify
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleClear}>
                      Clear
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Editor Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Input Editor */}
              <Card size="none">
                <CardHeader className="p-4 border-b" style={{ borderColor: 'var(--border-default)' }}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Input JSON</CardTitle>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      validation.isValid
                        ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      {validation.isValid ? 'Valid' : 'Invalid'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="border-b" style={{ borderColor: 'var(--border-default)' }}>
                    <Editor
                      height="400px"
                      language="json"
                      value={input}
                      onChange={handleInputChange}
                      theme={monacoTheme}
                      options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 13,
                        wordWrap: 'on',
                        automaticLayout: true,
                        padding: { top: 12, bottom: 12 },
                      }}
                    />
                  </div>
                  {!validation.isValid && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm">
                      <strong>Error:</strong> {validation.error}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Output Editor */}
              <Card size="none">
                <CardHeader className="p-4 border-b" style={{ borderColor: 'var(--border-default)' }}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Formatted Output</CardTitle>
                    <CopyButton text={validation.formatted || ''} />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {validation.formatted ? (
                    <Editor
                      height="400px"
                      language="json"
                      value={validation.formatted}
                      options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 13,
                        wordWrap: 'on',
                        automaticLayout: true,
                        padding: { top: 12, bottom: 12 },
                      }}
                      theme={monacoTheme}
                    />
                  ) : (
                    <div className="h-[400px] flex items-center justify-center" style={{ color: 'var(--text-tertiary)' }}>
                      <div className="text-center">
                        <Icons.Json size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Enter valid JSON to see formatted output</p>
                      </div>
                    </div>
                  )}
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
