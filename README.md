# Developer Utilities Web App

A modern, production-ready web application providing essential developer tools including JSON validation, JWT decoding, and encryption utilities.

## 🚀 Features

- **JSON Validator & Formatter** - Validate and format JSON with syntax highlighting
- **JSON Minifier** - Compress JSON by removing whitespace with size comparison
- **JWT Decoder** - Decode and analyze JWT tokens with signature verification
- **Jasypt Encryption** - Production-grade encryption/decryption with multiple algorithms

## ✨ Key Highlights

- **Modern React 19** with TypeScript for type safety
- **Responsive Design** with mobile-first approach
- **Dark/Light Mode** with system preference detection
- **Performance Optimized** with lazy loading and code splitting
- **Comprehensive Error Handling** with user-friendly error boundaries
- **Accessibility Ready** with ARIA labels and keyboard navigation
- **Production Deployment** ready for Netlify/Vercel

## 🛠️ Tech Stack

- **Frontend**: React 19.1.0 + TypeScript + Vite
- **Styling**: Tailwind CSS 4.x + Custom Design System
- **UI Components**: Custom component library with variants
- **Code Editor**: Monaco Editor for syntax highlighting
- **Build**: Vite with code splitting and optimization
- **Deployment**: Netlify/Vercel with CI/CD

## 🏗️ Architecture

### Design System
- Comprehensive color palette with semantic tokens
- Typography scale with Inter font family
- Custom SVG icon library
- Reusable UI components (Button, Card, Input, etc.)
- Dark mode support with CSS custom properties

### Performance
- Lazy loading for route-based code splitting
- Bundle optimization with manual chunks
- Performance monitoring hooks
- Virtualization for large data sets
- Error boundaries with retry mechanisms

### Mobile Experience
- Touch-friendly interface with 44px minimum tap targets
- Responsive navigation with mobile menu
- Container queries for adaptive layouts
- Reduced motion support for accessibility

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd dev-utils

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Development

```bash
# Development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Build for production
npm run build

# Preview production build
npm run preview

# Analyze bundle size
npm run analyze
```

## 🚀 Deployment

### Netlify
```bash
# Deploy to Netlify
npm run deploy:netlify

# Or use automatic deployment with git push to main branch
git push origin main
```

### Vercel
```bash
# Deploy to Vercel
npm run deploy:vercel

# Or connect your git repository to Vercel dashboard
```

### CI/CD Pipeline
The project includes GitHub Actions workflows for:
- Automated testing and linting
- Lighthouse performance auditing
- Security vulnerability scanning
- Automatic deployment to production

## 📊 Performance

### Optimization Features
- **Code Splitting**: Route-based lazy loading
- **Bundle Analysis**: Monaco Editor and crypto utilities in separate chunks
- **Caching**: Aggressive caching for static assets
- **Compression**: Optimized build output with source maps

### Lighthouse Scores Target
- Performance: 80+
- Accessibility: 90+
- Best Practices: 80+
- SEO: 80+

## 🔐 Security

### Security Headers
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy restrictions

### Cryptographic Security
- Web Crypto API for JWT signature verification
- PBKDF2 key derivation with 10,000+ iterations
- AES-256-GCM encryption for production use
- Secure password generation and validation

## 🎨 Design System

### Color Palette
- Primary: Blue scale (#3B82F6 main)
- Secondary: Cyan scale for accents
- Semantic: Success (green), Warning (yellow), Error (red)
- Neutral: Gray scale for text and backgrounds

### Typography
- Display: Inter for headings
- Body: Inter for content
- Code: JetBrains Mono for monospace

### Components
- Button variants (primary, secondary, outline, ghost)
- Card layouts (default, glass, elevated)
- Form controls with validation states
- Loading and skeleton states

## 📱 Mobile Support

### Touch Optimizations
- 44px minimum touch targets
- Touch-friendly spacing and padding
- Prevent zoom on input focus (16px font size)
- Optimized mobile navigation

### Responsive Breakpoints
- xs: 0px (mobile)
- sm: 640px (large mobile)
- md: 768px (tablet)
- lg: 1024px (desktop)
- xl: 1280px (large desktop)
- 2xl: 1536px (extra large)

## 🧪 Testing

### Performance Testing
```bash
# Run Lighthouse audit
npm run lighthouse

# Analyze bundle size
npm run analyze
```

### Browser Support
- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- Mobile browsers with modern JS support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper TypeScript types
4. Run linting and type checking
5. Test in mobile and desktop viewports
6. Create a pull request

## 📄 License

MIT License - see LICENSE file for details

<!-- ## 🔗 Links

- [Netlify Deployment](https://dev-utils.netlify.app)
- [Vercel Deployment](https://dev-utils.vercel.app)
- [GitHub Repository](https://github.com/username/dev-utils) -->

---

Built with ❤️ using modern web technologies for the developer community.