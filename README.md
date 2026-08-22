# Edwin Kimsal Portfolio

A data-driven React + TypeScript portfolio designed for GitHub Pages.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build`.

## Update content

Edit the JSON files in `src/data/`:

- `about.json` controls the introduction, links, education, and contact details.
- `experiences.json` controls work and teaching entries.
- `projects.json` controls project cards and detail pages.
- `skills.json` controls skill categories and badges.

Entries use an `id` as their slug. The shared repository and components automatically generate cards and hash-based detail URLs such as `#entry/targeting-system`.

## GitHub Pages

The included `.github/workflows/deploy.yml` deploys `dist/` automatically on pushes to `main`. In the repository settings, set Pages' source to **GitHub Actions**.