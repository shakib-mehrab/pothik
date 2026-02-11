# Firebase Setup Instructions for Pathik

## Step 1: Login to Firebase (Run in Terminal)
```bash
firebase login
```
This will open a browser for authentication.

## Step 2: Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Project name: `pathik-travel-app`
4. Disable Google Analytics (to save quota)
5. Click "Create project"

## Step 3: Initialize Firebase in Project
Run this command in the project root:
```bash
firebase init
```

**Select the following:**
- ☑ Firestore: Configure security rules and indexes files
- ☑ Functions: Configure a Cloud Functions directory and its files
- ☑ Hosting: Configure files for Firebase Hosting

**Firestore Setup:**
- Rules file: `firestore.rules` (already exists)
- Indexes file: `firestore.indexes.json` (already exists)

**Functions Setup:**
- Language: TypeScript
- ESLint: Yes
- Install dependencies now: Yes

**Hosting Setup:**
- Public directory: `dist`
- Configure as single-page app: Yes
- Set up automatic builds with GitHub: No
- Don't overwrite existing files

## Step 4: Enable Authentication Providers

1. Go to Firebase Console → Your Project
2. Click "Authentication" in left sidebar
3. Click "Get Started"
4. Go to "Sign-in method" tab
5. Enable **Email/Password**:
   - Click on Email/Password
   - Enable the toggle
   - Save
6. Enable **Google**:
   - Click on Google
   - Enable the toggle
   - Add project support email
   - Save

## Step 5: Get Firebase Config

1. In Firebase Console, click the gear icon (⚙️) next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (`</>`) to add a web app
5. App nickname: `Pathik Web App`
6. Don't enable Firebase Hosting (we'll do this separately)
7. Click "Register app"
8. **Copy the firebaseConfig object values**

## Step 6: Create .env File

Create a `.env` file in the project root with the values from above:

```bash
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=pathik-travel-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=pathik-travel-app
VITE_FIREBASE_STORAGE_BUCKET=pathik-travel-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## Step 7: Deploy Firestore Rules and Indexes

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

## Step 8: Verify Setup

Once everything is set up, let me know and I'll continue with:
- Frontend integration (connecting pages to Firebase)
- Admin dashboard creation
- Cloud Functions implementation
- Leaderboard page
- Tour-to-guide conversion flow

---

## Troubleshooting

### If firebase init asks about overwriting files:
- firestore.rules → **No** (keep existing)
- firestore.indexes.json → **No** (keep existing)
- .gitignore → **No** (keep existing)
- dist/index.html → **No** (keep existing)

### If you get permission errors:
```bash
firebase login --reauth
```

### To check which Firebase project you're using:
```bash
firebase projects:list
firebase use pathik-travel-app
```
