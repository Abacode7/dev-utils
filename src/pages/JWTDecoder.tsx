import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import TwoColumnLayout from '../components/TwoColumnLayout';
import ToolSidebar from '../components/ToolSidebar';
import StepIndicator from '../components/StepIndicator';
import CopyButton from '../components/CopyButton';
import FileUpload from '../components/FileUpload';
import { Card, CardHeader, CardTitle, CardContent, WelcomeState, ErrorState } from '../components/ui';
import { JWTDecoder, type DecodedJWT, type JWTValidation, type SignatureVerificationResult } from '../utils/jwt';
import { useDebounce } from '../hooks/useDebounce';

const JwtDecoder: React.FC = () => {
  const [input, setInput] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MzY4NzEwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
  const [decoded, setDecoded] = useState<DecodedJWT | null>(null);
  const [validation, setValidation] = useState<JWTValidation | null>(null);
  const [error, setError] = useState<string>('');
  const [verificationKey, setVerificationKey] = useState('');
  const [algorithm, setAlgorithm] = useState<'HS256' | 'RS256'>('HS256');
  const [verificationResult, setVerificationResult] = useState<SignatureVerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentStep] = useState('input');
  
  const debouncedInput = useDebounce(input, 300);

  const steps = [
    {
      id: 'input',
      title: 'Input JWT',
      description: 'Enter JWT token',
      status: (input.trim() ? 'completed' : 'current') as 'pending' | 'current' | 'completed' | 'error',
    },
    {
      id: 'decode',
      title: 'Decode',
      description: 'Parse JWT structure',
      status: (decoded ? 'completed' : (error ? 'error' : 'pending')) as 'pending' | 'current' | 'completed' | 'error',
    },
    {
      id: 'validate',
      title: 'Validate',
      description: 'Check expiry & claims',
      status: (validation ? (validation.isValid ? 'completed' : 'error') : 'pending') as 'pending' | 'current' | 'completed' | 'error',
    },
    {
      id: 'verify',
      title: 'Verify',
      description: 'Signature verification',
      status: (verificationResult ? (verificationResult.isValid ? 'completed' : 'error') : 'pending') as 'pending' | 'current' | 'completed' | 'error',
    },
  ];

  useEffect(() => {
    if (debouncedInput.trim()) {
      try {
        const decodedJWT = JWTDecoder.decode(debouncedInput);
        const validationResult = JWTDecoder.validate(decodedJWT);
        
        setDecoded(decodedJWT);
        setValidation(validationResult);
        setError('');
        setVerificationResult(null);
      } catch (err) {
        setDecoded(null);
        setValidation(null);
        setError(err instanceof Error ? err.message : 'Failed to decode JWT');
        setVerificationResult(null);
      }
    } else {
      setDecoded(null);
      setValidation(null);
      setError('');
      setVerificationResult(null);
    }
  }, [debouncedInput]);

  const handleInputChange = (value: string | undefined) => {
    setInput(value || '');
  };

  const handleFileContent = (content: string) => {
    setInput(content.trim());
  };

  const handleClear = () => {
    setInput('');
    setVerificationKey('');
    setVerificationResult(null);
  };

  const handleVerifySignature = async () => {
    if (!decoded || !verificationKey.trim()) return;
    
    setIsVerifying(true);
    try {
      const result = await JWTDecoder.verifySignature(input, verificationKey, algorithm);
      setVerificationResult(result);
    } catch (err) {
      setVerificationResult({
        isValid: false,
        error: err instanceof Error ? err.message : 'Verification failed',
        algorithm
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatTimeToExpiry = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getExpiryStatus = () => {
    if (!validation) return null;
    
    if (validation.isExpired) {
      return { status: 'expired', color: 'red', text: 'Expired' };
    } else if (validation.isNotYetValid) {
      return { status: 'not-yet-valid', color: 'orange', text: 'Not yet valid' };
    } else if (validation.timeToExpiry && validation.timeToExpiry < 3600) {
      return { status: 'expiring-soon', color: 'yellow', text: 'Expires soon' };
    } else {
      return { status: 'valid', color: 'green', text: 'Valid' };
    }
  };

  const expiryStatus = getExpiryStatus();

  return (
    <TwoColumnLayout
      sidebar={<ToolSidebar />}
      sidebarWidth="md"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-border-primary bg-surface-primary p-6 glass-card">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-text-primary mb-2 font-display text-gradient-enterprise animate-fade-in">
              JWT Decoder
            </h1>
            <p className="text-text-secondary text-lg animate-slide-in">
              Decode, validate, and verify JSON Web Tokens with security analysis
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
            {/* JWT Input */}
            <Card className="glass-card animate-slide-in shadow-glass">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-display">JWT Token Input</CardTitle>
                  <div className="flex items-center space-x-3">
                    {decoded && expiryStatus && (
                      <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                        expiryStatus.color === 'green' ? 'bg-success-100 text-success-700' :
                        expiryStatus.color === 'red' ? 'bg-error-100 text-error-700' :
                        expiryStatus.color === 'yellow' ? 'bg-warning-100 text-warning-700' :
                        'bg-warning-100 text-warning-700'
                      }`}>
                        {expiryStatus.text}
                      </span>
                    )}
                    {decoded && (
                      <span className="text-xs text-text-tertiary">
                        Algorithm: {decoded.header.alg}
                      </span>
                    )}
                    <div className="flex space-x-2">
                      <FileUpload 
                        onFileContent={handleFileContent} 
                        accept=".txt,.jwt"
                        className="flex-shrink-0" 
                      />
                      <button
                        onClick={handleClear}
                        className="btn-glass px-3 py-1.5 rounded-md transition-all font-medium"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <textarea
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Paste your JWT token here..."
                  className="w-full h-32 p-3 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 border border-border-primary rounded-lg bg-surface-primary text-text-primary"
                />
                {error && (
                  <div className="mt-3 p-3 bg-error-50 border border-error-200 rounded-md text-error-700">
                    <strong>Error:</strong> {error}
                  </div>
                )}
              </CardContent>
            </Card>

            {decoded && validation ? (
              <>
                {/* Header & Payload */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className="flex flex-col">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>JWT Header</CardTitle>
                        <CopyButton text={JSON.stringify(decoded.header, null, 2)} className="text-sm" />
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="border border-border-primary rounded-lg overflow-hidden">
                        <Editor
                          height="200px"
                          language="json"
                          value={JSON.stringify(decoded.header, null, 2)}
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

                  <Card className="flex flex-col">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>JWT Payload</CardTitle>
                        <CopyButton text={JSON.stringify(decoded.payload, null, 2)} className="text-sm" />
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="border border-border-primary rounded-lg overflow-hidden">
                        <Editor
                          height="200px"
                          language="json"
                          value={JSON.stringify(decoded.payload, null, 2)}
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

                {/* Token Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Token Information</CardTitle>
                  </CardHeader>
                  <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {validation.issuedAt && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Issued At:</span>
                    <div className="text-sm text-gray-900">{formatTime(decoded.payload.iat!)}</div>
                  </div>
                )}
                {validation.expiresAt && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Expires At:</span>
                    <div className="text-sm text-gray-900">{formatTime(decoded.payload.exp!)}</div>
                  </div>
                )}
                {validation.timeToExpiry && !validation.isExpired && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Time to Expiry:</span>
                    <div className="text-sm text-gray-900">{formatTimeToExpiry(validation.timeToExpiry)}</div>
                  </div>
                )}
                {validation.notValidBefore && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Not Before:</span>
                    <div className="text-sm text-gray-900">{formatTime(decoded.payload.nbf!)}</div>
                  </div>
                )}
                {decoded.payload.iss && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Issuer:</span>
                    <div className="text-sm text-gray-900">{decoded.payload.iss}</div>
                  </div>
                )}
                {decoded.payload.sub && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Subject:</span>
                    <div className="text-sm text-gray-900">{decoded.payload.sub}</div>
                  </div>
                )}
              </div>
              
                    {validation.errors.length > 0 && (
                      <div className="mt-4 p-3 bg-error-50 border border-error-200 rounded-md">
                        <h4 className="font-medium text-error-800 mb-2">Validation Errors:</h4>
                        <ul className="text-sm text-error-700 space-y-1">
                          {validation.errors.map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>


                {/* Signature Verification */}
                <Card>
                  <CardHeader>
                    <CardTitle>Signature Verification</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-warning-800">Security Warning</h4>
                        <p className="text-sm text-warning-700 mt-1">
                          This verification is for educational purposes. Never enter production secrets in client-side applications.
                        </p>
                      </div>
                    </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <label className="text-sm font-medium text-gray-700">Algorithm:</label>
                      <select
                        value={algorithm}
                        onChange={(e) => setAlgorithm(e.target.value as 'HS256' | 'RS256')}
                        className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="HS256">HS256 (HMAC + SHA256)</option>
                        <option value="RS256">RS256 (RSA + SHA256)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {algorithm === 'HS256' ? 'Secret Key:' : 'Public Key (PEM format):'}
                      </label>
                      <textarea
                        value={verificationKey}
                        onChange={(e) => setVerificationKey(e.target.value)}
                        placeholder={algorithm === 'HS256' ? 'Enter your secret key...' : 'Enter your RSA public key in PEM format...'}
                        className="w-full h-24 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      />
                    </div>
                    
                    <button
                      onClick={handleVerifySignature}
                      disabled={!verificationKey.trim() || isVerifying}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {isVerifying ? 'Verifying...' : 'Verify Signature'}
                    </button>
                    
                    {verificationResult && (
                      <div className={`p-3 rounded ${
                        verificationResult.isValid 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-red-50 border border-red-200'
                      }`}>
                        <div className={`font-medium ${
                          verificationResult.isValid ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {verificationResult.isValid ? '✓ Signature Valid' : '✗ Signature Invalid'}
                        </div>
                        {verificationResult.error && (
                          <div className="text-sm text-red-700 mt-1">
                            {verificationResult.error}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : !error ? (
              <WelcomeState
                icon="jwt"
                title="JWT Token Analysis"
                description="Paste a JWT token above to decode its header, payload, and verify its signature"
                className="mt-6"
              />
            ) : (
              <ErrorState
                title="Invalid JWT Token"
                description={error}
                actionLabel="Try Sample JWT"
                onAction={() => handleInputChange('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')}
                className="mt-6"
              />
            )}
          </div>
        </div>
      </div>
    </TwoColumnLayout>
  );
};

export default JwtDecoder;