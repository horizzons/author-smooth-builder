# Project File Structure Documentation

## Root Directory Structure

```
author-website-platform/
├── .github/                    # GitHub workflows and configuration
├── .husky/                    # Git hooks
├── .vscode/                   # VS Code settings
├── apps/                      # Application packages
│   ├── web/                   # Main web application
│   └── admin/                 # Admin dashboard
├── packages/                  # Shared packages
│   ├── ui/                    # Shared UI components
│   ├── config/               # Shared configuration
│   └── utils/                # Shared utilities
├── docs/                     # Documentation
├── scripts/                  # Build and maintenance scripts
└── package.json             # Root package.json
```

## Web Application Structure (apps/web)

```
web/
├── .env.example              # Environment variables example
├── .env.local               # Local environment variables
├── public/                  # Static files
│   ├── fonts/              # Custom fonts
│   ├── images/             # Static images
│   └── favicon.ico         # Site favicon
├── src/                    # Source code
│   ├── app/               # Next.js 14 App Router
│   │   ├── (auth)/       # Authentication routes
│   │   │   ├── login/    # Login page
│   │   │   └── signup/   # Signup page
│   │   ├── (dashboard)/  # Dashboard routes
│   │   │   ├── sites/    # Site management
│   │   │   ├── analytics/# Analytics pages
│   │   │   └── settings/ # User settings
│   │   ├── (editor)/     # Website editor
│   │   │   ├── [siteId]/ # Site-specific editor
│   │   │   └── templates/# Template management
│   │   └── layout.tsx    # Root layout
│   ├── components/       # React components
│   │   ├── common/      # Common components
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   └── Modal/
│   │   ├── editor/      # Editor components
│   │   │   ├── Canvas/
│   │   │   ├── Toolbar/
│   │   │   └── Panels/
│   │   └── sections/    # Website sections
│   │       ├── Hero/
│   │       ├── Books/
│   │       └── Contact/
│   ├── hooks/           # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useEditor.ts
│   │   └── useSite.ts
│   ├── lib/            # Library code
│   │   ├── api/       # API client
│   │   ├── db/        # Database utilities
│   │   └── utils/     # Utility functions
│   ├── store/         # State management
│   │   ├── auth/      # Authentication store
│   │   ├── editor/    # Editor store
│   │   └── site/      # Site management store
│   ├── styles/        # Global styles
│   │   ├── globals.css
│   │   └── tailwind.css
│   └── types/         # TypeScript types
│       ├── auth.ts
│       ├── editor.ts
│       └── site.ts
├── tests/             # Test files
│   ├── e2e/          # End-to-end tests
│   ├── integration/  # Integration tests
│   └── unit/        # Unit tests
└── package.json      # Package configuration
```

## Editor Components Structure

```
src/components/editor/
├── Canvas/
│   ├── index.tsx               # Main canvas component
│   ├── DropZone.tsx           # Section drop zones
│   └── Section.tsx            # Section wrapper
├── Toolbar/
│   ├── index.tsx              # Main toolbar
│   ├── ToolbarButton.tsx      # Reusable button
│   └── ToolbarDropdown.tsx    # Dropdown menu
├── Panels/
│   ├── DesignPanel/
│   │   ├── index.tsx          # Design panel wrapper
│   │   ├── ColorPicker.tsx    # Color selection
│   │   └── Typography.tsx     # Font controls
│   ├── ContentPanel/
│   │   ├── index.tsx          # Content panel wrapper
│   │   └── RichTextEditor.tsx # Text editor
│   └── SettingsPanel/
│       ├── index.tsx          # Settings wrapper
│       ├── SEO.tsx           # SEO settings
│       └── Social.tsx        # Social media links
└── Sections/
    ├── BookShowcase/
    │   ├── index.tsx         # Book showcase section
    │   └── BookCard.tsx      # Individual book card
    ├── AuthorBio/
    │   ├── index.tsx         # Author bio section
    │   └── SocialLinks.tsx   # Social media links
    └── Newsletter/
        ├── index.tsx         # Newsletter section
        └── SignupForm.tsx    # Signup form
```

## API Routes Structure

```
src/app/api/
├── trpc/                     # tRPC API routes
│   └── [trpc]/
│       └── route.ts
├── auth/                     # Authentication routes
│   ├── [...nextauth]/
│   │   └── route.ts         # NextAuth.js configuration
│   ├── login/
│   │   └── route.ts         # Login handler
│   └── register/
│       └── route.ts         # Registration handler
├── sites/                    # Site management
│   ├── route.ts             # Site list handler
│   └── [siteId]/
│       ├── route.ts         # Single site handler
│       └── pages/
│           └── route.ts     # Page management
└── upload/                   # Asset upload
    └── route.ts             # Upload handler
```

## Database Models

```
src/lib/db/models/
├── User.ts                  # User model
├── Site.ts                  # Site model
├── Page.ts                  # Page model
├── Section.ts              # Section model
├── Asset.ts               # Asset model
└── index.ts              # Model exports
```

## Shared Utilities

```
packages/utils/src/
├── validation/            # Form validation
│   ├── auth.ts
│   ├── site.ts
│   └── editor.ts
├── formatting/           # Data formatting
│   ├── date.ts
│   └── text.ts
├── hooks/               # Shared hooks
│   ├── useDebounce.ts
│   └── useMediaQuery.ts
└── helpers/            # Helper functions
    ├── api.ts
    ├── storage.ts
    └── url.ts
```

## Testing Structure

```
tests/
├── e2e/                 # End-to-end tests
│   ├── auth.spec.ts
│   ├── editor.spec.ts
│   └── site.spec.ts
├── integration/         # Integration tests
│   ├── api/
│   └── components/
└── unit/               # Unit tests
    ├── hooks/
    ├── utils/
    └── components/
```

## Development Guidelines

1. **Component Organization**
   - One component per file
   - Use index.ts for clean exports
   - Maintain consistent naming conventions
   - Group related components in directories

2. **State Management**
   - Use Zustand for global state
   - React Query for server state
   - Local state for component-specific data

3. **API Integration**
   - Centralize API calls in dedicated services
   - Use tRPC for type-safe API calls
   - Implement proper error handling

4. **Testing**
   - Write tests alongside components
   - Maintain high test coverage
   - Use meaningful test descriptions

5. **Code Style**
   - Follow ESLint configuration
   - Use Prettier for formatting
   - Write meaningful comments
   - Document complex logic

## Configuration Files

```
root/
├── .eslintrc.js           # ESLint config
├── .prettierrc           # Prettier config
├── jest.config.js       # Jest config
├── next.config.js      # Next.js config
├── tailwind.config.js # Tailwind config
└── tsconfig.json     # TypeScript config