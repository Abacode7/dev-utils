import { useRef, type ChangeEvent } from 'react';

interface FileUploadProps {
  onFileContent: (content: string) => void;
  accept?: string;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileContent, 
  accept = '.json,.txt',
  className = '' 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onFileContent(content);
      };
      reader.readAsText(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />
      <button
        onClick={handleClick}
        className={`px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors ${className}`}
      >
        Upload File
      </button>
    </>
  );
};

export default FileUpload;