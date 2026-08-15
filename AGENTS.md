<!-- aikit:begin - managed baseline, do not edit -->

## Baseline

Shared rules for every repo. Apply to any stack.

### Commits

- Format: [Conventional Commits](https://www.conventionalcommits.org) - `feat:`, `fix:`, `chore:`, `style:`, `refactor:`, `test:`, `docs:`
- Subject line only, ideally under 50 characters
- Human, direct tone. Avoid formal or robotic voice ("this commit introduces…", "this change implements…")
- **Never** add `Co-Authored-By` or any mention of Claude / AI / agents
- **Never** add a description or body - subject only
- Commit incrementally when a logical chunk lands - don't batch everything at the end

### Pull Requests

- Always draft (`gh pr create --draft`)
- Title in English, same shape as a commit subject: Conventional Commits format (`feat:`, `fix:`, `refactor:`…), ideally under 50 characters. Repos squash-merge, so the title becomes the commit on the default branch
  - ✅ `refactor: reorganize agent context into .agents/`
  - ❌ `Reorganize agent context into .agents/ and update Laravel/Boost`
- Base branch: the repo's default
- If the repo has a `.github/PULL_REQUEST_TEMPLATE.md`, fill it in as the PR body and check off the items that apply. `gh pr create` ignores the template unless you pass it yourself - write the filled body to a file and use `--body-file`
- **Never** reference Claude / AI / agents in title, body, branch name, or comments
- The description states only what the PR does in its final form. Leave out the history, the decisions behind it, planned follow-ups, and any term that needs outside context. A stranger reading it should get what it does, nothing else
- When new commits change what the PR does, update the title and description to match
- Add a brief **How to test** note when the steps are easy to state; if they aren't clear, ask instead of guessing

### Pre-push checks

Standard order before pushing:

1. Formatter → 2. Linter → 3. Static analysis → 4. Tests

Exact commands are repo-defined (see the repo's `CLAUDE.md` / `AGENTS.md` / `composer.json` / `package.json`). If the formatter modifies files, commit those changes before pushing so CI doesn't kick back automated `style:` cleanup commits.

For long tasks, run only affected checks during the work and defer the full suite to the end. For short tasks, skip intermediate runs.

### Security

- Never commit `.env`, credentials, tokens, or any secret - check diffs for hardcoded values, not just filenames
- Never read or commit protected files: `.env*`, `auth.json`, `AuthKey_*.p8`, `*.pem`, `*.key`, service-account `*.json` credentials
- Flag any new dependency as suspect before adding it (typosquatting, unknown maintainer)
- No destructive operations (`force-push`, branch deletion, history rewrite, `git reset --hard`, `rm -rf`) without explicit confirmation from the dev
- For external tools (CI, pastebins, gists): consider whether uploaded content could be sensitive - it may be cached or indexed even if later deleted

### Code style

- Follow existing patterns before introducing new ones; reuse existing components/helpers before writing new ones
- Comments and identifiers in **English**
- No comments unless explaining a non-obvious **why** (a hidden constraint, a subtle invariant, a workaround for a specific bug). A well-named identifier beats a comment explaining the "what"
- **Don't document changes in comments.** A comment describes the code as it is, not how it got there:
  - ❌ `// moved from backend to frontend`
  - ❌ `// renamed from foo to bar`
  - ❌ `// replaces the previous logic that used X`
  - ❌ `// added for issue #123`
  - ✅ omit it - git log / PR tells the story
- Don't reference callers or temporal context: no `// used by X`, `// for the Y flow`, `// added in sprint Z`
- Never hand-edit generated files (types, route helpers, lockfiles) - rerun the generator instead

### Writing

Applies to everything written - code, comments, commits, PRs, docs, UI copy.

- Use a plain hyphen `-`, never em or en dashes (`—`, `–`). They read as AI-generated.
- Prefer straight quotes (`"` `'`) over curly ones, and regular spaces over non-breaking spaces.

### Docs & rules

Write docs, READMEs, and rule files as the **final state**, for a reader with no prior context. Keep them brief - don't over-explain.

- Don't narrate history - what something replaces, used to be, or was added for. Git history and PRs carry that story
- Don't situate a file among its siblings ("pairs with `x.md`", "like `y.md`"). Files move; each doc stands alone
- Reference another file only when the reader must **act on it**, and by what it contains

### Reply style

- Concise. Skip the obvious
- End-of-turn summary: one or two sentences - what changed, what's next
- No long essays, no unnecessary disclaimers, no "sure, happy to help…"

### Overrides

- Personal override (gitignored): `CLAUDE.local.md` for Claude Code; `AGENTS.override.md` for Codex (replaces `AGENTS.md` for that machine - start it by copying `AGENTS.md`). Cursor personal rules live in its User Rules setting, not in a file
- Per-repo override: add rules below the imports in `CLAUDE.md` and below the managed block in `AGENTS.md`
- Permanent override: PR to the aikit repo

---

## JavaScript / TypeScript

Code-writing rules for JS/TS files. Apply when writing or editing JS/TS code.

### Types

- TypeScript in strict mode. Don't disable strict checks per file.
- Avoid `any` - use `unknown` and narrow, or a precise type.
- Add explicit return types to exported functions.

### Syntax

- Named exports over default exports (except where a framework requires default, e.g. an Inertia page).
- Use curly braces for every control structure, even single-line bodies.

### Formatting values

- Format dates and amounts through the project's shared formatter helpers, never inline `toLocaleDateString()` / `toLocaleString()`.
- Parse API dates as ISO 8601 (`new Date(iso)`); the backend never pre-formats.

### Package manager

- Prefer **pnpm** over `npm` or `yarn`. Use the shorthand without `run`: `pnpm test`, not `pnpm run test`.

### Scripts

- Prefer the repo's `package.json` scripts over invoking the underlying tool directly.

### Avoid

- Mutating arguments or inputs - take them immutable, return new values.

---

## React

React/TSX conventions. Tiers run from **Essential** (non-negotiable) to **Use with caution** (judgment calls).

### Essential

- One exported component per file; small private sub-components can share it.
- Component files are PascalCase, matching the export (`VotesFilter.tsx`); other files - hooks, utils - are kebab-case (`use-validators.ts`).
- Components use named exports - except where a framework requires a default (Inertia / Next.js pages).
- Name the props type after the component with a `Properties` suffix (`ButtonProperties`), not an inline anonymous shape.
- When a component wraps a host element, extend that element's props so callers can pass native attributes through: `type ButtonProperties = React.ComponentPropsWithoutRef<'button'> & { … }` (use `Omit<…>` to replace one).
- Callback props are named `onX` (`onChange`, `onConfirm`); a component's own internal handlers are named `handleX` (`handleSelectPage`).
- Rendering is pure: compute the JSX from props and state without side effects or mutating them. Side effects belong in event handlers or effects.

### Strongly recommended

- Render list items as named subcomponents (`UsersTable` → `UsersTableRow`), not inline markup inside a `.map()`. Passing the item down or wiring a handler per row is the signal to extract.
- Group code by feature/domain (`domains/vote/{components,hooks,utils}`), not by technical type spread across the app.
- Cross-domain code lives in one dedicated shared area (`shared/`, `app/`), not inside a feature folder. Shared primitives keep plain names (`Button`, `Modal`) - their location, not a prefix, marks them as shared.
- Co-locate tests with the code they cover as `*.test.tsx`.
- One source of truth per piece of state - don't copy props into state.
- Name from general to specific so siblings group together (`SearchInput`, `SearchButton` - not `InputSearch`).

### Recommended

- Order a component file: imports, types, then the component - inside it, hooks → derived values → handlers → `return`.
- For shared context, pair an `XProvider` with a `useXContext` hook that throws when used outside the provider, instead of exporting the raw context.

### Use with caution

- Prefer typing the props parameter over `React.FC` - it mainly adds an implicit `children` you usually don't want.
- Reach for context only for genuinely cross-cutting state - passing a couple of props is not prop-drilling.

---

## UI

Universal UI rules for any stack that renders an interface, web or native.

### Images

- An image never sits on a blank box while loading or after failing. Give its container a placeholder that fits the context: a background color token (or the image's dominant color when known), an image icon or subtle texture for content images, or a skeleton when the surrounding UI already uses them.
- Reserve the space (fixed dimensions or aspect ratio) so the layout doesn't shift when the image lands.
- Prefer the stack's dedicated image component with placeholder support (e.g. `expo-image` with a blurhash/thumbhash `placeholder` and a short `transition`) over a bare image tag.

---

## Expo / React Native

Conventions for Expo and React Native apps.

### Platform fidelity

- Platform-native first: follow the [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines) on iOS and [Material 3](https://m3.material.io) on Android. One codebase, two native feels - when the platforms disagree, diverge per platform instead of shipping a compromise.
- Reach for the primitive that carries the system behavior before building anything: native stack and native tabs from expo-router, native search bars, form sheets with detents, @expo/ui (SwiftUI / Jetpack Compose) controls, expo-symbols, expo-haptics, platform colors.
- Imitating a native component or system transition in JS is a last resort. Preference order: built-in primitive > @expo/ui > maintained native wrapper > write an Expo Module (Swift/Kotlin). Fall back to a JS imitation only when none of those is viable, and say so explicitly instead of deciding it silently.
- Native in behavior, the app's tokens in color: keep the native control but paint its chrome through the design tokens where the platform exposes it (e.g. Android tab bar background/indicator/tint) - never ship the platform's default theme colors. On iOS, system bars stay unpainted (Liquid Glass owns them).
- Preserve the system behaviors people expect: back edge-swipe and large-title morph on iOS; predictive back, edge-to-edge and ripple (`android_ripple`, never opacity) on Android; haptics through the platform's semantic constants on both.
- Track the current design languages: Liquid Glass on iOS (no custom bar backgrounds or tints, content scrolls edge-to-edge under bars, concentric corners) and M3 Expressive on Android (color roles - never hardcoded color pairs, spring motion, 48dp touch targets).
- App icons come from the platform pipelines: layered Icon Composer icons on iOS, adaptive icons with a monochrome layer on Android.

### Styling - NativeWind

- Style with Tailwind utilities via `className` (NativeWind). Prefer semantic role tokens (`bg-background`, `text-muted-foreground`) over raw Tailwind colors or hex; an arbitrary value is fine for a deliberate one-off.
- Design tokens have one source of truth, are named by role - not by place or caller - and carry light + dark. Dark mode follows the system; a recurring color role gets a token, a one-off can use `dark:`, a data-driven color belongs in `vars()`.
- When a component won't take `className`, stop at the first that fits: forward it to the inner primitive > [`remapProps`](https://www.nativewind.dev/docs/api/remap-props) > [`cssInterop`](https://www.nativewind.dev/docs/api/css-interop) > plain `style`/`StyleSheet` (fine when none fit, or the value is computed at runtime).
- Screen-edge spacing uses the safe-area utilities (`pt-safe`, `px-safe`, `*-safe-or-[n]`), not hand-wired inset math.
- On `TextInput`, avoid line-height-bearing text classes (`text-base`, `text-sm`) - their `lineHeight` mis-positions the text vertically on iOS; use a font-size-only value (`text-[16px]`).
- `useColorScheme` comes from `nativewind`, not `react-native`.

### Plumbing

- Never hardcode API URLs or endpoints - resolve them through the project's route helpers / generated routes.
- App-side API types come from the backend's generated types; regenerate and commit them when the API changes, never hand-edit.
- All user-facing copy goes through i18n; every locale changes in the same PR. Never `t('key', { defaultValue: '...' })` - a missing key must fail loudly.
- Permissions render backend decisions (flags on the payload); never recompute permission logic client-side.
- Report significant failures to Sentry, not only the console.

<!-- aikit:end -->

<!-- aikit:project:begin - synced from .agents/*.md - edit those files and run aikit update -->

## Proyecto

App móvil y sitio web para rezar el Santo Rosario: multiidioma (español, inglés y latín),
con audio, Apple Watch y una progresión que ayuda a la constancia sin gamificar la
oración. Fidelidad total a lo que la Iglesia católica enseña.

Monorepo con pnpm:

- `app/` - app móvil con Expo y React Native (incluye el target de watchOS cuando exista)
- `site/` - sitio en Astro
- `packages/content` - todo lo que se reza: oraciones, misterios, formas regionales, con
  su fuente
- `packages/engine` - el motor del Rosario: lógica pura que produce la secuencia de pasos

### Antes de tocar contenido litúrgico, leer la fuente

`docs/referencias/rosario-doctrina.md` es la fuente de verdad de todo lo que se reza y de
cómo se reza: magisterio, estructura, variantes regionales, textos completos en latín,
español e inglés, indulgencias y sus condiciones. **Ningún texto se escribe de memoria.**
Si no está ahí ni en una fuente citable, no entra.

### When to read what

- Antes de diseñar progresión, rachas, logros o cualquier métrica: `docs/gamificacion.md`
  y `docs/referencias/ripperger-y-gamificacion.md`. Este producto tiene reglas duras al
  respecto.
- Antes de decidir en qué superficie vive una feature: `.agents/superficies.md`.
- Antes de escribir cualquier texto que un usuario vaya a leer: `docs/voz.md` y el skill
  `voz`.
- Antes de tocar el reloj, el audio o el stack: `docs/referencias/tecnica/`, que trae lo
  verificado y lo que puede no funcionar.
- Antes de implementar una task: leerla completa en `docs/tasks/` y auditar su alcance
  contra el código actual.
- Stack y versiones: `.agents/stack.md`. Comandos: `.agents/commands.md`.
- Lo que falta decidir (nombre, identidad, modelo económico, voces): `docs/DECISIONES.md`.

### Plan de producto

`docs/PLAN.md` (visión y principios), `docs/FEATURES.md` (mapa), `docs/ROADMAP.md` (orden
y tasks), `docs/tasks/` (specs). El ciclo que cierra una feature es el skill
`ciclo-completo`.

`competencia/` tiene el análisis del mercado: qué hace cada app, qué le reprochan sus
usuarios, y dónde están los huecos.

---

## Comandos

### Raíz

- `pnpm check` - lo que corre antes de subir: lint, tipos y pruebas
- `pnpm test` - pruebas de los paquetes de contenido y motor
- `pnpm typecheck` - tipos de todo el monorepo
- `pnpm format` - formato

### App

- `pnpm app` - servidor de desarrollo de Expo
- `pnpm app:ios` / `pnpm app:android` - compilar y correr en dispositivo o simulador
- `pnpm app:check` - tipos, lint y formato de la app

### Sitio

- `pnpm site` - servidor de desarrollo de Astro
- `pnpm site:build` - compilar
- `pnpm site:check` - revisión de Astro

### Paquetes

- `pnpm --filter @rosario/content test` - pruebas del contenido litúrgico
- `pnpm --filter @rosario/engine test` - pruebas del motor
- Una sola prueba: agregar `-- -t "nombre"`

---

## Convenciones

Reglas que aplican en la mayoría de las tareas.

### Contenido litúrgico

- **Ningún texto de oración, misterio o meditación se escribe de memoria ni se genera.**
  Sale de `docs/referencias/rosario-doctrina.md` o de una fuente citable, y guarda esa
  fuente en el dato.
- **Se distingue siempre** magisterio, liturgia y tradición piadosa. Las quince promesas
  se muestran con su origen y sin lenguaje de garantía.
- **Las indulgencias se describen, no se otorgan.** La app nunca marca una indulgencia
  como conseguida ni promete efectos sobrenaturales.
- **Lo esencial del Rosario no es configurable**: misterio, Padrenuestro, diez Avemarías y
  Gloria. Lo demás es marco regional.

### Progresión

- Se cuentan actos (rosarios, decenas, días, minutos), nunca gracias.
- Sin tablas de posiciones, sin comparar con otras personas, sin rachas que se pierdan con
  drama, sin notificaciones de pérdida.
- Todo lo lúdico se puede apagar y la app sigue completa.
- Antes de dar por buena una pantalla de progresión, se pasa la prueba de
  `docs/gamificacion.md`.

### Privacidad

- Lo que alguien reza **no sale de su dispositivo**. Sin analítica de comportamiento, sin
  cuentas, sin servidor por defecto.
- Los permisos (micrófono, salud, notificaciones) se piden en el momento en que se usan y
  con una explicación de para qué.

### Código

- Package manager: **pnpm** en todo el monorepo.
- `packages/content` y `packages/engine` son lógica pura: sin React, sin Expo, sin Astro,
  con pruebas completas. La app y el sitio los consumen.
- Tipos estrictos, sin `any`. Los identificadores de oraciones y misterios son estables:
  no se renombran.
- Código, comentarios, nombres de test y commits en inglés; documentación en español.
- Fechas y horas: el diario guarda la fecha local de quien reza, no UTC. Un Rosario de las
  11 de la noche es de ese día.

### Interfaz

- Modo oscuro primero: se reza de noche.
- Tipografía que crece hasta el máximo del sistema sin romperse.
- Ninguna pantalla del rezo se interrumpe con diálogos, permisos o avisos.
- Estados completos: cargando, error, sin permiso, sin audio descargado, sin conexión,
  primera vez, sesión a medias.
- Nunca un contador sin su misterio a la vista.

### Texto de cara al usuario

Antes de escribir copy, `docs/voz.md` y el skill `voz`. Todo el copy existe en todos los
idiomas activos en el mismo cambio.

### Protegidos

Nunca leer ni commitear `.env*`, credenciales, claves de firma ni certificados.

<!-- aikit:project:end -->

<!-- Project-specific instructions go below. -->
