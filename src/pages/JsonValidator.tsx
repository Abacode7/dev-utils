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
        {/* Header - Clean, no border */}
        <div className="px-8 pt-8 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="p-2 rounded-xl"
              style={{
                background: 'color-mix(in srgb, var(--pink) 15%, transparent)',
              }}
            >
              <Icons.Json size={20} style={{ color: 'var(--pink)' }} />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              JSON Validator
            </h1>
          </div>
          <p className="text-sm ml-12" style={{ color: 'var(--text-secondary)' }}>
            Validate, format, and beautify your JSON data with real-time feedback.
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <div className="max-w-6xl space-y-6">
            {/* Controls - Glass morphism style */}
            <div
              className="rounded-2xl p-4"
              style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(var(--glass-blur))',
                border: '1px solid var(--glass-border)',
              }}
            >
              <div className="flex flex-wrap items-center gap-4">
                <FileUpload onFileContent={handleFileContent} className="flex-shrink-0" />
                <URLInput onURLContent={handleFileContent} className="flex-1 min-w-[200px]" />

                <div className="flex items-center gap-2 ml-auto">
                  <select
                    value={indentType}
                    onChange={(e) => setIndentType(e.target.value as 'spaces' | 'tabs')}
                    className="px-3 py-2 text-sm rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
                    style={{
                      background: 'var(--surface0)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--surface1)',
                    }}
                  >
                    <option value="spaces">Spaces</option>
                    <option value="tabs">Tabs</option>
                  </select>
                  {indentType === 'spaces' && (
                    <select
                      value={indentSize}
                      onChange={(e) => setIndentSize(Number(e.target.value))}
                      className="px-3 py-2 text-sm rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
                      style={{
                        background: 'var(--surface0)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--surface1)',
                      }}
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
            </div>

            {/* Editor Grid - Premium card styling */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Input Editor */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'var(--surface0)',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                <div className="px-5 py-4 flex items-center justify-between">
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Input JSON
                  </span>
                  <span
                    className="text-xs px-3 py-1.5 rounded-full font-medium"
                    style={{
                      background: validation.isValid
                        ? 'color-mix(in srgb, var(--green) 15%, transparent)'
                        : 'color-mix(in srgb, var(--red) 15%, transparent)',
                      color: validation.isValid ? 'var(--green)' : 'var(--red)',
                    }}
                  >
                    {validation.isValid ? 'Valid' : 'Invalid'}
                  </span>
                </div>
                <div className="relative">
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
                  <div
                    className="px-5 py-3 text-sm"
                    style={{
                      background: 'color-mix(in srgb, var(--red) 10%, transparent)',
                      color: 'var(--red)',
                    }}
                  >
                    <strong>Error:</strong> {validation.error}
                  </div>
                )}
              </div>

              {/* Output Editor */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'var(--surface0)',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                <div className="px-5 py-4 flex items-center justify-between">
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Formatted Output
                  </span>
                  <CopyButton text={validation.formatted || ''} />
                </div>
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
                  <div
                    className="h-[400px] flex items-center justify-center"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    <div className="text-center">
                      <div
                        className="mx-auto mb-3 p-3 rounded-2xl w-fit"
                        style={{ background: 'var(--surface1)' }}
                      >
                        <Icons.Json size={24} style={{ color: 'var(--overlay1)' }} />
                      </div>
                      <p className="text-sm">Enter valid JSON to see formatted output</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TwoColumnLayout>
  );
};

export default JsonValidator;
