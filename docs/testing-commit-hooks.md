# Testing Husky Hooks and Commitlint

Here's a step-by-step guide to test if your Husky hooks and Commitlint are working properly.

## Prerequisites

Ensure you have:

1. Initialized Git repository (`git init`)
2. Installed dependencies (`npm install`)
3. Set up Husky (`npm run prepare`)

## Testing Steps

1. **Make a change to any file**

   ```bash
   # For example, add a new line to README.md
   echo "# Test change" >> README.md
   ```

2. **Stage the changes**

   ```bash
   git add README.md
   ```

3. **Try an incorrect commit message**

   ```bash
   git commit -m "testing"
   ```

   This should fail because it doesn't follow the conventional commit format. You should see an error message from commitlint.

4. **Try a correct commit message**
   ```bash
   git commit -m "test: verify commit hooks are working"
   ```
   This should succeed because it follows the conventional commit format.

## Valid Commit Message Types

Your commit messages must start with one of these types:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `chore:` - Routine tasks, maintenance
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code changes that neither fix bugs nor add features
- `ci:` - Changes to CI configuration
- `test:` - Adding or modifying tests
- `perf:` - Performance improvements
- `revert:` - Reverting previous changes
- `build:` - Changes affecting build system

## Examples of Valid Commit Messages

```bash
git commit -m "feat: add new login functionality"
git commit -m "fix: resolve issue with form validation"
git commit -m "docs: update API documentation"
git commit -m "style: format according to style guide"
git commit -m "test: add unit tests for user service"
```

## What Happens During Commit

1. When you run `git commit`:

   - The pre-commit hook runs first
     - Runs lint-staged
     - Formats staged files with Prettier
     - Runs ESLint on staged files
   - If pre-commit passes, the commit-msg hook runs
     - Validates your commit message with commitlint
     - Checks if it follows conventional commit format

2. The commit will only succeed if:
   - All staged files pass formatting and linting
   - The commit message follows the conventional commit format

## Troubleshooting

If hooks aren't running:

1. Check if .husky directory exists
2. Ensure hook files are executable:
   ```bash
   chmod +x .husky/pre-commit
   chmod +x .husky/commit-msg
   ```
3. Verify Husky is installed:
   ```bash
   npm run prepare
   ```
