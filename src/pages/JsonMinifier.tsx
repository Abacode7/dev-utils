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
        {/* Header - Clean, no border */}
        <div className="px-8 pt-8 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="p-2 rounded-xl"
              style={{
                background: 'color-mix(in srgb, var(--teal) 15%, transparent)',
              }}
            >
              <Icons.Compress size={20} style={{ color: 'var(--teal)' }} />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              JSON Minifier
            </h1>
          </div>
          <p className="text-sm ml-12" style={{ color: 'var(--text-secondary)' }}>
            Compress your JSON by removing unnecessary whitespace and formatting.
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <div className="max-w-6xl space-y-6">
            {/* Controls & Stats - Glass morphism style */}
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

                <div className="flex items-center gap-4 ml-auto">
                  {result.isValid && result.originalSize > 0 && (
                    <div className="flex items-center gap-3">
                      <div
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm"
                        style={{ background: 'var(--surface0)' }}
                      >
                        <span style={{ color: 'var(--text-secondary)' }}>Original:</span>
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                          {formatBytes(result.originalSize)}
                        </span>
                      </div>
                      <div
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm"
                        style={{ background: 'var(--surface0)' }}
                      >
                        <span style={{ color: 'var(--text-secondary)' }}>Minified:</span>
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                          {formatBytes(result.minifiedSize)}
                        </span>
                      </div>
                      <div
                        className="px-3 py-1.5 rounded-xl text-sm font-semibold"
                        style={{
                          background: 'color-mix(in srgb, var(--green) 15%, transparent)',
                          color: 'var(--green)',
                        }}
                      >
                        -{result.compressionRatio.toFixed(1)}%
                      </div>
                    </div>
                  )}
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
                      background: result.isValid
                        ? 'color-mix(in srgb, var(--green) 15%, transparent)'
                        : 'color-mix(in srgb, var(--red) 15%, transparent)',
                      color: result.isValid ? 'var(--green)' : 'var(--red)',
                    }}
                  >
                    {result.isValid ? 'Valid' : 'Invalid'}
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
                {!result.isValid && (
                  <div
                    className="px-5 py-3 text-sm"
                    style={{
                      background: 'color-mix(in srgb, var(--red) 10%, transparent)',
                      color: 'var(--red)',
                    }}
                  >
                    <strong>Error:</strong> {result.error}
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
                    Minified JSON
                  </span>
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
                  <div
                    className="h-[400px] flex items-center justify-center"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    <div className="text-center">
                      <div
                        className="mx-auto mb-3 p-3 rounded-2xl w-fit"
                        style={{ background: 'var(--surface1)' }}
                      >
                        <Icons.Compress size={24} style={{ color: 'var(--overlay1)' }} />
                      </div>
                      <p className="text-sm">Enter JSON to see minified output</p>
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

export default JsonMinifier;
