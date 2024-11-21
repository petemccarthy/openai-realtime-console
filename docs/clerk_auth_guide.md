Sure! I'll convert the instructions into proper Markdown format while preserving all the content:

# Create a React App with Clerk Authentication

## Create a React app using Vite

Run the following commands to create a new React app using Vite:

```bash
npm create vite@latest clerk-react -- --template react-ts
cd clerk-react
npm install
npm run dev
```

## Install `@clerk/clerk-react`

Clerk's React SDK gives you access to prebuilt components, hooks, and helpers to make user authentication easier.

Run the following command to install the SDK:

```bash
npm install @clerk/clerk-react
```

## Set your Clerk API keys

Add your Clerk publishable key to your `.env.local` file. It can always be retrieved from the **API Keys** page of your Clerk Dashboard.

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_dHJ1c3RlZC13b2xmLTYzLmNsZXJrLmFjY291bnRzLmRldiQ
```

## Import the Clerk publishable key

In your `main.tsx` file, import your Clerk publishable key. You can add an `if` statement to check that it is imported and that it exists. This will prevent running the app without the publishable key, and will also prevent TypeScript errors.

```typescript
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk publishable key to the .env.local file')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

## Add `<ClerkProvider>` to your app

The `<ClerkProvider>` component wraps your app to provide active session and user context to Clerk's hooks and other components. You must pass your publishable key as a prop to the `<ClerkProvider>` component.

```typescript
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk publishable key to the .env.local file')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)
```

## Create a header with Clerk components

You can control which content signed-in and signed-out users can see with the prebuilt control components. Create a header using the following components:

* `<SignedIn>`: Children of this component can only be seen while **signed in**
* `<SignedOut>`: Children of this component can only be seen while **signed out**
* `<UserButton />`: Shows the signed-in user's avatar. Selecting it opens a dropdown menu with account management options
* `<SignInButton />`: An unstyled component that links to the sign-in page or displays the sign-in modal

```typescript
// src/App.tsx
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'

export default function App() {
  return (
    <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  )
}
```

## Create your first user

Run your project with the following command:

```bash
npm run dev
```

Visit your app's homepage at `http://localhost:5173`. Sign up to create your first user.

## Next step: Add routing with React Router

React has many options for handling routing, and you are free to choose the option that suits you best. If you would like to learn how to integrate React Router's latest Data API-based router (also known as Data Router), see the dedicated guide.

I'll convert the documentation for `<ClerkProvider>` into Markdown format:

# ClerkProvider Component

The `<ClerkProvider>` component wraps your React application to provide active session and user context to Clerk's hooks and other components.

## Usage

The `<ClerkProvider>` component must be added to your React entrypoint.

### Next.js App Router Example

```typescript
// app/layout.tsx
import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Next.js 13 with Clerk</title>
      </head>
      <ClerkProvider>
        <body>{children}</body>
      </ClerkProvider>
    </html>
  )
}
```

> **Note**: Other meta-frameworks, like Remix, have wrappers around `<ClerkProvider>` to make their integrations tighter.

## Properties

### Navigation & URLs

| Property | Type | Description |
|----------|------|-------------|
| `afterMultiSessionSingleSignOutUrl` | `string` | The full URL or path to navigate to after signing out from a currently active account in a multi-session app. |
| `afterSignOutUrl` | `string` | The full URL or path to navigate to after a successful sign-out. |
| `signInUrl` | `string` | URL used for redirects, must point to your primary application on the client-side. Optional for production, required for satellite apps in development. |
| `signUpUrl` | `string` | URL used for redirects, must point to your primary application on the client-side. Optional for production, required in development. |
| `signInFallbackRedirectUrl` | `string` | Fallback URL after sign-in if no `redirect_url` exists. Defaults to `/`. |
| `signUpFallbackRedirectUrl` | `string` | Fallback URL after sign-up if no `redirect_url` exists. Defaults to `/`. |
| `signInForceRedirectUrl` | `string` | If provided, always redirects to this URL after sign-in. |
| `signUpForceRedirectUrl` | `string` | If provided, always redirects to this URL after sign-up. |

### Configuration

| Property | Type | Description |
|----------|------|-------------|
| `publishableKey` | `string` | Your Clerk publishable key (found in Clerk Dashboard under API Keys). |
| `allowedRedirectOrigins` | `Array<string \| RegExp>` | Optional array of domains for validating auth redirects. |
| `appearance` | `Appearance \| undefined` | Optional styling object for Clerk components (excluding Account Portal pages). |
| `localization` | `Localization \| undefined` | Optional localization object for Clerk components (excluding Account Portal pages). |
| `supportEmail` | `string` | Optional support email displayed in authentication screens. |

### Router & Navigation

| Property | Type | Description |
|----------|------|-------------|
| `routerPush` | `(to: string) => Promise<unknown> \| void` | Function for "push" navigation. |
| `routerReplace` | `(to: string) => Promise<unknown> \| void` | Function for "replace" navigation. |

### Advanced Configuration

| Property | Type | Description |
|----------|------|-------------|
| `clerkJSUrl` | `string` | Custom URL for loading `@clerk/clerk-js`. |
| `clerkJSVariant` | `string` | Set to 'headless' for minimal bundle with Control components only. |
| `clerkJSVersion` | `string` | Specify npm version for `@clerk/clerk-js`. |
| `domain` | `string \| ((url: URL) => boolean)` | Required domain setting for satellite applications. |
| `isSatellite` | `boolean \| ((url: URL) => boolean)` | Defines if the application is a satellite application. |
| `telemetry` | `false \| { disabled?: boolean; debug?: boolean } \| undefined` | Controls Clerk's telemetry data collection. |
| `nonce` | `string` | Nonce value for `@clerk/clerk-js` script tag (requires `dynamic` prop). |

### SDK & Development

| Property | Type | Description |
|----------|------|-------------|
| `sdkMetadata` | `{ name: string; version: string; environment?: string }` | SDK information (for SDK development). |
| `standardBrowser` | `boolean` | Controls cookie settings assumption (false for native platforms). |
| `selectInitialSession` | `(client: ClientResource) => ActiveSessionResource \| null` | Customize initial session selection. |
| `touchSession` | `boolean` | Toggle session keeping-alive behavior. |
| `initialState` | `InitialState` | Initial Clerk client state for SSR. |
| `dynamic` | `boolean` | (Next.js) Enables dynamic auth data based on current request. |
| `waitlistUrl` | `string` | Full URL/path to waitlist page (defaults to Account Portal waitlist). |


I'll convert the `<SignIn />` component documentation into Markdown format:

# SignIn Component

The `<SignIn />` component renders a UI for signing in users. Its functionality is controlled by instance settings specified in your Clerk Dashboard, including sign-in and sign-up options and social connections. The component can be further customized through additional properties at render time.

> **Note**: The `<SignUp/>` and `<SignIn/>` components cannot render when a user is already signed in, unless the application allows multiple sessions. For single-session applications, Clerk will redirect signed-in users to the Home URL.

## Properties

All properties are optional.

### Core Properties

| Property | Type | Description |
|----------|------|-------------|
| `appearance` | `Appearance \| undefined` | Style customization object for Clerk components (excludes Account Portal pages) |
| `routing` | `'hash' \| 'path' \| 'virtual'` | Routing strategy. Defaults to 'path' in Next.js/Remix, 'hash' for other SDKs |
| `path` | `string` | Mount path for path-based routing (ignored in hash/virtual routing), e.g., `/sign-in` |
| `transferable` | `boolean` | Controls if sign-in attempts can transfer to sign-up flow (default: `true`) |

### URL & Redirect Properties

| Property | Type | Description |
|----------|------|-------------|
| `signUpUrl` | `string` | Full URL/path to sign up page |
| `forceRedirectUrl` | `string` | URL to always redirect to after sign-in (highest priority) |
| `fallbackRedirectUrl` | `string` | Fallback URL for sign-in redirect (default: `/`) |
| `signUpForceRedirectUrl` | `string` | URL to always redirect to after sign-up |
| `signUpFallbackRedirectUrl` | `string` | Fallback URL for sign-up redirect (default: `/`) |
| `waitlistUrl` | `string` | Path to waitlist page (defaults to Account Portal waitlist) |

### Other Properties

| Property | Type | Description |
|----------|------|-------------|
| `initialValues` | `SignInInitialValues` | Values to prefill sign-in fields |

## Framework Usage

### Next.js Example

```typescript
// app/page.tsx
import { SignIn, useUser } from '@clerk/nextjs'

export default function Home() {
  const { user } = useUser()

  if (!user) {
    return <SignIn />
  }

  return <div>Welcome!</div>
}
```

## JavaScript API Usage

The Clerk instance provides several methods to control the `<SignIn />` component:

### `mountSignIn()`

Renders the `<SignIn />` component to an HTML `<div>` element.

```typescript
function mountSignIn(node: HTMLDivElement, props?: SignInProps): void
```

Example:
```javascript
import { Clerk } from '@clerk/clerk-js'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const clerk = new Clerk(clerkPubKey)
await clerk.load()

document.getElementById('app').innerHTML = `
  <div id="sign-in"></div>
`

const signInDiv = document.getElementById('sign-in')
clerk.mountSignIn(signInDiv)
```

### `unmountSignIn()`

Unmounts and cleans up an existing `<SignIn />` component instance.

```typescript
function unmountSignIn(node: HTMLDivElement): void
```

Example:
```javascript
const signInDiv = document.getElementById('sign-in')
clerk.mountSignIn(signInDiv)
// ... later ...
clerk.unmountSignIn(signInDiv)
```

### `openSignIn()`

Opens the `<SignIn />` component as an overlay at the root of your HTML body.

```typescript
function openSignIn(props?: SignInProps): void
```

Example:
```javascript
const clerk = new Clerk(clerkPubKey)
await clerk.load()
clerk.openSignIn()
```

### `closeSignIn()`

Closes the sign-in overlay.

```typescript
function closeSignIn(): void
```

Example:
```javascript
clerk.openSignIn()
// ... later ...
clerk.closeSignIn()
```

# SignUp Component

The `<SignUp />` component renders a UI for signing up users. Its functionality is controlled by instance settings specified in your Clerk Dashboard, including sign-in and sign-up options and social connections. The component can be further customized through additional properties at render time.

> **Note**: The `<SignUp/>` and `<SignIn/>` components cannot render when a user is already signed in, unless the application allows multiple sessions. For single-session applications, Clerk will redirect signed-in users to the Home URL.

## Properties

All properties are optional.

### Core Properties

| Property | Type | Description |
|----------|------|-------------|
| `appearance` | `Appearance \| undefined` | Style customization object for Clerk components (excludes Account Portal pages) |
| `routing` | `'hash' \| 'path' \| 'virtual'` | Routing strategy. Defaults to 'path' in Next.js/Remix, 'hash' for other SDKs |
| `path` | `string` | Mount path for path-based routing (ignored in hash/virtual routing), e.g., `/sign-up` |

### URL & Redirect Properties

| Property | Type | Description |
|----------|------|-------------|
| `signInUrl` | `string` | Full URL/path to sign in page |
| `forceRedirectUrl` | `string` | URL to always redirect to after sign-up (highest priority) |
| `fallbackRedirectUrl` | `string` | Fallback URL for sign-up redirect (default: `/`) |
| `signInForceRedirectUrl` | `string` | URL to always redirect to after sign-in |
| `signInFallbackRedirectUrl` | `string` | Fallback URL for sign-in redirect (default: `/`) |

### Other Properties

| Property | Type | Description |
|----------|------|-------------|
| `initialValues` | `SignUpInitialValues` | Values to prefill sign-up fields |

## Framework Usage

### Next.js Example

```typescript
// app/page.tsx
import { SignUp, useUser } from '@clerk/nextjs'

export default function Home() {
  const { user } = useUser()

  if (!user) {
    return <SignUp />
  }

  return <div>Welcome!</div>
}
```

## JavaScript API Usage

The Clerk instance provides several methods to control the `<SignUp />` component:

### `mountSignUp()`

Renders the `<SignUp />` component to an HTML `<div>` element.

```typescript
function mountSignUp(node: HTMLDivElement, props?: SignUpProps): void
```

Example:
```javascript
import { Clerk } from '@clerk/clerk-js'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const clerk = new Clerk(clerkPubKey)
await clerk.load()

document.getElementById('app').innerHTML = `
  <div id="sign-up"></div>
`

const signUpDiv = document.getElementById('sign-up')
clerk.mountSignUp(signUpDiv)
```

### `unmountSignUp()`

Unmounts and cleans up an existing `<SignUp />` component instance.

```typescript
function unmountSignUp(node: HTMLDivElement): void
```

Example:
```javascript
const signUpDiv = document.getElementById('sign-up')
clerk.mountSignUp(signUpDiv)
// ... later ...
clerk.unmountSignUp(signUpDiv)
```

### `openSignUp()`

Opens the `<SignUp />` component as an overlay at the root of your HTML body.

```typescript
function openSignUp(props?: SignUpProps): void
```

Example:
```javascript
const clerk = new Clerk(clerkPubKey)
await clerk.load()
clerk.openSignUp()
```

### `closeSignUp()`

Closes the sign-up overlay.

```typescript
function closeSignUp(): void
```

Example:
```javascript
clerk.openSignUp()
// ... later ...
clerk.closeSignUp()
```