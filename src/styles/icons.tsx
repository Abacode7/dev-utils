// Custom SVG Icon Library
import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  'aria-label'?: string;
}

// Base icon component
const Icon: React.FC<IconProps & { children: React.ReactNode }> = ({
  size = 24,
  className = '',
  children,
  'aria-label': ariaLabel,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-label={ariaLabel}
    role="img"
  >
    {children}
  </svg>
);

// Professional Tool Icons
export const JsonIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="JSON">
    <path d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7c0-2.21-1.79-4-4-4H8c-2.21 0-4 1.79-4 4z" />
    <path d="M9 9h6" />
    <path d="M9 12h4" />
    <path d="M9 15h6" />
    <circle cx="7" cy="9" r="1" />
    <circle cx="7" cy="12" r="1" />
    <circle cx="7" cy="15" r="1" />
  </Icon>
);

export const ValidateIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="Validate">
    <path d="M7.5 12h9l-2 2" />
    <path d="M7.5 12l2-2" />
    <circle cx="12" cy="12" r="9" />
  </Icon>
);

export const CompressIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="Compress">
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
    <path d="M8 8l8 8" />
    <path d="M8 16l8-8" />
  </Icon>
);

// JWT-related icons
export const JwtIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="JWT Token">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="16" r="1" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Icon>
);

export const DecodeIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="Decode">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27,6.96 12,12.01 20.73,6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </Icon>
);

export const VerifyIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="Verify">
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="M9 12l2 2 4-4" />
  </Icon>
);

// Encryption-related icons
export const EncryptIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="Encrypt">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    <circle cx="12" cy="16" r="1" />
  </Icon>
);

export const DecryptIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="Decrypt">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    <circle cx="12" cy="16" r="1" />
  </Icon>
);

export const KeyIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="Key">
    <circle cx="7.5" cy="15.5" r="5.5" />
    <path d="M21 2l-6 6m-2 5h-7l2-2m0 4l2-2" />
  </Icon>
);

// UI/UX icons
export const CopyIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="Copy">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </Icon>
);

export const DownloadIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="Download">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7,10 12,15 17,10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </Icon>
);

export const UploadIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="Upload">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17,8 12,3 7,8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </Icon>
);

export const FileIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="File">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10,9 9,9 8,9" />
  </Icon>
);

export const LinkIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="Link">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </Icon>
);

export const CheckIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="Check">
    <polyline points="20,6 9,17 4,12" />
  </Icon>
);

export const XIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="Close">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </Icon>
);

export const AlertIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="Alert">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </Icon>
);

export const InfoIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="Info">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </Icon>
);

export const SettingsIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="Settings">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </Icon>
);

export const MoonIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="Dark Mode">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </Icon>
);

export const SunIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="Light Mode">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </Icon>
);

// Navigation icons
export const HomeIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="Home">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
  </Icon>
);

export const MenuIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="Menu">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </Icon>
);

export const PlayIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="Play">
    <polygon points="5,3 19,12 5,21" />
  </Icon>
);

export const HelpIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="Help">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </Icon>
);

// Professional Brand Icons
export const BrandIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="Brand">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
  </Icon>
);

export const EnterpriseIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="Enterprise">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01" />
    <path d="M16 6h.01" />
    <path d="M12 6h.01" />
    <path d="M12 10h.01" />
    <path d="M12 14h.01" />
    <path d="M16 10h.01" />
    <path d="M16 14h.01" />
    <path d="M8 10h.01" />
    <path d="M8 14h.01" />
  </Icon>
);

export const SecurityIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="Security">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </Icon>
);

export const PerformanceIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="Performance">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </Icon>
);

export const QualityIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="Quality">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </Icon>
);

export const AnalyticsIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="Analytics">
    <path d="M3 3v18h18" />
    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
    <circle cx="7" cy="14" r="1" />
    <circle cx="11" cy="11" r="1" />
    <circle cx="16" cy="6" r="1" />
  </Icon>
);

// Additional icons needed for components
export const LoadingIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="Loading">
    <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="32" className="animate-spin" />
  </Icon>
);

export const SearchIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="Search">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </Icon>
);

export const ErrorIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="Error">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </Icon>
);

export const WarningIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="Warning">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </Icon>
);

export const GlobeIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="Globe">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </Icon>
);

export const LockIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} aria-label="Lock">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Icon>
);

// Export all icons for easy access
export const Icons = {
  // JSON tools
  Json: JsonIcon,
  Validate: ValidateIcon,
  Compress: CompressIcon,
  
  // JWT tools
  Jwt: JwtIcon,
  Decode: DecodeIcon,
  Verify: VerifyIcon,
  
  // Encryption tools
  Encrypt: EncryptIcon,
  Decrypt: DecryptIcon,
  Key: KeyIcon,
  
  // UI/UX
  Copy: CopyIcon,
  Download: DownloadIcon,
  Upload: UploadIcon,
  File: FileIcon,
  Link: LinkIcon,
  Check: CheckIcon,
  X: XIcon,
  Alert: AlertIcon,
  Info: InfoIcon,
  Settings: SettingsIcon,
  Moon: MoonIcon,
  Sun: SunIcon,
  Home: HomeIcon,
  Menu: MenuIcon,
  Play: PlayIcon,
  Help: HelpIcon,
  
  // Professional Brand
  Brand: BrandIcon,
  Enterprise: EnterpriseIcon,
  Security: SecurityIcon,
  Performance: PerformanceIcon,
  Quality: QualityIcon,
  Analytics: AnalyticsIcon,
  
  // Additional UI Icons
  Loading: LoadingIcon,
  Search: SearchIcon,
  Error: ErrorIcon,
  Warning: WarningIcon,
  Globe: GlobeIcon,
  Lock: LockIcon,
  FileIcon: FileIcon,
} as const;

export type IconName = keyof typeof Icons;