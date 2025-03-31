# Git Push Instructions

## Prerequisites
- Make sure you have Git installed
- Have the GitHub token ready

## Step-by-Step Instructions

### 1. Configure Git Remote with Token
```bash
git remote set-url origin https://[YOUR_TOKEN]@github.com/[USERNAME]/[REPOSITORY].git
```

### 2. Push Changes to Remote Repository
For first-time push on a branch:
```bash
git push --set-upstream origin [BRANCH_NAME]
```

For subsequent pushes:
```bash
git push
```

### 3. Verify Changes
1. Check push status in terminal
2. Verify on GitHub repository page

## Common Issues and Solutions

### No Upstream Branch
If you see: "The current branch has no upstream branch"
```bash
git push --set-upstream origin [BRANCH_NAME]
```

### Authentication Failed
Re-configure remote with token:
```bash
git remote set-url origin https://[TOKEN]@github.com/[USERNAME]/[REPOSITORY].git
```

## Additional Notes
- Keep your token secure
- Don't share tokens in public repositories
- Use `git status` to check branch status before pushing
