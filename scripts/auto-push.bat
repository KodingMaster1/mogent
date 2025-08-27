@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo 🚀 Starting Auto Push Process...

REM Check if we're in a git repository
git rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Not in a git repository
    exit /b 1
)

REM Check if there are any changes
git diff --quiet
if errorlevel 1 (
    set "HAS_CHANGES=1"
) else (
    git diff --staged --quiet
    if errorlevel 1 (
        set "HAS_CHANGES=1"
    ) else (
        set "HAS_CHANGES=0"
    )
)

if "!HAS_CHANGES!"=="0" (
    echo 📝 No changes to commit
    exit /b 0
)

REM Get current branch
for /f "tokens=*" %%i in ('git branch --show-current') do set "CURRENT_BRANCH=%%i"
echo 📍 Current branch: !CURRENT_BRANCH!

REM Add all changes
echo 📦 Adding all changes...
git add .

REM Get list of changed files
echo 📄 Changed files:
git diff --cached --name-only

REM Create commit message with timestamp
for /f "tokens=1-3 delims=/ " %%a in ('date /t') do set "DATE=%%a %%b %%c"
for /f "tokens=1-2 delims=: " %%a in ('time /t') do set "TIME=%%a:%%b"
set "TIMESTAMP=!DATE! !TIME!"

REM Commit changes
echo 💾 Committing changes...
git commit -m "Auto-commit: Update files at !TIMESTAMP!"

REM Push to remote
echo 🚀 Pushing to remote...
git push origin !CURRENT_BRANCH!
if errorlevel 1 (
    echo ❌ Failed to push to GitHub
    exit /b 1
) else (
    echo ✅ Successfully pushed to GitHub!
)

echo 🎉 Auto push completed successfully! 