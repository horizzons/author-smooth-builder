# Git Versioning Guide

The following files should be committed to the Git repository:

## Development Environment Configuration

```
.prettierrc.json         # Prettier configuration
.prettierignore         # Prettier ignore patterns
.vscode/               # VSCode configuration
├── extensions.json    # Recommended extensions
└── settings.json     # Editor settings
.husky/               # Git hooks
├── commit-msg       # Commit message validation
└── pre-commit      # Pre-commit tasks
commitlint.config.js  # Commit message linting rules
```

## Files to be ignored (.gitignore)

The following patterns should be in your `.gitignore`:

```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Dependencies
node_modules
.pnp
.pnp.js

# Testing
coverage

# Production
dist
dist-ssr

# Local env files
*.local
.env
.env.*

# Editor directories and files
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# VSCode files (except specific configs)
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
```

## Rationale

1. **Configuration Files**

   - `.prettierrc.json` and `.prettierignore`: Ensure consistent code formatting across the team
   - `.vscode/`: Share common editor settings and recommended extensions
   - `commitlint.config.js`: Maintain consistent commit message format
   - `.husky/`: Share Git hooks for maintaining code quality

2. **Package Management**

   - `package.json`: Track project dependencies and scripts
   - `package-lock.json`: Lock dependency versions
   - `bun.lockb`: Lock dependency versions for Bun

3. **Source Code**

   - All files under `src/`
   - All files under `public/`
   - Configuration files like `vite.config.ts`, `tsconfig.json`, etc.

4. **Documentation**
   - All files under `docs/`
   - `README.md` and other documentation files

## Ignored Files Explanation

1. **Dependencies**: `node_modules/` should never be committed as they can be installed via package managers
2. **Build Output**: `dist/` and similar build directories contain generated code
3. **Environment Variables**: `.env` files often contain sensitive information
4. **Logs and Cache**: Generated during development, not needed in the repository
5. **Editor-specific**: Most IDE/editor specific files except shared configurations

Remember to initialize Husky after cloning the repository:

```bash
npm install
npm run prepare  # This will set up the Git hooks
```
