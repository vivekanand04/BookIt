# Deployment Guide for BookIt

This guide provides step-by-step instructions for deploying the BookIt application to production.

## 🎯 Deployment Overview

- **Frontend**: Vercel (recommended) or Netlify
- **Backend**: Render (recommended) or Railway
- **Database**: Railway PostgreSQL or Supabase

## 📋 Pre-Deployment Checklist

- [ ] GitHub repository created and code pushed
- [ ] All environment variables documented
- [ ] Database schema tested locally
- [ ] Application tested end-to-end locally
- [ ] README.md updated with project details

## 🗄️ Step 1: Deploy Database

### Option A: Railway (Recommended)

1. **Sign Up**: Go to [railway.app](https://railway.app) and sign up with GitHub
2. **Create Project**: 
   - Click "New Project"
   - Select "Provision PostgreSQL"
   - Project will be created automatically
3. **Get Connection String**:
   - Click on your PostgreSQL service
   - Go to "Variables" tab
   - Copy the `DATABASE_URL` value
4. **Configure**:
   - It should look like: `postgresql://user:password@host:port/database`
   - Save this for backend configuration

### Option B: Supabase

1. **Sign Up**: Go to [supabase.com](https://supabase.com)
2. **Create Project**:
   - Click "New Project"
   - Choose a name and password
   - Select a region (closest to your users)
3. **Get Connection String**:
   - Go to Settings → Database
   - Copy "Connection string" under "Connection pooling"
   - Replace `[YOUR-PASSWORD]` with your database password
4. **Enable SSL**: Make sure connection string includes `?sslmode=require`

## 🔧 Step 2: Deploy Backend

### Option A: Render (Recommended)

1. **Sign Up**: Go to [render.com](https://render.com) and sign up with GitHub

2. **Create Web Service**:
   - Dashboard → "New +" → "Web Service"
   - Select "Connect a repository"
   - Choose your GitHub repository
   - Click "Connect"

3. **Configure Service**:
   ```
   Name: bookit-backend
   Environment: Node
   Region: Oregon (or closest to your users)
   Branch: main
   Root Directory: backend
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

4. **Add Environment Variables**:
   - Click "Advanced" → "Add Environment Variable"
   - Add the following:
     ```
     NODE_ENV=production
     PORT=5000
     DATABASE_URL=<your-database-url-from-step-1>
     ```

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Note your service URL: `https://bookit-backend.onrender.com`

6. **Seed Database**:
   - Go to your service page
   - Click "Shell" tab
   - Run: `npm run seed`
   - Verify output shows successful seeding

7. **Test Backend**:
   ```bash
   curl https://your-backend-url.onrender.com/health
   curl https://your-backend-url.onrender.com/api/experiences
   ```

### Option B: Railway

1. **Sign Up**: Go to [railway.app](https://railway.app)

2. **Create Project**:
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

3. **Configure**:
   - Railway auto-detects Node.js
   - Set root directory: `backend`
   - Build command: `npm install && npm run build`
   - Start command: `npm start`

4. **Add Environment Variables**:
   - Click "Variables" tab
   - Add:
     ```
     NODE_ENV=production
     PORT=5000
     DATABASE_URL=${{Postgres.DATABASE_URL}}
     ```
   - Note: Railway auto-injects database URL if using Railway Postgres

5. **Deploy**: Railway will auto-deploy

6. **Generate Domain**:
   - Go to Settings → Networking
   - Click "Generate Domain"
   - Note your URL: `https://your-project.up.railway.app`

## 🎨 Step 3: Deploy Frontend

### Option A: Vercel (Recommended)

1. **Install CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Deploy from GitHub** (easier):
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure:
     ```
     Framework Preset: Vite
     Root Directory: frontend
     Build Command: npm run build
     Output Directory: dist
     Install Command: npm install
     ```

3. **Add Environment Variables**:
   - Go to "Environment Variables"
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com/api
     ```
   - Important: Replace with your actual backend URL from Step 2

4. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site will be live at: `https://your-project.vercel.app`

5. **Custom Domain** (optional):
   - Go to Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

### Option B: Netlify

1. **Sign Up**: Go to [netlify.com](https://netlify.com)

2. **Deploy**:
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository
   - Configure:
     ```
     Base directory: frontend
     Build command: npm run build
     Publish directory: frontend/dist
     ```

3. **Environment Variables**:
   - Site settings → Environment variables
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com/api
     ```

4. **Deploy**: Click "Deploy site"

## ✅ Step 4: Post-Deployment Verification

### Test Backend Health

```bash
# Health check
curl https://your-backend-url.onrender.com/health

# Get experiences
curl https://your-backend-url.onrender.com/api/experiences

# Get specific experience
curl https://your-backend-url.onrender.com/api/experiences/1
```

Expected responses:
- `/health`: `{"status":"ok","message":"BookIt API is running"}`
- `/api/experiences`: Array of experience objects
- `/api/experiences/1`: Single experience with slots

### Test Frontend

1. Open your Vercel URL in a browser
2. Verify home page loads with experience cards
3. Test search functionality
4. Click "View Details" on an experience
5. Select date and time slot
6. Complete checkout with test data:
   - Name: Test User
   - Email: test@test.com
   - Promo: SAVE10
7. Verify booking confirmation page shows reference ID

### Test End-to-End Booking

1. **Browse**: Home page loads experiences ✅
2. **Search**: Search for "Kayak" works ✅
3. **Details**: Click experience → date/time selection works ✅
4. **Checkout**: Form validation and promo code works ✅
5. **Confirmation**: Booking created with reference ID ✅

### Verify Database

Connect to your database and check:

```sql
-- Check if data exists
SELECT COUNT(*) FROM experiences;  -- Should return 8
SELECT COUNT(*) FROM slots;        -- Should return ~224 (8 experiences × 7 days × 4 slots)
SELECT COUNT(*) FROM promo_codes;  -- Should return 4

-- Check a booking (after testing)
SELECT * FROM bookings ORDER BY booking_date DESC LIMIT 1;
```

## 🔄 Step 5: Continuous Deployment

### Enable Auto-Deploy

Both Vercel and Render support automatic deployments:

**Vercel** (Frontend):
- Automatically deploys on every push to `main`
- Preview deployments for pull requests
- No configuration needed

**Render** (Backend):
- Go to Settings → "Auto-Deploy"
- Enable "Auto-Deploy" for `main` branch
- Choose "Yes" for auto-deploy

### Deployment Workflow

1. Make changes locally
2. Test thoroughly
3. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```
4. Automatic deployment triggers:
   - Frontend: Vercel builds and deploys (~2-3 min)
   - Backend: Render builds and deploys (~5-10 min)
5. Verify changes in production

## 🐛 Troubleshooting

### Backend Issues

**Build Fails**:
- Check build logs in Render/Railway dashboard
- Verify `package.json` scripts are correct
- Ensure all dependencies are in `dependencies`, not `devDependencies` (except tsx, typescript)

**Database Connection Error**:
```
Error: connect ECONNREFUSED
```
- Verify `DATABASE_URL` is set correctly
- Check if database is in same region (for better latency)
- Ensure SSL is enabled: add `?sslmode=require` to connection string

**Port Error**:
```
Error: Port 5000 is not available
```
- Render/Railway set PORT automatically
- Make sure your code uses `process.env.PORT`

### Frontend Issues

**API Calls Fail**:
```
CORS Error or Network Error
```
- Verify `VITE_API_URL` is set in Vercel environment variables
- Check backend URL is correct and includes `/api`
- Ensure backend CORS is enabled (already configured in our code)

**Environment Variables Not Working**:
- Vercel: Must redeploy after adding env vars
- Variables must start with `VITE_` prefix
- Check: Settings → Environment Variables

**Build Fails**:
- Check if all dependencies are installed
- Verify `vite.config.ts` is correct
- Check build logs for specific errors

## 📊 Monitoring & Logs

### Render Logs
- Go to your service → "Logs" tab
- View real-time logs
- Filter by severity (info, error, etc.)

### Vercel Logs
- Go to project → Deployment → "Function Logs"
- View request logs
- Check build logs

### Database Monitoring

**Railway**:
- Dashboard → PostgreSQL → "Metrics"
- View connections, storage, queries

**Supabase**:
- Dashboard → Database → "Database"
- View table stats, connections

## 🔒 Security Checklist

- [ ] Database uses SSL connection
- [ ] Environment variables are secret (not in code)
- [ ] CORS is configured properly (frontend domain only)
- [ ] API endpoints validate input
- [ ] Sensitive data is not logged
- [ ] Rate limiting considered (for production)

## 💰 Cost Estimation

All recommended services have free tiers:

| Service | Free Tier | Notes |
|---------|-----------|-------|
| Vercel | Unlimited hobby projects | More than enough for this project |
| Render | 750 hours/month | Backend may sleep after inactivity |
| Railway | $5 credit/month | Includes PostgreSQL |
| Supabase | 500MB database | Plenty for this project |

**Total Monthly Cost**: $0 (within free tiers)

**Upgrade Path** (if needed):
- Render Starter: $7/month (no sleep)
- Railway Pro: $20/month credit
- Vercel Pro: $20/month (team features)

## 🚀 Performance Optimization

### Backend
- Enable database connection pooling
- Add caching for frequently accessed data
- Use CDN for static assets
- Enable gzip compression

### Frontend
- Optimize images (already using Unsplash optimized URLs)
- Code splitting (Vite does this automatically)
- Lazy load routes
- Enable production build minification

### Database
- Add indexes on frequently queried columns (already done)
- Regular VACUUM operations
- Monitor slow queries

## 📱 Custom Domain Setup

### Frontend (Vercel)
1. Go to Project Settings → Domains
2. Add your domain (e.g., `bookit.yourdomain.com`)
3. Add DNS records:
   ```
   Type: CNAME
   Name: bookit (or @)
   Value: cname.vercel-dns.com
   ```

### Backend (Render)
1. Go to Service Settings → Custom Domain
2. Add domain (e.g., `api.yourdomain.com`)
3. Add DNS records as shown
4. SSL certificate auto-generated

## 🎓 Learning Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [PostgreSQL Best Practices](https://www.postgresql.org/docs/current/tutorial.html)

## 🆘 Getting Help

If you encounter issues:

1. Check service status pages:
   - [Vercel Status](https://vercel-status.com)
   - [Render Status](https://status.render.com)
   - [Railway Status](https://status.railway.app)

2. Review logs in service dashboard

3. Search community forums:
   - [Vercel Discussions](https://github.com/vercel/vercel/discussions)
   - [Render Community](https://community.render.com)

4. Check this repository's issues section

---

**Good luck with your deployment! 🚀**

