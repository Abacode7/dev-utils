import { useState, useEffect } from 'react';
import { 
  JasyptEncryption, 
  type SupportedAlgorithm, 
  type EncryptionResult, 
  type DecryptionResult,
  type PasswordStrength
} from '../utils/jasypt';
import CopyButton from '../components/CopyButton';
import FileUpload from '../components/FileUpload';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import SecureInput from '../components/SecureInput';
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
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Jasypt Encryption</h1>
        <p className="text-gray-600">Production-grade encryption and decryption with Jasypt-compatible algorithms</p>
      </div>

      {/* Security Warning */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800">Production Security Notice</h4>
            <div className="text-sm text-blue-700 mt-1 space-y-1">
              <p>• Use strong, unique passwords for production data</p>
              <p>• Store passwords securely using environment variables or key management systems</p>
              <p>• Never commit passwords or encrypted secrets to version control</p>
              <p>• Consider server-side encryption for sensitive production data</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {(['encrypt', 'decrypt', 'compare'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                mode === m
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <FileUpload onFileContent={handleFileContent} className="flex-shrink-0" />
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value as SupportedAlgorithm)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="AES-256-GCM">AES-256-GCM (Recommended)</option>
          <option value="PBEWithHmacSHA256AndAES_256">PBEWithHmacSHA256AndAES_256 (Jasypt)</option>
        </select>
        <button
          onClick={downloadConfiguration}
          className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Export Config
        </button>
        <button
          onClick={handleClear}
          className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Password Input */}
      {mode !== 'compare' && (
        <div className="mb-6">
          <SecureInput
            value={password}
            onChange={setPassword}
            label="Encryption Password"
            placeholder="Enter a strong password..."
            onGenerate={handleGeneratePassword}
          />
          <div className="mt-3">
            <PasswordStrengthMeter strength={passwordStrength} />
          </div>
        </div>
      )}

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700">
          <strong>Success:</strong> {successMessage}
        </div>
      )}

      {/* Mode-specific content */}
      {mode === 'encrypt' && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Plaintext</label>
            </div>
            <textarea
              value={plaintext}
              onChange={(e) => setPlaintext(e.target.value)}
              placeholder="Enter text to encrypt..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleEncrypt}
            disabled={isLoading || !passwordStrength.isStrong || !plaintext.trim()}
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? 'Encrypting...' : 'Encrypt Text'}
          </button>

          {encryptionResult && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Encrypted Result</label>
                <div className="flex space-x-2">
                  <CopyButton text={encryptedText} className="text-sm" />
                  <button
                    onClick={downloadResult}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
                  >
                    Download
                  </button>
                </div>
              </div>
              <textarea
                value={encryptedText}
                readOnly
                className="w-full h-32 p-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
              />
              
              <div className="mt-3 bg-gray-50 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 mb-2">Encryption Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>Algorithm: {encryptionResult.algorithm}</div>
                  <div>Iterations: {encryptionResult.iterations}</div>
                  <div>Salt Length: {encryptionResult.salt ? atob(encryptionResult.salt).length : 0} bytes</div>
                  <div>IV Length: {encryptionResult.iv ? atob(encryptionResult.iv).length : 0} bytes</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'decrypt' && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Encrypted Text</label>
            </div>
            <textarea
              value={encryptedText}
              onChange={(e) => setEncryptedText(e.target.value)}
              placeholder="Enter encrypted text to decrypt..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>

          <button
            onClick={handleDecrypt}
            disabled={isLoading || !password.trim() || !encryptedText.trim()}
            className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? 'Decrypting...' : 'Decrypt Text'}
          </button>

          {decryptionResult && decryptionResult.isValid && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Decrypted Result</label>
                <CopyButton text={decryptedText} className="text-sm" />
              </div>
              <textarea
                value={decryptedText}
                readOnly
                className="w-full h-32 p-3 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
          )}
        </div>
      )}

      {mode === 'compare' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Text 1</label>
              <textarea
                value={compareText1}
                onChange={(e) => setCompareText1(e.target.value)}
                placeholder="Enter first text..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Text 2</label>
              <textarea
                value={compareText2}
                onChange={(e) => setCompareText2(e.target.value)}
                placeholder="Enter second text..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={handleCompare}
            disabled={!compareText1.trim() || !compareText2.trim()}
            className="w-full py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Compare Texts
          </button>
        </div>
      )}
    </div>
  );
};

export default JasyptEncryptionPage;