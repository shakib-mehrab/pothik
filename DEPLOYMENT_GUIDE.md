# 🚀 Deployment Guide - Pothik

Complete guide for deploying Pothik to Firebase Hosting with easy redeployment workflow.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] Firebase CLI installed: `npm install -g firebase-tools`
- [ ] Logged into Firebase: `firebase login`
- [ ] Environment variables set in `.env` file
- [ ] All changes committed to Git
- [ ] Version number updated (if releasing new version)
- [ ] Service worker version updated in `public/sw.js` (if needed)
- [ ] Build tested locally: `npm run build && npm run preview`

---

## 🛠️ Quick Deployment (Local)

### First Time Setup

1. **Install Firebase CLI globally:**
```bash
npm install -g firebase-tools
```

2. **Login to Firebase:**
```bash
firebase login
```

3. **Verify project is linked:**
```bash
firebase projects:list
```

### Deploy Commands

#### Deploy Everything (Hosting + Functions + Rules)
```bash
npm run deploy:full
```

#### Deploy Only Frontend (Recommended for quick updates)
```bash
npm run deploy
```

#### Deploy Only Functions
```bash
npm run deploy:functions
```

#### Deploy Only Firestore Rules
```bash
npm run deploy:rules
```

---

## 🔄 Redeployment Workflow

### For Quick Updates (UI/Frontend Changes)

1. **Make your changes** to components, pages, or styles

2. **Test locally:**
```bash
npm run dev
```

3. **Build and deploy:**
```bash
npm run deploy
```

That's it! Your changes are live in ~2 minutes.

### For Data Updates (Adding/Modifying Data)

1. **Update seed data** in `seed-data/csv/` or `seed-data/json/`

2. **Run seed script:**
```bash
cd scripts
npm run seed -- -f ../seed-data/json/metro.json -c metroStations
```

3. **No redeployment needed!** Data is in Firestore, changes are instant.

### For New Features (Code Changes)

1. **Create a feature branch:**
```bash
git checkout -b feature/new-feature-name
```

2. **Develop and test:**
```bash
npm run dev
```

3. **Commit changes:**
```bash
git add .
git commit -m "Add new feature: description"
```

4. **Merge to main:**
```bash
git checkout main
git merge feature/new-feature-name
```

5. **Deploy:**
```bash
npm run deploy
```

---

## 📦 Version Management

### Bump Version Numbers

Before releasing a new version:

#### Patch Release (1.0.0 → 1.0.1) - Bug fixes
```bash
npm run version:patch
```

#### Minor Release (1.0.0 → 1.1.0) - New features
```bash
npm run version:minor
```

#### Major Release (1.0.0 → 2.0.0) - Breaking changes
```bash
npm run version:major
```

### Update Service Worker Version

When you want users to see updates immediately, update the cache version in `public/sw.js`:

```javascript
const CACHE_NAME = 'pothik-v2'; // Increment version
```

---

## 🤖 Automated Deployment (GitHub Actions)

### Setup (One-Time)

1. **Push code to GitHub:**
```bash
git remote add origin https://github.com/yourusername/pothik.git
git push -u origin main
```

2. **Add GitHub Secrets:**

Go to: `GitHub Repository → Settings → Secrets and variables → Actions`

Add these secrets:
- `FIREBASE_SERVICE_ACCOUNT` - Get from Firebase Console
- `VITE_FIREBASE_API_KEY` - From your .env file
- `VITE_FIREBASE_AUTH_DOMAIN` - From your .env file
- `VITE_FIREBASE_PROJECT_ID` - From your .env file
- `VITE_FIREBASE_STORAGE_BUCKET` - From your .env file
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - From your .env file
- `VITE_FIREBASE_APP_ID` - From your .env file

3. **Get Firebase Service Account:**
```bash
firebase init hosting:github
```
Follow prompts to create the service account.

### Auto-Deploy on Push

Once setup, every push to `main` branch automatically:
1. ✅ Installs dependencies
2. ✅ Generates PWA icons
3. ✅ Builds the project
4. ✅ Deploys to Firebase Hosting

**Just push to main, and it deploys automatically!**

---

## 🗂️ File Structure for Deployment

```
pothik/
├── dist/                    # Build output (deployed to Firebase)
│   ├── index.html
│   ├── assets/
│   ├── sw.js
│   └── manifest.json
├── public/                  # Static files (copied to dist)
│   ├── logo.svg
│   ├── sw.js               # Service Worker
│   ├── manifest.json       # PWA Manifest
│   └── icons/
├── src/                     # Source code
├── firebase.json            # Firebase config
├── .firebaserc             # Firebase project ID
└── package.json            # Scripts and dependencies
```

---

## 📊 Adding New Data (Easy Process)

### Option 1: Manual (Firestore Console)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `pathik-db6ee`
3. Click **Firestore Database**
4. Add/Edit documents directly in the UI

**No redeployment needed!**

### Option 2: Seed Script (Bulk Import)

1. **Update CSV/JSON file** in `seed-data/`

2. **Run seed script:**
```bash
cd scripts
npm run seed -- -f ../seed-data/json/restaurants.json -c restaurants
```

**No redeployment needed!**

### Option 3: Admin Panel (Through App)

1. **Login as admin** in the deployed app
2. **Use admin features** to add/edit/delete data
3. Changes save directly to Firestore

**No redeployment needed!**

---

## 🔥 Common Deployment Scenarios

### Scenario 1: Fixed a Bug
```bash
# Make fixes
git add .
git commit -m "Fix: description"
npm run deploy
```
⏱️ Time: ~2 minutes

### Scenario 2: Added New Feature
```bash
# Develop feature
npm run version:minor
git add .
git commit -m "Feature: description"
npm run deploy
```
⏱️ Time: ~2 minutes

### Scenario 3: Added New Metro Stations
```bash
# Update JSON file
cd scripts
npm run seed -- -f ../seed-data/json/metro.json -c metroStations
# Done! No deployment needed
```
⏱️ Time: ~10 seconds

### Scenario 4: Updated UI Colors/Styles
```bash
# Make CSS changes
npm run deploy
```
⏱️ Time: ~2 minutes

### Scenario 5: Updated Firestore Rules
```bash
# Edit firestore.rules
npm run deploy:rules
```
⏱️ Time: ~30 seconds

---

## 🔍 Verify Deployment

After deploying:

1. **Check Console Output:**
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/pathik-db6ee/overview
Hosting URL: https://pathik-db6ee.web.app
```

2. **Visit Your Site:**
   - Main URL: `https://pathik-db6ee.web.app`
   - Or custom domain (if configured)

3. **Test Features:**
   - [ ] Install PWA prompt appears
   - [ ] Offline mode works
   - [ ] Authentication works
   - [ ] Data loads from Firestore
   - [ ] Admin features (if logged in as admin)

4. **Check Browser Console:**
   - No errors
   - Service worker registered
   - Cache working

---

## 🚨 Troubleshooting

### Build Fails

**Error: "Module not found"**
```bash
npm install
npm run build
```

**Error: Environment variables missing**
- Check `.env` file exists
- Verify all `VITE_FIREBASE_*` variables are set

### Deploy Fails

**Error: "Authentication error"**
```bash
firebase login --reauth
```

**Error: "Permission denied"**
- Check Firebase project permissions
- Verify you're owner/editor of the project

**Error: "Build directory not found"**
```bash
npm run build
npm run deploy
```

### Service Worker Not Updating

1. **Hard refresh** browser: `Ctrl + Shift + R`
2. **Clear site data** in DevTools
3. **Increment cache version** in `sw.js`
4. **Redeploy**

### Data Not Showing

1. **Check Firestore rules** allow read access
2. **Verify collection names** match your code
3. **Check browser console** for errors
4. **Reseed data** if needed

---

## 📈 Monitoring & Analytics

### View Site Performance

1. **Firebase Console:**
   - Hosting → View Analytics
   - Performance → Monitor metrics

2. **Google Analytics:**
   - Add GA if needed for detailed tracking

### Check Logs

```bash
firebase functions:log
```

### View Deploy History

```bash
firebase hosting:releases:list
```

---

## 🔐 Security Best Practices

### Before Deploy

- ✅ Firestore rules properly configured
- ✅ API keys in environment variables (not hardcoded)
- ✅ Admin emails whitelisted in Firestore
- ✅ CORS configured for APIs
- ✅ Service account keys NOT in repo

### After Deploy

- ✅ Test authentication flows
- ✅ Verify admin-only routes protected
- ✅ Check Firestore rules in production
- ✅ Monitor for suspicious activity

---

## 🎯 Production Checklist

Before going live:

### Performance
- [ ] Lighthouse score > 90 for all metrics
- [ ] Images optimized (WebP, proper sizes)
- [ ] Unnecessary console.logs removed
- [ ] Build size < 1MB (check with `npm run build`)

### PWA
- [ ] Manifest.json validated
- [ ] Service worker caching correctly
- [ ] Offline mode works
- [ ] Install prompt functional

### Functionality
- [ ] All pages load correctly
- [ ] Forms submit properly
- [ ] Authentication works
- [ ] Admin features restricted
- [ ] Data displays correctly

### SEO & Metadata
- [ ] Meta tags set (title, description, OG tags)
- [ ] Favicon configured
- [ ] Sitemap generated (optional)
- [ ] robots.txt configured (optional)

---

## 🔄 Typical Development Cycle

```
1. Local Development
   ↓
   npm run dev
   ↓
2. Test Changes
   ↓
3. Commit to Git
   ↓
   git add . && git commit -m "message"
   ↓
4. Deploy
   ↓
   npm run deploy
   ↓
5. Verify Live Site
   ↓
   https://pathik-db6ee.web.app
   ↓
6. (Optional) Add/Update Data
   ↓
   npm run seed (in scripts folder)
   ↓
7. Monitor & Iterate
```

**Time per cycle: 5-10 minutes** ⚡

---

## 📞 Quick Reference

| Task | Command | Time |
|------|---------|------|
| Start dev server | `npm run dev` | - |
| Build project | `npm run build` | ~30s |
| Deploy hosting | `npm run deploy` | ~2min |
| Deploy everything | `npm run deploy:full` | ~3min |
| Seed data | `npm run seed` (in scripts/) | ~10s |
| Update version | `npm run version:patch` | ~1s |
| Preview build | `npm run preview` | - |

---

## 🆘 Support & Resources

- **Firebase Console:** https://console.firebase.google.com/
- **Firebase Docs:** https://firebase.google.com/docs
- **Vite Docs:** https://vitejs.dev/
- **React Router:** https://reactrouter.com/
- **PWA Guide:** See `PWA_IMPLEMENTATION.md`

---

## 🎉 You're Ready to Deploy!

**Simple workflow:**
1. Make changes
2. Test locally: `npm run dev`
3. Deploy: `npm run deploy`
4. Done! 🚀

Your app is now live and you can easily redeploy anytime with a single command!

---

**Project:** Pothik - Bangladesh Travel Guide  
**Hosting:** Firebase Hosting  
**Project ID:** pathik-db6ee  
**Live URL:** https://pathik-db6ee.web.app

**Status:** ✅ Ready for Production
