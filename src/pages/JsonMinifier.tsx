import { useState } from 'react';
import Editor from '@monaco-editor/react';
import CopyButton from '../components/CopyButton';
import FileUpload from '../components/FileUpload';
import URLInput from '../components/URLInput';

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
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">JSON Minifier</h1>
        <p className="text-gray-600">Compress your JSON by removing unnecessary whitespace and formatting</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <FileUpload onFileContent={handleFileContent} className="flex-shrink-0" />
        <URLInput onURLContent={handleFileContent} className="flex-1 min-w-0" />
      </div>

      <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className={`text-sm px-2 py-1 rounded ${
              result.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {result.isValid ? 'Valid JSON' : 'Invalid JSON'}
            </span>
          </div>
          {result.isValid && result.originalSize > 0 && (
            <div className="text-sm text-gray-600 space-x-4">
              <span>Original: {formatBytes(result.originalSize)}</span>
              <span>Minified: {formatBytes(result.minifiedSize)}</span>
              <span className="font-semibold text-green-600">
                Saved: {result.compressionRatio.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        <button
          onClick={handleClear}
          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Input JSON</h3>
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
          {!result.isValid && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-red-700">
              <strong>Error:</strong> {result.error}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Minified JSON</h3>
            <div className="flex space-x-2">
              <CopyButton 
                text={result.minified || ''} 
                className="text-sm"
              />
              <button
                onClick={downloadMinified}
                disabled={!result.minified}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Download
              </button>
            </div>
          </div>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
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
        </div>
      </div>
    </div>
  );
};

export default JsonMinifier;