# Windows Task Scheduler Setup for Daily ROI Crediting
# Usage: powershell -ExecutionPolicy Bypass -File setup-cron.ps1

param(
    [string]$Action = "install",
    [string]$ProjectPath = $PSScriptRoot
)

$TaskName = "Cypher Vault - Daily ROI Crediting"
$ScriptPath = Join-Path $ProjectPath "scripts\credit-daily-roi.js"
$LogPath = Join-Path $ProjectPath "logs\roi-cron.log"
$NodePath = (Get-Command node -ErrorAction SilentlyContinue).Source

Write-Host "==========================================" -ForegroundColor Green
Write-Host "Daily ROI Crediting - Task Scheduler Setup" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

if (-not $NodePath) {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js found at: $NodePath" -ForegroundColor Green
Write-Host "📁 Project Path: $ProjectPath" -ForegroundColor Cyan
Write-Host "📝 Script Path: $ScriptPath" -ForegroundColor Cyan
Write-Host "📋 Log Path: $LogPath" -ForegroundColor Cyan
Write-Host ""

# Create logs directory
$LogDir = Split-Path $LogPath
if (-not (Test-Path $LogDir)) {
    New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
    Write-Host "✅ Created logs directory: $LogDir" -ForegroundColor Green
}

if ($Action -eq "install") {
    Write-Host "Installing scheduled task..." -ForegroundColor Yellow
    
    # Check if task already exists
    $ExistingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
    
    if ($ExistingTask) {
        Write-Host "⚠️  Task already exists!" -ForegroundColor Yellow
        Write-Host "Removing existing task..." -ForegroundColor Yellow
        Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
        Write-Host "✅ Removed old task" -ForegroundColor Green
    }
    
    # Create trigger (daily at 12:00 AM)
    $Trigger = New-ScheduledTaskTrigger -Daily -At 12:00am
    
    # Create action (run node script)
    $Action = New-ScheduledTaskAction `
        -Execute $NodePath `
        -Argument $ScriptPath `
        -WorkingDirectory $ProjectPath
    
    # Create settings
    $Settings = New-ScheduledTaskSettingsSet `
        -AllowStartIfOnBatteries `
        -DontStopIfGoingOnBatteries `
        -StartWhenAvailable `
        -RunOnlyIfNetworkAvailable `
        -MultipleInstances IgnoreNew
    
    # Register task
    Register-ScheduledTask `
        -TaskName $TaskName `
        -Trigger $Trigger `
        -Action $Action `
        -Settings $Settings `
        -RunLevel Highest `
        -Description "Automatically credits daily ROI to active investments at 12:00 AM daily" `
        -Force | Out-Null
    
    Write-Host ""
    Write-Host "✅ Task installed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Task Details:" -ForegroundColor Cyan
    Get-ScheduledTask -TaskName $TaskName | Select-Object TaskName, State, @{Name="NextRun";Expression={$_.Triggers[0].StartBoundary}} | Format-List
    
} elseif ($Action -eq "remove") {
    Write-Host "Removing scheduled task..." -ForegroundColor Yellow
    
    $ExistingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
    
    if ($ExistingTask) {
        Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
        Write-Host "✅ Task removed successfully!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Task not found" -ForegroundColor Yellow
    }
    
} elseif ($Action -eq "status") {
    $Task = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
    
    if ($Task) {
        Write-Host "✅ Task is installed" -ForegroundColor Green
        Write-Host ""
        Write-Host "Status:" -ForegroundColor Cyan
        $Task | Select-Object TaskName, State | Format-List
        
        Write-Host "Last Run:" -ForegroundColor Cyan
        $Task | Select-Object @{Name="LastRunTime";Expression={$_.LastRunTime}} | Format-List
        
        Write-Host "Next Run:" -ForegroundColor Cyan
        $Task | Select-Object @{Name="NextRunTime";Expression={$_.NextRunTime}} | Format-List
    } else {
        Write-Host "❌ Task not found" -ForegroundColor Red
    }
    
} elseif ($Action -eq "test") {
    Write-Host "Running test execution..." -ForegroundColor Yellow
    Write-Host ""
    & $NodePath $ScriptPath
    
} else {
    Write-Host "Usage:" -ForegroundColor Cyan
    Write-Host "  powershell -File setup-cron.ps1 -Action install   # Install task"
    Write-Host "  powershell -File setup-cron.ps1 -Action remove    # Remove task"
    Write-Host "  powershell -File setup-cron.ps1 -Action status    # Check status"
    Write-Host "  powershell -File setup-cron.ps1 -Action test      # Run test"
    exit 1
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "Monitor logs with:" -ForegroundColor Cyan
Write-Host "  Get-Content -Path '$LogPath' -Wait" -ForegroundColor Gray
Write-Host ""
Write-Host "View all tasks:" -ForegroundColor Cyan
Write-Host "  Get-ScheduledTask -TaskName '$TaskName' | Get-ScheduledTaskInfo" -ForegroundColor Gray
Write-Host "==========================================" -ForegroundColor Green
