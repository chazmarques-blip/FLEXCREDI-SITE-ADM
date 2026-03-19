# 🔐 FlexCredi Admin Login

## 🌐 Access URL
**Admin Panel:** https://www.flexcredi.com/admin-panel/admin/login.html

---

## 👤 Test Credentials (Development Mode)

### Default Admin Account
```
Email:    admin@flexcredi.com
Password: FlexCredi2024!
```

**Note:** These credentials work in fallback mode when the Railway API is unavailable due to CORS restrictions.

---

## 🔄 Login Flow

### Normal Flow (with API):
1. User enters credentials
2. System sends POST to Railway API
3. API validates and returns JWT token
4. Token stored in `localStorage.adminToken`
5. Redirect to admin dashboard

### Fallback Flow (without API):
1. User enters credentials
2. System detects API unavailable (CORS/timeout)
3. If credentials match fallback (`admin@flexcredi.com` / `FlexCredi2024!`)
4. Generate mock token and user object
5. Store in localStorage
6. Redirect to admin dashboard

---

## 🐛 Troubleshooting

### Issue: "Login error: Timed-out"
**Cause:** Railway API not responding or CORS blocking request  
**Solution:** System automatically uses fallback mode with test credentials

### Issue: Redirect loop (login → dashboard → login)
**Cause:** localStorage keys mismatch  
**Solution:** Fixed in commit `8975f5c` - now uses consistent `adminToken` / `adminUser`

### Issue: "API_BASE_URL has already been declared"
**Cause:** Script loading order  
**Solution:** Fixed in commit `6272121` - api-config.js loads before auth.js

---

## 🔧 Backend Configuration (Railway)

To enable production API login, configure CORS on Railway backend:

```javascript
// backend/server.js or similar
app.use(cors({
  origin: [
    'https://www.flexcredi.com',
    'https://admin.flexcredi.com'
  ],
  credentials: true
}));
```

---

## 📝 localStorage Keys

The admin system uses these localStorage keys:

| Key | Type | Description |
|-----|------|-------------|
| `adminToken` | String | JWT authentication token |
| `adminUser` | JSON | User object (email, name, role) |
| `adminRemember` | String | "true" if "Remember Me" was checked |

**Clear cache:**
```javascript
localStorage.clear();
```

---

## 🚀 Features

### Protected Routes
All admin pages check for authentication:
- `/admin-panel/admin/admin-dashboard-v2.html`
- `/admin-panel/admin/admin-aplicacoes.html`
- `/admin-panel/admin/admin-clientes.html`
- etc.

### Auto-redirect
If not authenticated, any admin page redirects to login.

---

## 🎯 Next Steps

1. **Test login** with fallback credentials
2. **Configure Railway CORS** for production API
3. **Create real admin accounts** in database
4. **Update credentials** (remove fallback for production)

---

Last Updated: March 4, 2026
