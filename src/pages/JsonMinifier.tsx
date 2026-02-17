import { useState } from 'react';
import Editor from '@monaco-editor/react';
import TwoColumnLayout from '../components/TwoColumnLayout';
import ToolSidebar from '../components/ToolSidebar';
import CopyButton from '../components/CopyButton';
import FileUpload from '../components/FileUpload';
import URLInput from '../components/URLInput';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../components/ui';
import { Icons } from '../styles/icons';
import { useTheme } from '../hooks/useTheme';

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
  const { resolvedTheme } = useTheme();
  const monacoTheme = resolvedTheme === 'dark' ? 'vs-dark' : 'vs-light';

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
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
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
      <div className="h-full flex flex-col" style={{ background: 'var(--bg-primary)' }}>
        {/* Header */}
        <div className="border-b px-8 py-6" style={{ borderColor: 'var(--border-default)' }}>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>JSON Minifier</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Compress your JSON by removing unnecessary whitespace and formatting.
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl space-y-6">
            {/* Controls & Stats */}
            <Card size="sm">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-4">
                  <FileUpload onFileContent={handleFileContent} className="flex-shrink-0" />
                  <URLInput onURLContent={handleFileContent} className="flex-1 min-w-[200px]" />

                  <div className="flex items-center gap-4 ml-auto">
                    {result.isValid && result.originalSize > 0 && (
                      <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <span>Original: <span className="font-medium">{formatBytes(result.originalSize)}</span></span>
                        <span>Minified: <span className="font-medium">{formatBytes(result.minifiedSize)}</span></span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          -{result.compressionRatio.toFixed(1)}%
                        </span>
                      </div>
                    )}
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
                      result.isValid
                        ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      {result.isValid ? 'Valid' : 'Invalid'}
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
                  {!result.isValid && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm">
                      <strong>Error:</strong> {result.error}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Output Editor */}
              <Card size="none">
                <CardHeader className="p-4 border-b" style={{ borderColor: 'var(--border-default)' }}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Minified JSON</CardTitle>
                    <div className="flex items-center gap-2">
                      <CopyButton text={result.minified || ''} />
                      <Button
                        variant="default"
                        size="sm"
                        onClick={downloadMinified}
                        disabled={!result.minified}
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {result.minified ? (
                    <Editor
                      height="400px"
                      language="json"
                      value={result.minified}
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
                        <Icons.Compress size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Enter JSON to see minified output</p>
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

export default JsonMinifier;
