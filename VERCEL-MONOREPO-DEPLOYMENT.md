# 🚀 VERCEL DEPLOYMENT - MONOREPO STRATEGY
## Deploy Admin Dashboard Separately from Main Site

**Repository**: https://github.com/chazmarques-blip/FLEXCREDI-SITE-ADM  
**Strategy**: Monorepo with Multiple Vercel Projects  
**Date**: February 22, 2026

---

## 📊 REPOSITORY STRUCTURE

```
FLEXCREDI-SITE-ADM/
├── /                          # Main website (flexcredi.com)
│   ├── index.html            # Public site homepage
│   ├── css/                  # Public site styles
│   ├── js/                   # Public site scripts
│   ├── images/               # Public site images
│   └── vercel.json           # Config for main site (existing)
│
├── public/                    # Admin Dashboard (admin.flexcredi.com)
│   ├── admin/                # Dashboard pages
│   ├── css/                  # Dashboard styles
│   ├── js/                   # Dashboard scripts
│   ├── index.html            # Dashboard landing page
│   └── vercel.json           # ✅ Config for dashboard (new)
│
└── backend/                   # API (Railway)
    └── ...                    # Not deployed to Vercel
```

---

## 🎯 DEPLOYMENT STRATEGY

### Current Setup
1. **`flexcredi-site-adm`** - Already deployed on Vercel
   - Deploys root directory (`/`)
   - Domain: flexcredi.com (or similar)
   - Status: ✅ Already exists

### New Setup
2. **`flexcredi-dashboard`** - New project (to create)
   - Deploys `/public/` directory only
   - Domain: admin.flexcredi.com
   - Status: ⏳ To be created

---

## 📝 STEP-BY-STEP DEPLOYMENT

### Step 1: Create New Vercel Project

1. **Go to Vercel Dashboard**
   - URL: https://vercel.com/dashboard
   - Login with GitHub

2. **Add New Project**
   - Click **"Add New"** → **"Project"**
   - Click **"Import Git Repository"**
   - Select: `chazmarques-blip/FLEXCREDI-SITE-ADM` (same repo!)
   - Click **"Import"**

3. **Configure Project Name**
   - Project Name: **`flexcredi-dashboard`** (or `flexcredi-admin-dash`)
   - This differentiates it from existing `flexcredi-site-adm`

### Step 2: Configure Build Settings

**IMPORTANT:** This is what makes it work differently!

1. **Framework Preset**: Other (Static)

2. **Root Directory**: 
   ```
   public
   ```
   ⚠️ **CRITICAL:** Set to `public` (not `./` or leave blank)
   
   This tells Vercel to only deploy the `/public/` folder!

3. **Build Command**: 
   ```
   # Leave empty (static files)
   ```

4. **Output Directory**:
   ```
   # Leave empty (uses root of public/)
   ```

5. **Install Command**:
   ```
   # Leave empty (no dependencies)
   ```

### Step 3: Environment Variables

Add these in Project Settings → Environment Variables:

| Variable | Value | All Environments |
|----------|-------|------------------|
| `VITE_API_URL` | `https://web-production-e227.up.railway.app` | ✓ Production, Preview, Development |
| `NEXT_PUBLIC_API_URL` | `https://web-production-e227.up.railway.app` | ✓ Production, Preview, Development |

### Step 4: Deploy

1. **First Deployment**
   - Click **"Deploy"**
   - Vercel builds from `/public/` directory only
   - Takes ~30-60 seconds

2. **Get Temporary URL**
   - Vercel provides: `https://flexcredi-dashboard-xxx.vercel.app`
   - Test this before adding custom domain

3. **Verify Deployment**
   ```bash
   # Landing page
   curl https://flexcredi-dashboard-xxx.vercel.app/
   
   # Admin dashboard
   curl https://flexcredi-dashboard-xxx.vercel.app/admin/
   
   # API config
   curl https://flexcredi-dashboard-xxx.vercel.app/js/api-config.js
   ```

### Step 5: Add Custom Domain

1. **Go to Project Settings**
   - Dashboard → `flexcredi-dashboard` → Settings → Domains

2. **Add Domain**
   - Enter: `admin.flexcredi.com`
   - Click **"Add"**

3. **Configure DNS**
   - Vercel shows: `CNAME admin → cname.vercel-dns.com`
   - Go to your DNS provider (Cloudflare, GoDaddy, etc.)
   - Add CNAME record:
     ```
     Type: CNAME
     Name: admin
     Target: cname.vercel-dns.com
     TTL: Auto or 600
     ```

4. **Wait for Verification**
   - DNS propagation: 1-5 minutes (Cloudflare) or up to 24 hours
   - SSL auto-provisioned by Vercel
   - Green checkmark when ready

5. **Test Production URL**
   ```bash
   https://admin.flexcredi.com
   https://admin.flexcredi.com/admin/
   ```

### Step 6: Configure Git Integration

1. **Production Branch**
   - Settings → Git → Production Branch: `main`
   - Every push to `main` triggers auto-deploy for BOTH projects

2. **Ignored Build Step** (Optional)
   - To prevent rebuilding when only backend changes:
   - Settings → Git → Ignored Build Step
   - Command:
     ```bash
     git diff HEAD^ HEAD --quiet -- public/
     ```
   - This only rebuilds if `/public/` directory changes

### Step 7: Update Railway CORS

1. **Add Dashboard URL**
   - Railway Dashboard → FlexCredi Backend → Variables
   - Update `ALLOWED_ORIGINS`:
   ```
   https://admin.flexcredi.com,https://flexcredi-dashboard-xxx.vercel.app,https://web-production-e227.up.railway.app
   ```

2. **Redeploy Backend**
   - Deployments → Redeploy

3. **Test CORS**
   ```bash
   curl -H "Origin: https://admin.flexcredi.com" \
        -H "Access-Control-Request-Method: GET" \
        -X OPTIONS \
        https://web-production-e227.up.railway.app/health
   ```

---

## ✅ VERIFICATION CHECKLIST

### Project Configuration
- [ ] New Vercel project created: `flexcredi-dashboard`
- [ ] Root Directory set to: `public`
- [ ] Environment variables configured
- [ ] First deployment successful
- [ ] Temporary URL working

### Custom Domain
- [ ] `admin.flexcredi.com` added to Vercel
- [ ] DNS CNAME record created
- [ ] DNS verified (green checkmark)
- [ ] SSL certificate provisioned
- [ ] HTTPS working

### Testing
- [ ] Landing page loads: https://admin.flexcredi.com/
- [ ] Admin dashboard loads: https://admin.flexcredi.com/admin/
- [ ] CSS files load correctly
- [ ] JS files load correctly
- [ ] API calls work (check Network tab)
- [ ] No CORS errors in console
- [ ] Security headers present

### Backend Integration
- [ ] Railway CORS updated with admin domain
- [ ] Backend redeployed
- [ ] API health check working
- [ ] No CORS errors from frontend

---

## 🔧 TROUBLESHOOTING

### Problem: Vercel Deploys Root Instead of /public/

**Cause:** Root Directory not set correctly

**Solution:**
1. Go to Project Settings → General
2. Scroll to "Root Directory"
3. Set to: `public` (no leading/trailing slashes)
4. Click "Save"
5. Redeploy: Deployments → Redeploy

### Problem: 404 on All Pages

**Cause:** Root directory misconfigured or vercel.json not detected

**Solution:**
1. Check `/public/vercel.json` exists
2. Verify Root Directory = `public`
3. Check routes in vercel.json are correct
4. Redeploy

### Problem: Two Projects Deploy the Same Content

**Cause:** Both projects have same Root Directory

**Solution:**
- **`flexcredi-site-adm`** should have Root Directory: `./` or blank
- **`flexcredi-dashboard`** should have Root Directory: `public`

### Problem: Changes to Main Site Rebuild Dashboard

**Cause:** No Ignored Build Step configured

**Solution:**
1. Settings → Git → Ignored Build Step
2. Add command: `git diff HEAD^ HEAD --quiet -- public/`
3. This only rebuilds if `/public/` changes

---

## 📊 COMPARISON: Two Projects

| Feature | flexcredi-site-adm | flexcredi-dashboard |
|---------|-------------------|---------------------|
| **Repository** | FLEXCREDI-SITE-ADM | FLEXCREDI-SITE-ADM (same) |
| **Root Directory** | `./` or blank | `public` |
| **Deploys** | Root files (index.html, css/, js/) | Only /public/ folder |
| **Domain** | flexcredi.com | admin.flexcredi.com |
| **Purpose** | Public website | Admin dashboard |
| **Auto-deploy** | On push to main | On push to main (when public/ changes) |

---

## 🎯 BENEFITS OF THIS APPROACH

✅ **Single Repository** - Easier to manage, one source of truth  
✅ **Separate Deployments** - Main site and dashboard deploy independently  
✅ **Different Domains** - Public site vs admin portal  
✅ **Selective Rebuilds** - Only rebuild what changed  
✅ **Same Codebase** - Share utilities, styles if needed  
✅ **Simpler CI/CD** - One repo, multiple outputs  

---

## 📝 QUICK REFERENCE

### Vercel Dashboard URLs
- Main Site Project: https://vercel.com/dashboard/flexcredi-site-adm
- Dashboard Project: https://vercel.com/dashboard/flexcredi-dashboard

### Production URLs
- Main Site: https://flexcredi.com (or current domain)
- Admin Dashboard: https://admin.flexcredi.com
- Backend API: https://web-production-e227.up.railway.app

### Repository
- GitHub: https://github.com/chazmarques-blip/FLEXCREDI-SITE-ADM
- Main Site Code: `/` (root)
- Dashboard Code: `/public/`
- Backend Code: `/backend/`

---

## 🚀 NEXT STEPS AFTER DEPLOYMENT

1. **Test Thoroughly**
   - Both sites work independently
   - No cross-contamination
   - API calls work from both

2. **Set Up Monitoring**
   - Vercel Analytics (optional)
   - Uptime monitoring
   - Error tracking

3. **Document URLs**
   - Update all documentation with new URLs
   - Share with team
   - Update environment variables

4. **Configure Alerts**
   - Deployment failures
   - Build errors
   - Downtime notifications

---

## 📚 ADDITIONAL RESOURCES

- **Vercel Monorepo Guide**: https://vercel.com/docs/git/monorepos
- **Root Directory Documentation**: https://vercel.com/docs/concepts/projects/project-configuration#root-directory
- **Multiple Projects Guide**: https://vercel.com/docs/concepts/git/monorepos#multiple-vercel-projects

---

**Deployment Date**: February 22, 2026  
**Strategy**: Monorepo with Root Directory isolation  
**Status**: Ready for deployment  
**Estimated Time**: 15-20 minutes

🎉 **Your monorepo is now ready for dual deployment!**
