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
- Modern Vercel configuration format
- SPA routing with rewrites (not legacy routes)
- Caching headers for performance
- Security headers
- CORS configuration
- No conflicts between routes/headers

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

## 🔧 Framework Settings Override Fix

If you see "Configuration Settings in the current Production deployment differ from your current Project Settings":

### **Solution Steps:**

1. **Go to Vercel Dashboard** → Your Project → Settings → General

2. **Override Framework Detection:**
   - Framework Preset: `Other` (not auto-detected)
   - Click "Override" if needed

3. **Build & Development Settings:**
   ```
   Build Command: npm run vercel-build
   Output Directory: web-build  
   Install Command: npm install
   Development Command: npm run dev
   ```

4. **Apply Override:**
   - Click "Override" next to each setting that differs
   - Save the changes

5. **Redeploy:**
   - Go to Deployments tab
   - Click "Redeploy" on the latest deployment
   - Or push a new commit to trigger deployment

### **Configuration Files Updated:**
- ✅ `vercel.json` - Added explicit build commands
- ✅ `package.json` - Added dev script
- ✅ `.vercel/project.json` - Project-specific settings

This ensures your project uses the correct build configuration consistently.
## 🚨 
Configuration Format Fix

**Issue Fixed:** "If `rewrites`, `redirects`, `headers`, `cleanUrls` or `trailingSlash` are used, then `routes` cannot be present."

**Solution:** 
- Converted from legacy `routes` + `builds` format to modern Vercel configuration
- Uses `rewrites` instead of `routes` for SPA routing
- Removed `builds` array (handled automatically)
- Kept all caching and security headers
- No more configuration conflicts

**Benefits:**
- ✅ Modern Vercel configuration format
- ✅ Better performance and caching
- ✅ No deployment warnings
- ✅ Cleaner configuration structure