# Vercel Git Deployment Settings for Pillar Valley 3D

## 🚀 Complete Deployment Configuration

### 1. Repository Settings
- **Repository**: `https://github.com/AmanAJ21/Pillar-Valley-3D.git`
- **Branch**: `main` (auto-deploy enabled)
- **Framework Preset**: `Other` (Custom Expo Web)

### 2. Build & Development Settings
```
Build Command: npm run vercel-build
Output Directory: web-build
Install Command: npm install
Development Command: npm run web
```

### 3. Environment Variables (if needed)
```
NODE_ENV=production
EXPO_PUBLIC_ENV=production
```

### 4. Root Directory
```
./
```

### 5. Node.js Version
- **Specified in**: `.nvmrc` and `package.json`
- **Version**: `18.x` or higher

## 📁 Project Structure
```
├── src/
│   ├── assets/
│   │   ├── icon.png          # App icon
│   │   └── splash.png        # Splash screen
│   └── components/
├── public/
│   ├── favicon.png           # Favicon
│   ├── manifest.json         # PWA manifest
│   └── index.html           # HTML template
├── web-build/               # Build output (auto-generated)
├── vercel.json             # Vercel configuration
├── .vercelignore           # Files to ignore
├── .nvmrc                  # Node version
├── package.json            # Dependencies & scripts
└── app.config.js           # Expo configuration
```

## ⚙️ Key Configuration Files

### vercel.json
- Static build configuration
- SPA routing setup
- Caching headers for performance
- Security headers
- CORS configuration

### package.json Scripts
- `vercel-build`: Production build command
- `build`: Standard build command
- Node.js version specification

### .vercelignore
- Excludes unnecessary files from deployment
- Reduces build time and deployment size

## 🔧 Deployment Process
1. **Push to GitHub**: Changes trigger automatic deployment
2. **Install Dependencies**: `npm install`
3. **Build**: `npm run vercel-build`
4. **Deploy**: Static files from `web-build/` directory
5. **Live**: Available at your Vercel domain

## 🐛 Common Issues & Solutions

### Build Failures
- **Node Version**: Ensure Node.js 18+ (specified in .nvmrc)
- **Dependencies**: Check for missing dependencies
- **Build Command**: Verify `vercel-build` script exists

### Asset Loading Issues
- **Favicon**: Configured in app.config.js and public/
- **Icons**: Ionicons font loading handled
- **Images**: Assets properly bundled in web-build

### Routing Issues
- **SPA Routing**: All routes redirect to index.html
- **Static Assets**: Proper caching headers applied
- **API Routes**: Not applicable for static site

## 📊 Performance Optimizations
- **Caching**: 1-year cache for static assets
- **Compression**: Automatic by Vercel
- **CDN**: Global edge network
- **Bundle Size**: Optimized with Metro bundler

## 🔒 Security Features
- **HTTPS**: Automatic SSL certificate
- **Security Headers**: XSS protection, content type options
- **CORS**: Configured for media assets
- **CSP**: Can be added if needed

## 🚀 Deployment Commands
```bash
# Manual deployment (if needed)
vercel --prod

# Preview deployment
vercel

# Check deployment status
vercel ls
```