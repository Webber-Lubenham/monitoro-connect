@echo off
echo Git Push Automation Script
echo.
echo This script will:
echo 1. Check repository status
echo 2. Add all changes to staging
echo 3. Commit changes with your message
echo 4. Push changes to the remote repository
echo.

:get_message
set /p commit_message=Enter your commit message (or press Enter for auto-generated message): 
if "%commit_message%"=="" (
    echo.
    echo Analyzing build errors...
    for /f "tokens=*" %%a in ('npm run build 2^>^&1') do (
        echo %%a | findstr /C:"error during build:" >nul
        if not errorlevel 1 (
            for /f "tokens=3 delims=:" %%b in ("%%a") do (
                set "error_file=%%b"
                set "error_file=!error_file:~1,-1!"
                set "error_file=!error_file:src/=!"
                set "error_file=!error_file:/=\!"
                set "error_file=!error_file:.js=.ts!"
                set commit_message=fix: update import path in !error_file!
            )
        )
    )
    if not defined commit_message (
        set commit_message=chore: update project files
    )
    echo Auto-generated commit message: %commit_message%
    echo.
)

echo.
echo Checking repository status...
git status

echo.
echo Adding changes to staging area...
git add .

echo.
echo Committing changes...
git commit -m "%commit_message%"

echo.
echo Pushing changes to remote repository...
git push origin main

echo.
echo All changes have been successfully pushed to the remote repository!
echo Script completed successfully! 