# CLAUDE.md
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
This projects is intended for a large public use, so we need to be careful with the code and the performance, me and you claude are expert/senior software engineers with mature approaches. Prioritise a good implementation over a quick and dirty one that fixes the issue in the immediate term. concise in our conversations I am a senior dev.
This project use Tauri 2, please refer to the actual documentation. https://v2.tauri.app/. When you use Tauri features, cite the documentation page and section.

Futur Features: 
1. Tabs = Tabs for the current projects (Only the current)
2. Allow Folders = Intelligent reload of tags on external changes. You can take folders and save with CTRL+S or AutoSave.
3. Addon/Patch = This option allows to generate a separate datapack that patches the original one. Containing only the modified files, and for tags intelligent use of replace true/false.

## Development Commands
- **Dev server**: `npm run dev` - Start Vite development server
- **Build**: `npm run build` - TypeScript compilation + Vite build
- **Tauri dev**: `npm run tauri` - Start Tauri development server
- **Preview**: `npm run preview` - Preview production build
- **Lint/Typecheck**: `npm run lint` - Run TypeScript 7 Go compiler without emit for type checking
- **Format**: `npm run biome:format` - Format code with Biome
- **Lint check**: `npm run biome:check` - Check code with Biome linter
- **Auto-fix**: `npm run biome:unsafefix` - Auto-fix with Biome (unsafe)

## Architecture Overview
This is a Desktop Application with React + TypeScript built with Vite, using TanStack Router and Tauri
for routing and Zustand for state management. It's a Minecraft datapack/voxel/mods
editor studio application.

### Core Technologies
- **Build Tool**: Vite 8 with Rolldown
- **Framework**: React 19 with React Compiler
- **Routing**: TanStack Router (file-based routing in `src/routes/`)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query with persistence
- **Styling**: TailwindCSS v4
- **Linting/Formatting**: Biome (replaces ESLint/Prettier)
- **Core Engine**: @voxelio/breeze for datapack/voxel operations

### Project Structure
```
src/
├── components/          # React components
│   ├── layout/         # Layout components (Navbar, Footer, etc.)
│   ├── tools/          # Core editor tools and elements
│   │   ├── concept/    # Component related to a specific concept (recipe, loot, enchantment, etc.)
│   │   ├── elements/   # Generic component for studio with reactive zustand state management
│   │   ├── sidebar/    # Editor sidebar components
│   │   ├── debug/      # Editor debug panels
│   │   └── elements.ts # All data abouts Tabs and Href Navigation elements
│   │   └── Store.ts    # Main Zustand store for configurator state
│   └── ui/            # Reusable UI components (Not Shadcn)
├── lib/               # Utilities and hooks
│   ├── hook/         # Custom React hooks
│   └── utils/        # General utilities
├── routes/           # TanStack Router file-based routes
└── globals.css       # Global styles
```

### Key Architectural Concepts
#### Voxel Studio
- **Main Store**: `src/components/tools/Store.ts` - Central Zustand store
  managing:
  - Voxel elements and datapack compilation
  - Current element selection and editing
  - Registry caching and sorting
  - Route navigation history per concept
- **Query Provider**: TanStack Query for server state with persistence

#### Routing Pattern
- Uses TanStack Router with file-based routing
- Nested layouts with `Outlet` components

#### Internationalization
- use t() function to transtale string allow interpolation with {}, i18n code is in @/lib/i18n.ts.
- All translations are in `src-tauri/resources/locales` folder.

#### Element System
- Powered by `@voxelio/breeze` library for Minecraft datapack operations
- Elements stored in Map with identifier-based keys
- Registry-based organization (recipes, loot tables, textures, etc.)
- Real-time compilation and validation

#### Code Style
- **Biome Configuration**: 4-space indents, 140 char line width, double quotes
- **Import Aliases**: `@/` for src root, `@lib/*` and `@routes/*` for specific
  paths
- **React Patterns**: Uses React 19 features with React Compiler enabled

Rules:
- No code redundancy.
- No "any" type. For type "unknown", it is preferable to request authorization.
- Avoid globalthis.
- Prefer modern and standards logic 2024 abb 2025.
- Methods must be less than 10 lines of code and must do one thing correctly.
- No Legacy or Deprecated support.
- At the end of each sessions, check with `npm run lint`
- Avoid unnecessary re-renders with zustand or React.
- useEffect and useLayoutEffect is completely prohibited; you must ask for permission to use it. https://react.dev/learn/you-might-not-need-an-effect
- useMemo, useCallback are deprecated and are automacly done by React 19.
- useForwardRef is deprecated, use ref as props.
- no .foreach prefer for of or any loop or new set/map ECMAScript 2025 syntax.

It's not mandatory but you can use modern syntax ES2024 like Map.groupby or other thing.
Map -> groupBy()
Object -> map().filter().find().findLast().sort().toSorted().toReversed().fromEntries().groupBy()
Array -> findLast().toSorted().toReversed().with().toSpliced().fromAsync()
Set -> intersection().union().difference().symmetricDifference().isSubsetOf().isSupersetOf().isDisjointFrom()
Nullish Coalescing -> ??
Logical Assignment -> ||=
Float16Array