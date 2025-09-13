# GitHub Secrets Setup Guide
## Free Alternative to Netlify Environment Variables

Since Netlify environment variables require a paid subscription, we'll use **GitHub Secrets** (completely free) with GitHub Actions to deploy your site.

## 🔐 Setting Up GitHub Secrets

### Step 1: Go to GitHub Repository Settings
1. Visit: https://github.com/GeorgeRCAdamJohnson/cloud_Ai_Art
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions**

### Step 2: Add Required Secrets
Click **New repository secret** for each of these:

#### ✅ HUGGINGFACEALL
```
Name: HUGGINGFACEALL
Secret: [Your Hugging Face API Token from .env.local]
```

#### ✅ NEXTAUTH_SECRET  
```
Name: NEXTAUTH_SECRET
Secret: cloud-ai-art-secret-2025-netlify-production
```

#### ✅ NETLIFY_AUTH_TOKEN (if not already added)
```
Name: NETLIFY_AUTH_TOKEN
Secret: [Your Netlify Personal Access Token]
```

### Step 3: Get Netlify Auth Token (if needed)
1. Go to: https://app.netlify.com/user/applications#personal-access-tokens
2. Click **New access token**
3. Name: "GitHub Actions Deploy"
4. Copy the token and add it as `NETLIFY_AUTH_TOKEN` secret

## 🚀 How It Works

1. **GitHub Actions** builds your site with environment variables from GitHub Secrets
2. **Deploys** the built site to Netlify with embedded environment variables
3. **No Netlify environment variables needed** - everything is baked into the build

## 🧪 Testing the Setup

1. **Push code** to main branch
2. **Check GitHub Actions**: https://github.com/GeorgeRCAdamJohnson/cloud_Ai_Art/actions
3. **Wait for deployment** to complete
4. **Test API**: https://cloudaiart.netlify.app/api/generate-sprite

## 📋 Verification Checklist

- [ ] `HUGGINGFACEALL` secret added to GitHub
- [ ] `NEXTAUTH_SECRET` secret added to GitHub  
- [ ] `NETLIFY_AUTH_TOKEN` secret added to GitHub
- [ ] GitHub Actions workflow updated
- [ ] Code pushed to main branch
- [ ] Deployment successful
- [ ] API endpoints working

## 🔧 Manual Deployment (Backup)

If GitHub Actions fails, you can still deploy manually:

```bash
# Build with environment variables
npm run build

# Deploy using Netlify CLI
netlify deploy --prod --dir=.next
```

## 🎯 Benefits of This Approach

✅ **Completely Free** - No paid Netlify subscription needed
✅ **Secure** - Secrets stored safely in GitHub
✅ **Automatic** - Deploys on every push to main
✅ **Environment Variables** - Properly injected during build
✅ **API Routes** - Work correctly as serverless functions

## 🆘 Troubleshooting

**Problem**: API routes return 404
**Solution**: Environment variables are now embedded in build, not runtime

**Problem**: Hugging Face API fails  
**Solution**: Check GitHub Secrets are spelled exactly right

**Problem**: GitHub Actions fails
**Solution**: Check all required secrets are added