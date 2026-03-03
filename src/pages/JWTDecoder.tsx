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
import { useTheme } from '../hooks/useTheme';

const JwtDecoder: React.FC = () => {
  const [input, setInput] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MzY4NzEwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
  const [decoded, setDecoded] = useState<DecodedJWT | null>(null);
  const [validation, setValidation] = useState<JWTValidation | null>(null);
  const [error, setError] = useState<string>('');
  const [verificationKey, setVerificationKey] = useState('');
  const [algorithm, setAlgorithm] = useState<'HS256' | 'RS256'>('HS256');
  const [verificationResult, setVerificationResult] = useState<SignatureVerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const { resolvedTheme } = useTheme();
  const monacoTheme = resolvedTheme === 'dark' ? 'vs-dark' : 'vs-light';

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

  // Status badge color helper
  const getStatusBadgeStyle = (color: string) => {
    switch (color) {
      case 'green':
        return {
          background: 'color-mix(in srgb, var(--green) 15%, transparent)',
          color: 'var(--green)',
        };
      case 'red':
        return {
          background: 'color-mix(in srgb, var(--red) 15%, transparent)',
          color: 'var(--red)',
        };
      default:
        return {
          background: 'color-mix(in srgb, var(--yellow) 15%, transparent)',
          color: 'var(--yellow)',
        };
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
                background: 'color-mix(in srgb, var(--mauve) 15%, transparent)',
              }}
            >
              <Icons.Jwt size={20} style={{ color: 'var(--mauve)' }} />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              JWT Decoder
            </h1>
          </div>
          <p className="text-sm ml-12" style={{ color: 'var(--text-secondary)' }}>
            Decode, validate, and verify JSON Web Tokens with security analysis.
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <div className="max-w-6xl space-y-6">
            {/* JWT Input - Premium card */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'var(--surface0)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div className="px-5 py-4 flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  JWT Token
                </span>
                <div className="flex items-center gap-3">
                  {decoded && expiryStatus && (
                    <span
                      className="text-xs px-3 py-1.5 rounded-full font-medium"
                      style={getStatusBadgeStyle(expiryStatus.color)}
                    >
                      {expiryStatus.text}
                    </span>
                  )}
                  {decoded && (
                    <span
                      className="text-xs px-2 py-1 rounded-lg font-mono"
                      style={{
                        background: 'var(--surface1)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {decoded.header.alg}
                    </span>
                  )}
                  <FileUpload onFileContent={handleFileContent} accept=".txt,.jwt" />
                  <Button variant="ghost" size="sm" onClick={handleClear}>
                    Clear
                  </Button>
                </div>
              </div>
              <div className="px-5 pb-5">
                <textarea
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Paste your JWT token here..."
                  className="w-full h-24 p-4 font-mono text-sm resize-none rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
                  style={{
                    background: 'var(--surface1)',
                    color: 'var(--text-primary)',
                    border: 'none',
                  }}
                />
                {error && (
                  <div
                    className="mt-3 p-4 text-sm rounded-xl"
                    style={{
                      background: 'color-mix(in srgb, var(--red) 10%, transparent)',
                      color: 'var(--red)',
                    }}
                  >
                    <strong>Error:</strong> {error}
                  </div>
                )}
              </div>
            </div>

            {decoded && validation ? (
              <>
                {/* Header & Payload */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: 'var(--surface0)',
                      boxShadow: 'var(--shadow-md)',
                    }}
                  >
                    <div className="px-5 py-4 flex items-center justify-between">
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Header
                      </span>
                      <CopyButton text={JSON.stringify(decoded.header, null, 2)} />
                    </div>
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
                      theme={monacoTheme}
                    />
                  </div>

                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: 'var(--surface0)',
                      boxShadow: 'var(--shadow-md)',
                    }}
                  >
                    <div className="px-5 py-4 flex items-center justify-between">
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Payload
                      </span>
                      <CopyButton text={JSON.stringify(decoded.payload, null, 2)} />
                    </div>
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
                      theme={monacoTheme}
                    />
                  </div>
                </div>

                {/* Token Information */}
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: 'var(--surface0)',
                    boxShadow: 'var(--shadow-md)',
                  }}
                >
                  <div className="px-5 py-4">
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Token Information
                    </span>
                  </div>
                  <div className="px-5 pb-5">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {validation.issuedAt && decoded.payload.iat && (
                        <div
                          className="p-4 rounded-xl"
                          style={{ background: 'var(--surface1)' }}
                        >
                          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--overlay1)' }}>
                            Issued At
                          </span>
                          <div className="mt-1 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                            {formatTime(decoded.payload.iat)}
                          </div>
                        </div>
                      )}
                      {validation.expiresAt && decoded.payload.exp && (
                        <div
                          className="p-4 rounded-xl"
                          style={{ background: 'var(--surface1)' }}
                        >
                          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--overlay1)' }}>
                            Expires At
                          </span>
                          <div className="mt-1 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                            {formatTime(decoded.payload.exp)}
                          </div>
                        </div>
                      )}
                      {decoded.payload.iss && (
                        <div
                          className="p-4 rounded-xl"
                          style={{ background: 'var(--surface1)' }}
                        >
                          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--overlay1)' }}>
                            Issuer
                          </span>
                          <div className="mt-1 text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                            {decoded.payload.iss}
                          </div>
                        </div>
                      )}
                      {decoded.payload.sub && (
                        <div
                          className="p-4 rounded-xl"
                          style={{ background: 'var(--surface1)' }}
                        >
                          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--overlay1)' }}>
                            Subject
                          </span>
                          <div className="mt-1 text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                            {decoded.payload.sub}
                          </div>
                        </div>
                      )}
                    </div>

                    {validation.errors.length > 0 && (
                      <div
                        className="mt-4 p-4 rounded-xl"
                        style={{
                          background: 'color-mix(in srgb, var(--red) 10%, transparent)',
                        }}
                      >
                        <h4 className="font-semibold text-sm mb-2" style={{ color: 'var(--red)' }}>
                          Validation Errors
                        </h4>
                        <ul className="text-sm space-y-1" style={{ color: 'var(--red)' }}>
                          {validation.errors.map((err, index) => (
                            <li key={index}>• {err}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Signature Verification */}
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: 'var(--surface0)',
                    boxShadow: 'var(--shadow-md)',
                  }}
                >
                  <div className="px-5 py-4">
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Signature Verification
                    </span>
                  </div>
                  <div className="px-5 pb-5 space-y-4">
                    <div
                      className="p-4 rounded-xl flex items-start gap-3"
                      style={{
                        background: 'color-mix(in srgb, var(--yellow) 10%, transparent)',
                      }}
                    >
                      <Icons.Warning size={18} style={{ color: 'var(--yellow)', marginTop: '2px', flexShrink: 0 }} />
                      <div className="text-sm" style={{ color: 'var(--yellow)' }}>
                        <strong>Security Warning:</strong> This verification is for educational purposes. Never enter production secrets in client-side applications.
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Algorithm:
                      </label>
                      <select
                        value={algorithm}
                        onChange={(e) => setAlgorithm(e.target.value as 'HS256' | 'RS256')}
                        className="px-3 py-2 text-sm rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
                        style={{
                          background: 'var(--surface1)',
                          color: 'var(--text-primary)',
                          border: 'none',
                        }}
                      >
                        <option value="HS256">HS256 (HMAC + SHA256)</option>
                        <option value="RS256">RS256 (RSA + SHA256)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                        {algorithm === 'HS256' ? 'Secret Key' : 'Public Key (PEM format)'}
                      </label>
                      <textarea
                        value={verificationKey}
                        onChange={(e) => setVerificationKey(e.target.value)}
                        placeholder={algorithm === 'HS256' ? 'Enter your secret key...' : 'Enter your RSA public key in PEM format...'}
                        className="w-full h-24 p-4 text-sm rounded-xl focus:outline-none focus:ring-2 font-mono transition-all duration-200"
                        style={{
                          background: 'var(--surface1)',
                          color: 'var(--text-primary)',
                          border: 'none',
                        }}
                      />
                    </div>

                    <Button
                      onClick={handleVerifySignature}
                      disabled={!verificationKey.trim() || isVerifying}
                    >
                      {isVerifying ? 'Verifying...' : 'Verify Signature'}
                    </Button>

                    {verificationResult && (
                      <div
                        className="p-4 rounded-xl"
                        style={{
                          background: verificationResult.isValid
                            ? 'color-mix(in srgb, var(--green) 10%, transparent)'
                            : 'color-mix(in srgb, var(--red) 10%, transparent)',
                          color: verificationResult.isValid ? 'var(--green)' : 'var(--red)',
                        }}
                      >
                        <div className="font-semibold text-sm">
                          {verificationResult.isValid ? 'Signature Valid' : 'Signature Invalid'}
                        </div>
                        {verificationResult.error && (
                          <div className="text-sm mt-1 opacity-80">
                            {verificationResult.error}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : !error && (
              <div className="text-center py-16" style={{ color: 'var(--text-tertiary)' }}>
                <div
                  className="mx-auto mb-4 p-4 rounded-2xl w-fit"
                  style={{ background: 'var(--surface0)' }}
                >
                  <Icons.Jwt size={32} style={{ color: 'var(--overlay1)' }} />
                </div>
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
