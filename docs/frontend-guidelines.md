# Frontend Development Guidelines

## 1. Component Architecture

### 1.1 Component Organization

```typescript
// Good Component Structure
export interface ButtonProps {
  variant: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  size,
  children,
  onClick
}) => {
  const baseStyles = 'rounded-md font-medium transition-colors';
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
  };
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### 1.2 User Flow Components

Based on the provided frontend screenshots, implement consistent UI patterns for:

1. **Onboarding Flow**
   ```typescript
   // components/onboarding/StepIndicator.tsx
   interface StepIndicatorProps {
     currentStep: number;
     totalSteps: number;
     steps: {
       title: string;
       description: string;
     }[];
   }

   export const StepIndicator: React.FC<StepIndicatorProps> = ({
     currentStep,
     totalSteps,
     steps
   }) => {
     return (
       <div className="flex flex-col gap-4">
         <div className="flex justify-between">
           {steps.map((step, index) => (
             <Step
               key={index}
               isActive={currentStep === index + 1}
               isCompleted={currentStep > index + 1}
               {...step}
             />
           ))}
         </div>
       </div>
     );
   };
   ```

2. **Editor Interface**
   ```typescript
   // components/editor/Toolbar.tsx
   interface ToolbarProps {
     activeSection: string;
     onSectionChange: (section: string) => void;
   }

   export const Toolbar: React.FC<ToolbarProps> = ({
     activeSection,
     onSectionChange
   }) => {
     const sections = ['Design', 'Settings', 'Branding', 'Sections'];
     
     return (
       <nav className="flex items-center gap-4 px-6 py-4 bg-white border-b">
         {sections.map(section => (
           <button
             key={section}
             className={`px-4 py-2 rounded-md transition-colors ${
               activeSection === section
                 ? 'bg-blue-50 text-blue-600'
                 : 'text-gray-600 hover:text-gray-900'
             }`}
             onClick={() => onSectionChange(section)}
           >
             {section}
           </button>
         ))}
       </nav>
     );
   };
   ```

## 2. UI Components Library

### 2.1 Design System Components

Based on the screenshots, implement these core components:

```typescript
// components/ui/Card.tsx
export const Card: React.FC<CardProps> = ({
  children,
  className,
  shadow = 'md'
}) => {
  const shadowStyles = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };

  return (
    <div 
      className={`
        bg-white rounded-lg ${shadowStyles[shadow]}
        ${className || ''}
      `}
    >
      {children}
    </div>
  );
};

// components/ui/Input.tsx
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2 border rounded-md
            ${error ? 'border-red-500' : 'border-gray-300'}
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
          `}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);
```

### 2.2 Layout Components

```typescript
// components/layout/DashboardLayout.tsx
export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          <aside className="col-span-3">
            <Sidebar />
          </aside>
          <main className="col-span-9">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
```

## 3. Responsive Design Guidelines

Based on the mobile preview screenshots:

```typescript
// hooks/useBreakpoint.ts
export const useBreakpoint = () => {
  const isXS = useMediaQuery('(max-width: 639px)');
  const isSM = useMediaQuery('(min-width: 640px) and (max-width: 767px)');
  const isMD = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isLG = useMediaQuery('(min-width: 1024px)');

  return {
    isXS,
    isSM,
    isMD,
    isLG,
    isMobile: isXS || isSM,
    isDesktop: isMD || isLG
  };
};

// components/responsive/Container.tsx
export const Container: React.FC<ContainerProps> = ({
  children,
  className
}) => {
  return (
    <div className={`
      w-full mx-auto px-4
      sm:px-6 
      lg:px-8 
      max-w-7xl
      ${className || ''}
    `}>
      {children}
    </div>
  );
};
```

## 4. Animation Guidelines

```typescript
// utils/animations.ts
export const transitions = {
  fade: 'transition-opacity duration-200',
  scale: 'transition-transform duration-200',
  slideIn: 'transition-all duration-300',
};

// components/Transition.tsx
export const Transition: React.FC<TransitionProps> = ({
  show,
  children
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
```

## 5. Performance Guidelines

### 5.1 Image Optimization

```typescript
// components/OptimizedImage.tsx
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className="object-cover"
      quality={90}
    />
  );
};
```

### 5.2 Code Splitting

```typescript
// app/(dashboard)/sites/page.tsx
const SiteEditor = dynamic(() => import('@/components/editor/SiteEditor'), {
  loading: () => <EditorSkeleton />,
  ssr: false
});

// Lazy load heavy components
const ImageEditor = dynamic(() => import('@/components/editor/ImageEditor'));
const CodeEditor = dynamic(() => import('@/components/editor/CodeEditor'));
```

## 6. State Management Guidelines

```typescript
// store/editor.ts
interface EditorStore {
  activeSection: Section | null;
  history: {
    past: Operation[];
    future: Operation[];
  };
  unsavedChanges: boolean;
}

export const useEditorStore = create<EditorStore>((set) => ({
  activeSection: null,
  history: {
    past: [],
    future: []
  },
  unsavedChanges: false,
  actions: {
    updateSection: (section: Section) => 
      set(state => ({
        activeSection: section,
        unsavedChanges: true,
        history: {
          past: [...state.history.past, state.activeSection],
          future: []
        }
      }))
  }
}));
```

## 7. Testing Guidelines

```typescript
// components/Editor.test.tsx
describe('Editor Component', () => {
  it('renders toolbar with correct sections', () => {
    render(<Editor />);
    expect(screen.getByText('Design')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Branding')).toBeInTheDocument();
  });

  it('handles section changes correctly', () => {
    render(<Editor />);
    fireEvent.click(screen.getByText('Design'));
    expect(screen.getByTestId('design-panel')).toBeVisible();
  });
});
```

## 8. Documentation Standards

```typescript
/**
 * Editor component for website customization
 * @component
 * @example
 * ```tsx
 * <Editor siteId="123" initialSection="design" />
 * ```
 */
export interface EditorProps {
  /** Unique identifier for the site being edited */
  siteId: string;
  /** Initial active section in the editor */
  initialSection?: 'design' | 'settings' | 'branding';
  /** Callback when changes are saved */
  onSave?: (changes: EditorChanges) => Promise<void>;
}
```

Remember to follow these guidelines for consistent, maintainable, and performant frontend development.