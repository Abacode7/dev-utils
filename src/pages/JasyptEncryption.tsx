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
import StepIndicator from '../components/StepIndicator';
import CopyButton from '../components/CopyButton';
import FileUpload from '../components/FileUpload';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui';
import { FloatingInput, FloatingTextarea } from '../components/ui';
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
  const [currentStep] = useState('password');

  const steps = [
    {
      id: 'password',
      title: 'Password',
      description: 'Set encryption password',
      status: (password.trim() ? 'completed' : 'current') as 'pending' | 'current' | 'completed' | 'error',
    },
    {
      id: 'input',
      title: 'Input',
      description: 'Enter text to process',
      status: (
        mode === 'encrypt' ? (plaintext.trim() ? 'completed' : 'pending') :
        mode === 'decrypt' ? (encryptedText.trim() ? 'completed' : 'pending') :
        (compareText1.trim() && compareText2.trim() ? 'completed' : 'pending')
      ) as 'pending' | 'current' | 'completed' | 'error',
    },
    {
      id: 'process',
      title: mode === 'encrypt' ? 'Encrypt' : mode === 'decrypt' ? 'Decrypt' : 'Compare',
      description: mode === 'encrypt' ? 'Generate encrypted text' : mode === 'decrypt' ? 'Decrypt text' : 'Compare encrypted values',
      status: (
        mode === 'encrypt' ? (encryptionResult ? 'completed' : 'pending') :
        mode === 'decrypt' ? (decryptionResult?.isValid ? 'completed' : 'pending') :
        'pending'
      ) as 'pending' | 'current' | 'completed' | 'error',
    },
    {
      id: 'result',
      title: 'Result',
      description: 'Copy or download result',
      status: 'pending' as 'pending' | 'current' | 'completed' | 'error',
    },
  ];
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

  const downloadConfiguration = () => {
    const config = JasyptEncryption.exportConfiguration(algorithm);
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jasypt-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadResult = () => {
    if (mode === 'encrypt' && encryptionResult) {
      const data = {
        algorithm: encryptionResult.algorithm,
        encrypted: encryptionResult.encrypted,
        salt: encryptionResult.salt,
        iv: encryptionResult.iv,
        iterations: encryptionResult.iterations,
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
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-border-primary bg-surface-primary p-6 glass-card">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-text-primary mb-2 font-display text-gradient-enterprise animate-fade-in">
              Jasypt Encryption
            </h1>
            <p className="text-text-secondary text-lg animate-slide-in">
              Production-grade encryption and decryption with Jasypt-compatible algorithms
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex-shrink-0 bg-surface-secondary border-b border-border-primary p-6">
          <div className="max-w-4xl mx-auto">
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
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Security Warning */}
            <Card>
              <CardContent className="p-4">
                <div className="bg-info-50 border border-info-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-info-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-info-800">Production Security Notice</h4>
                      <div className="text-sm text-info-700 mt-1 space-y-1">
                        <p>• Use strong, unique passwords for production data</p>
                        <p>• Store passwords securely using environment variables or key management systems</p>
                        <p>• Never commit passwords or encrypted secrets to version control</p>
                        <p>• Consider server-side encryption for sensitive production data</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mode Selection & Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Mode Selection */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-3">Operation Mode</label>
                  <div className="flex space-x-1 bg-surface-secondary p-1 rounded-lg">
                    {(['encrypt', 'decrypt', 'compare'] as Mode[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                          mode === m
                            ? 'bg-surface-primary text-text-primary shadow-sm'
                            : 'text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        {m.charAt(0).toUpperCase() + m.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Algorithm & Controls */}
                <div className="flex flex-wrap gap-4 items-center">
                  <FileUpload onFileContent={handleFileContent} className="flex-shrink-0" />
                  <select
                    value={algorithm}
                    onChange={(e) => setAlgorithm(e.target.value as SupportedAlgorithm)}
                    className="px-3 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface-primary text-text-primary"
                  >
                    <option value="AES-256-GCM">AES-256-GCM (Recommended)</option>
                    <option value="PBEWithHmacSHA256AndAES_256">PBEWithHmacSHA256AndAES_256 (Jasypt)</option>
                  </select>
                  <button
                    onClick={downloadConfiguration}
                    className="px-3 py-2 bg-neutral-500 text-white rounded-lg hover:bg-neutral-600 transition-colors font-medium"
                  >
                    Export Config
                  </button>
                  <button
                    onClick={handleClear}
                    className="px-3 py-2 bg-neutral-500 text-white rounded-lg hover:bg-neutral-600 transition-colors font-medium"
                  >
                    Clear All
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Password Input */}
            {mode !== 'compare' && (
              <Card>
                <CardHeader>
                  <CardTitle>Password Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FloatingInput
                    label="Encryption Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    required
                    validation={{
                      isValid: passwordStrength.isStrong,
                      type: passwordStrength.isStrong ? 'success' : 'warning',
                      message: passwordStrength.isStrong ? 'Strong password' : 'Password could be stronger'
                    }}
                  />
                  <PasswordStrengthMeter strength={passwordStrength} />
                  <button
                    onClick={handleGeneratePassword}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
                  >
                    Generate Strong Password
                  </button>
                </CardContent>
              </Card>
            )}

            {/* Error/Success Messages */}
            {error && (
              <Card>
                <CardContent className="p-4">
                  <div className="p-3 bg-error-50 border border-error-200 rounded-md text-error-700">
                    <strong>Error:</strong> {error}
                  </div>
                </CardContent>
              </Card>
            )}

            {successMessage && (
              <Card>
                <CardContent className="p-4">
                  <div className="p-3 bg-success-50 border border-success-200 rounded-md text-success-700">
                    <strong>Success:</strong> {successMessage}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Mode-specific content */}
            {mode === 'encrypt' && (
              <Card>
                <CardHeader>
                  <CardTitle>Encrypt Text</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FloatingTextarea
                    label="Plaintext"
                    value={plaintext}
                    onChange={(e) => setPlaintext(e.target.value)}
                    placeholder="Enter text to encrypt..."
                    autoResize
                    maxRows={8}
                    showCharCount
                  />

                  <button
                    onClick={handleEncrypt}
                    disabled={isLoading || !passwordStrength.isStrong || !plaintext.trim()}
                    className="w-full py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {isLoading ? 'Encrypting...' : 'Encrypt Text'}
                  </button>

                  {encryptionResult && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-text-primary">Encrypted Result</h4>
                        <div className="flex space-x-2">
                          <CopyButton text={encryptedText} className="text-sm" />
                          <button
                            onClick={downloadResult}
                            className="px-3 py-1.5 bg-success-500 text-white rounded-md hover:bg-success-600 transition-colors text-sm font-medium"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={encryptedText}
                        readOnly
                        className="w-full h-32 p-3 border border-border-primary rounded-lg bg-surface-secondary font-mono text-sm text-text-primary"
                      />
                      
                      <div className="bg-surface-secondary rounded-lg p-4">
                        <h5 className="font-medium text-text-primary mb-3">Encryption Details</h5>
                        <div className="grid grid-cols-2 gap-4 text-sm text-text-secondary">
                          <div>Algorithm: {encryptionResult.algorithm}</div>
                          <div>Iterations: {encryptionResult.iterations}</div>
                          <div>Salt Length: {encryptionResult.salt ? atob(encryptionResult.salt).length : 0} bytes</div>
                          <div>IV Length: {encryptionResult.iv ? atob(encryptionResult.iv).length : 0} bytes</div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {mode === 'decrypt' && (
              <Card>
                <CardHeader>
                  <CardTitle>Decrypt Text</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FloatingTextarea
                    label="Encrypted Text"
                    value={encryptedText}
                    onChange={(e) => setEncryptedText(e.target.value)}
                    placeholder="Enter encrypted text to decrypt..."
                    autoResize
                    maxRows={8}
                    className="font-mono"
                  />

                  <button
                    onClick={handleDecrypt}
                    disabled={isLoading || !password.trim() || !encryptedText.trim()}
                    className="w-full py-3 bg-success-500 text-white rounded-lg hover:bg-success-600 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {isLoading ? 'Decrypting...' : 'Decrypt Text'}
                  </button>

                  {decryptionResult && decryptionResult.isValid && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-text-primary">Decrypted Result</h4>
                        <CopyButton text={decryptedText} className="text-sm" />
                      </div>
                      <FloatingTextarea
                        label="Decrypted Text"
                        value={decryptedText}
                        onChange={() => {}}
                        validation={{
                          isValid: true,
                          type: 'success'
                        }}
                        autoResize
                        maxRows={8}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {mode === 'compare' && (
              <Card>
                <CardHeader>
                  <CardTitle>Compare Encrypted Texts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FloatingTextarea
                      label="Text 1"
                      value={compareText1}
                      onChange={(e) => setCompareText1(e.target.value)}
                      placeholder="Enter first text..."
                      autoResize
                      maxRows={6}
                    />
                    <FloatingTextarea
                      label="Text 2"
                      value={compareText2}
                      onChange={(e) => setCompareText2(e.target.value)}
                      placeholder="Enter second text..."
                      autoResize
                      maxRows={6}
                    />
                  </div>

                  <button
                    onClick={handleCompare}
                    disabled={!compareText1.trim() || !compareText2.trim()}
                    className="w-full py-3 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Compare Texts
                  </button>
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