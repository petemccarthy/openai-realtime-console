# TypeScript Guide for React Development

## Common Issues and Solutions

### 1. Module Issues
When you see errors like `'File is not a module'` or `'cannot be compiled under --isolatedModules'`:

```typescript
// ❌ Wrong - File treated as script
function MyComponent() {
  return <div>Hello</div>;
}

// ✅ Correct - File treated as module
import React from 'react';
export function MyComponent() {
  return <div>Hello</div>;
}
```

### 2. React Component Types

```typescript
// Basic Function Component
interface MyComponentProps {
  name: string;
  age?: number; // Optional prop
}

// ✅ Using React.FC (Function Component)
export const MyComponent: React.FC<MyComponentProps> = ({ name, age }) => {
  return <div>Hello {name}, Age: {age}</div>;
};

// ✅ Alternative syntax
export function MyComponent(props: MyComponentProps) {
  return <div>Hello {props.name}, Age: {props.age}</div>;
}
```

### 3. Event Handling

```typescript
// Button click events
const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
  console.log(event.currentTarget.name);
};

// Input change events
const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
  console.log(event.target.value);
};
```

### 4. State and Hooks

```typescript
// useState with type inference
const [count, setCount] = useState(0); // TypeScript infers number

// useState with explicit type
const [user, setUser] = useState<User | null>(null);

// useRef with HTML element
const inputRef = useRef<HTMLInputElement>(null);

// Custom hooks
function useCustomHook<T>(initial: T) {
  const [value, setValue] = useState<T>(initial);
  return [value, setValue] as const;
}
```

### 5. Common Props Types

```typescript
// Children prop
interface Props {
  children: React.ReactNode;
}

// Style props
interface StyleProps {
  style?: React.CSSProperties;
  className?: string;
}

// Event handler props
interface EventProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}
```

### 6. Working with Routes

```typescript
// Route parameters
interface RouteParams {
  id: string;
}

// useParams with TypeScript
const { id } = useParams<RouteParams>();

// Route component props
interface RouteComponentProps {
  path: string;
  element: React.ReactNode;
}
```

## Best Practices

1. **Always Define Prop Types**
   - Use interfaces for prop definitions
   - Make optional props explicit with `?`
   - Use descriptive names for interfaces

2. **Use Type Inference When Possible**
   - Let TypeScript infer types when they're obvious
   - Explicitly define types when inference isn't clear

3. **Avoid `any`**
   - Use `unknown` instead of `any` when type is truly unknown
   - Define proper interfaces instead of using `any`

4. **Export Types**
   - Export interfaces and types that are used across components
   - Keep shared types in a separate types file

5. **Use Type Guards**
```typescript
function isUser(obj: any): obj is User {
  return 'id' in obj && 'name' in obj;
}
```

## Project Structure

```
src/
├── types/           # Shared type definitions
│   ├── user.ts
│   └── api.ts
├── components/      # React components
│   └── Button/
│       ├── Button.tsx
│       └── types.ts # Component-specific types
└── utils/          # Utility functions with types
    └── helpers.ts
```

## Common Type Declarations

```typescript
// API Response
interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

// User type
interface User {
  id: string;
  name: string;
  email: string;
}

// Form event handlers
interface FormEvents {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
```

Remember: TypeScript is a tool to help catch errors early and provide better development experience. Use it to document your code's intent and constraints, but don't over-complicate things when simple solutions work well.
