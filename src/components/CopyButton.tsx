import React, { useState } from 'react';
import { Button } from './ui';
import { Icons } from '../styles/icons';
import Tooltip from './Tooltip';

interface CopyButtonProps {
  text: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showText?: boolean;
}

const CopyButton: React.FC<CopyButtonProps> = ({ 
  text, 
  className = '', 
  variant = 'outline',
  size = 'sm',
  showText = true
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const buttonContent = (
    <Button
      onClick={handleCopy}
      variant={copied ? 'success' : variant}
      size={size}
      className={className}
      disabled={!text}
    >
      {copied ? (
        <>
          <Icons.Check size={16} />
          {showText && <span className="ml-1">Copied!</span>}
        </>
      ) : (
        <>
          <Icons.Copy size={16} />
          {showText && <span className="ml-1">Copy</span>}
        </>
      )}
    </Button>
  );

  if (!showText) {
    return (
      <Tooltip content={copied ? 'Copied!' : 'Copy to clipboard'}>
        {buttonContent}
      </Tooltip>
    );
  }

  return buttonContent;
};

export default CopyButton;