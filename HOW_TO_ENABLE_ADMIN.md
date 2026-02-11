# How to Enable Admin Access

## Problem
You're getting "Access Denied" when trying to access the admin dashboard because your user role is set to "user" by default.

## Solution: Set Your Role to Admin in Firebase

Follow these steps carefully:

### Step 1: Go to Firebase Console
1. Open https://console.firebase.google.com/
2. Select your project: **pathik-db6ee**

### Step 2: Navigate to Firestore Database
1. In the left sidebar, click **"Firestore Database"**
2. You'll see a list of collections

### Step 3: Find Your User Document
1. Click on the **"users"** collection
2. Find your user document (it will have your UID as the document ID)
   - If you don't know your UID, check the browser console when logged in
   - Or look for the document with your email address

### Step 4: Edit the Role Field
1. Click on your user document to open it
2. Find the field named **"role"**
3. Click on the value (it currently says "user")
4. Change it to: **admin**
5. Click the **"Update"** button

### Step 5: Sign Out and Sign Back In
1. Go back to your app at http://localhost:5173
2. Click your avatar in the top right
3. Click "লগ আউট" (Logout)
4. Sign in again with your credentials

### Step 6: Verify Admin Access
1. After signing in, click your avatar again
2. You should now see "Admin Dashboard" in the dropdown menu
3. Click it to access the admin dashboard

## Visual Guide

```
Firebase Console
└── Firestore Database
    └── users (collection)
        └── [your-uid] (document)
            ├── email: "your@email.com"
            ├── displayName: "Your Name"
            ├── role: "user" ← CHANGE THIS TO "admin"
            └── ...other fields
```

## Alternative: Use Firebase Console Query

If you can't find your user document:

1. In Firestore Database, click "Start collection"
2. In the filter bar, add filter:
   - Field path: `email`
   - Operator: `==`
   - Value: `your@email.com` (your actual email)
3. Click "Apply"
4. Your document should appear
5. Follow Step 4 above to edit the role

## Troubleshooting

### Still Can't Access Admin Dashboard?

1. **Clear browser cache:**
   - Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
   - Select "Cached images and files"
   - Click "Clear data"

2. **Check browser console for errors:**
   - Press `F12` to open Developer Tools
   - Click "Console" tab
   - Look for real errors (ignore browser extension errors from content.bundle.js)

3. **Verify role was saved:**
   - Go back to Firebase Console → Firestore → users → your document
   - Confirm the role field shows "admin"

4. **Check userData in console:**
   - Open browser console (F12)
   - Run: `localStorage.getItem('auth')`
   - You should see your user data with role: "admin"

### The Console Errors You See Are NORMAL

These errors are from **browser extensions**, NOT your app:
- `content.bundle.js:2 Uncaught (in promise) Error: auth required` ← Browser extension (Clearly)
- `giveFreely.tsx` errors ← Browser extension (Give Freely)
- `ERR_BLOCKED_BY_CLIENT` ← Ad blocker blocking requests

**To confirm these are from extensions:**
1. Open your app in Incognito/Private mode (extensions disabled)
2. The errors should disappear

### React Warning About Refs

The warning about `Function components cannot be given refs` is from Radix UI library and doesn't affect functionality. It's safe to ignore.

## After Setting Admin Role

Once you've set your role to "admin" and signed back in, you'll have access to:

1. **Admin Dashboard** (`/admin`)
   - View pending submissions count
   - Quick access to review queue
   - System status

2. **Review Queue** (`/admin/review-queue`)
   - Approve/reject user submissions
   - Award points to contributors
   - Update leaderboard

3. **Seed Data** (`/admin/seed-data`)
   - Import sample data for testing
   - Quickly populate database

## Need Help?

If you're still having issues after following these steps:

1. Share a screenshot of your Firestore user document
2. Share any NEW errors from the browser console (not the browser extension ones)
3. Confirm you've signed out and back in after changing the role

---

**Status:** Profile page fixed ✅ (no longer requires Firestore indexes)
**Next:** Set role to "admin" in Firebase Console and sign back in
