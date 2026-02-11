# 🚀 Quick Command Reference

## Setup (One-time)

```bash
# 1. Install dependencies
cd scripts
npm install

# 2. Get serviceAccountKey.json from Firebase Console
# Save it in scripts/ folder

# 3. Deploy Firestore rules
cd ..
firebase deploy --only firestore:rules
```

---

## 🎯 Automated Seeding (Recommended)

**Seed ALL collections at once:**

```bash
cd scripts

# Windows
npm run seed-all

# Linux/Mac  
npm run seed-all:unix
```

Place CSV files in `seed-data/raw/`:
- `restaurants.csv`
- `hotels.csv`
- `resorts.csv`
- `markets.csv`
- `local-bus.csv`
- `long-distance-bus.csv`
- `train-schedules.csv`

---

## 🔧 Manual Commands (Individual Collections)

### Convert CSV → JSON

```bash
npm run convert -- \
  -i ../seed-data/raw/restaurants.csv \
  -o ../seed-data/json/restaurants.json \
  -t restaurant
```

### Validate JSON

```bash
npm run validate -- \
  -f ../seed-data/json/restaurants.json \
  -t restaurant
```

### Seed to Firestore

```bash
# Preview (dry-run)
npm run seed -- \
  -f ../seed-data/json/restaurants.json \
  -c restaurants \
  -d

# Actually seed
npm run seed -- \
  -f ../seed-data/json/restaurants.json \
  -c restaurants \
  --skip-duplicates
```

---

## 📋 Data Types & Collections

| Type | Collection | CSV Example |
|------|-----------|-------------|
| `restaurant` | `restaurants` | restaurants.csv |
| `hotel` | `hotels` | hotels.csv |
| `resort` | `hotels` | resorts.csv |
| `market` | `markets` | markets.csv |
| `metroStation` | `metroStations` | metro-stations.csv |
| `localBus` | `localBuses` | local-bus.csv |
| `longDistanceBus` | `longDistanceBuses` | long-distance-bus.csv |
| `trainSchedule` | `trainSchedules` | train-schedules.csv |

---

## 🎨 Interactive Tools

**Windows:**
```bash
quick-start.bat
```

**Linux/Mac:**
```bash
chmod +x quick-start.sh
./quick-start.sh
```

---

## 📚 Documentation

- [AUTOMATED_SEEDING.md](./AUTOMATED_SEEDING.md) - Automated pipeline guide
- [README.md](./README.md) - Scripts overview
- [../seed-data/SEEDING_GUIDE.md](../seed-data/SEEDING_GUIDE.md) - Complete guide
- Example CSV files in `../seed-data/raw/`

---

## ⚠️ Important

- ✅ Use UTF-8 encoding for CSV files
- ✅ Run dry-run first: `-d` or `--dry-run`
- ✅ Use `--skip-duplicates` to avoid duplicates
- ❌ Never commit `serviceAccountKey.json`

---

## 🐛 Common Issues

**Service account key not found:**
```
Download from Firebase Console → Settings → Service Accounts
Save as: scripts/serviceAccountKey.json
```

**CSV parse error:**
```
Check UTF-8 encoding
Verify column headers
See example CSV files
```

**Validation error:**
```
Check required fields
Review error messages
Fix CSV and reconvert
```

---

## 💡 Quick Tips

```bash
# Test with small dataset first
npm run seed-all  # processes only files that exist

# Check Firebase Console after seeding
https://console.firebase.google.com/

# Re-running is safe (skips duplicates)
npm run seed-all  # can run multiple times
```

---

**Need help?** Check the full documentation or example CSV files! 📖
