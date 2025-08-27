@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo 🔍 Starting File Watcher for Auto-Push...
echo 📁 Watching for changes in the current directory...
echo ⏰ Auto-push will trigger every 30 seconds if changes are detected
echo 🛑 Press Ctrl+C to stop

:loop
timeout /t 30 /nobreak >nul

REM Check if there are any changes
git diff --quiet
if errorlevel 1 (
    echo 📝 Changes detected! Running auto-push...
    call scripts\auto-push.bat
) else (
    git diff --staged --quiet
    if errorlevel 1 (
        echo 📝 Staged changes detected! Running auto-push...
        call scripts\auto-push.bat
    ) else (
        echo ⏳ No changes detected, continuing to watch...
    )
)

goto loop 