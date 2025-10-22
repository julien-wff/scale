# Project Scanner UI (SvelteKit + shadcn-svelte)

This app lets you upload project requests as PDFs and browse parsed opportunities in a clean list, with filters in a sidebar.

Tech: SvelteKit (Svelte 5), Tailwind CSS v4, shadcn-svelte, lucide-svelte, Bun.

## Quick start

```bash
# install deps
bun install

# run dev
bun run dev

# build / preview
bun run build
bun run preview
```

Open http://localhost:5173.

## Configure the API

Set your backend base URL so the UI can load and upload projects:

Create a `.env` file at the project root with:

```
PUBLIC_API_URL=https://your-api.example.com
```

If `PUBLIC_API_URL` is not set, the UI falls back to a local mock at `static/mock/projects.json` so you can see the UI immediately.

## UI notes

-   Sidebar filters: search, technology, and priority range.
-   Upload button (top-right): opens a Sheet to upload a PDF to `POST ${PUBLIC_API_URL}/projects/upload`.
-   List items show name, company (if present), tags, start date, duration, short description, and a temperature bar.

## shadcn-svelte components

Added components include: button, input, badge, card, separator, scroll-area, progress, tooltip, sheet, sidebar, skeleton, textarea, select, label, form, avatar, breadcrumb.

Use Bun to add more components if needed:

```bash
bunx --bun shadcn-svelte add <component>
```

Icons are from `@lucide/svelte` — import per-icon:

```ts
import Plus from '@lucide/svelte/icons/plus';
```

## File map

-   `src/lib/api.ts` – tiny client for fetching and uploading projects.
-   `src/lib/types.ts` – types and mapper to the UI list shape.
-   `src/lib/components/AppSidebar.svelte` – sidebar with filters.
-   `src/lib/components/ProjectCard.svelte` – card used in the list.
-   `src/routes/+page.{ts,svelte}` – data load and main page UI.

## Troubleshooting

-   If shadcn CLI warns about Node version on Bun, you can still proceed — components will be added correctly.
-   If upload fails, verify `PUBLIC_API_URL` and CORS for the endpoint `/projects/upload`.
