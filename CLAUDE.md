# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev           # Vite dev server with HMR
npm run build         # TypeScript compilation + Vite production build
npm run type-check    # TypeScript type checking (no emit) — run before committing
npm run lint          # ESLint check (flat config format)
npm run lint:fix      # ESLint auto-fix
npm run preview:build # Build then preview production locally
npm run analyze       # Bundle analysis (vite-bundle-analyzer)
npm run clean         # Remove dist/ and Vite cache
```

**No test framework is configured.** The GitHub Actions workflow has a test step but it's gated on `if-present` and will skip.

## Architecture Overview

React 19 + TypeScript SPA providing browser-based developer utilities (JSON validator, JSON minifier, JWT decoder, Jasypt encryption). All processing is client-side only — no backend.

### Key Architectural Decisions

- **No global state** — component-level state with React hooks only. Theme persists via `useTheme` hook + localStorage.
- **Web Crypto API primary** — `src/utils/jasypt.ts` and `src/utils/jwt.ts` use `crypto.subtle`, not `crypto-js` (which exists only as a legacy chunk dependency).
- **No lazy-loaded routes** — all 5 pages are imported directly in `App.tsx`.
- **Manual chunk splitting** in `vite.config.ts`: separate chunks for Monaco Editor, UI component libs (CVA/clsx/tailwind-merge), and crypto-js.
- **Design tokens as single source of truth** — `src/styles/design-tokens.ts` feeds into `tailwind.config.js` for colors, spacing, border-radius, and z-index.
- **Mobile-first responsive design** — `useResponsive` hook provides breakpoint detection; touch targets minimum 44px.

### Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | Home | Tool overview cards |
| `/json-validator` | JsonValidator | Monaco Editor input, real-time validation (300ms debounce) |
| `/json-minifier` | JsonMinifier | Side-by-side original vs minified with size metrics |
| `/jwt-decoder` | JWTDecoder | Decode, validate, verify signatures (HS256/RS256) |
| `/jasypt` | JasyptEncryption | Encrypt/decrypt with AES-256-GCM or PBEWithHmacSHA256AndAES_256 |

Layout wraps all routes with `ErrorBoundary`, `Header`, and `KeyboardShortcutsHelp`.

### Component Patterns

- **UI components** (`src/components/ui/`) use `class-variance-authority` for variants and `cn()` (`src/utils/cn.ts`) for class merging.
- **Barrel export**: `import { Button, Card, Input } from '../components/ui'`
- **All components** are functional with TypeScript interfaces and `forwardRef` for DOM access.

### Theme System

Three modes: `light`, `dark`, `system` (default follows OS). Applied via `data-theme` attribute on document root. Dark mode CSS custom properties are in `src/styles/globals.css` under `[data-theme='dark']`.

### Accessibility

`globals.css` includes `@media (prefers-reduced-motion)` for motion reduction, `@media (prefers-contrast)` for high contrast mode, and print styles. Components use ARIA labels and keyboard navigation.

### TypeScript Configuration

Multi-config setup: `tsconfig.json` references `tsconfig.app.json` (ES2022, strict, bundler resolution) and `tsconfig.node.json` (ES2023 for build tools). Both use `noEmit: true`.

### Deployment

Netlify (`netlify.toml`): Node 18, publish `dist/`, SPA redirect `/* → /index.html`, security headers, aggressive asset caching (1 year immutable), force HTTPS. GitHub Actions workflow exists in `.github/workflows/deploy.yml` but is currently disabled.

## Common Patterns

### Adding a New Tool Page

1. Create page component in `src/pages/NewTool.tsx`
2. Add route in `src/App.tsx`:
   ```tsx
   import NewTool from './pages/NewTool';
   <Route path="/new-tool" element={<NewTool />} />
   ```
3. Add navigation link in `src/components/Header.tsx`
4. Add card on home page in `src/pages/Home.tsx`

### Working with Crypto APIs

Always use Web Crypto API (`crypto.subtle`), not `crypto-js`. Follow patterns in `src/utils/jasypt.ts` (PBKDF2 key derivation, 10,000+ iterations) and `src/utils/jwt.ts` (HS256/RS256 verification).
