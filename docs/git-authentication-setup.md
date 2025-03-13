# Git Authentication Setup Guide

## Current Issues Identified

1. Git remote URL formatting issue
2. SSH key needs to be added to GitHub
3. Need proper GitHub authentication setup

## Solution Steps

### 1. Fix Remote URL

```bash
# Check current remote
git remote -v

# If you see formatting issues (no space between 'origin' and URL)
# Remove and re-add the remote
git remote remove origin
git remote add origin https://github.com/horizzons/author-smooth-builder.git
```

### 2. Add SSH Key to GitHub

Your SSH public key is:

```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCpDn8P02uerAoZ0wV1OPnPSgqyK1ajOyknOlUHpLsrdksRf/qfNWeXO/UKi7C4K4MkyIIozYwcok3Nm8q4V3JbcfS7nDvYV0OV7TqHua8FLNYr1fgjfOGPMcvvhHY0+YZ5zXPXpuuQWftVXSdeMVPIucOp0xDykYF5qio2Nb/5fE2vx+blI6ffWodR3xZL2y12JpGSf0cyIGhlQkY2Sb7rXAMtOvZgdW0pvzY7Jcz2X+b3//oMQAyC4V/eQH/oagvwbXAjKZdzIw/gxJTWsg05rSmflcxUTXcnHJ4p8HFUvCEmrOtnvSXeKcyo96Tqk5X1l6wd41H8fON7s46nG11AYxretq/hoixFvO/+O5Jg8k+5cZ5ZPozaKB+MBPeVYFUH4DAADovVRHqhUEoDuvJh2BVnaxEjLf/CME+yliP1XaUFTtZk1frhnr4gLS14H92AF4s9kLEXQivH7j09Kc/D7bjovxddhDzYhGbdoJu7i5W8cZHIfqmZt6Uqr9e6COE= jorge@Jorge-MBP
```

Add this key to GitHub:

1. Go to GitHub.com → Settings → SSH and GPG keys
2. Click "New SSH key"
3. Give it a title (e.g., "MacBook Pro")
4. Paste the key and save

### 3. GitHub CLI Setup (Recommended)

We're installing GitHub CLI (gh) to help with authentication:

```bash
# Install GitHub CLI
brew install gh

# Authenticate with GitHub
gh auth login

# Configure Git to use gh credentials
gh auth setup-git
```

### 4. Test the Connection

After adding the SSH key and setting up GitHub CLI:

```bash
# Test SSH connection
ssh -T git@github.com

# Try pushing your changes
git push -u origin added-docs
```

### Alternative: Using Personal Access Token

If SSH and GitHub CLI don't work, you can use a Personal Access Token:

1. Go to GitHub.com → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select 'repo' scope
4. Copy the token and use it as your password when pushing

### Troubleshooting

If you still have issues:

1. Check Git configuration:
   ```bash
   git config --list
   ```
2. Verify remote URL format:
   ```bash
   git remote -v
   ```
3. Check SSH agent:
   ```bash
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_rsa
   ```
