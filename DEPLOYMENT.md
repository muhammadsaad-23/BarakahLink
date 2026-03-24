# Deployment Guide for Vercel

This guide will help you deploy BarakahLink to Vercel.

## Quick Deploy

1. **Push your code to GitHub** (already done ✅)

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "Add New Project"
   - Select your `barakahlink` repository
   - Vercel will auto-detect Vite settings

3. **Configure Environment Variables:**
   - In the Vercel project settings, go to "Environment Variables"
   - Add: `GEMINI_API_KEY` with your API key value
   - (Optional - app works without it using fallback)

4. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

## Important Notes

- ✅ The app is **100% client-side** - no backend server needed
- ✅ All data is stored in browser memory (resets on refresh)
- ✅ Vercel will automatically detect Vite and configure build settings
- ✅ The `vercel.json` file is included for optimal routing

## Environment Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

- `GEMINI_API_KEY` - Your Google Gemini API key (optional)

## Build Settings (Auto-detected)

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## Post-Deployment

After deployment, your app will be available at:
- `https://your-project-name.vercel.app`

You can also set up a custom domain in Vercel settings.

## Troubleshooting

If you encounter issues:

1. **Build fails:** Check that all dependencies are in `package.json`
2. **Environment variables not working:** Make sure they're set in Vercel dashboard
3. **Routing issues:** The `vercel.json` includes SPA routing configuration

