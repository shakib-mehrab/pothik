#!/usr/bin/env pwsh

# Pre-Deployment Checklist Script
# Validates everything is ready for deployment

Write-Host "Running pre-deployment checks..." -ForegroundColor Cyan
Write-Host ""

$allChecksPassed = $true

# Check 1: Node modules installed
Write-Host "1. Checking node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "   OK: Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "   ERROR: Dependencies not installed" -ForegroundColor Red
    Write-Host "   Run: npm install" -ForegroundColor Yellow
    $allChecksPassed = $false
}

# Check 2: Environment file
Write-Host "2. Checking .env file..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "   OK: Environment file exists" -ForegroundColor Green

    # Check for required variables
    $envContent = Get-Content ".env" -Raw
    $requiredVars = @(
        "VITE_FIREBASE_API_KEY",
        "VITE_FIREBASE_AUTH_DOMAIN",
        "VITE_FIREBASE_PROJECT_ID",
        "VITE_FIREBASE_STORAGE_BUCKET",
        "VITE_FIREBASE_MESSAGING_SENDER_ID",
        "VITE_FIREBASE_APP_ID"
    )

    foreach ($var in $requiredVars) {
        if ($envContent -match $var) {
            Write-Host "   OK: $var configured" -ForegroundColor Green
        } else {
            Write-Host "   ERROR: $var missing" -ForegroundColor Red
            $allChecksPassed = $false
        }
    }
} else {
    Write-Host "   ERROR: .env file not found" -ForegroundColor Red
    Write-Host "   Copy .env.example to .env and configure" -ForegroundColor Yellow
    $allChecksPassed = $false
}

# Check 3: Firebase CLI
Write-Host "3. Checking Firebase CLI..." -ForegroundColor Yellow
$firebaseInstalled = Get-Command firebase -ErrorAction SilentlyContinue
if ($firebaseInstalled) {
    Write-Host "   OK: Firebase CLI installed" -ForegroundColor Green
} else {
    Write-Host "   ERROR: Firebase CLI not installed" -ForegroundColor Red
    Write-Host "   Run: npm install -g firebase-tools" -ForegroundColor Yellow
    $allChecksPassed = $false
}

# Check 4: Firebase project
Write-Host "4. Checking Firebase configuration..." -ForegroundColor Yellow
if (Test-Path ".firebaserc") {
    Write-Host "   OK: Firebase project configured" -ForegroundColor Green
} else {
    Write-Host "   ERROR: Firebase project not configured" -ForegroundColor Red
    Write-Host "   Run: firebase init" -ForegroundColor Yellow
    $allChecksPassed = $false
}

# Check 5: PWA assets
Write-Host "5. Checking PWA assets..." -ForegroundColor Yellow
if (Test-Path "public/manifest.json") {
    Write-Host "   OK: Manifest file exists" -ForegroundColor Green
} else {
    Write-Host "   WARN: Manifest file missing" -ForegroundColor Yellow
}

if (Test-Path "public/sw.js") {
    Write-Host "   OK: Service worker exists" -ForegroundColor Green
} else {
    Write-Host "   WARN: Service worker missing" -ForegroundColor Yellow
}

if (Test-Path "public/logo.svg") {
    Write-Host "   OK: Logo file exists" -ForegroundColor Green
} else {
    Write-Host "   WARN: Logo file missing" -ForegroundColor Yellow
}

# Check 6: Git status
Write-Host "6. Checking Git status..." -ForegroundColor Yellow
$gitStatus = git status --porcelain 2>$null
if ($LASTEXITCODE -eq 0) {
    if ($gitStatus) {
        Write-Host "   WARN: Uncommitted changes found" -ForegroundColor Yellow
        Write-Host "   Consider committing before deploy" -ForegroundColor Gray
    } else {
        Write-Host "   OK: All changes committed" -ForegroundColor Green
    }
} else {
    Write-Host "   WARN: Not a git repository" -ForegroundColor Yellow
}

# Check 7: Build test
Write-Host "7. Testing build..." -ForegroundColor Yellow
Write-Host "   Building project (this may take a moment)..." -ForegroundColor Gray
$buildOutput = npm run build 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   OK: Build successful" -ForegroundColor Green

    # Check dist folder
    if (Test-Path "dist") {
        $distSize = (Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
        Write-Host "   OK: Build output size: $([math]::Round($distSize, 2)) MB" -ForegroundColor Green

        if ($distSize -gt 5) {
            Write-Host "   WARN: Build size is large, consider optimization" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "   ERROR: Build failed" -ForegroundColor Red
    Write-Host $buildOutput -ForegroundColor Red
    $allChecksPassed = $false
}

# Summary
Write-Host ""
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

if ($allChecksPassed) {
    Write-Host "OK: All checks passed. Ready to deploy." -ForegroundColor Green
    Write-Host ""
    Write-Host "Deploy now with:" -ForegroundColor Cyan
    Write-Host "  npm run deploy" -ForegroundColor White
    Write-Host ""
    Write-Host "Or:" -ForegroundColor Cyan
    Write-Host "  ./deploy.ps1" -ForegroundColor White
} else {
    Write-Host "ERROR: Some checks failed. Fix issues above before deploying." -ForegroundColor Red
    Write-Host ""
    Write-Host "See DEPLOYMENT_GUIDE.md for detailed instructions." -ForegroundColor Yellow
}

Write-Host ""
