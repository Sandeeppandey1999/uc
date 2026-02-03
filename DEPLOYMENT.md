# Deployment Guide - Unified Communication Platform

## 🚀 Deployment Options

### Option 1: Static Hosting (Recommended for SPA)

#### Build for Production
```bash
# Build optimized production bundle
npm run build

# The build folder will contain your production app
# Files will be in: /Users/sandeep/Desktop/React/gui/build/
```

#### Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd build
netlify deploy --prod
```

#### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Deploy to AWS S3 + CloudFront
```bash
# Build
npm run build

# Upload to S3 (replace with your bucket)
aws s3 sync build/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Option 2: Docker Deployment

Create `Dockerfile`:
```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://your-backend-url;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Build and run:
```bash
# Build image
docker build -t uc-platform .

# Run container
docker run -p 3000:80 uc-platform
```

### Option 3: Node.js Server Deployment

#### Using PM2
```bash
# Install PM2
npm install -g pm2

# Install serve
npm install -g serve

# Build
npm run build

# Serve with PM2
pm2 start "serve -s build -l 3000" --name uc-platform

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

## 🔧 Environment Configuration

### Production .env
```env
REACT_APP_MODE=production
REACT_APP_API_BASE_URL=https://api.yourdomain.com/services/api/v2/
REACT_APP_APP_BASE_URL=https://api.yourdomain.com/services/app/v2/
REACT_APP_TELEMETRY_API_URL=https://api.yourdomain.com/telemetry/api/v2/
REACT_APP_TELEMETRY_APP_URL=https://api.yourdomain.com/telemetry/app/v2/
REACT_APP_WS_SERVICES=https://api.yourdomain.com/services/app/v2/messaging/messages
REACT_APP_WS_TELEMETRY=https://api.yourdomain.com/telemetry/app/v2/messaging/messages
REACT_APP_SIP_DOMAIN=sip.yourdomain.com
REACT_APP_SIP_WEBSOCKET=wss://sip.yourdomain.com:7443
REACT_APP_SECRET_KEY=YOUR_PRODUCTION_SECRET_KEY
REACT_APP_INACTIVE_TIME=30
REACT_APP_APPLICATION_NAME=Unified Communication
```

**Important**: 
- Replace all URLs with production values
- Generate secure secret key: `openssl rand -base64 32`
- Use HTTPS/WSS protocols in production

## 📋 Pre-Deployment Checklist

- [ ] Update .env with production values
- [ ] Generate secure secret key
- [ ] Test build locally: `npm run build && serve -s build`
- [ ] Verify all API endpoints are correct
- [ ] Test WebSocket connections
- [ ] Check CORS settings on backend
- [ ] Setup SSL certificates (Let's Encrypt recommended)
- [ ] Configure CDN (CloudFront, Cloudflare)
- [ ] Setup monitoring (Sentry, LogRocket)
- [ ] Configure error tracking
- [ ] Test on multiple browsers
- [ ] Test responsive design
- [ ] Run security audit: `npm audit`
- [ ] Optimize images and assets
- [ ] Enable gzip compression
- [ ] Setup backup strategy

## 🔒 Security Hardening

### 1. Content Security Policy
Add to `public/index.html`:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:; 
               connect-src 'self' https://your-api.com wss://your-ws.com;">
```

### 2. Security Headers (Nginx)
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
```

### 3. Environment Variables
- Never commit .env to version control
- Use secrets management (AWS Secrets Manager, HashiCorp Vault)
- Rotate keys regularly
- Use different keys per environment

## 📊 Performance Optimization

### 1. Code Splitting
Already configured with React.lazy:
```javascript
const LazyComponent = React.lazy(() => import('./Component'));
```

### 2. Build Optimization
```json
// package.json
"build": "GENERATE_SOURCEMAP=false react-scripts build"
```

### 3. Caching Strategy
Configure in nginx:
```nginx
location /static/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## 🔍 Monitoring & Analytics

### Setup Error Tracking (Sentry)
```bash
npm install @sentry/react
```

```javascript
// src/index.js
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.REACT_APP_MODE,
});
```

### Setup Analytics (Google Analytics)
```bash
npm install react-ga4
```

```javascript
// src/index.js
import ReactGA from "react-ga4";

ReactGA.initialize("YOUR_GA_ID");
```

## 🧪 Testing Before Deployment

```bash
# Run tests
npm test

# Build production
npm run build

# Test production build locally
npx serve -s build -p 3000

# Check build size
npm run build -- --stats

# Security audit
npm audit

# Update dependencies
npm update
```

## 🚨 Rollback Strategy

### Keep Previous Builds
```bash
# Tag releases
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# Keep build archives
tar -czf build-v1.0.0.tar.gz build/
```

### Quick Rollback
```bash
# Restore previous build
tar -xzf build-v1.0.0.tar.gz

# Or revert git commit
git revert HEAD
npm run build
```

## 📱 Progressive Web App (PWA)

Enable PWA in `src/index.js`:
```javascript
// Change from:
serviceWorkerRegistration.unregister();

// To:
serviceWorkerRegistration.register();
```

Update `public/manifest.json` with your app details.

## 🌐 CDN Setup

### CloudFront Configuration
1. Create distribution
2. Set origin to S3 bucket
3. Configure custom error pages (404 → index.html)
4. Enable compression
5. Setup SSL certificate
6. Configure cache behaviors

### Cloudflare Setup
1. Add site to Cloudflare
2. Update DNS records
3. Enable Auto Minify (JS, CSS, HTML)
4. Enable Brotli compression
5. Setup Page Rules for caching

## 📞 Post-Deployment

- [ ] Test login functionality
- [ ] Verify WebSocket connections
- [ ] Check all routes work correctly
- [ ] Test theme switching
- [ ] Verify search functionality
- [ ] Check mobile responsiveness
- [ ] Monitor error logs
- [ ] Setup uptime monitoring
- [ ] Configure alerting
- [ ] Document deployment process
- [ ] Train team on new features

## 🆘 Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf node_modules
rm package-lock.json
npm install
```

### WebSocket Connection Issues
- Check WSS protocol in production
- Verify CORS settings
- Check firewall rules
- Test WebSocket endpoint separately

### API Calls Failing
- Verify CORS configuration
- Check API endpoint URLs
- Verify SSL certificates
- Check authentication tokens

### Blank Page After Deploy
- Check browser console for errors
- Verify paths in build
- Check nginx configuration
- Ensure all assets loaded correctly

## 📚 Additional Resources

- [Create React App Deployment](https://create-react-app.dev/docs/deployment/)
- [Netlify Documentation](https://docs.netlify.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [AWS S3 Static Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [Docker Documentation](https://docs.docker.com/)

---

**Ready to Deploy!** 🚀

Follow this guide step by step for a successful deployment.
