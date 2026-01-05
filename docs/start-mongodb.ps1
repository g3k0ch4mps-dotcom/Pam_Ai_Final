# Start MongoDB Service
# Run this script as Administrator

Write-Host "Starting MongoDB Service..." -ForegroundColor Yellow

try {
    # Try to start MongoDB service
    Start-Service -Name MongoDB -ErrorAction Stop
    Write-Host "✓ MongoDB service started successfully!" -ForegroundColor Green
    
    # Wait a moment for service to fully start
    Start-Sleep -Seconds 2
    
    # Check service status
    $service = Get-Service -Name MongoDB
    Write-Host "MongoDB Status: $($service.Status)" -ForegroundColor Cyan
    
    if ($service.Status -eq 'Running') {
        Write-Host "`n✓ MongoDB is now running!" -ForegroundColor Green
        Write-Host "You can now start your application with: npm run dev" -ForegroundColor Cyan
    }
    
} catch {
    Write-Host "❌ Failed to start MongoDB service" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host "`nPossible solutions:" -ForegroundColor Yellow
    Write-Host "1. Make sure you're running PowerShell as Administrator" -ForegroundColor White
    Write-Host "2. Check if MongoDB is installed: Get-Service -Name MongoDB" -ForegroundColor White
    Write-Host "3. Or use MongoDB Atlas (cloud) instead - see MONGODB_SETUP.md" -ForegroundColor White
}
