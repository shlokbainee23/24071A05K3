# Stop the Tomcat server started by setup.ps1
$ErrorActionPreference = 'SilentlyContinue'

$pids = (Get-NetTCPConnection -LocalPort 8080).OwningProcess | Sort-Object -Unique
if (-not $pids) {
    Write-Host "Nothing listening on port 8080."
    exit 0
}

foreach ($procId in $pids) {
    Write-Host "Stopping PID $procId..."
    Stop-Process -Id $procId -Force
}
Write-Host "Tomcat stopped."
