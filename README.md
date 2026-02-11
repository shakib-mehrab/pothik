
  # 🇧🇩 Pothik - Bangladesh Travel Guide

A comprehensive Progressive Web App (PWA) for exploring Bangladesh - Metro stations, Restaurants, Hotels, Markets, and Travel information.

**Live App:** [https://pathik-db6ee.web.app](https://pathik-db6ee.web.app)

## ✨ Features

- 🚇 **Metro Guide** - Complete Dhaka Metro station information with gates and exits
- 🍽️ **Restaurants** - Discover local restaurants and eateries
- 🏨 **Hotels** - Find accommodation across Bangladesh
- 🛒 **Markets** - Explore local shopping destinations
- 🗺️ **Travel Guide** - Essential travel information
- 📱 **PWA** - Install as native app, works offline
- 🔐 **Admin Panel** - Manage content with admin access
- 🌐 **Bilingual** - Bengali and English support

## 🚀 Quick Start

### Development

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your Firebase credentials
```

3. **Start development server:**
```bash
npm run dev
```

4. **Open browser:**
   - Navigate to `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## 📦 Deployment

### Quick Deploy (2 minutes)

```bash
npm run deploy
```

**That's it!** Your app is now live at [https://pathik-db6ee.web.app](https://pathik-db6ee.web.app)

### Detailed Deployment

See comprehensive guides:
- **Quick Guide:** [QUICK_DEPLOY.md](QUICK_DEPLOY.md)
- **Full Guide:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

### Pre-Deployment Check

Run checks before deploying:
```bash
./check-deploy.ps1
```

### One-Time Setup

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

## 📊 Adding Data

### No Redeployment Needed!

Data lives in Firestore. To add/update:

**Option 1: Seed Script**
```bash
cd scripts
npm run seed -- -f ../seed-data/json/metro.json -c metroStations
```

**Option 2: Admin Panel**
- Login as admin in the app
- Add/edit data through UI
- Changes are instant!

**Option 3: Firebase Console**
- Go to [Firebase Console](https://console.firebase.google.com/)
- Edit Firestore directly

## 🔄 Redeployment Workflow

1. **Make changes** to code
2. **Test locally:** `npm run dev`
3. **Deploy:** `npm run deploy`

**Time:** ~2 minutes per deployment ⚡

## 🛠️ Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run deploy` | Build and deploy to Firebase |
| `npm run deploy:full` | Deploy everything (hosting + functions + rules) |
| `npm run deploy:functions` | Deploy only Cloud Functions |
| `npm run deploy:rules` | Deploy only Firestore rules |
| `npm run generate-icons` | Generate PWA icons |
| `npm run version:patch` | Bump patch version (1.0.0 → 1.0.1) |
| `npm run version:minor` | Bump minor version (1.0.0 → 1.1.0) |
| `npm run version:major` | Bump major version (1.0.0 → 2.0.0) |

## 🏗️ Tech Stack

- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **Routing:** React Router 7
- **UI Components:** Radix UI, shadcn/ui
- **Backend:** Firebase (Firestore, Authentication, Hosting)
- **Build Tool:** Vite 6
- **PWA:** Service Workers, Web App Manifest

## 📱 PWA Features

- ✅ Installable on mobile and desktop
- ✅ Offline functionality
- ✅ Push notifications ready
- ✅ App shortcuts
- ✅ Background sync
- ✅ Update notifications

See [PWA_IMPLEMENTATION.md](PWA_IMPLEMENTATION.md) for details.

## 🔐 Admin Access

1. **Enable admin for a user:**
   - See [HOW_TO_ENABLE_ADMIN.md](HOW_TO_ENABLE_ADMIN.md)

2. **Admin features:**
   - Add/edit/delete metro stations
   - Manage restaurants, hotels, markets
   - User management

## 📁 Project Structure

```
pothik/
├── src/
│   ├── app/              # App components and pages
│   ├── components/       # Reusable components
│   ├── contexts/         # React contexts
│   ├── services/         # Firebase services
│   ├── hooks/            # Custom hooks
│   └── utils/            # Utility functions
├── public/               # Static assets
│   ├── sw.js            # Service Worker
│   ├── manifest.json    # PWA manifest
│   └── icons/           # PWA icons
├── scripts/             # Seed and utility scripts
├── seed-data/           # Data files (CSV/JSON)
├── functions/           # Firebase Cloud Functions
└── dist/                # Build output
```

## 🔄 Continuous Deployment

Push to `main` branch, and GitHub Actions automatically builds and deploys!

See [.github/workflows/deploy.yml](.github/workflows/deploy.yml)

## 📚 Documentation

- **Deployment:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Quick Deploy:** [QUICK_DEPLOY.md](QUICK_DEPLOY.md)
- **PWA Implementation:** [PWA_IMPLEMENTATION.md](PWA_IMPLEMENTATION.md)
- **Admin Setup:** [HOW_TO_ENABLE_ADMIN.md](HOW_TO_ENABLE_ADMIN.md)
- **Firebase Setup:** [FIREBASE_SETUP_INSTRUCTIONS.md](FIREBASE_SETUP_INSTRUCTIONS.md)
- **Authentication:** [AUTHENTICATION_SUMMARY.md](AUTHENTICATION_SUMMARY.md)

## 🌐 Live URLs

- **Production:** https://pathik-db6ee.web.app
- **Firebase Console:** https://console.firebase.google.com/project/pathik-db6ee

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test locally
4. Deploy: `npm run deploy`

## 📄 License

Private project.

## 🆘 Need Help?

1. Check [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
2. See [PWA_IMPLEMENTATION.md](PWA_IMPLEMENTATION.md)
3. Review Firebase documentation

---

**Built with ❤️ for Bangladesh 🇧🇩**

  