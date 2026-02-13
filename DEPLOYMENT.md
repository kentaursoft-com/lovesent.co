# 🚀 Cloudflare Pages Deployment Guide

## Issue: Site shows 404

Your deployment succeeded but the site isn't loading. This is because Cloudflare Pages needs specific configuration.

## ✅ Required Cloudflare Pages Settings

### 1. Build Configuration

Go to **Workers & Pages** → **lovesent-page** → **Settings** → **Builds & deployments**

Set these values:

| Setting | Value |
|---------|-------|
| **Build command** | `npm run build` |
| **Build output directory** | `.svelte-kit/cloudflare` |
| **Root directory** | (leave empty) |
| **Node version** | `20` or higher |

### 2. Environment Variables

Go to **Workers & Pages** → **lovesent-page** → **Settings** → **Environment variables**

Add these for **Production**:

```
JWT_SECRET=your-actual-secret-here-min-32-chars
RESEND_API_KEY=re_your_actual_key
BACKBLAZE_KEY_ID=00564d72a6fb4ab0000000002
BACKBLAZE_APP_KEY=K005fDVbXrc5UasowObluULrwOTpJko
BACKBLAZE_BUCKET_NAME=lovesent-photos
```

### 3. D1 Database Binding

Go to **Workers & Pages** → **lovesent-page** → **Settings** → **Functions** → **D1 database bindings**

Click **Add binding**:
- **Variable name**: `DB`
- **D1 database**: Select `lovesent-db` from dropdown

### 4. Redeploy

After setting all the above:
1. Go to **Deployments** tab
2. Click the **···** (three dots) on the latest deployment
3. Click **Retry deployment** or **Redeploy**

---

## 🧪 Testing Locally

To test the production build locally:

```bash
# Build the app
npm run build

# Deploy to local wrangler
npx wrangler pages dev .svelte-kit/cloudflare --d1 DB=lovesent-db
```

## 📋 Checklist

- [ ] Build output directory set to `.svelte-kit/cloudflare`
- [ ] Build command set to `npm run build`
- [ ] D1 database `DB` binding added
- [ ] All environment variables configured
- [ ] Redeployed after configuration changes
- [ ] Site loads at `lovesent-page.pages.dev`

## 🔍 Troubleshooting

### Still seeing 404?

1. **Check build logs**: Go to Deployments → View details → Build logs
2. **Check function logs**: Go to Deployments → View details → Functions logs
3. **Verify bindings**: Settings → Functions → Check D1 binding exists

### Build failing?

- Ensure Node.js version is 18+ in build settings
- Check that `.svelte-kit/cloudflare` directory is created during build
- Verify `@sveltejs/adapter-cloudflare` is installed

### Database errors?

- Ensure D1 binding variable name is exactly `DB` (case-sensitive)
- Verify database `lovesent-db` exists in your Cloudflare account
- Check migrations were applied: `npx wrangler d1 migrations list lovesent-db`

---

**Most Common Issue**: Build output directory not set to `.svelte-kit/cloudflare` ⚠️
