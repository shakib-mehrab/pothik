@echo off
REM Quick Start Script for Data Seeding (Windows)
REM This script guides you through the seeding process

echo 🌟 Pothik Data Seeding Quick Start
echo ====================================
echo.

REM Check if serviceAccountKey.json exists
if not exist "serviceAccountKey.json" (
    echo ❌ serviceAccountKey.json not found!
    echo.
    echo 📝 To get your service account key:
    echo 1. Go to https://console.firebase.google.com/
    echo 2. Select your project → Settings → Service accounts
    echo 3. Click 'Generate new private key'
    echo 4. Save the file as 'serviceAccountKey.json' in the scripts/ folder
    echo.
    exit /b 1
)

echo ✅ Service account key found
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
    echo.
)

echo 🎯 What would you like to do?
echo.
echo 1^) Convert CSV to JSON
echo 2^) Validate JSON file
echo 3^) Seed to Firestore ^(with preview^)
echo 4^) Seed to Firestore ^(direct^)
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo.
    set /p input="Enter CSV file path (e.g., ../seed-data/raw/restaurants.csv): "
    set /p output="Enter output JSON path (e.g., ../seed-data/json/restaurants.json): "
    set /p type="Enter type (restaurant/hotel/resort/market/localBus/longDistanceBus/trainSchedule): "
    
    call npm run convert -- -i "%input%" -o "%output%" -t "%type%"
) else if "%choice%"=="2" (
    echo.
    set /p file="Enter JSON file path: "
    set /p type="Enter type (restaurant/hotel/resort/market/localBus/longDistanceBus/trainSchedule): "
    
    call npm run validate -- -f "%file%" -t "%type%"
) else if "%choice%"=="3" (
    echo.
    set /p file="Enter JSON file path: "
    set /p collection="Enter collection name (restaurants/hotels/markets/localBuses/longDistanceBuses/trainSchedules): "
    
    echo.
    echo 🔍 Running DRY RUN (preview only)...
    call npm run seed -- -f "%file%" -c "%collection%" -d
    
    echo.
    set /p proceed="Proceed with actual seeding? (yes/no): "
    if "%proceed%"=="yes" (
        call npm run seed -- -f "%file%" -c "%collection%"
    ) else (
        echo Cancelled.
    )
) else if "%choice%"=="4" (
    echo.
    echo ⚠️  WARNING: This will seed data directly without preview!
    set /p sure="Are you sure? (yes/no): "
    
    if "%sure%"=="yes" (
        set /p file="Enter JSON file path: "
        set /p collection="Enter collection name: "
        
        call npm run seed -- -f "%file%" -c "%collection%"
    ) else (
        echo Cancelled.
    )
) else (
    echo Invalid choice!
    exit /b 1
)

echo.
echo ✨ Done!
