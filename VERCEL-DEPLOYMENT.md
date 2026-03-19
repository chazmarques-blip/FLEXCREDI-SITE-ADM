# 🚀 VERCEL DEPLOYMENT GUIDE - admin.flexcredi.com
## Step-by-Step Instructions

**Date**: February 22, 2026  
**Project**: FlexCredi Admin Portal  
**Domain**: admin.flexcredi.com  
**Repository**: https://github.com/chazmarques-blip/FLEXCREDI-SITE-ADM

---

## 📋 PRE-DEPLOYMENT CHECKLIST

- ✅ Repository pushed to GitHub (`dbc4fcb` commit)
- ✅ `/public/` directory with organized files
- ✅ `vercel.json` configuration file
- ✅ `.vercelignore` to exclude backend
- ✅ API configuration in `/public/js/api-config.js`
- ✅ Backend API running on Railway
- ✅ DNS access for flexcredi.com domain

---

## 🎯 DEPLOYMENT STEPS

### Step 1: Import Project to Vercel

1. **Go to Vercel Dashboard**
   - URL: https://vercel.com/dashboard
   - Login with GitHub account

2. **Import Repository**
   - Click **"Add New"** → **"Project"**
   - Select **"Import Git Repository"**
   - Find `chazmarques-blip/FLEXCREDI-SITE-ADM`
   - Click **"Import"**

3. **Configure Project**
   Vercel will auto-detect the configuration, but verify:
   
   - **Project Name**: `flexcredi-admin`
   - **Framework Preset**: Other (Static HTML)
   - **Root Directory**: `./` (leave default, vercel.json handles routing)
   - **Build Command**: (leave empty - static files)
   - **Output Directory**: `public`
   - **Install Command**: (leave empty)

### Step 2: Configure Environment Variables

1. **Go to Project Settings**
   - Dashboard → Your Project → Settings → Environment Variables

2. **Add Variables**
   
   | Variable Name | Value | Environment |
   |--------------|--------|-------------|
   | `VITE_API_URL` | `https://web-production-e227.up.railway.app` | Production, Preview, Development |
   | `NEXT_PUBLIC_API_URL` | `https://web-production-e227.up.railway.app` | Production, Preview, Development |

   Note: Even though we're not using Vite/Next.js, these are defined for future compatibility.

### Step 3: Deploy

1. **Trigger Deployment**
   - Vercel automatically deploys after import
   - Or click **"Deploy"** button
   - Deployment takes ~30-60 seconds

2. **Monitor Build**
   - Watch build logs in real-time
   - Green checkmark = successful deployment
   - Red X = build failed (check logs)

3. **Get Deployment URL**
   - Vercel provides: `https://flexcredi-admin-xxx.vercel.app`
   - Test this URL before adding custom domain

### Step 4: Test Deployment

**Test URLs:**

1. **Landing Page**
   ```
   https://flexcredi-admin-xxx.vercel.app/
   ```
   Expected: Landing page with "Access Admin Dashboard" button

2. **Admin Dashboard**
   ```
   https://flexcredi-admin-xxx.vercel.app/admin/
   ```
   Expected: Admin dashboard loads successfully

3. **API Connection**
   - Open browser console (F12)
   - Navigate to admin dashboard
   - Check Network tab for API calls to Railway
   - Should see calls to `https://web-production-e227.up.railway.app`

4. **No CORS Errors**
   - Console should be clean (no red errors)
   - If CORS error: add Vercel URL to Railway ALLOWED_ORIGINS

### Step 5: Add Custom Domain (admin.flexcredi.com)

1. **Go to Project Settings**
   - Dashboard → Your Project → Settings → Domains

2. **Add Domain**
   - Click **"Add"**
   - Enter: `admin.flexcredi.com`
   - Click **"Add"**

3. **Vercel Provides DNS Configuration**
   Vercel will show:
   ```
   Type: CNAME
   Name: admin
   Value: cname.vercel-dns.com
   ```

### Step 6: Configure DNS

**If using Cloudflare:**

1. **Login to Cloudflare**
   - Go to flexcredi.com domain

2. **Add DNS Record**
   - Type: `CNAME`
   - Name: `admin`
   - Target: `cname.vercel-dns.com`
   - Proxy status: DNS only (gray cloud) **IMPORTANT**
   - TTL: Auto

3. **Save**

**If using GoDaddy/Namecheap/Other:**

1. **Login to DNS Provider**
   - Navigate to DNS Management for flexcredi.com

2. **Add CNAME Record**
   - Host: `admin`
   - Points to: `cname.vercel-dns.com`
   - TTL: 600 or Auto

3. **Save Changes**

### Step 7: Wait for DNS Propagation

1. **Verification**
   - Vercel automatically verifies DNS
   - Takes 1-5 minutes (Cloudflare) or up to 24 hours (other providers)
   - Green checkmark appears when verified

2. **SSL Certificate**
   - Vercel auto-provisions Let's Encrypt SSL
   - Takes 1-2 minutes after DNS verification
   - HTTPS automatically enabled

3. **Test Domain**
   ```bash
   # Check DNS propagation
   nslookup admin.flexcredi.com
   
   # Should return:
   # Name: cname.vercel-dns.com
   # Address: 76.76.21.xxx (Vercel IP)
   ```

4. **Access Production Site**
   ```
   https://admin.flexcredi.com
   ```

### Step 8: Update Railway CORS

1. **Add Vercel Domain to CORS**
   - Go to Railway Dashboard
   - Select FlexCredi Backend project
   - Settings → Variables
   - Update `ALLOWED_ORIGINS`:
   ```
   https://admin.flexcredi.com,https://flexcredi-admin-xxx.vercel.app,https://web-production-e227.up.railway.app
   ```

2. **Redeploy Backend**
   - Railway → Deployments → Deploy Latest
   - Or push new commit to trigger auto-deploy

3. **Verify CORS**
   ```bash
   curl -H "Origin: https://admin.flexcredi.com" \
        -H "Access-Control-Request-Method: GET" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS \
        https://web-production-e227.up.railway.app/health
   ```

---

## ✅ POST-DEPLOYMENT VERIFICATION

### 1. Landing Page Test
```bash
curl -I https://admin.flexcredi.com/
```
**Expected:** HTTP 200, HTML content

### 2. Admin Dashboard Test
```bash
curl -I https://admin.flexcredi.com/admin/
```
**Expected:** HTTP 200, HTML content

### 3. Static Assets Test
```bash
curl -I https://admin.flexcredi.com/css/style.css
curl -I https://admin.flexcredi.com/js/api-config.js
```
**Expected:** HTTP 200, proper Content-Type headers

### 4. API Connection Test
- Visit: https://admin.flexcredi.com/admin/
- Open Browser Console (F12) → Network tab
- Look for API calls to Railway
- Should see requests to `https://web-production-e227.up.railway.app`
- No CORS errors

### 5. Security Headers Test
```bash
curl -I https://admin.flexcredi.com/ | grep -E "X-Frame-Options|X-Content-Type-Options|X-XSS-Protection"
```
**Expected:**
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
```

### 6. Cache Headers Test
```bash
# CSS/JS should have long cache
curl -I https://admin.flexcredi.com/css/style.css | grep Cache-Control
# Expected: Cache-Control: public, max-age=31536000, immutable

# HTML should have no cache
curl -I https://admin.flexcredi.com/admin/ | grep Cache-Control
# Expected: Cache-Control: public, max-age=0, must-revalidate
```

---

## 🔧 TROUBLESHOOTING

### Problem: 404 on /admin/ pages

**Cause:** Vercel routing not configured correctly

**Solution:**
1. Check `vercel.json` has correct routes
2. Ensure `public/admin/index.html` exists
3. Redeploy: `vercel --prod`

### Problem: CORS Error

**Cause:** Railway backend not allowing Vercel origin

**Solution:**
1. Add Vercel URL to Railway `ALLOWED_ORIGINS`
2. Redeploy Railway backend
3. Clear browser cache
4. Hard reload (Ctrl+Shift+R)

### Problem: CSS/JS Not Loading

**Cause:** Wrong file paths or 404

**Solution:**
1. Check browser console for 404 errors
2. Verify files exist in `/public/css/` and `/public/js/`
3. Check `vercel.json` routing configuration
4. Ensure file names match (case-sensitive)

### Problem: API Calls Failing

**Cause:** Wrong API URL or Railway down

**Solution:**
1. Check `/public/js/api-config.js` has correct URL
2. Test Railway directly: `curl https://web-production-e227.up.railway.app/health`
3. Check Railway deployment logs
4. Verify environment variables in Vercel

### Problem: Domain Not Resolving

**Cause:** DNS not propagated or misconfigured

**Solution:**
1. Wait 1-24 hours for DNS propagation
2. Check DNS records: `nslookup admin.flexcredi.com`
3. Verify CNAME points to `cname.vercel-dns.com`
4. If using Cloudflare: disable proxy (gray cloud)
5. Clear DNS cache: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)

### Problem: SSL Certificate Error

**Cause:** Certificate not provisioned yet

**Solution:**
1. Wait 1-2 minutes after DNS verification
2. Check Vercel Dashboard → Domains → SSL status
3. If stuck: remove domain and re-add
4. Contact Vercel support if persists

---

## 📊 DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] Code pushed to GitHub `main` branch
- [ ] `vercel.json` configuration verified
- [ ] Backend API running on Railway
- [ ] DNS access for flexcredi.com

### Vercel Setup
- [ ] Project imported to Vercel
- [ ] Environment variables configured
- [ ] Initial deployment successful
- [ ] Test URL working (https://flexcredi-admin-xxx.vercel.app)

### Custom Domain
- [ ] Domain added in Vercel
- [ ] DNS CNAME record created
- [ ] DNS propagation verified
- [ ] SSL certificate provisioned
- [ ] HTTPS working on admin.flexcredi.com

### CORS Configuration
- [ ] Vercel URL added to Railway ALLOWED_ORIGINS
- [ ] Railway backend redeployed
- [ ] CORS verified (no errors in browser console)

### Testing
- [ ] Landing page loads
- [ ] Admin dashboard loads
- [ ] API calls working
- [ ] No 404 errors
- [ ] No console errors
- [ ] Security headers present
- [ ] Cache headers correct

---

## 🔗 USEFUL LINKS

**Project**
- Repository: https://github.com/chazmarques-blip/FLEXCREDI-SITE-ADM
- Backend API: https://web-production-e227.up.railway.app
- Frontend (after deployment): https://admin.flexcredi.com

**Vercel**
- Dashboard: https://vercel.com/dashboard
- Documentation: https://vercel.com/docs
- CLI: https://vercel.com/docs/cli

**DNS Tools**
- DNS Checker: https://dnschecker.org
- SSL Checker: https://www.sslshopper.com/ssl-checker.html

---

## 📝 NEXT STEPS

After successful deployment:

1. **Monitor Performance**
   - Vercel Analytics (optional paid feature)
   - Check response times and error rates

2. **Set Up Alerts**
   - Vercel can notify on deployment failures
   - Configure in Project Settings → Notifications

3. **Add Team Members**
   - Project Settings → Team Members
   - Add developers with appropriate permissions

4. **Configure Preview Deployments**
   - Every PR gets a preview URL
   - Settings → Git → Preview Deployments

5. **Enable Analytics** (optional)
   - Project Settings → Analytics
   - Track page views, performance, etc.

---

## 🎉 SUCCESS CRITERIA

Your deployment is successful when:

✅ https://admin.flexcredi.com loads the landing page  
✅ https://admin.flexcredi.com/admin/ loads the dashboard  
✅ API calls to Railway work (check Network tab)  
✅ No CORS errors in console  
✅ SSL certificate valid (green padlock)  
✅ All CSS/JS files loading  
✅ Security headers present  

---

**Deployment Date**: February 22, 2026  
**Commit**: `dbc4fcb`  
**Status**: Ready for production deployment  
**Estimated Time**: 15-30 minutes (excluding DNS propagation)

Good luck with the deployment! 🚀
