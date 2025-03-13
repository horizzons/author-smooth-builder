# Git Branch Naming Convention

## Main vs Master Branch

1. **Historical Context**

   - Historically, `master` was the default branch name in Git
   - GitHub changed their default branch name to `main` in October 2020
   - This change was made to move away from unnecessary references to master/slave terminology

2. **Current Best Practice**

   - `main` is now the recommended default branch name
   - It's considered more inclusive and descriptive
   - Most new GitHub repositories default to `main`

3. **Our Current Setup**
   - Our repository is using `master` because it was created using `git init` locally
   - We should rename it to `main` to follow current best practices

## How to Fix This

To rename the `master` branch to `main`:

```bash
# Rename local branch
git branch -m master main

# Push the main branch and reset upstream
git push -u origin main

# Delete the old master branch on remote
git push origin --delete master
```

## Going Forward

1. **Default Branch Setup**

   - All new repositories should use `main` as the default branch
   - Configure Git globally to use `main`:
     ```bash
     git config --global init.defaultBranch main
     ```

2. **Branch Strategy**

   ```
   main (stable)
   ├── develop (integration)
   ├── feature/* (new features)
   ├── bugfix/* (bug fixes)
   └── release/* (release preparation)
   ```

3. **Branch Naming Guidelines**

   - feature/[feature-name]
   - bugfix/[bug-description]
   - release/[version-number]
   - hotfix/[issue-description]

4. **Protection Rules**
   - `main` branch should be protected
   - Require pull request reviews
   - No direct pushes to `main`
   - Require status checks to pass before merging
