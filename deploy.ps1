#!/usr/bin/env pwsh

# Pothik Deployment Script
# Simple script to build and deploy the application

Write-Host "🚀 Starting Pothik Deployment..." -ForegroundColor Cyan
Write-Host ""

# Check if Firebase CLI is installed
Write-Host "Checking Firebase CLI..." -ForegroundColor Yellow
$firebaseInstalled = Get-Command firebase -ErrorAction SilentlyContinue
if (-not $firebaseInstalled) {
    Write-Host "❌ Firebase CLI not found!" -ForegroundColor Red
    Write-Host "Please install it with: npm install -g firebase-tools" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Firebase CLI found" -ForegroundColor Green
Write-Host ""

# Check if .env file exists
Write-Host "Checking environment variables..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "Please create .env file with Firebase configuration" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Environment variables configured" -ForegroundColor Green
Write-Host ""

# Generate PWA icons
Write-Host "Generating PWA icons..." -ForegroundColor Yellow
npm run generate-icons
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Icon generation failed, continuing anyway..." -ForegroundColor Yellow
}
Write-Host ""

# Build the project
Write-Host "Building project..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful" -ForegroundColor Green
Write-Host ""

# Ask for deployment confirmation
Write-Host "Ready to deploy to Firebase Hosting" -ForegroundColor Cyan
$confirmation = Read-Host "Deploy now? (y/n)"
if ($confirmation -ne 'y') {
    Write-Host "❌ Deployment cancelled" -ForegroundColor Yellow
    exit 0
}
Write-Host ""

# Deploy to Firebase
Write-Host "Deploying to Firebase..." -ForegroundColor Yellow
firebase deploy --only hosting
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "✅ Deployment successful!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Your app is now live at: https://pathik-db6ee.web.app" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Visit your live site to verify deployment"
Write-Host "  2. Test the PWA installation"
Write-Host "  3. Check admin functionality"
Write-Host ""
