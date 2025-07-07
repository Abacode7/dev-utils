import { useState } from 'react';

interface URLInputProps {
  onURLContent: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const URLInput: React.FC<URLInputProps> = ({ 
  onURLContent, 
  placeholder = "Enter URL to fetch JSON...",
  className = '' 
}) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetch = async () => {
    if (!url.trim()) return;
    
    setLoading(true);
    setError('');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(url, { 
        signal: controller.signal,
        mode: 'cors'
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const content = await response.text();
      onURLContent(content);
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError('Request timed out after 10 seconds');
        } else if (err.message.includes('CORS')) {
          setError('CORS error: URL does not allow cross-origin requests');
        } else {
          setError(err.message);
        }
      } else {
        setError('Failed to fetch URL');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFetch();
    }
  };

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <div className="flex space-x-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleFetch}
          disabled={loading || !url.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Fetching...' : 'Fetch'}
        </button>
      </div>
      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default URLInput;