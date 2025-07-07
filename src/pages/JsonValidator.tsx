import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import CopyButton from '../components/CopyButton';
import FileUpload from '../components/FileUpload';
import URLInput from '../components/URLInput';
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
  const debouncedInput = useDebounce(input, 300);

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
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">JSON Validator & Formatter</h1>
        <p className="text-gray-600">Validate, format, and beautify your JSON data</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <FileUpload onFileContent={handleFileContent} className="flex-shrink-0" />
        <URLInput onURLContent={handleFileContent} className="flex-1 min-w-0" />
      </div>

      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Indent:</label>
          <select
            value={indentType}
            onChange={(e) => setIndentType(e.target.value as 'spaces' | 'tabs')}
            className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="spaces">Spaces</option>
            <option value="tabs">Tabs</option>
          </select>
          {indentType === 'spaces' && (
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={2}>2</option>
              <option value={4}>4</option>
            </select>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleClear}
            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={handleMinify}
            disabled={!validation.isValid || !input.trim()}
            className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Minify
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Input</h3>
            <div className="flex items-center space-x-2">
              <span className={`text-sm px-2 py-1 rounded ${
                validation.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {validation.isValid ? 'Valid JSON' : 'Invalid JSON'}
              </span>
            </div>
          </div>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
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
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-red-700">
              <strong>Error:</strong> {validation.error}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Formatted Output</h3>
            <CopyButton 
              text={validation.formatted || ''} 
              className="text-sm"
            />
          </div>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
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
        </div>
      </div>
    </div>
  );
};

export default JsonValidator;