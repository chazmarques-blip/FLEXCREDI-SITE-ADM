# 🚀 FLEXCREDI LLC - DEPLOYMENT GUIDE
## Production Deployment on Railway + Vercel

**Date**: February 22, 2026  
**Company**: FlexCredi LLC (Florida, USA)  
**Backend**: Railway (Node.js + PostgreSQL)  
**Frontend**: Vercel (Static HTML/JS)  
**Database**: Supabase PostgreSQL

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Backend Deployment (Railway)](#backend-deployment-railway)
3. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
4. [Database Setup (Supabase)](#database-setup-supabase)
5. [Environment Variables](#environment-variables)
6. [Post-Deployment Testing](#post-deployment-testing)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 OVERVIEW

### Architecture
```
┌─────────────┐     HTTPS      ┌──────────────┐
│   VERCEL    │──────────────▶ │   RAILWAY    │
│  Frontend   │                 │   Backend    │
│ (HTML/JS)   │                 │  (Node.js)   │
└─────────────┘                 └──────┬───────┘
                                       │
                                       │ PostgreSQL
                                       │
                                ┌──────▼───────┐
                                │  SUPABASE    │
                                │  PostgreSQL  │
                                └──────────────┘
```

### Current URLs
- **Backend API (Railway)**: https://web-production-e227.up.railway.app
- **Frontend (Vercel)**: TBD
- **Database (Supabase)**: db.oekfkdvrgyiklgkfqpbt.supabase.co:5432

---

## 🚂 BACKEND DEPLOYMENT (RAILWAY)

### Prerequisites
- ✅ GitHub repository: https://github.com/chazmarques-blip/FLEXCREDI-SITE-ADM
- ✅ Railway account connected to GitHub
- ✅ Supabase database credentials

### Step 1: Railway Project Setup

1. **Connect Repository**
   - Go to [Railway Dashboard](https://railway.app/dashboard)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select `chazmarques-blip/FLEXCREDI-SITE-ADM`
   - Railway will auto-detect Node.js

2. **Configure Build Settings**
   - Railway should detect `railway.json` configuration:
   ```json
   {
     "build": {
       "builder": "NIXPACKS",
       "buildCommand": "cd backend && npm install && npx prisma generate"
     },
     "deploy": {
       "startCommand": "cd backend && npm start",
       "restartPolicyType": "ON_FAILURE",
       "restartPolicyMaxRetries": 3
     }
   }
   ```

3. **Alternative: Manual Configuration**
   - If `railway.json` not detected:
     - **Root Directory**: Leave as `/` (not `/backend`)
     - **Build Command**: `cd backend && npm install && npx prisma generate`
     - **Start Command**: `cd backend && npm start`
     - **Watch Paths**: `backend/**`

### Step 2: Environment Variables

Add these variables in Railway Dashboard → Settings → Variables:

```bash
# Database (Supabase)
DATABASE_URL=postgresql://postgres:PASSWORD@db.oekfkdvrgyiklgkfqpbt.supabase.co:5432/postgres?schema=public

# Server Configuration
PORT=8080
NODE_ENV=production

# CORS Origins (comma-separated)
ALLOWED_ORIGINS=https://YOUR-VERCEL-APP.vercel.app,https://web-production-e227.up.railway.app

# Security (optional)
JWT_SECRET=your-jwt-secret-here
API_KEY=your-api-key-here

# External APIs (when ready)
EXPERIAN_API_KEY=your-experian-key
EQUIFAX_API_KEY=your-equifax-key
TRANSUNION_API_KEY=your-transunion-key
```

**Important Notes:**
- Use **port 5432** (direct connection), NOT 6543 (pgbouncer) for Prisma migrations
- `DATABASE_URL` should NOT have `pgbouncer=true` parameter
- Remove `connection_limit=1` for production

### Step 3: Database Migration

Railway will automatically run migrations via `postinstall` hook in `package.json`:

```json
"postinstall": "npx prisma generate && npx prisma db push --accept-data-loss || true"
```

**Manual Migration (if needed):**
1. SSH into Railway container (Railway CLI)
2. Run: `cd backend && npx prisma db push`
3. Or use migration file: `psql $DATABASE_URL < backend/migration_us_market.sql`

### Step 4: Deploy

1. **Automatic Deploy**
   - Push to `main` branch triggers auto-deploy
   - Railway builds and deploys in ~2-5 minutes
   - Check logs: Railway Dashboard → Deployments → View Logs

2. **Manual Deploy**
   - Railway Dashboard → Deployments → Deploy Latest

### Step 5: Verify Deployment

```bash
# Health check
curl https://web-production-e227.up.railway.app/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2026-02-22T...",
  "uptime": 123,
  "environment": "production",
  "version": "4.0"
}

# Test endpoint
curl https://web-production-e227.up.railway.app/api/test

# Expected response:
{
  "message": "FLEXCREDI Admin API is running!",
  "version": "4.0",
  "timestamp": "..."
}
```

---

## 🌐 FRONTEND DEPLOYMENT (VERCEL)

### Prerequisites
- ✅ Vercel account
- ✅ GitHub repository connected
- ✅ Railway backend URL

### Step 1: Vercel Project Setup

1. **Import Project**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import `chazmarques-blip/FLEXCREDI-SITE-ADM`

2. **Configure Build Settings**
   - **Framework Preset**: Other (static HTML)
   - **Root Directory**: `frontend` (if exists) or `/`
   - **Build Command**: (leave empty for static)
   - **Output Directory**: `frontend` or `public`
   - **Install Command**: (leave empty)

### Step 2: Environment Variables

Add in Vercel Dashboard → Settings → Environment Variables:

```bash
# Backend API URL
VITE_API_URL=https://web-production-e227.up.railway.app
NEXT_PUBLIC_API_URL=https://web-production-e227.up.railway.app
VUE_APP_API_URL=https://web-production-e227.up.railway.app

# Or for vanilla JS (use in code):
# const API_URL = 'https://web-production-e227.up.railway.app';
```

### Step 3: Update Frontend API Calls

**Option A: Environment Variable (recommended)**
```javascript
const API_URL = process.env.VITE_API_URL || 'http://localhost:3001';

// Usage
fetch(`${API_URL}/api/applications`, { ... });
```

**Option B: Hardcoded (simple)**
```javascript
const API_URL = 'https://web-production-e227.up.railway.app';

// Usage
fetch(`${API_URL}/api/applications`, { ... });
```

### Step 4: Deploy

1. **Automatic Deploy**
   - Push to `main` → auto-deploy
   - Vercel builds in ~30-60 seconds

2. **Manual Deploy**
   - Vercel Dashboard → Deployments → Redeploy

3. **Get URL**
   - Vercel provides: `https://flexcredi-xxx.vercel.app`
   - Add custom domain (optional): `app.flexcredi.com`

### Step 5: Update CORS on Backend

Add Vercel URL to Railway environment variables:

```bash
ALLOWED_ORIGINS=https://flexcredi-xxx.vercel.app,https://web-production-e227.up.railway.app
```

Redeploy Railway backend.

---

## 🗄️ DATABASE SETUP (SUPABASE)

### Current Configuration
- **Provider**: Supabase (PostgreSQL 15)
- **Host**: db.oekfkdvrgyiklgkfqpbt.supabase.co
- **Port**: 5432 (direct) | 6543 (pgbouncer - for app connections)
- **Database**: postgres
- **Schema**: public

### Connection Strings

**For Prisma (migrations):**
```
postgresql://postgres:PASSWORD@db.oekfkdvrgyiklgkfqpbt.supabase.co:5432/postgres?schema=public
```

**For Application (runtime):**
```
postgresql://postgres:PASSWORD@db.oekfkdvrgyiklgkfqpbt.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1
```

### Schema Updates

#### Option 1: Prisma Push (Recommended for dev)
```bash
cd backend
npx prisma db push --accept-data-loss
```

#### Option 2: Prisma Migrate (Recommended for prod)
```bash
cd backend
npx prisma migrate dev --name migration_name
npx prisma migrate deploy
```

#### Option 3: Manual SQL
```bash
psql "postgresql://postgres:PASSWORD@db.oekfkdvrgyiklgkfqpbt.supabase.co:5432/postgres" < backend/migration_us_market.sql
```

### Verify Tables
```bash
cd backend
npx prisma studio
```
Or use Supabase Dashboard → Table Editor

---

## 🔐 ENVIRONMENT VARIABLES

### Backend (Railway)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ | PostgreSQL connection | `postgresql://...` |
| `PORT` | ❌ | Server port (Railway sets automatically) | `8080` |
| `NODE_ENV` | ✅ | Environment | `production` |
| `ALLOWED_ORIGINS` | ✅ | CORS origins (comma-separated) | `https://app.vercel.app` |
| `JWT_SECRET` | ⏳ | JWT secret for auth | `random-string-here` |
| `API_KEY` | ⏳ | API key for protected endpoints | `api-key-here` |
| `EXPERIAN_API_KEY` | ⏳ | Experian credit API | (when ready) |

### Frontend (Vercel)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | ✅ | Backend API URL | `https://web-production-e227.up.railway.app` |
| `NEXT_PUBLIC_API_URL` | ✅ | (if using Next.js) | Same as above |

---

## 🧪 POST-DEPLOYMENT TESTING

### 1. Health Check
```bash
curl https://web-production-e227.up.railway.app/health
```

**Expected:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-22T04:30:00.000Z",
  "uptime": 12345,
  "environment": "production",
  "version": "4.0"
}
```

### 2. Test Endpoint
```bash
curl https://web-production-e227.up.railway.app/api/test
```

**Expected:**
```json
{
  "message": "FLEXCREDI Admin API is running!",
  "version": "4.0",
  "timestamp": "2026-02-22T04:30:00.000Z"
}
```

### 3. Database Connection
```bash
curl https://web-production-e227.up.railway.app/api/admin/dashboard
```

**Expected:**
```json
{
  "success": true,
  "dashboard": {
    "partners": { "total": 0, "pending": 0, "approved": 0, "rejected": 0 },
    "applications": { "total": 0, "pending": 0, ... },
    ...
  }
}
```

### 4. Create Test Application
```bash
curl -X POST https://web-production-e227.up.railway.app/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Test User",
    "clientEmail": "test@example.com",
    "clientPhone": "3051234567",
    "clientSsn": "123-45-6789",
    "clientAddress": "123 Test St",
    "clientCity": "Miami",
    "clientState": "FL",
    "clientZipCode": "33139",
    "monthlyIncome": 5000,
    "employer": "Test Corp",
    "occupation": "Engineer",
    "employmentStatus": "FULL_TIME",
    "desiredAmount": 10000,
    "purpose": "Test loan"
  }'
```

**Expected:**
```json
{
  "success": true,
  "application": {
    "id": "...",
    "clientName": "Test User",
    "status": "PENDING",
    ...
  }
}
```

### 5. Frontend Test

Visit `https://YOUR-VERCEL-APP.vercel.app` and:
1. ✅ Page loads
2. ✅ Can access application form
3. ✅ Can submit application (check Network tab for API call)
4. ✅ No CORS errors in console

---

## 🔧 TROUBLESHOOTING

### Problem: Railway Returns 502 Error

**Cause**: Application failed to start or crashed

**Solutions:**
1. Check Railway logs: Dashboard → Deployments → View Logs
2. Look for Node.js errors (syntax errors, missing dependencies)
3. Verify `DATABASE_URL` is correct
4. Ensure `PORT` is set correctly (Railway auto-assigns)
5. Check if Prisma migrations ran successfully

**Common Errors:**
```
Error: P1001: Can't reach database
→ Check DATABASE_URL, ensure using port 5432 for migrations

SyntaxError: Identifier 'xxx' has already been declared
→ Check for duplicate variable declarations

Error: Route.post() requires a callback function
→ Check exports in controllers (ensure proper module.exports)
```

### Problem: CORS Error on Frontend

**Cause**: Backend not allowing frontend origin

**Solution:**
1. Add Vercel URL to `ALLOWED_ORIGINS` in Railway
2. Redeploy backend
3. Clear browser cache

**Test CORS:**
```bash
curl -H "Origin: https://YOUR-VERCEL-APP.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://web-production-e227.up.railway.app/api/applications
```

### Problem: Database Connection Failed

**Cause**: Wrong connection string or firewall

**Solutions:**
1. Verify `DATABASE_URL` in Railway
2. Use port 5432 (not 6543) for migrations
3. Check Supabase dashboard for connection limits
4. Test connection:
```bash
psql "postgresql://postgres:PASSWORD@db.oekfkdvrgyiklgkfqpbt.supabase.co:5432/postgres" -c "SELECT 1"
```

### Problem: Prisma Migrations Not Running

**Cause**: `postinstall` hook failed

**Solutions:**
1. Check Railway logs for Prisma errors
2. Manually run migration:
   - Railway CLI: `railway run bash`
   - Inside container: `cd backend && npx prisma db push`
3. Or remove `|| true` from postinstall to see actual error

### Problem: Frontend Can't Reach Backend

**Cause**: Wrong API URL or network issue

**Solutions:**
1. Check `API_URL` in frontend code
2. Test backend directly: `curl https://web-production-e227.up.railway.app/health`
3. Check browser console for errors
4. Verify backend is running (Railway logs)

---

## 📊 DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] All code committed to `main` branch
- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] Local testing passed

### Backend (Railway)
- [ ] Repository connected
- [ ] Build settings configured
- [ ] Environment variables set
- [ ] Database migration ready
- [ ] Health endpoint working

### Frontend (Vercel)
- [ ] Project imported
- [ ] Build settings configured
- [ ] API URL environment variable set
- [ ] CORS configured on backend
- [ ] Test deployment successful

### Post-Deployment
- [ ] Health check returns 200 OK
- [ ] Test endpoint working
- [ ] Database queries working
- [ ] Frontend loads successfully
- [ ] API calls from frontend working
- [ ] No CORS errors
- [ ] Agents (AgentCreditAnalyzer, AgentDocumentChecker) running

---

## 🔗 USEFUL LINKS

**Project**
- Repository: https://github.com/chazmarques-blip/FLEXCREDI-SITE-ADM
- Backend API: https://web-production-e227.up.railway.app
- Frontend: (pending Vercel deployment)

**Platforms**
- Railway: https://railway.app/dashboard
- Vercel: https://vercel.com/dashboard
- Supabase: https://supabase.com/dashboard

**Documentation**
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs

---

## 📝 NOTES

### Database Migration Strategy
We use `prisma db push` in production via `postinstall` hook because:
1. Fast deployment (no migration history needed yet)
2. Auto-sync schema on every deploy
3. Suitable for early-stage development

For production-grade deployments, switch to:
```bash
npx prisma migrate deploy
```

### Monitoring
- Railway provides logs and metrics in Dashboard
- Set up alerts for errors
- Monitor response times and uptime

### Scaling
- Railway auto-scales based on traffic
- Database connection pooling via Supabase pgbouncer (port 6543)
- Consider adding Redis cache for high traffic

---

**Last Updated**: February 22, 2026  
**Status**: Backend fixes deployed, awaiting Railway redeploy  
**Next Steps**: Test production API, deploy frontend to Vercel
