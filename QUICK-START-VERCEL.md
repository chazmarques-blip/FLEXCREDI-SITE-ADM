# 🎯 QUICK START: Deploy Admin Dashboard to Vercel

## TL;DR - 5 Minute Setup

You have **ONE repository** with **TWO websites**:
- Root (`/`) = Public site → flexcredi.com
- `public/` = Admin dashboard → admin.flexcredi.com

---

## 🚀 DEPLOYMENT STEPS

### 1. Go to Vercel
```
https://vercel.com/dashboard
```

### 2. Add New Project
- Click: **"Add New"** → **"Project"**
- Import: `chazmarques-blip/FLEXCREDI-SITE-ADM` (same repo as before!)
- Name it: **`flexcredi-dashboard`**

### 3. Configure (MOST IMPORTANT!)
```
Framework Preset:    Other (Static)
Root Directory:      public          ← CRITICAL! This is the magic!
Build Command:       [leave empty]
Output Directory:    [leave empty]
Install Command:     [leave empty]
```

### 4. Environment Variables
```
VITE_API_URL = https://web-production-e227.up.railway.app
```

### 5. Deploy
- Click **"Deploy"**
- Wait ~30 seconds
- Get URL: `https://flexcredi-dashboard-xxx.vercel.app`

### 6. Add Domain
- Settings → Domains → Add: **`admin.flexcredi.com`**
- Configure DNS: `CNAME admin → cname.vercel-dns.com`

### 7. Update Railway CORS
```
ALLOWED_ORIGINS = https://admin.flexcredi.com,https://web-production-e227.up.railway.app
```

---

## ✅ DONE!

Your admin dashboard is now live at:
```
https://admin.flexcredi.com
https://admin.flexcredi.com/admin/
```

---

## 📊 HOW IT WORKS

```
GitHub Repo: FLEXCREDI-SITE-ADM
│
├── /                    ─────► Vercel Project 1: flexcredi-site-adm
│   ├── index.html             └─► Domain: flexcredi.com
│   ├── css/
│   └── js/
│
└── public/              ─────► Vercel Project 2: flexcredi-dashboard  ← NEW!
    ├── admin/                 └─► Domain: admin.flexcredi.com
    ├── css/
    └── js/
```

**Key:** Root Directory setting tells Vercel which folder to deploy!

---

## 🔗 DETAILED GUIDE

Full instructions: `/VERCEL-MONOREPO-DEPLOYMENT.md`

---

**Time to deploy:** 5-10 minutes  
**Difficulty:** Easy  
**What's different:** Just set Root Directory to `public`
