# Pothik Data Seeding Scripts

Automated tools for converting CSV/Excel files to JSON and seeding data to Firestore.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Get Firebase Service Account Key

**Required for seeding to Firestore**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project → ⚙️ Settings → **Project settings**
3. Go to **Service accounts** tab
4. Click **Generate new private key**
5. Save the downloaded file as `serviceAccountKey.json` in this folder

⚠️ **Never commit this file to git!** It's already in `.gitignore`.

### 3. Run Interactive Tool (Recommended)

**Windows:**
```bash
quick-start.bat
```

**Linux/Mac:**
```bash
chmod +x quick-start.sh
./quick-start.sh
```

### 4. Or Run Complete Seeding Pipeline

**Seed ALL collections at once (after placing CSV files in seed-data/raw/):**

**Windows:**
```bash
npm run seed-all
```

**Linux/Mac:**
```bash
npm run seed-all:unix
```

This will automatically:
- Convert all CSV files to JSON
- Validate each JSON file
- Seed to Firestore with duplicate checking
- Show detailed progress for each collection

### 5. Or Use Commands Directly

**Convert CSV to JSON:**
```bash
npm run convert -- -i ../seed-data/raw/restaurants.csv -o ../seed-data/json/restaurants.json -t restaurant
```

**Validate JSON:**
```bash
npm run validate -- -f ../seed-data/json/restaurants.json -t restaurant
```

**Seed to Firestore:**
```bash
npm run seed -- -f ../seed-data/json/restaurants.json -c restaurants -d  # dry-run first
npm run seed -- -f ../seed-data/json/restaurants.json -c restaurants     # actual seeding
```

## 📚 Documentation

See [../seed-data/SEEDING_GUIDE.md](../seed-data/SEEDING_GUIDE.md) for complete documentation.

## 🔧 Available Commands

| Command | Description |
|---------|-------------|
| `npm run convert` | Convert CSV/Excel to JSON |
| `npm run validate` | Validate JSON against schemas |
| `npm run seed` | Seed JSON data to Firestore |
| `npm run seed-all` | **Seed ALL collections (Windows)** |
| `npm run seed-all:unix` | **Seed ALL collections (Linux/Mac)** |

## 📁 Supported Data Types

- `restaurant` → Collection: `restaurants`
- `hotel` / `resort` → Collection: `hotels`
- `market` → Collection: `markets`
- `localBus` → Collection: `localBuses`
- `longDistanceBus` → Collection: `longDistanceBuses`
- `🚀 Quick Workflow

### Option A: Seed Everything at Once

1. Place all your CSV files in `../seed-data/raw/`:
   - `restaurants.csv`
   - `hotels.csv`
   - `resorts.csv`
   - `markets.csv`
   - `metro-stations.csv`
   - `local-bus.csv`
   - `long-distance-bus.csv`
   - `train-schedules.csv`

2. Run the automated pipeline:
   ```bash
   npm run seed-all
   ```

3. Wait for completion and check the summary!

### Option B: Seed Collections Individually

Use the interactive tool (`quick-start.bat`) or individual commands as shown above.

## trainSchedule` → Collection: `trainSchedules`

## ⚠️ Important Notes

1. Always run with `--dry-run` first to preview changes
2. Use `--skip-duplicates` to avoid duplicate entries
3. Keep your `serviceAccountKey.json` secure
4. Example CSV files are in `../seed-data/raw/`

## 🐛 Troubleshooting

**"Service account key not found"**
- Download from Firebase Console and save as `serviceAccountKey.json`

**"Failed to parse CSV"**
- Ensure UTF-8 encoding
- Check required columns exist

**Bengali text shows as "???"**
- Save CSV with UTF-8 encoding

## 📖 Full Documentation

For detailed guide with examples, see:
- [Complete Seeding Guide](../seed-data/SEEDING_GUIDE.md)
- [Service Account Security](./SERVICE_ACCOUNT_README.md)
