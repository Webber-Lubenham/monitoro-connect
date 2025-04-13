@echo off
setlocal enabledelayedexpansion

echo Git Push Automation Script
echo.
echo This script will:
echo 1. Check repository status
echo 2. Add all changes to staging
echo 3. Commit changes with your message
echo 4. Push changes to remote repository
echo.

:get_message
set /p commit_message=Enter your commit message (or press Enter for auto-generated message): 
if "%commit_message%"=="" (
    echo.
    echo Analyzing changes and build errors...
    
    :: Check for build errors
    for /f "tokens=*" %%a in ('npm run build 2^>^&1') do (
        echo %%a | findstr /C:"error during build:" >nul
        if not errorlevel 1 (
            for /f "tokens=3 delims=:" %%b in ("%%a") do (
                set "error_file=%%b"
                set "error_file=!error_file:~1,-1!"
                set "error_file=!error_file:src/=!"
                set "error_file=!error_file:/=\!"
                set "error_file=!error_file:.js=.ts!"
                
                :: Extract error type
                echo %%a | findstr /C:"is not exported" >nul
                if not errorlevel 1 (
                    set "error_type=fix: update import path"
                ) else (
                    echo %%a | findstr /C:"Type" >nul
                    if not errorlevel 1 (
                        set "error_type=fix: resolve type error"
                    ) else (
                        set "error_type=fix: resolve build error"
                    )
                )
                
                set commit_message=!error_type! in !error_file!
                goto :commit_ready
            )
        )
    )
    
    :: If no build error, check git status for changes
    for /f "tokens=*" %%a in ('git status --porcelain') do (
        set "changed_file=%%a"
        set "changed_file=!changed_file:~3!"
        
        :: Determine change type based on file extension
        echo !changed_file! | findstr /C:".ts" >nul
        if not errorlevel 1 (
            set "change_type=refactor: update TypeScript file"
        ) else (
            echo !changed_file! | findstr /C:".tsx" >nul
            if not errorlevel 1 (
                set "change_type=refactor: update React component"
            ) else (
                echo !changed_file! | findstr /C:".json" >nul
                if not errorlevel 1 (
                    set "change_type=chore: update configuration"
                ) else (
                    echo !changed_file! | findstr /C:".bat" >nul
                    if not errorlevel 1 (
                        set "change_type=chore: update script"
                    ) else (
                        set "change_type=chore: update project files"
                    )
                )
            )
        )
        
        set commit_message=!change_type! !changed_file!
        goto :commit_ready
    )
    
    :: Default message if no specific changes detected
    set commit_message=chore: update project files
    
    :commit_ready
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