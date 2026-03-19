# 🏦 FlexCredi LLC - Admin Portal

Administrative portal for FlexCredi credit platform.

## 🚀 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/chazmarques-blip/FLEXCREDI-SITE-ADM)

## 📦 Project Structure

```
/
├── public/                 # Static files (served by Vercel)
│   ├── admin/             # Admin dashboard pages
│   │   ├── index.html     # Main admin dashboard
│   │   ├── clientes.html  # Client management
│   │   └── simples.html   # Simple admin view
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript files
│   │   └── api-config.js  # API configuration
│   ├── assets/            # Images, fonts, etc.
│   └── index.html         # Landing page
├── backend/               # Node.js API (deployed on Railway)
├── vercel.json            # Vercel configuration
└── .vercelignore          # Files to ignore in deployment
```

## 🌐 Deployment

### Automatic Deployment

1. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import `chazmarques-blip/FLEXCREDI-SITE-ADM`
   - Vercel auto-deploys on every push to `main`

2. **Manual Deployment**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login
   vercel login
   
   # Deploy
   vercel --prod
   ```

### Custom Domain Setup

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Add `admin.flexcredi.com`
   - Vercel provides DNS configuration

2. **Configure DNS (Cloudflare/GoDaddy/etc.)**
   - Type: `CNAME`
   - Name: `admin`
   - Value: `cname.vercel-dns.com`
   - TTL: Auto

3. **Wait for Verification**
   - DNS propagation takes 1-24 hours
   - Vercel auto-provisions SSL certificate

## 🔧 Configuration

### Environment Variables

Set in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | `https://web-production-e227.up.railway.app` | Backend API URL |
| `NEXT_PUBLIC_API_URL` | `https://web-production-e227.up.railway.app` | (if using Next.js) |

### API Configuration

The API URL is configured in `/public/js/api-config.js`:

```javascript
const API_URL = 'https://web-production-e227.up.railway.app';
```

## 🧪 Testing

### Local Testing

```bash
# Install local server (optional)
npm install -g http-server

# Serve public directory
http-server public -p 8080

# Open browser
open http://localhost:8080
```

### Production Testing

After deployment:

1. **Landing Page**: https://admin.flexcredi.com
2. **Admin Dashboard**: https://admin.flexcredi.com/admin/
3. **API Health Check**: Network tab in browser console

## 📚 Documentation

- **Deployment Guide**: `/DEPLOYMENT-GUIDE.md`
- **Self-Service Flow**: `/CLIENT-SELF-SERVICE-FLOW.md`
- **US Market Adjustments**: `/US-MARKET-ADJUSTMENTS.md`
- **Backend API**: https://web-production-e227.up.railway.app

## 🔗 Links

- **Repository**: https://github.com/chazmarques-blip/FLEXCREDI-SITE-ADM
- **Backend API**: https://web-production-e227.up.railway.app
- **Frontend**: https://admin.flexcredi.com (pending DNS)

## 📝 Version

- **Version**: 4.0
- **Market**: US (Florida)
- **Last Updated**: February 22, 2026

## 📄 License

Proprietary - FlexCredi LLC
