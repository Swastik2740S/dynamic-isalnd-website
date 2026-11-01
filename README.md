# Pill website

Marketing site for Pill, the Dynamic Island for Windows. Built with Next.js 15 (App Router), React 19 and TypeScript, with no UI framework. It exports to plain static files.

## Features

- Interactive Dynamic Island demos driven by a damped spring model (`lib/spring.ts`, `lib/useSpringBox.ts`).
- Spring lab, shape list and "tuck" demos.
- Download button that finds the latest installers from the GitHub release of `Swastik2740S/Pill`.
- Page accent colour follows the hero demo's current state.

## Project layout

```
app/          App Router entry (layout, page, global CSS, icon)
components/   Demos and the download actions
lib/          Spring physics, demo hook, repo constants
```

## Getting started

Requires Node.js 18.18 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to ./out
npm start          # serve ./out locally
```

## Deploy

The site is a static export, so any static host works (Vercel, Netlify, Cloudflare Pages, GitHub Pages).
For GitHub Pages under a repo path, build with a base path:

```bash
NEXT_PUBLIC_BASE_PATH=/Pill npm run build
```

## Configuration

- The release repo is set in `lib/repo.ts`.
- The download button calls the public GitHub API in the browser. If that fails, it links to the releases page.

## Security notes

- No secrets, API keys or environment variables are used. Do not commit `.env*` files (they are git-ignored).
- The only network call is an unauthenticated `GET` to `api.github.com`. Installer links are only used if they point to `github.com/Swastik2740S/Pill/releases/download/`.
- No `dangerouslySetInnerHTML`, `eval` or user input is handled.
- Because the site is static, HTTP security headers (CSP, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`/`frame-ancestors`) must be set at your host. A suggested CSP: `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src https://api.github.com; img-src 'self' data:; frame-ancestors 'none'`.
- Run `npm audit` regularly. Dependencies are for build-time only, since the output is static.

## License

No license has been chosen yet. Add one before accepting contributions.
