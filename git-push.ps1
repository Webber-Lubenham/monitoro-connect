# Git Push Automation Script
# This script automates the process of pushing changes to the remote repository

# Function to get commit message from user
function Get-CommitMessage {
    $commitMessage = Read-Host "Enter your commit message"
    if ([string]::IsNullOrWhiteSpace($commitMessage)) {
        Write-Host "Commit message cannot be empty. Please try again."
        return Get-CommitMessage
    }
    return $commitMessage
}

# Function to execute Git commands
function Push-Changes {
    param (
        [string]$commitMessage
    )

    try {
        # Check status
        Write-Host "Checking repository status..." -ForegroundColor Cyan
        git status

        # Add all changes
        Write-Host "Adding changes to staging area..." -ForegroundColor Cyan
        git add .

        # Commit changes
        Write-Host "Committing changes..." -ForegroundColor Cyan
        git commit -m $commitMessage

        # Push changes
        Write-Host "Pushing changes to remote repository..." -ForegroundColor Cyan
        git push origin main

        Write-Host "`nAll changes have been successfully pushed to the remote repository!" -ForegroundColor Green
    }
    catch {
        Write-Host "An error occurred: $_" -ForegroundColor Red
        exit 1
    }
}

# Main script execution
Write-Host "`nGit Push Automation Script`n" -ForegroundColor Yellow
Write-Host "This script will:" -ForegroundColor White
Write-Host "1. Check repository status" -ForegroundColor White
Write-Host "2. Add all changes to staging" -ForegroundColor White
Write-Host "3. Commit changes with your message" -ForegroundColor White
Write-Host "4. Push changes to the remote repository`n" -ForegroundColor White

# Get commit message from user
$commitMessage = Get-CommitMessage

# Execute Git commands
Push-Changes -commitMessage $commitMessage

Write-Host "`nScript completed successfully!" -ForegroundColor Green 