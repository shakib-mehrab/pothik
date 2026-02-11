#!/bin/bash

# Quick Start Script for Data Seeding
# This script guides you through the seeding process

echo "🌟 Pothik Data Seeding Quick Start"
echo "===================================="
echo ""

# Check if serviceAccountKey.json exists
if [ ! -f "serviceAccountKey.json" ]; then
    echo "❌ serviceAccountKey.json not found!"
    echo ""
    echo "📝 To get your service account key:"
    echo "1. Go to https://console.firebase.google.com/"
    echo "2. Select your project → Settings → Service accounts"
    echo "3. Click 'Generate new private key'"
    echo "4. Save the file as 'serviceAccountKey.json' in the scripts/ folder"
    echo ""
    exit 1
fi

echo "✅ Service account key found"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "🎯 What would you like to do?"
echo ""
echo "1) Convert CSV to JSON"
echo "2) Validate JSON file"
echo "3) Seed to Firestore (with preview)"
echo "4) Seed to Firestore (direct)"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        read -p "Enter CSV file path (e.g., ../seed-data/raw/restaurants.csv): " input
        read -p "Enter output JSON path (e.g., ../seed-data/json/restaurants.json): " output
        read -p "Enter type (restaurant/hotel/resort/market/localBus/longDistanceBus/trainSchedule): " type
        
        npm run convert -- -i "$input" -o "$output" -t "$type"
        ;;
    
    2)
        echo ""
        read -p "Enter JSON file path: " file
        read -p "Enter type (restaurant/hotel/resort/market/localBus/longDistanceBus/trainSchedule): " type
        
        npm run validate -- -f "$file" -t "$type"
        ;;
    
    3)
        echo ""
        read -p "Enter JSON file path: " file
        read -p "Enter collection name (restaurants/hotels/markets/localBuses/longDistanceBuses/trainSchedules): " collection
        
        echo ""
        echo "🔍 Running DRY RUN (preview only)..."
        npm run seed -- -f "$file" -c "$collection" -d
        
        echo ""
        read -p "Proceed with actual seeding? (yes/no): " proceed
        if [ "$proceed" = "yes" ]; then
            npm run seed -- -f "$file" -c "$collection"
        else
            echo "Cancelled."
        fi
        ;;
    
    4)
        echo ""
        echo "⚠️  WARNING: This will seed data directly without preview!"
        read -p "Are you sure? (yes/no): " sure
        
        if [ "$sure" = "yes" ]; then
            read -p "Enter JSON file path: " file
            read -p "Enter collection name: " collection
            
            npm run seed -- -f "$file" -c "$collection"
        else
            echo "Cancelled."
        fi
        ;;
    
    *)
        echo "Invalid choice!"
        exit 1
        ;;
esac

echo ""
echo "✨ Done!"
