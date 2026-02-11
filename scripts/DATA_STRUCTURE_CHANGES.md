# Data Structure Updates - Local Bus & Metro Stations

## 🚌 Local Bus Data Structure Changes

### Previous Structure
```json
{
  "name": "Bus Name",
  "route": {
    "from": "Starting Point",
    "to": "Destination"
  },
  "hours": "Operating hours",
  "type": "Semi-Seating"
}
```

### New Structure
```json
{
  "name": "Anabil Paribahan",
  "fromStation": "Mirpur 10",
  "toStation": "Motijheel",
  "route": [
    "Mirpur 10",
    "Kazipara",
    "Shewrapara",
    "Farmgate",
    "Karwan Bazar",
    "Motijheel"
  ],
  "hours": "6:00 AM–11:00 PM",
  "type": "Semi-Seating"
}
```

### Changes:
- ✅ Added `fromStation` - Starting station/point
- ✅ Added `toStation` - Destination station/point  
- ✅ Changed `route` from object to **array** - Lists all stops between from and to
- ✅ Kept `name`, `hours`, `type` unchanged

### CSV Format:
```csv
name,fromStation,toStation,route,hours,type
"Anabil","Mirpur 10","Motijheel","Mirpur 10,Kazipara,Farmgate,Motijheel","6:00 AM–11:00 PM","Semi-Seating"
```

**Note:** The `route` column should be comma-separated stops in order.

---

## 🚇 Metro Station Data Structure Updates

### Previous Structure
```json
{
  "nameBangla": "উত্তরা উত্তর",
  "nameEnglish": "Uttara North",
  "gates": [
    {
      "name": "Gate A",
      "exitTo": "Jasimuddin Avenue",
      "landmarks": ["Rajlakshmi Complex", "Uttara Sector 3"]
    }
  ],
  "fare": "৳20 - ৳100",
  "lastUpdated": "Feb 2026"
}
```

### New Structure
```json
{
  "nameBangla": "উত্তরা উত্তর",
  "nameEnglish": "Uttara North",
  "gates": [
    {
      "name": "Gate A",
      "exitTo": "Jasimuddin Avenue",
      "landmarks": ["Rajlakshmi Complex", "Uttara Sector 3"]
    },
    {
      "name": "Gate B",
      "exitTo": "Airport Road",
      "landmarks": ["Uttara Market", "House Building"]
    }
  ],
  "nearbyPlaces": [
    {
      "name": "Rajlakshmi Complex",
      "howToGo": "Exit from Gate A, walk straight for 2 minutes"
    },
    {
      "name": "Uttara Central Mosque",
      "howToGo": "Exit from Gate B, cross the road and walk 5 minutes"
    }
  ],
  "fare": "৳20 - ৳100",
  "lastUpdated": "Feb 2026"
}
```

### Changes:
- ✅ Added `nearbyPlaces` array - Lists nearby locations with directions
- ✅ Each nearby place has:
  - `name` - Name of the nearby place
  - `howToGo` - Detailed directions from the station
- ✅ Gates structure unchanged - Can still add/edit gates
- ✅ All existing fields maintained

### CSV Format:
```csv
nameBangla,nameEnglish,gates,nearbyPlaces,fare
"উত্তরা উত্তর","Uttara North","[{""name"":""Gate A"",""exitTo"":""Avenue"",""landmarks"":[""Complex""]}]","[{""name"":""Rajlakshmi"",""howToGo"":""Exit Gate A, 2 min walk""}]","৳20 - ৳100"
```

**Note:** Gates and nearbyPlaces must be valid JSON arrays (use double quotes escaped as `""`).

---

## 👨‍💼 Admin Capabilities for Metro Stations

Admins can now manage metro stations with full CRUD operations:

### 1. Add New Metro Stations
```bash
# Via CSV seeding
npm run seed -- -f metro-stations.json -c metroStations

# Or manually through Firestore Console
```

### 2. Add Gates to Stations
Each station can have multiple gates with:
- Gate name (e.g., "Gate A", "Gate B")
- Exit destination
- Nearby landmarks

**Example:**
```json
{
  "name": "Gate C",
  "exitTo": "Diabari Road",
  "landmarks": ["Sector 13", "Police Station"]
}
```

### 3. Add Nearby Places with Directions
For each station, admins can add:
- Popular nearby destinations
- Step-by-step directions from the station
- Which gate to use

**Example:**
```json
{
  "name": "Apollo Hospital Uttara",
  "howToGo": "Exit from Gate B, take a rickshaw for 3 minutes or walk 10 minutes straight"
}
```

### 4. Update Existing Information
- Modify gate information
- Update nearby places
- Change directions
- Update fare information

### 5. Delete Stations or Gates
- Remove outdated stations
- Delete incorrect gate information
- Remove invalid nearby places

---

## 🔐 Firestore Rules

Metro stations are protected with these rules:

```javascript
match /metroStations/{stationId} {
  // Public read for all metro station data
  allow read: if true;

  // Only admins can create, update, or delete
  allow write: if isAdmin();
}
```

**This means:**
- ✅ Anyone can read metro station data
- ✅ Only admins can add/edit/delete stations
- ✅ Only admins can add/edit gates
- ✅ Only admins can add/edit nearby places

---

## 📝 How to Seed Metro Station Data

### Option 1: Via CSV File

1. Create `seed-data/raw/metro-stations.csv`:
```csv
nameBangla,nameEnglish,gates,nearbyPlaces,fare
"উত্তরা উত্তর","Uttara North","[{""name"":""Gate A"",""exitTo"":""Avenue"",""landmarks"":[""Complex""]}]","[{""name"":""Rajlakshmi"",""howToGo"":""Exit A, 2 min""}]","৳20"
```

2. Convert and seed:
```bash
cd scripts
npm run convert -- -i ../seed-data/raw/metro-stations.csv -o ../seed-data/json/metro-stations.json -t metroStation
npm run validate -- -f ../seed-data/json/metro-stations.json -t metroStation
npm run seed -- -f ../seed-data/json/metro-stations.json -c metroStations
```

### Option 2: Use Automated Pipeline

```bash
cd scripts
npm run seed-all  # Windows
npm run seed-all:unix  # Linux/Mac
```

This will automatically process `metro-stations.csv` if it exists.

### Option 3: Manual Entry via Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project → Firestore Database
3. Go to `metroStations` collection
4. Add document with the structure shown above

---

## 🎯 Benefits of New Structure

### Local Buses:
- ✅ Shows **complete route** with all stops
- ✅ Easier to find which bus goes through specific areas
- ✅ Better for route planning
- ✅ More informative for users

### Metro Stations:
- ✅ **Nearby places directory** - Users can see what's near each station
- ✅ **Directions provided** - Step-by-step guidance from station to destination
- ✅ **Gate-specific routing** - Know which gate to exit for their destination
- ✅ **Better user experience** - All info in one place

---

## 🔄 Migration Notes

### For Existing Local Bus Data:
If you have old format data, you'll need to:
1. Extract `from` and `to` into `fromStation` and `toStation`
2. Create `route` array with all stops between them
3. Re-seed the data with new format

### For Existing Metro Station Data:
- Current data is still valid
- Just add `nearbyPlaces` array to existing stations
- Use admin panel or re-seed with updated CSV

---

## 📚 Documentation Updated

All documentation has been updated:
- ✅ [SEEDING_GUIDE.md](../seed-data/SEEDING_GUIDE.md) - CSV formats
- ✅ [README.md](./README.md) - Scripts overview  
- ✅ [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Command reference
- ✅ [AUTOMATED_SEEDING.md](./AUTOMATED_SEEDING.md) - Pipeline guide
- ✅ Example CSV files with new structure
- ✅ Firestore rules deployed

---

## ✅ What's Ready to Use

1. ✅ Updated schemas and validators
2. ✅ CSV converter supports new fields
3. ✅ Example CSV files created
4. ✅ Automated seeding pipeline updated
5. ✅ Firestore rules deployed
6. ✅ All documentation updated

**You can start seeding data with the new structure immediately!** 🚀

---

## 💡 Usage Tips

### For Local Buses:
- List stops in order from start to end
- Include major landmarks and popular areas
- Keep stop names consistent across all routes

### For Metro Stations:
- Add popular destinations as nearby places
- Provide clear, step-by-step directions
- Mention estimated walking time
- Include rickshaw/CNG options if needed
- Update regularly with new places

---

**Questions?** Check the example CSV files or the complete documentation! 📖
