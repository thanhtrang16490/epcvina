# EPCVINA Multi-Site Deployment Guide

## Architecture

This repository contains **two separate websites**:

1. **epcvinahome** (`/epcvinahome`) - Corporate website (static site)
   - URL: `https://epcvina.com`
   - Tech: Astro v6 + React + Tailwind CSS
   - Output: Static HTML/CSS/JS
   - Build time: ~4s

2. **epcvinasolar** (`/epcvinasolar`) - Solar product website (SSR)
   - URL: `https://epcvina-solar.com` (or subdomain)
   - Tech: Astro v6 + React + Node.js adapter
   - Output: SSR with `@astrojs/node`
   - Build time: ~4s

---

## Deployment Options

### Option 1: Separate Deployments (Recommended)

Deploy each site to its own domain/subdomain:

```
epcvinahome    → https://epcvina.com         (static hosting)
epcvinasolar   → https://solar.epcvina.com   (SSR hosting)
```

**epcvinahome - Static Deployment:**
```bash
cd epcvinahome
npm ci
npm run build
# Deploy /epcvinahome/dist to:
# - Vercel (auto-detects Astro)
# - Netlify (auto-detects Astro)
# - Cloudflare Pages
# - Any static hosting
```

**epcvinasolar - SSR Deployment:**
```bash
cd epcvinasolar
npm ci
npm run build
# Deploy with:
# - Dokploy (Nixpacks auto-detects @astrojs/node)
# - Vercel (serverless functions)
# - DigitalOcean App Platform
# - Any Node.js hosting
```

---

### Option 2: Single Nixpacks Deployment (Current Setup)

If you must deploy both from a single Nixpacks build, the configuration in `nixpacks.toml` will:

1. Install dependencies for both projects
2. Build both projects
3. Start epcvinasolar SSR server (port 3000)

**Limitation**: Only epcvinasolar will be served. epcvinahome static files are built but not automatically served.

**To serve both**, you need ONE of these approaches:

#### A. Use Reverse Proxy (Nginx/Traefik)
```nginx
# Nginx configuration
server {
    listen 80;
    server_name epcvina.com;
    
    # Serve epcvinahome static files
    location / {
        root /app/epcvinahome/dist;
        try_files $uri $uri.html $uri/ =404;
    }
    
    # Proxy solar routes to epcvinasolar
    location /solar {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
    }
}

server {
    listen 80;
    server_name solar.epcvina.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
    }
}
```

#### B. Merge Static Files into SSR Server
Copy epcvinahome build output into epcvinasolar's client directory:
```bash
# After building both
cp -r epcvinahome/dist/* epcvinasolar/dist/client/
```

Now epcvinasolar's Node server will serve both sites.

---

## Nixpacks Configuration

Current `nixpacks.toml` supports building both projects:

```toml
[phases.setup]
nixPkgs = ["nodejs_22"]

[phases.install]
cmds = [
  "cd epcvinahome && npm ci",
  "cd epcvinasolar && npm ci"
]

[phases.build]
cmds = [
  "cd epcvinahome && npm run build",
  "cd epcvinasolar && npm run build"
]

[start]
cmd = "cd epcvinasolar && node ./dist/server/entry.mjs"
```

---

## Recommended Deployment Strategy

### For Production:

**Use separate deployments** for better performance, caching, and scalability:

1. **epcvinahome** → Static hosting (free/cheap, fast CDN)
   - Vercel: `vercel --prod`
   - Netlify: `netlify deploy --prod`
   - Cloudflare Pages: Auto-deploy from Git

2. **epcvinasolar** → SSR hosting (Node.js required)
   - Dokploy with Nixpacks
   - Vercel: Auto-detects Astro SSR
   - DigitalOcean App Platform

### For Development:

```bash
# Terminal 1 - epcvinahome
cd epcvinahome
npm run dev -- --port 4321

# Terminal 2 - epcvinasolar
cd epcvinasolar
npm run dev -- --port 4322

# Access:
# http://localhost:4321 → epcvinahome
# http://localhost:4322 → epcvinasolar
```

---

## Troubleshooting

### Nixpacks Build Fails

**Error**: "Unable to generate a build plan"

**Solution**: Check that `nixpacks.toml` exists in the repository root and paths are correct.

### SSR Server Won't Start

**Error**: "Cannot find module './dist/server/entry.mjs'"

**Solution**: Ensure `npm run build` completed successfully and `dist/server/` exists.

### Static Files Not Served

**Problem**: epcvinahome built but not accessible

**Solution**: Either:
1. Deploy to separate static hosting (recommended)
2. Copy static files to epcvinasolar/dist/client/
3. Configure reverse proxy

---

## Build Commands

```bash
# Build both projects
npm run build --prefix epcvinahome
npm run build --prefix epcvinasolar

# Or in sequence
cd epcvinahome && npm run build
cd ../epcvinasolar && npm run build

# Preview builds locally
cd epcvinahome && npm run preview  # Port 4321
cd epcvinasolar && npm run preview  # Port 4322
```

---

## Performance

| Metric | epcvinahome | epcvinasolar |
|--------|-------------|--------------|
| **Build Time** | ~4s | ~4s |
| **Output Size** | ~2MB (static) | ~3MB (SSR) |
| **TTFB** | <50ms (CDN) | <200ms (Node) |
| **Lighthouse** | 95+ | 90+ |

---

## Environment Variables

### epcvinahome
No environment variables required (static site).

### epcvinasolar
```bash
HOST=0.0.0.0
PORT=3000
NODE_ENV=production
```

---

## Git Workflow

```bash
# Commit changes
git add -A
git commit -m "feat: description"

# Push to trigger deployment
git push

# Both projects will build via Nixpacks
```
