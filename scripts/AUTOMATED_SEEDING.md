# Automated Seeding Pipeline

## 🎯 Quick Start

The automated pipeline seeds **ALL** collections at once.

### Prerequisites

1. ✅ Install dependencies: `npm install`
2. ✅ Get `serviceAccountKey.json` from Firebase Console
3. ✅ Place CSV files in `../seed-data/raw/`

### Expected CSV Files

Place these files in `seed-data/raw/`:

```
seed-data/raw/
├── restaurants.csv          ✅ Required
├── hotels.csv               ✅ Required
├── resorts.csv              ⚪ Optional
├── markets.csv              ✅ Required
├── metro-stations.csv       ⚪ Optional
├── local-bus.csv            ⚪ Optional
├── long-distance-bus.csv    ⚪ Optional
└── train-schedules.csv      ⚪ Optional
```

The script will automatically skip any missing files.

---

## 🚀 Run the Pipeline

### Windows

```bash
cd scripts
npm run seed-all
```

### Linux/Mac

```bash
cd scripts
npm run seed-all:unix
```

---

## 📊 What It Does

For each CSV file found:

1. **Convert** CSV → JSON
   - Validates structure
   - Transforms data
   - Generates timestamps

2. **Validate** JSON
   - Checks required fields
   - Verifies data types
   - Reports errors

3. **Seed** to Firestore
   - Batches 500 docs at a time
   - Skips duplicates
   - Shows progress

---

## 📝 Example Output

```
========================================
 Pothik Data Seeding Pipeline
========================================

[✓] Service account key found
[✓] Dependencies ready

========================================
 Processing: RESTAURANTS
========================================

[1/3] Converting CSV to JSON...
✓ Parsed 150 rows (150 valid)
✓ Validated 150 entries
✓ Successfully created restaurants.json

[2/3] Validating JSON...
Total Records:   150
✓ Valid:         150
✗ Invalid:       0

✓ All records are valid!

[3/3] Seeding to Firestore...
✓ Successfully seeded 150 documents

[✓] Restaurants seeded successfully

========================================
 Processing: HOTELS
========================================
...

========================================
 SEEDING COMPLETE
========================================

✓ Successfully seeded: restaurants hotels markets localBus
```

---

## ⚙️ Processing Order

Collections are seeded in this order:

1. Restaurants
2. Hotels
3. Resorts
4. Markets
5. Metro Stations
6. Local Buses
7. Long Distance Buses
8. Train Schedules

---

## 🛡️ Safety Features

- **Duplicate Detection**: Skips existing entries (by name + location)
- **Error Handling**: Continues if one collection fails
- **Validation**: Checks data before seeding
- **Progress Tracking**: Shows detailed status for each step
- **Summary Report**: Shows success/failure for all collections

---

## ❌ If Errors Occur

The pipeline will:
- Continue processing other collections
- Show which collections failed
- Display error messages for debugging

**Common issues:**

1. **"Service account key not found"**
   - Download from Firebase Console
   - Save as `serviceAccountKey.json` in `scripts/` folder

2. **"Failed to parse CSV"**
   - Check UTF-8 encoding
   - Verify column headers match expected format
   - See example CSV files

3. **"Validation failed"**
   - Check required fields are present
   - Verify data types (yes/no for booleans, comma-separated for arrays)
   - Review error messages for specific issues

4. **"Failed to seed"**
   - Check Firebase connection
   - Verify Firestore rules are deployed
   - Check service account has proper permissions

---

## 🔄 Re-running the Pipeline

The pipeline is **safe to re-run** because:
- Uses `--skip-duplicates` flag
- Won't create duplicate entries
- Only adds new records

To completely replace data:
1. Delete collection in Firebase Console
2. Re-run the pipeline

---

## 🎨 Customization

To modify the pipeline:

1. Edit `seed-all.bat` (Windows) or `seed-all.sh` (Linux/Mac)
2. Add/remove collections
3. Change processing order
4. Add custom validation steps

---

## 📚 Related Files

- [SEEDING_GUIDE.md](../seed-data/SEEDING_GUIDE.md) - Complete documentation
- [README.md](./README.md) - Scripts overview
- Example CSV files in `../seed-data/raw/`

---

## 💡 Tips

1. **Test with small datasets first**
   - Use example CSV files
   - Verify in Firebase Console
   - Then process full datasets

2. **Monitor Firebase usage**
   - Check Firestore quota
   - Watch for rate limits
   - Split large datasets if needed

3. **Keep backups**
   - Export existing data before seeding
   - Keep original CSV files
   - Version control JSON files

4. **Bengali text encoding**
   - Always use UTF-8
   - Test with a few records first
   - Check in Firebase Console

---

**Ready?** Place your CSV files in `seed-data/raw/` and run `npm run seed-all`! 🚀
