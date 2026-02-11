# 🚀 Quick Deploy Guide

## One-Time Setup (5 minutes)

1. **Install Firebase CLI:**
```bash
npm install -g firebase-tools
```

2. **Login to Firebase:**
```bash
firebase login
```

3. **Done!** You're ready to deploy.

---

## Deploy Now (2 minutes)

### Option 1: Using npm script (Recommended)
```bash
npm run deploy
```

### Option 2: Using PowerShell script (Windows)
```bash
./deploy.ps1
```

### Option 3: Manual commands
```bash
npm run build
firebase deploy --only hosting
```

---

## After Deploy

1. Visit: **https://pathik-db6ee.web.app**
2. Test PWA installation
3. Verify data loads correctly

---

## Update & Redeploy

Make changes, then:
```bash
npm run deploy
```

That's it! ✅

---

## Add New Data (No deployment needed!)

### Using Seed Script:
```bash
cd scripts
npm run seed -- -f ../seed-data/json/metro.json -c metroStations
```

### Using Admin Panel:
1. Login as admin
2. Add/edit data through UI
3. Changes are instant!

---

## Version Updates

Before major release:
```bash
npm run version:minor
git push
npm run deploy
```

---

## Need Help?

See full guide: `DEPLOYMENT_GUIDE.md`

**Live URL:** https://pathik-db6ee.web.app
**Firebase Console:** https://console.firebase.google.com/project/pathik-db6ee
