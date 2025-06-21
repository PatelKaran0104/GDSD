# 🚀 Render.com Deployment Guide for Swoplet

## Why Render.com is Perfect for Your App

✅ **Excellent WebSocket Support** - Native socket.io compatibility  
✅ **Extremely Simple Setup** - Git-based deployment  
✅ **Auto-deploys** - Push to GitHub = automatic deployment  
✅ **Free SSL** - HTTPS included automatically  
✅ **Great for Full-Stack Apps** - Frontend + Backend together  
✅ **Cost Effective** - $7-25/month total  

## Architecture Options

### Option 1: Single Service (Recommended)
- Deploy backend with built frontend served as static files
- One service, one URL, simpler management

### Option 2: Separate Services  
- Backend as Web Service
- Frontend as Static Site
- More flexibility but slightly more complex

---

## 🎯 Option 1: Single Service Deployment (Easiest)

This serves both your API and React frontend from one service.

### Step 1: Prepare Your Repository

#### 1.1 Update your root `package.json`:
```json
{
  "name": "swoplet-app",
  "version": "1.0.0",
  "scripts": {
    "build": "cd UI && npm install && npm run build",
    "start": "cd Backend && npm start",
    "install-backend": "cd Backend && npm install"
  },
  "engines": {
    "node": "18.x"
  }
}
```

#### 1.2 Update Backend `app.js` to serve frontend:
```javascript
// Add this after your existing routes
const path = require('path');

// ...existing code...

// Apply routes under /api
routes.forEach((route) => app.use('/api', route));

// Serve static files from the UI build folder
const frontendPath = path.join(__dirname, '..', 'UI', 'dist');
app.use(express.static(frontendPath));

// Catch-all handler: send back React's index.html file
app.get('*', (req, res) => {
  // Skip API routes - they should have been handled above
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
    if (err) {
      res.status(500).send('Frontend not built. Please build the UI first.');
    }
  });
});

module.exports = app;
```

#### 1.3 Create `render.yaml` (optional but recommended):
```yaml
services:
  - type: web
    name: swoplet-app
    env: node
    buildCommand: npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DB_HOST
        fromDatabase:
          name: swoplet-db
          property: host
      - key: DB_USER
        fromDatabase:
          name: swoplet-db
          property: user
      - key: DB_PASSWORD
        fromDatabase:
          name: swoplet-db
          property: password
      - key: DB_NAME
        fromDatabase:
          name: swoplet-db
          property: database

databases:
  - name: swoplet-db
    databaseName: swoplet_db
    user: swoplet_user
```

### Step 2: Deploy to Render

#### 2.1 Push to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

#### 2.2 Create Render Service
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `swoplet-app`
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Starter` ($7/month) or `Standard` ($25/month)

#### 2.3 Add Environment Variables
In Render dashboard, add:
```
NODE_ENV=production
DB_HOST=your-rds-endpoint
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
JWT_SECRET=your-jwt-secret
```

#### 2.4 Deploy
Click "Create Web Service" - Render will automatically deploy!

---

## 🎯 Option 2: Separate Services

### Backend Service

#### 2.1 Create Backend Web Service
1. **Repository**: Your repo
2. **Root Directory**: `Backend`
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. **Environment Variables**: Same as above

### Frontend Service

#### 2.2 Update Frontend Environment
Create `UI/.env.production`:
```bash
VITE_API_BASE_URL=https://your-backend-service.onrender.com/api/
VITE_SOCKET_URL=https://your-backend-service.onrender.com
```

#### 2.3 Create Frontend Static Site
1. **Repository**: Your repo
2. **Root Directory**: `UI`
3. **Build Command**: `npm install && npm run build`
4. **Publish Directory**: `dist`

---

## 🔧 Configuration Files to Create

### 1. Root `package.json`:
```json
{
  "name": "swoplet-app",
  "version": "1.0.0",
  "scripts": {
    "build": "cd UI && npm install && npm run build",
    "start": "cd Backend && npm start",
    "install-backend": "cd Backend && npm install"
  },
  "engines": {
    "node": "18.x"
  }
}
```

### 2. `render.yaml` (optional):
```yaml
services:
  - type: web
    name: swoplet
    env: node
    buildCommand: npm run build
    startCommand: npm start
    plan: starter
    envVars:
      - key: NODE_ENV
        value: production
```

---

## 📊 Cost Comparison

| Plan | CPU | RAM | Price/Month | Good For |
|------|-----|-----|-------------|----------|
| **Starter** | 0.5 CPU | 512MB | $7 | Development/Low Traffic |
| **Standard** | 1 CPU | 2GB | $25 | Production/Medium Traffic |
| **Pro** | 2 CPU | 4GB | $85 | High Traffic |

---

## ✅ Benefits of Render

1. **Git-Based Deployment** - Push to deploy automatically
2. **Free SSL** - HTTPS included
3. **WebSocket Support** - Native support for socket.io
4. **Easy Environment Variables** - Simple dashboard management
5. **Automatic Builds** - No manual deployment needed
6. **Great Documentation** - Excellent support

---

## 🚀 Quick Start Commands

```bash
# 1. Update files (package.json, app.js)
# 2. Push to GitHub
git add .
git commit -m "Deploy to Render"
git push

# 3. Create service on Render.com
# 4. Add environment variables
# 5. Deploy automatically!
```

**Your app will be live at**: `https://your-app-name.onrender.com`

---

## 🆘 Troubleshooting

### Common Issues:
1. **Build fails**: Check build logs, ensure all dependencies in package.json
2. **404 on routes**: Make sure catch-all route is configured in app.js
3. **Database connection**: Verify RDS security group allows Render IPs
4. **WebSocket issues**: Render fully supports WebSockets, should work out of the box

**Render is often easier than AWS for full-stack apps like yours!** 🎉
