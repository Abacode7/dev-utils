import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import TwoColumnLayout from '../components/TwoColumnLayout';
import ToolSidebar from '../components/ToolSidebar';
import CopyButton from '../components/CopyButton';
import FileUpload from '../components/FileUpload';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../components/ui';
import { Icons } from '../styles/icons';
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

  const debouncedInput = useDebounce(input, 300);

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

  const getExpiryStatus = () => {
    if (!validation) return null;

    if (validation.isExpired) {
      return { color: 'red', text: 'Expired' };
    } else if (validation.isNotYetValid) {
      return { color: 'amber', text: 'Not yet valid' };
    } else if (validation.timeToExpiry && validation.timeToExpiry < 3600) {
      return { color: 'amber', text: 'Expires soon' };
    } else {
      return { color: 'green', text: 'Valid' };
    }
  };

  const expiryStatus = getExpiryStatus();

  return (
    <TwoColumnLayout
      sidebar={<ToolSidebar />}
      sidebarWidth="md"
    >
      <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="border-b border-neutral-100 px-8 py-6">
          <h1 className="text-xl font-semibold text-neutral-900">JWT Decoder</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Decode, validate, and verify JSON Web Tokens with security analysis.
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl space-y-6">
            {/* JWT Input */}
            <Card size="none">
              <CardHeader className="p-4 border-b border-neutral-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">JWT Token</CardTitle>
                  <div className="flex items-center gap-3">
                    {decoded && expiryStatus && (
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        expiryStatus.color === 'green' ? 'bg-green-50 text-green-700' :
                        expiryStatus.color === 'red' ? 'bg-red-50 text-red-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {expiryStatus.text}
                      </span>
                    )}
                    {decoded && (
                      <span className="text-xs text-neutral-500">
                        {decoded.header.alg}
                      </span>
                    )}
                    <FileUpload onFileContent={handleFileContent} accept=".txt,.jwt" />
                    <Button variant="ghost" size="sm" onClick={handleClear}>
                      Clear
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <textarea
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Paste your JWT token here..."
                  className="w-full h-24 p-3 font-mono text-sm resize-none border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white text-neutral-900 placeholder:text-neutral-400"
                />
                {error && (
                  <div className="mt-3 p-3 bg-red-50 text-red-700 text-sm rounded-lg">
                    <strong>Error:</strong> {error}
                  </div>
                )}
              </CardContent>
            </Card>

            {decoded && validation ? (
              <>
                {/* Header & Payload */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card size="none">
                    <CardHeader className="p-4 border-b border-neutral-100">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">Header</CardTitle>
                        <CopyButton text={JSON.stringify(decoded.header, null, 2)} />
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Editor
                        height="180px"
                        language="json"
                        value={JSON.stringify(decoded.header, null, 2)}
                        options={{
                          readOnly: true,
                          minimap: { enabled: false },
                          scrollBeyondLastLine: false,
                          fontSize: 13,
                          wordWrap: 'on',
                          automaticLayout: true,
                          padding: { top: 12, bottom: 12 },
                        }}
                        theme="vs-light"
                      />
                    </CardContent>
                  </Card>

                  <Card size="none">
                    <CardHeader className="p-4 border-b border-neutral-100">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">Payload</CardTitle>
                        <CopyButton text={JSON.stringify(decoded.payload, null, 2)} />
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Editor
                        height="180px"
                        language="json"
                        value={JSON.stringify(decoded.payload, null, 2)}
                        options={{
                          readOnly: true,
                          minimap: { enabled: false },
                          scrollBeyondLastLine: false,
                          fontSize: 13,
                          wordWrap: 'on',
                          automaticLayout: true,
                          padding: { top: 12, bottom: 12 },
                        }}
                        theme="vs-light"
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Token Information */}
                <Card size="sm">
                  <CardHeader className="p-4 border-b border-neutral-100">
                    <CardTitle className="text-sm font-medium">Token Information</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {validation.issuedAt && decoded.payload.iat && (
                        <div>
                          <span className="text-xs font-medium text-neutral-500 uppercase">Issued At</span>
                          <div className="mt-1 text-sm text-neutral-900">{formatTime(decoded.payload.iat)}</div>
                        </div>
                      )}
                      {validation.expiresAt && decoded.payload.exp && (
                        <div>
                          <span className="text-xs font-medium text-neutral-500 uppercase">Expires At</span>
                          <div className="mt-1 text-sm text-neutral-900">{formatTime(decoded.payload.exp)}</div>
                        </div>
                      )}
                      {decoded.payload.iss && (
                        <div>
                          <span className="text-xs font-medium text-neutral-500 uppercase">Issuer</span>
                          <div className="mt-1 text-sm text-neutral-900">{decoded.payload.iss}</div>
                        </div>
                      )}
                      {decoded.payload.sub && (
                        <div>
                          <span className="text-xs font-medium text-neutral-500 uppercase">Subject</span>
                          <div className="mt-1 text-sm text-neutral-900">{decoded.payload.sub}</div>
                        </div>
                      )}
                    </div>

                    {validation.errors.length > 0 && (
                      <div className="mt-4 p-3 bg-red-50 rounded-lg">
                        <h4 className="font-medium text-red-800 text-sm mb-2">Validation Errors</h4>
                        <ul className="text-sm text-red-700 space-y-1">
                          {validation.errors.map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Signature Verification */}
                <Card size="sm">
                  <CardHeader className="p-4 border-b border-neutral-100">
                    <CardTitle className="text-sm font-medium">Signature Verification</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <div className="p-3 bg-amber-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Icons.Warning size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-amber-800">
                          <strong>Security Warning:</strong> This verification is for educational purposes. Never enter production secrets in client-side applications.
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium text-neutral-700">Algorithm:</label>
                      <select
                        value={algorithm}
                        onChange={(e) => setAlgorithm(e.target.value as 'HS256' | 'RS256')}
                        className="px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white text-neutral-700"
                      >
                        <option value="HS256">HS256 (HMAC + SHA256)</option>
                        <option value="RS256">RS256 (RSA + SHA256)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        {algorithm === 'HS256' ? 'Secret Key' : 'Public Key (PEM format)'}
                      </label>
                      <textarea
                        value={verificationKey}
                        onChange={(e) => setVerificationKey(e.target.value)}
                        placeholder={algorithm === 'HS256' ? 'Enter your secret key...' : 'Enter your RSA public key in PEM format...'}
                        className="w-full h-20 p-3 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white text-neutral-900 font-mono placeholder:text-neutral-400"
                      />
                    </div>

                    <Button
                      onClick={handleVerifySignature}
                      disabled={!verificationKey.trim() || isVerifying}
                    >
                      {isVerifying ? 'Verifying...' : 'Verify Signature'}
                    </Button>

                    {verificationResult && (
                      <div className={`p-3 rounded-lg ${
                        verificationResult.isValid
                          ? 'bg-green-50 text-green-800'
                          : 'bg-red-50 text-red-800'
                      }`}>
                        <div className="font-medium text-sm">
                          {verificationResult.isValid ? 'Signature Valid' : 'Signature Invalid'}
                        </div>
                        {verificationResult.error && (
                          <div className="text-sm mt-1 opacity-80">
                            {verificationResult.error}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : !error && (
              <div className="text-center py-12 text-neutral-400">
                <Icons.Jwt size={48} className="mx-auto mb-3 opacity-50" />
                <p className="text-sm">Paste a JWT token above to decode it</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </TwoColumnLayout>
  );
};

export default JwtDecoder;
