# Railway Deployment - Quick Reference

## 🚀 Deployed URLs

**Backend API:**
```
https://your-backend-name.up.railway.app
```

**Frontend:**
```
https://your-frontend-name.up.railway.app
```

## 🔑 Environment Variables

### Backend Service
```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
ALLOWED_ORIGINS=https://your-frontend.up.railway.app
```

### Frontend Service
```
VITE_API_URL=https://your-backend.up.railway.app
```

## 📋 Deployment Commands

```bash
# Commit changes
git add .
git commit -m "Update for deployment"
git push origin main

# Railway will auto-deploy on push!
```

## 🧪 Test Endpoints

**Health Check:**
```
https://your-backend.up.railway.app/api/health
```

**Chat Widget:**
```
https://your-frontend.up.railway.app/chat-test?slug=YOUR_SLUG
```

## 🔧 Troubleshooting

**View Logs:**
1. Go to Railway dashboard
2. Click on service
3. Click "Deployments"
4. View logs

**Redeploy:**
1. Click service
2. Click "Deployments"
3. Click "Redeploy"

## 📊 Monitoring

- Railway Dashboard: https://railway.app/dashboard
- MongoDB Atlas: https://cloud.mongodb.com
- GitHub Repo: https://github.com/your-username/repo

## 🆘 Common Issues

**CORS Error:**
- Update ALLOWED_ORIGINS in backend variables
- Include frontend URL

**MongoDB Connection:**
- Check MONGODB_URI is correct
- Verify IP whitelist (0.0.0.0/0)

**Build Failed:**
- Check build logs
- Verify package.json scripts
- Test build locally first

---

**For full deployment guide, see:** `implementation_plan.md`
