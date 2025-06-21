# 🎯 Simple Render.com Deployment Steps

## Why Choose Render Over AWS?

✅ **Much Simpler** - No CLI tools needed, just web interface  
✅ **Git-Based** - Push to GitHub = automatic deployment  
✅ **WebSocket Support** - Perfect for your chat functionality  
✅ **Free SSL** - HTTPS included automatically  
✅ **Cheaper** - $7-25/month vs $25-40/month on AWS  
✅ **Better for Beginners** - Easier to understand and manage  

---

## 🚀 Step-by-Step Deployment (15 minutes)

### Step 1: Prepare Your Code (2 minutes)
Your files are already updated! Just commit and push:

```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### Step 2: Create Render Account (1 minute)
1. Go to [render.com](https://render.com)
2. Sign up with GitHub (recommended)
3. Connect your GitHub account

### Step 3: Deploy Your App (5 minutes)
1. Click **"New +"** → **"Web Service"**
2. Select your repository: `gsds-2025-team-6`
3. Configure the service:
   - **Name**: `swoplet-app`
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: 
     - `Starter ($7/month)` - Good for testing
     - `Standard ($25/month)` - Better for production

### Step 4: Add Environment Variables (3 minutes)
In the Render dashboard, scroll down to "Environment Variables" and add:

```
NODE_ENV=production
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_USER=your-database-username
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
JWT_SECRET=your-jwt-secret-key
```

### Step 5: Deploy! (2 minutes)
1. Click **"Create Web Service"**
2. Render will automatically:
   - Install dependencies
   - Build your frontend
   - Start your backend
   - Give you a URL like: `https://swoplet-app.onrender.com`

### Step 6: Update Frontend Config (2 minutes)
Once deployed, update your frontend environment:

Edit `UI/.env.production`:
```bash
VITE_API_BASE_URL=https://your-app-name.onrender.com/api/
VITE_SOCKET_URL=https://your-app-name.onrender.com
```

Then commit and push - Render will auto-deploy:
```bash
git add .
git commit -m "Update frontend config for production"
git push
```

---

## ✅ What You Get

- **Single URL**: `https://your-app-name.onrender.com`
- **API Endpoints**: `https://your-app-name.onrender.com/api/productcategory`
- **Frontend**: `https://your-app-name.onrender.com` (React app)
- **Chat**: Full WebSocket + polling fallback support
- **HTTPS**: Automatic SSL certificate
- **Auto-deploys**: Every git push triggers deployment

---

## 🔧 Database Setup Options

### Option 1: Keep Your RDS (Recommended)
- Use your existing AWS RDS
- Just add the connection details to Render environment variables
- No migration needed

### Option 2: Use Render's Database
- Render offers PostgreSQL databases
- $7/month for 1GB database
- Would require migration from MySQL to PostgreSQL

**Recommendation: Keep your RDS** - simpler and no migration needed.

---

## 💰 Cost Breakdown

| Service | Plan | Cost/Month |
|---------|------|------------|
| **Web Service** | Starter | $7 |
| **Web Service** | Standard | $25 |
| **Database** | Keep RDS | Your current cost |
| **Total** | | **$7-25/month** |

---

## 🆘 Troubleshooting

### Build Fails?
- Check the build logs in Render dashboard
- Common issue: Missing dependencies in package.json

### Can't Connect to Database?
- Ensure your RDS security group allows connections from `0.0.0.0/0`
- Or add Render's IP ranges (check Render docs)

### Frontend Routes Don't Work?
- Should work automatically with the updated app.js
- If not, check that the catch-all route is configured correctly

---

## 🎉 Success!

After deployment, your app will be live at:
- **App**: `https://your-app-name.onrender.com`
- **API**: `https://your-app-name.onrender.com/api/`

Your chat functionality with WebSocket support will work perfectly!

**Render is often the best choice for full-stack apps like yours.** Much simpler than AWS, great WebSocket support, and automatic deployments. 🚀
