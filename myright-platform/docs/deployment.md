# Deployment Guide

## Overview

The MyRight Platform is designed for seamless deployment to modern hosting platforms. This guide covers deployment to Vercel, Netlify, and self-hosted environments.

## Pre-Deployment Checklist

### ✅ Prerequisites
- [ ] Node.js 18+ installed
- [ ] All tests passing (`npm test`)
- [ ] Production build successful (`npm run build:production`)
- [ ] Environment variables configured
- [ ] Content data prepared
- [ ] Domain and SSL certificate ready (optional)

### ✅ Security Review
- [ ] No sensitive data in repository
- [ ] Environment variables properly configured
- [ ] CSP headers implemented
- [ ] HTTPS enforced
- [ ] Error reporting configured

## Automated Deployment

### Using the Deploy Script

The platform includes an automated deployment script:

```bash
# Make script executable
chmod +x scripts/deploy.sh

# Run deployment preparation
./scripts/deploy.sh
```

The script will:
1. ✅ Check Node.js version compatibility
2. ✅ Install production dependencies  
3. ✅ Run critical test suite
4. ✅ Build application for production
5. ✅ Validate build output
6. ✅ Generate deployment manifest

## Vercel Deployment

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy to Production**
```bash
# First deployment
vercel --prod

# Subsequent deployments
vercel --prod
```

### Method 2: GitHub Integration

1. **Connect GitHub Repository**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Configure project settings

2. **Environment Variables**
   Configure in Vercel dashboard:
   ```env
   NODE_ENV=production
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   NEXT_PUBLIC_APP_NAME=MyRight Platform
   ```

3. **Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build:production`
   - Output Directory: `.next`
   - Install Command: `npm ci`

### Method 3: Vercel Configuration File

The platform includes `vercel.json` with optimized settings:

```json
{
  "name": "myright-platform",
  "version": 2,
  "build": {
    "env": {
      "NODE_ENV": "production"
    }
  },
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "@vercel/node"
    }
  }
}
```

## Netlify Deployment

### Method 1: Netlify CLI

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Build and Deploy**
```bash
# Build the application
npm run build:production

# Deploy to Netlify
netlify deploy --prod --dir=.next
```

### Method 2: Git Integration

1. **Connect Repository**
   - Visit [netlify.com/new](https://netlify.com/new)
   - Connect your Git repository

2. **Build Settings**
   - Build Command: `npm run build:production`
   - Publish Directory: `.next`
   - Environment Variables: Configure in Netlify dashboard

### Method 3: Netlify Configuration

The platform includes `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_ENV = "production"
  NEXT_TELEMETRY_DISABLED = "1"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

## Self-Hosted Deployment

### Docker Deployment

1. **Create Dockerfile**
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build:production

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

2. **Build and Run**
```bash
# Build Docker image
docker build -t myright-platform .

# Run container
docker run -p 3000:3000 myright-platform
```

### PM2 Deployment

1. **Install PM2**
```bash
npm install -g pm2
```

2. **Create ecosystem.config.js**
```javascript
module.exports = {
  apps: [{
    name: 'myright-platform',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

3. **Deploy**
```bash
# Build application
npm run build:production

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Environment Configuration

### Production Environment Variables

```env
# Required
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_APP_NAME=MyRight Platform

# Optional
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_ERROR_REPORTING=true
NEXT_PUBLIC_GA_TRACKING_ID=GA_XXXXXXXXX
```

### Development vs Production

| Variable | Development | Production |
|----------|-------------|------------|
| NODE_ENV | development | production |
| NEXT_PUBLIC_APP_URL | http://localhost:3000 | https://yourdomain.com |
| NEXT_TELEMETRY_DISABLED | false | true |
| ANALYZE | false | false |

## Domain and SSL Setup

### Vercel Custom Domain

1. **Add Domain in Vercel Dashboard**
   - Go to Project Settings > Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **SSL Certificate**
   - Automatically provisioned by Vercel
   - Supports wildcard domains
   - Auto-renewal included

### Netlify Custom Domain

1. **Configure Domain**
   - Go to Site Settings > Domain Management
   - Add custom domain
   - Configure DNS records

2. **SSL Setup**
   - Automatic HTTPS with Let's Encrypt
   - Custom certificate upload supported
   - HTTP to HTTPS redirects enabled

## Performance Optimization

### Caching Strategy

```javascript
// next.config.ts
module.exports = {
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

### CDN Configuration

Both Vercel and Netlify provide global CDN automatically:
- **Vercel**: Edge Network with 70+ regions
- **Netlify**: Global CDN with instant cache invalidation

## Monitoring and Analytics

### Error Tracking

Configure error reporting in production:

```typescript
// src/lib/errorReporting.ts
if (process.env.NODE_ENV === 'production') {
  // Initialize error tracking service
  // Sentry, Bugsnag, etc.
}
```

### Performance Monitoring

```typescript
// src/lib/analytics.ts
export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    // Google Analytics, Plausible, etc.
    gtag('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID, {
      page_path: url,
    });
  }
}
```

## Health Checks

### API Health Check

```typescript
// src/pages/api/health.ts
export default function handler(req: NextRequest) {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    uptime: process.uptime()
  });
}
```

### Service Status

Monitor key services:
- Search functionality
- Content loading
- Database connectivity (if applicable)
- External API dependencies

## Deployment Rollback

### Vercel Rollback

```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url]
```

### Netlify Rollback

1. **Via Dashboard**
   - Go to Deploys tab
   - Click "Publish deploy" on previous version

2. **Via CLI**
```bash
netlify api listSiteDeploys --site-id=YOUR_SITE_ID
netlify api restoreSiteDeploy --site-id=YOUR_SITE_ID --deploy-id=DEPLOY_ID
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json .next
   npm install
   npm run build:production
   ```

2. **Environment Variable Issues**
   ```bash
   # Verify environment variables
   npm run build 2>&1 | grep -i "env"
   ```

3. **Memory Issues**
   ```bash
   # Increase Node.js memory limit
   NODE_OPTIONS="--max_old_space_size=4096" npm run build
   ```

4. **TypeScript Errors**
   ```bash
   # Type check only
   npx tsc --noEmit
   ```

### Performance Issues

1. **Slow Build Times**
   - Enable incremental builds
   - Use build cache
   - Optimize dependencies

2. **Large Bundle Size**
   ```bash
   # Analyze bundle
   ANALYZE=true npm run build
   ```

3. **Runtime Performance**
   - Enable Next.js analytics
   - Monitor Web Vitals
   - Use performance profiling tools

## Security Considerations

### Content Security Policy

Configured in `next.config.ts`:
```typescript
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
}
```

### Security Headers

- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff  
- ✅ Referrer-Policy: strict-origin-when-cross-origin
- ✅ X-XSS-Protection: 1; mode=block

### Regular Security Updates

```bash
# Check for vulnerabilities
npm audit

# Fix automatically fixable issues
npm audit fix

# Update dependencies
npm update
```

## Backup and Recovery

### Content Backup
- Legal scenarios: Version controlled in Git
- Embeddings: Regeneratable from source content
- Configuration: Stored in environment variables

### Database Backup (If Applicable)
```bash
# Example for MongoDB
mongodump --uri="mongodb://..." --out=backup/

# Example for PostgreSQL  
pg_dump database_name > backup.sql
```

### Recovery Procedures
1. Restore from Git repository
2. Regenerate embeddings if needed
3. Redeploy application
4. Verify functionality

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Security scan completed
- [ ] Content validated
- [ ] Environment variables configured

### Deployment
- [ ] Build successful
- [ ] DNS configured
- [ ] SSL certificate active
- [ ] Health checks passing
- [ ] Monitoring configured

### Post-Deployment
- [ ] Functionality verification
- [ ] Performance monitoring
- [ ] Error tracking active
- [ ] Analytics configured
- [ ] Backup procedures tested