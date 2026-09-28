# Upkeep

A UK property maintenance product: tenants report issues, a property manager triages and
routes them, landlords approve spend, vendors get dispatched and get it done — one job,
tracked end to end. Two things live in this repo:

1. **The marketing site** ([index.html](index.html)) — a static landing page: a hero, a
   role picker, an interactive "how it works" walkthrough, and a dashboard preview. No
   forms, no backend — every screen it points to is the real product.
2. **The app itself** ([app/](app/)) — a real, working product: a React + TypeScript +
   Tailwind single-page app with a sign-in screen and four routed workspaces (Property
   Manager, Tenant, Landlord, Vendor) sharing one maintenance-job workflow (report → triage
   → approve → assign → complete → confirm). No backend here either — state lives in the
   browser's `localStorage`, seeded with sample data — so it deploys as static files but
   behaves like a real app, not a slideshow.

Both are static and both deploy to GitHub Pages: the marketing site at the site root, the
app at `/app/`.

## Brand system

Both surfaces implement the same design system — one accent (teal), a warm off-white
surface, Plus Jakarta Sans for text and JetBrains Mono for job references/timestamps, pill
shapes for anything clickable, and a four-colour status-pill language (new / pending /
active / done) reused everywhere a job's state is shown. Tokens live in
[assets/css/styles.css](assets/css/styles.css) (marketing site) and
[app/src/index.css](app/src/index.css) (app, as Tailwind v4 theme variables) — keep them in
sync if either changes.

## Run locally

Marketing site — just open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
```

The app — needs Node.js:

```bash
cd app
npm install
npm run dev
```

## Deploy to GitHub Pages

Deployment is automated via [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml):
it builds `app/` and assembles it together with the root static files (marketing site under
`/`, app under `/app/`) into one site, using GitHub's official Pages Actions.

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `GitHub Actions` (not "Deploy from a
   branch" — the app needs a build step).
4. Push to `main` (or run the workflow manually from the **Actions** tab). Your site will
   be live at `https://<username>.github.io/<repo>/` within a couple of minutes, with the
   app at `https://<username>.github.io/<repo>/app/`.

Deep links into the app (e.g. `/app/manager/triage`) work on a direct hit or refresh via
the redirect trick in [404.html](404.html) — GitHub Pages has no server-side router, so
that file stashes the intended path and bounces to the app shell, which restores it before
the app's router mounts. The marketing site's role cards link to `/app/?role=<role>`, which
preselects that role on the sign-in screen.

## Structure

```
index.html                          Marketing site: hero, role picker, how-it-works, dashboard preview
assets/css/styles.css               Marketing site brand tokens and components
assets/js/app.js                    Hero video fade-in + how-it-works tab switching
assets/video/hero-building.mp4      Hero background video (Pixabay Content License, free for commercial use)
404.html                            GitHub Pages SPA redirect for deep links into /app/*
.github/workflows/deploy-pages.yml  Builds app/ and deploys both sites together

app/                                The product: React + TypeScript + Tailwind
  src/index.css                     Brand theme tokens (Tailwind v4 @theme)
  src/lib/                          Data model, seed data, the localStorage-backed store
  src/lib/roles.tsx                 Per-role config: nav items, icons, routes
  src/lib/meta.ts                   Status/urgency → brand colour + label mapping
  src/components/                  Shared UI (JobCard, RoleShell, Badge, form fields...)
  src/routes/                      SignIn + manager/tenant/landlord/vendor pages
```
