# amit-brahmbhatt.dev

Personal site — blog, project showcase, and idea garden. Built with [Astro](https://astro.build), deployed on [Cloudflare Pages](https://pages.cloudflare.com).

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

## Adding content

- **Blog post:** add a Markdown file to `src/content/blog/` with frontmatter:
  ```yaml
  ---
  title: "Your title"
  description: "One-line summary."
  pubDate: 2026-09-17
  tags: ["ai"]
  ---
  ```
- **Project:** add an entry to `src/data/projects.ts`
- **Sync all GitHub repos:** `python3 scripts/sync-repos.py` pulls every public repo
  from `amitb-gpu` and `amitb-quantum` (descriptions + topics) and regenerates
  `src/data/projects.ts`. Re-run anytime you push new repos. Featured homepage
  picks are controlled by the `FEATURED` set at the top of the script.
- **Idea:** add an entry to `src/data/ideas.ts`
- **Bio / links:** edit `src/data/site.ts` (confirm the GitHub username there)

## Deploying to Cloudflare Pages (free)

1. Push this repo to GitHub.
2. In the [Cloudflare dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Select the repo. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Deploy. Every push to `main` redeploys automatically; PRs get preview URLs.

## Connecting the custom domain

1. Buy `amit-brahmbhatt.dev` at [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) (~$12/yr) or [Porkbun](https://porkbun.com) (~$12.87/yr).
2. In the Pages project → **Custom domains** → **Set up a custom domain** → enter `amit-brahmbhatt.dev`.
3. Cloudflare provisions DNS + HTTPS automatically (`.dev` is HSTS-preloaded, so HTTPS is mandatory — handled for you).

## Cost

- Domain: ~$12–14/year
- Hosting (Cloudflare Pages): $0
