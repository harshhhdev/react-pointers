![image](https://qursor.harshsingh.me/og.png)

<p align="center">
  <a href="#">
    <h2 align="center">Qursor</h2>
  </a>
</p>

<p align="center">Plug n' play cursors for React.</p>

### About

This is the monorepo for Qursor, a tiny library for using custom components as cursors in React applications with built-in cursor state management.

### Packages

- **core**: `qursor` — the main React library with cursor components and hooks.

### Apps

- **web**: official demo website and documentation (`apps/web`).

### Install

```bash
npm install qursor
# or
pnpm add qursor
# or
bun add qursor
```

### Monorepo development

Requirements: Node >= 18.

```bash
git clone https://github.com/harshsingh/Qursor
cd qursor
bun install

# develop demo app and packages
bun run dev

# build all packages/apps
bun run build

# type-check and lint
bun run check-types
bun run lint
```

Scripts are powered by Turborepo and run across workspaces. See `package.json` and `turbo.json` for details.

### Usage

```tsx
import { CursorProvider, CursorTarget, useCursor } from "qursor";
import "qursor/styles.css";

// Define cursor variants
const variants = {
  default: ({ isHidden }) => (
    <div className={`default-cursor ${isHidden ? "hidden" : ""}`} />
  ),
  hover: ({ isHidden }) => (
    <div className={`hover-cursor ${isHidden ? "hidden" : ""}`} />
  ),
};

function App() {
  return (
    <CursorProvider variants={variants}>
      {/* Declarative approach */}
      <button data-cursor="hover">Hover me!</button>

      {/* Component approach */}
      <CursorTarget variant="hover">
        <div>Interactive element</div>
      </CursorTarget>
    </CursorProvider>
  );
}
```

*** 

Built by [Harsh Singh](https://harshsingh.me)
