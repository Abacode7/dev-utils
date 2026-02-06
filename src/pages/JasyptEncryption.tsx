import { useState, useEffect } from 'react';
import {
  JasyptEncryption,
  type SupportedAlgorithm,
  type EncryptionResult,
  type DecryptionResult,
  type PasswordStrength
} from '../utils/jasypt';
import TwoColumnLayout from '../components/TwoColumnLayout';
import ToolSidebar from '../components/ToolSidebar';
import CopyButton from '../components/CopyButton';
import FileUpload from '../components/FileUpload';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../components/ui';
import { Icons } from '../styles/icons';
import { useDebounce } from '../hooks/useDebounce';

type Mode = 'encrypt' | 'decrypt' | 'compare';

const JasyptEncryptionPage: React.FC = () => {
  const [mode, setMode] = useState<Mode>('encrypt');
  const [algorithm, setAlgorithm] = useState<SupportedAlgorithm>('AES-256-GCM');
  const [password, setPassword] = useState('');
  const [plaintext, setPlaintext] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [compareText1, setCompareText1] = useState('');
  const [compareText2, setCompareText2] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({ score: 0, feedback: [], isStrong: false });
  const [encryptionResult, setEncryptionResult] = useState<EncryptionResult | null>(null);
  const [decryptionResult, setDecryptionResult] = useState<DecryptionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const debouncedPassword = useDebounce(password, 300);

  useEffect(() => {
    if (debouncedPassword) {
      setPasswordStrength(JasyptEncryption.validatePassword(debouncedPassword));
    } else {
      setPasswordStrength({ score: 0, feedback: [], isStrong: false });
    }
  }, [debouncedPassword]);

  const clearMessages = () => {
    setError('');
    setSuccessMessage('');
  };

  const handleEncrypt = async () => {
    if (!plaintext.trim()) {
      setError('Please enter text to encrypt');
      return;
    }

    if (!passwordStrength.isStrong) {
      setError('Please use a strong password for encryption');
      return;
    }

    setIsLoading(true);
    clearMessages();

    try {
      const result = await JasyptEncryption.encrypt(plaintext, password, algorithm);
      setEncryptionResult(result);
      setEncryptedText(result.encrypted);
      setSuccessMessage('Text encrypted successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Encryption failed');
      setEncryptionResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecrypt = async () => {
    if (!encryptedText.trim()) {
      setError('Please enter encrypted text to decrypt');
      return;
    }

    if (!password.trim()) {
      setError('Please enter the password');
      return;
    }

    setIsLoading(true);
    clearMessages();

    try {
      const result = await JasyptEncryption.decrypt(encryptedText, password, algorithm);
      setDecryptionResult(result);

      if (result.isValid) {
        setDecryptedText(result.decrypted);
        setSuccessMessage('Text decrypted successfully');
      } else {
        setError(result.error || 'Decryption failed');
        setDecryptedText('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Decryption failed');
      setDecryptionResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompare = () => {
    if (!compareText1.trim() || !compareText2.trim()) {
      setError('Please enter both texts to compare');
      return;
    }

    const isMatch = JasyptEncryption.compareTexts(compareText1, compareText2);
    setSuccessMessage(isMatch ? 'Texts match exactly' : 'Texts do not match');
  };

  const handleGeneratePassword = () => {
    const newPassword = JasyptEncryption.generateSecurePassword(16);
    setPassword(newPassword);
  };

  const handleFileContent = (content: string) => {
    if (mode === 'encrypt') {
      setPlaintext(content);
    } else if (mode === 'decrypt') {
      setEncryptedText(content);
    }
  };

  const handleClear = () => {
    setPlaintext('');
    setEncryptedText('');
    setDecryptedText('');
    setCompareText1('');
    setCompareText2('');
    setPassword('');
    setEncryptionResult(null);
    setDecryptionResult(null);
    clearMessages();
  };

  const downloadResult = () => {
    if (mode === 'encrypt' && encryptionResult) {
      const data = {
        algorithm: encryptionResult.algorithm,
        encrypted: encryptionResult.encrypted,
        timestamp: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'encrypted-data.json';
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
      <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="border-b border-neutral-100 px-8 py-6">
          <h1 className="text-xl font-semibold text-neutral-900">Jasypt Encryption</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Production-grade encryption and decryption with Jasypt-compatible algorithms.
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl space-y-6">
            {/* Security Notice */}
            <div className="p-4 bg-sky-50 rounded-lg">
              <div className="flex items-start gap-3">
                <Icons.Info size={18} className="text-sky-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-sky-800">
                  <strong>Security Notice:</strong> Use strong, unique passwords. Store passwords securely using environment variables or key management systems.
                </div>
              </div>
            </div>

            {/* Mode Selection & Configuration */}
            <Card size="sm">
              <CardHeader className="p-4 border-b border-neutral-100">
                <CardTitle className="text-sm font-medium">Configuration</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {/* Mode Selection */}
                <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg w-fit">
                  {(['encrypt', 'decrypt', 'compare'] as Mode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        mode === m
                          ? 'bg-white text-neutral-900 shadow-sm'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      {m.charAt(0).toUpperCase() + m.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Controls */}
                <div className="flex flex-wrap items-center gap-4">
                  <FileUpload onFileContent={handleFileContent} />
                  <select
                    value={algorithm}
                    onChange={(e) => setAlgorithm(e.target.value as SupportedAlgorithm)}
                    className="px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white text-neutral-700"
                  >
                    <option value="AES-256-GCM">AES-256-GCM (Recommended)</option>
                    <option value="PBEWithHmacSHA256AndAES_256">PBEWithHmacSHA256AndAES_256</option>
                  </select>
                  <Button variant="ghost" size="sm" onClick={handleClear}>
                    Clear All
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Password Input */}
            {mode !== 'compare' && (
              <Card size="sm">
                <CardHeader className="p-4 border-b border-neutral-100">
                  <CardTitle className="text-sm font-medium">Password</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter encryption password..."
                        className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white text-neutral-900 placeholder:text-neutral-400"
                      />
                    </div>
                    <Button variant="outline" onClick={handleGeneratePassword}>
                      Generate
                    </Button>
                  </div>
                  <PasswordStrengthMeter strength={passwordStrength} />
                </CardContent>
              </Card>
            )}

            {/* Messages */}
            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">
                <strong>Error:</strong> {error}
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg">
                <strong>Success:</strong> {successMessage}
              </div>
            )}

            {/* Encrypt Mode */}
            {mode === 'encrypt' && (
              <Card size="sm">
                <CardHeader className="p-4 border-b border-neutral-100">
                  <CardTitle className="text-sm font-medium">Encrypt Text</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Plaintext</label>
                    <textarea
                      value={plaintext}
                      onChange={(e) => setPlaintext(e.target.value)}
                      placeholder="Enter text to encrypt..."
                      className="w-full h-32 p-3 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white text-neutral-900 placeholder:text-neutral-400 resize-none"
                    />
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleEncrypt}
                    disabled={isLoading || !passwordStrength.isStrong || !plaintext.trim()}
                  >
                    {isLoading ? 'Encrypting...' : 'Encrypt'}
                  </Button>

                  {encryptionResult && (
                    <div className="space-y-3 pt-4 border-t border-neutral-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-neutral-700">Encrypted Result</span>
                        <div className="flex items-center gap-2">
                          <CopyButton text={encryptedText} />
                          <Button variant="outline" size="sm" onClick={downloadResult}>
                            Download
                          </Button>
                        </div>
                      </div>
                      <textarea
                        value={encryptedText}
                        readOnly
                        className="w-full h-24 p-3 text-sm border border-neutral-200 rounded-lg bg-neutral-50 font-mono text-neutral-900 resize-none"
                      />
                      <div className="flex gap-4 text-xs text-neutral-500">
                        <span>Algorithm: {encryptionResult.algorithm}</span>
                        <span>Iterations: {encryptionResult.iterations}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Decrypt Mode */}
            {mode === 'decrypt' && (
              <Card size="sm">
                <CardHeader className="p-4 border-b border-neutral-100">
                  <CardTitle className="text-sm font-medium">Decrypt Text</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Encrypted Text</label>
                    <textarea
                      value={encryptedText}
                      onChange={(e) => setEncryptedText(e.target.value)}
                      placeholder="Enter encrypted text to decrypt..."
                      className="w-full h-32 p-3 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white text-neutral-900 font-mono placeholder:text-neutral-400 resize-none"
                    />
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleDecrypt}
                    disabled={isLoading || !password.trim() || !encryptedText.trim()}
                  >
                    {isLoading ? 'Decrypting...' : 'Decrypt'}
                  </Button>

                  {decryptionResult && decryptionResult.isValid && (
                    <div className="space-y-3 pt-4 border-t border-neutral-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-neutral-700">Decrypted Result</span>
                        <CopyButton text={decryptedText} />
                      </div>
                      <textarea
                        value={decryptedText}
                        readOnly
                        className="w-full h-24 p-3 text-sm border border-green-200 rounded-lg bg-green-50 text-neutral-900 resize-none"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Compare Mode */}
            {mode === 'compare' && (
              <Card size="sm">
                <CardHeader className="p-4 border-b border-neutral-100">
                  <CardTitle className="text-sm font-medium">Compare Texts</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Text 1</label>
                      <textarea
                        value={compareText1}
                        onChange={(e) => setCompareText1(e.target.value)}
                        placeholder="Enter first text..."
                        className="w-full h-32 p-3 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white text-neutral-900 placeholder:text-neutral-400 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Text 2</label>
                      <textarea
                        value={compareText2}
                        onChange={(e) => setCompareText2(e.target.value)}
                        placeholder="Enter second text..."
                        className="w-full h-32 p-3 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white text-neutral-900 placeholder:text-neutral-400 resize-none"
                      />
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleCompare}
                    disabled={!compareText1.trim() || !compareText2.trim()}
                  >
                    Compare Texts
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </TwoColumnLayout>
  );
};

export default JasyptEncryptionPage;
