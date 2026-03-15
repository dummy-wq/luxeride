# Theme Wizard Launcher for PowerShell
# This script ensures Node is installed and launches the JS wizard.

if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Error: Node.js is not installed. Please install it to use the Theme Wizard." -ForegroundColor Red
    exit
}

node "$PSScriptRoot/theme-wizard.js"
