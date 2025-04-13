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
set /p commit_message=Enter your commit message: 
if "%commit_message%"=="" (
    echo Commit message cannot be empty. Please try again.
    goto get_message
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