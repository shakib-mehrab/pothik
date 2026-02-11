# Data Seeding Guide for Pothik Application

Complete guide for seeding data from CSV/Excel files to Firestore.

## 📁 Project Structure

```
pothik/
├── seed-data/
│   ├── raw/              # Place your CSV/Excel files here
│   ├── json/             # Converted JSON files (auto-generated)
│   └── schemas/          # Schema definitions
├── scripts/
│   ├── convert-csv-to-json.ts    # CSV → JSON converter
│   ├── validate-data.ts          # Data validator
│   ├── seed-firestore.ts         # Firestore seeder
│   ├── package.json              # Script dependencies
│   ├── tsconfig.json             # TypeScript config
│   └── utils/                    # Helper utilities
│       ├── csv-parser.ts
│       └── validators.ts
└── serviceAccountKey.json  # Firebase Admin SDK key (DO NOT COMMIT!)
```

## 🚀 Step-by-Step Setup

### Step 1: Install Script Dependencies

Navigate to the scripts folder and install packages:

```bash
cd scripts
npm install
```

This will install:
- `csv-parser` - CSV file parsing
- `xlsx` - Excel file support
- `firebase-admin` - Firebase Admin SDK
- `zod` - Data validation
- `commander` - CLI interface
- `chalk` - Colored console output
- `ora` - Loading spinners

### Step 2: Get Firebase Service Account Key

**IMPORTANT:** This key has full admin access. Never commit it to git!

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (Pothik)
3. Click ⚙️ (Settings) → **Project settings**
4. Go to **Service accounts** tab
5. Click **Generate new private key**
6. Save the downloaded JSON file as `serviceAccountKey.json`
7. Move it to the `scripts/` folder

**Add to .gitignore:**
```bash
# In project root, add this line to .gitignore
serviceAccountKey.json
scripts/serviceAccountKey.json
```

### Step 3: Deploy Updated Firestore Rules

Deploy the new rules that include transport collections:

```bash
# From project root
firebase deploy --only firestore:rules
```

## 📊 CSV File Format Guidelines

### General Rules:
- **First row** must contain column headers
- Use **UTF-8 encoding** for Bengali text
- Comma-separated values (CSV) or Excel (XLSX/XLS)
- Empty cells are okay for optional fields
- Use quotes for text with commas: `"Hello, World"`

### Column Name Mapping:
The converter automatically recognizes variations:
- `howToGo` or `how_to_go`
- `bestItem` or `best_item`
- `coupleFriendly` or `couple_friendly`
- `documentsNeeded` or `documents_needed`

---

## 📋 CSV Formats for Each Collection

### 1. Restaurants

**Required columns:**
- `name` - Restaurant name
- `location` - Full address
- `howToGo` - Directions
- `bestItem` - Signature dish
- `reviews` - Description and reviews

**Example:** `seed-data/raw/restaurants-example.csv`

```csv
name,location,howToGo,bestItem,reviews
"Star Kabab","Dhanmondi","Metro to Dhanmondi 27","Beef Kebab","Famous kebabs, affordable"
```

---

### 2. Hotels/Resorts

**Required columns:**
- `name` - Hotel name
- `location` - Full address
- `howToGo` - Directions
- `coupleFriendly` - yes/no or true/false
- `documentsNeeded` - Comma-separated list
- `facebookPage` - Facebook URL (optional)
- `reviews` - Description
- `category` - "hotel" or "resort"

**Example:** `seed-data/raw/hotels-example.csv`

```csv
name,location,howToGo,coupleFriendly,documentsNeeded,facebookPage,reviews,category
"Hotel Sarina","Banani","Metro to Banani","yes","NID","https://fb.com/sarina","Clean, safe","hotel"
```

---

### 3. Markets

**Required columns:**
- `name` - Market name
- `location` - Full address
- `howToGo` - Directions
- `specialty` - Comma-separated list of specialties
- `reviews` - Description
- `category` - "brands", "local", "budget", or "others"

**Example:** `seed-data/raw/markets-example.csv`

```csv
name,location,howToGo,specialty,reviews,category
"Bashundhara City","Panthapath","Metro to Karwan Bazar","Electronics,Fashion","Largest mall","brands"
```

---

### 4. Metro Stations

**Required columns:**
- `nameBangla` - Station name in Bengali
- `nameEnglish` - Station name in English
- `gates` - JSON array of gate objects (name, exitTo, landmarks)
- `nearbyPlaces` - JSON array of nearby places with directions (name, howToGo)
- `fare` - Fare information (optional)

**Example:** `seed-data/raw/metro-stations-example.csv`

```csv
nameBangla,nameEnglish,gates,nearbyPlaces,fare
"উত্তরা উত্তর","Uttara North","[{""name"":""Gate A"",""exitTo"":""Jasimuddin Avenue"",""landmarks"":[""Rajlakshmi Complex""]}]","[{""name"":""Rajlakshmi Complex"",""howToGo"":""Exit from Gate A, 2 minutes walk""}]","৳20 - ৳100"
```

**Note:** Gates and nearbyPlaces must be valid JSON arrays. Each nearbyPlace has:
- `name` - Place name
- `howToGo` - Directions from the station

**Admin capabilities:**
- Add new metro stations
- Add/edit gates for each station
- Add nearby places with custom directions
- Update fare information

---

### 5. Local Buses

**Required columns:**
- `name` - Bus service name
- `fromStation` - Starting station/point
- `toStation` - Destination station/point
- `route` - Comma-separated list of all stops between from and to
- `hours` - Operating hours (optional)
- `type` - "Semi-Seating" or "Seating"

**Example:** `seed-data/raw/local-bus-example.csv`

```csv
name,fromStation,toStation,route,hours,type
"Anabil","Mirpur 10","Motijheel","Mirpur 10,Kazipara,Farmgate,Motijheel","6:00 AM–11:00 PM","Semi-Seating"
```

**Note:** The `route` field should include all major stops from fromStation to toStation.

---

### 6. Long Distance Buses

**Required columns:**
- `company` - Bus company name
- `from` - Starting city/location
- `to` - Destination city
- `fare` - Fare range (optional)
- `contactNumber` - Phone number (optional)
- `schedule` - Departure times (optional)
- `counterLocation` - Ticket counter (optional)

**Example:** `seed-data/raw/long-distance-bus-example.csv`

```csv
company,from,to,fare,contactNumber,schedule,counterLocation
"Hanif","Dhaka","Cox's Bazar","৳1200","01711-111222","Multiple daily","Sayedabad"
```

---

### 7. Train Schedules

**Required columns:**
- `trainName` - Train name
- `trainNumber` - Train number
- `from` - Starting station
- `to` - Destination station
- `departureTime` - Departure time (optional)
- `arrivalTime` - Arrival time (optional)
- `fare` - Fare range (optional)
- `trainType` - Train category (optional)
- `days` - Days of operation, comma-separated (optional)

**Example:** `seed-data/raw/train-schedules-example.csv`

```csv
trainName,trainNumber,from,to,departureTime,arrivalTime,fare,trainType,days
"Suborno Express","702","Dhaka","Chittagong","15:30","21:30","৳450-800","Mail","All days"
```

---

## 🔄 Conversion Workflow

### OPTION A: Automated Pipeline (Recommended for Bulk Seeding)

If you have all CSV files ready, use the automated pipeline:

**Windows:**
```bash
cd scripts
npm run seed-all
```

**Linux/Mac:**
```bash
cd scripts
npm run seed-all:unix
```

This will automatically process all CSV files in `seed-data/raw/`:
1. Convert each CSV to JSON
2. Validate each JSON file
3. Seed to Firestore with duplicate checking
4. Show detailed progress and summary

**Expected CSV files:**
- `restaurants.csv` → `restaurants` collection
- `hotels.csv` → `hotels` collection  
- `resorts.csv` → `hotels` collection (with category: resort)
- `markets.csv` → `markets` collection
- `metro-stations.csv` → `metroStations` collection
- `local-bus.csv` → `localBuses` collection
- `long-distance-bus.csv` → `longDistanceBuses` collection
- `train-schedules.csv` → `trainSchedules` collection

---

### OPTION B: Manual Step-by-Step Process

For individual collections or custom control:

### Step 1: Convert CSV to JSON

From the `scripts/` folder:

```bash
npm run convert -- \
  --input ../seed-data/raw/restaurants.csv \
  --output ../seed-data/json/restaurants.json \
  --type restaurant
```

**Options:**
- `-i, --input <path>` - CSV/Excel input file
- `-o, --output <path>` - JSON output file
- `-t, --type <type>` - Data type (see types below)
- `-a, --admin-id <id>` - Admin user ID (default: "admin")
- `--no-validate` - Skip validation

**Supported types:**
- `restaurant`
- `hotel`
- `resort`
- `market`
- `metroStation`
- `localBus`
- `longDistanceBus`
- `trainSchedule`

---

### Step 2: Validate JSON (Optional but Recommended)

```bash
npm run validate -- \
  --file ../seed-data/json/restaurants.json \
  --type restaurant
```

This will check:
- Required fields are present
- Data types are correct
- Values match expected formats
- Bengali text encoding is valid

If validation fails, fix the CSV and reconvert.

---

### Step 3: Seed to Firestore

**Dry run first (preview):**
```bash
npm run seed -- \
  --file ../seed-data/json/restaurants.json \
  --collection restaurants \
  --dry-run
```

**Actual seeding:**
```bash
npm run seed -- \
  --file ../seed-data/json/restaurants.json \
  --collection restaurants
```

**Advanced options:**
```bash
npm run seed -- \
  --file ../seed-data/json/markets.json \
  --collection markets \
  --skip-duplicates \
  --batch-size 500
```

**All options:**
- `-f, --file <path>` - JSON file to seed
- `-c, --collection <name>` - Target collection
- `-b, --batch-size <number>` - Docs per batch (default: 500)
- `-d, --dry-run` - Preview without writing
- `-s, --skip-duplicates` - Skip existing entries
- `--clear-existing` - Delete all before seeding (⚠️ dangerous!)

---

## 📝 Complete Example Workflow

### Example: Seed 100 Restaurants

1. **Prepare CSV file:**
   ```
   seed-data/raw/restaurants.csv
   ```

2. **Convert to JSON:**
   ```bash
   cd scripts
   npm run convert -- -i ../seed-data/raw/restaurants.csv -o ../seed-data/json/restaurants.json -t restaurant
   ```

3. **Validate:**
   ```bash
   npm run validate -- -f ../seed-data/json/restaurants.json -t restaurant
   ```

4. **Preview (dry run):**
   ```bash
   npm run seed -- -f ../seed-data/json/restaurants.json -c restaurants -d
   ```

5. **Seed to Firestore:**
   ```bash
   npm run seed -- -f ../seed-data/json/restaurants.json -c restaurants
   ```

---

## 🎯 Collection Names

| Data Type | CSV Type Flag | Collection Name |
|-----------|---------------|-----------------|
| Restaurants | `restaurant` | `restaurants` |
| Hotels | `hotel` | `hotels` |
| Resorts | `resort` | `hotels` |
| Markets | `market` | `markets` |
| Metro Stations | `metroStation` | `metroStations` |
| Local Bus | `localBus` | `localBuses` |
| Long Distance | `longDistanceBus` | `longDistanceBuses` |
| Train | `trainSchedule` | `trainSchedules` |

---

## ⚠️ Important Notes

1. **Service Account Key Security:**
   - Never commit `serviceAccountKey.json` to git
   - Never share this file publicly
   - Regenerate if compromised

2. **Data Quality:**
   - Always validate before seeding
   - Use dry-run to preview changes
   - Keep backups of original CSV files

3. **Duplicate Handling:**
   - Use `--skip-duplicates` for incremental updates
   - Duplicates are detected by: name + location (restaurants/hotels/markets)
   - For buses: by route (from + to)
   - For trains: by train number

4. **Batch Size:**
   - Default: 500 documents per batch
   - Reduce if timeout errors occur
   - Firestore limit: 500 writes per batch

5. **Bengali Text:**
   - Ensure CSV files use UTF-8 encoding
   - Test with small dataset first
   - Check in Firebase Console after seeding

---

## 🐛 Troubleshooting

### Error: "Service account key not found"
- Make sure `serviceAccountKey.json` is in `scripts/` folder
- Check file name spelling (case-sensitive)

### Error: "Failed to parse CSV"
- Check CSV encoding (must be UTF-8)
- Verify no missing required columns
- Check for unescaped quotes

### Error: "Validation failed"
- Review error messages for specific issues
- Fix CSV file and reconvert
- Use `--no-validate` to skip (not recommended)

### Bengali text shows as "??????"
- CSV file not saved as UTF-8
- Re-save CSV with UTF-8 encoding

### Duplicates not skipped correctly
- Ensure name and location fields match exactly
- Use `--clear-existing` for fresh start (⚠️ deletes all!)

---

## 📚 Next Steps

1. ✅ Install dependencies: `cd scripts && npm install`
2. ✅ Get service account key from Firebase Console
3. ✅ Deploy Firestore rules: `firebase deploy --only firestore:rules`
4. ✅ Prepare CSV files in `seed-data/raw/`
5. ✅ Convert CSV to JSON
6. ✅ Validate JSON data
7. ✅ Seed to Firestore (dry-run first!)
8. ✅ Verify in Firebase Console

---

## 🔗 Useful Links

- [Firebase Console](https://console.firebase.google.com/)
- [CSV to JSON Converter](https://www.convertcsv.com/csv-to-json.htm) - Online tool
- [UTF-8 Encoding Guide](https://www.w3schools.com/charsets/ref_html_utf8.asp)

---

**Need help?** Check example CSV files in `seed-data/raw/` for reference format.
