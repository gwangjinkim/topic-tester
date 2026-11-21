# Pinterest topic tester

A tiny static site that turns Pinterest demand into measurable topic tests. Each topic gets one page, one email capture and one UTM-tagged Pinterest link. Agents handle research, copy and weekly analysis; you keep the publishing decisions.

## Which free host should you use?

**My pick: Cloudflare Pages.** It has the most predictable free tier for this exact job: no credit pool that can pause your account, built-in Web Analytics, and enough headroom for a few hundred topic pages.

Current free-plan facts, checked 21 Nov 2026:

| Host | Free allowance that matters here | Watch out for | Best for |
|---|---|---|---|
| **Cloudflare Pages** *(recommended)* | 500 builds/month, 1 concurrent build, 100 custom domains per project, 20,000 files, 25 MiB per file, 100 projects per account, unlimited bandwidth claim | Build timeout is 20 minutes; new projects are rate-limited in your first 48 hours | This kit, static pages, built-in analytics |
| **Vercel Hobby** | 1M CDN requests/month, 100 GB data transfer/month, 50K Web Analytics events/month, unlimited deployments, 1 developer seat | Basic build minutes are included but usage-based; Pro adds flat-rate CDN | Next.js / React projects |
| **Netlify Free** | 300 credits/month shared across deploys, compute, bandwidth, forms and requests | Hard cap: if one project exceeds it, **all** projects on the account pause until next cycle | Built-in forms, if you watch usage carefully |
| **GitHub Pages** | Free from a public repo, custom domain supported, 1 user/org site plus 1 per repo | Static only, no native forms, functions or analytics; project sites live under `/repo/` | Simplest possible Git-only hosting |

If you only want the absolute simplest setup and do not care about forms or analytics, GitHub Pages works. If you plan to build with React or Next.js later, use Vercel. For this starter, use Cloudflare Pages.

> **Account note:** I can prepare the repo, build, workflow and deploy config, but I cannot create or verify a Cloudflare account for you — that needs your email, identity and acceptance of terms. Once you have an account, going live is a two-secret setup.

## Quick start

```bash
cd pinterest-topic-tester
node build.js
```

Then open `public/index.html` in a browser. No dependencies, no install step. Requires Node 18 or newer.

## Configure it

Edit `site.json` before deploying:

- `baseUrl` — your final site URL, e.g. `https://topic-tests.pages.dev`. For GitHub Pages project sites include the repo path: `https://USER.github.io/REPO/`.
- `formEndpoint` — a free form endpoint such as Formspree, Formsubmit or Tally. Until you set it, the form shows a setup message instead of pretending to work.
- `analyticsToken` — Cloudflare Web Analytics token. Leave empty to disable the script.
- `ctaLabel` and `ctaUrl` — your affiliate link, Gumroad product or booking page.

Edit `topics.json` to add, remove or rewrite topics. Each entry needs `slug`, `title`, `description`, `bullets` and `pinAngle`. Then rebuild.

Or let an agent append a topic directly:

```bash
node scripts/new-topic.js <slug> "Title" "Description" "Pin angle" "bullet one|bullet two|bullet three"
```

It updates an existing slug or adds a new one. Set `TOPICS_FILE` to target a different JSON file for testing.

### Auto-deploy on push

`.github/workflows/deploy-cloudflare.yml` builds and deploys to Cloudflare Pages on every push to `main`.

In your GitHub repo → **Settings** → **Secrets and variables** → **Actions**, add:

- `CLOUDFLARE_API_TOKEN` — a token with Pages edit permission
- `CLOUDFLARE_ACCOUNT_ID` — your Cloudflare account ID

If your Pages project is not named `topic-tester`, edit `--project-name=topic-tester` in the workflow. Then push to `main`; the site deploys itself.

## Deploy

### Cloudflare Pages (recommended)

1. Push this folder to GitHub.
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Build command: `node build.js`
4. Build output directory: `public`
5. Deploy. Optional: enable Web Analytics and paste the token into `site.json`, then rebuild.

Direct upload also works: run `node build.js` locally and upload the `public` folder.

### Vercel

Import the repo. Framework preset: **Other**. Build command `node build.js`, output directory `public`.

### Netlify

New site from Git. Build command `node build.js`, publish directory `public`. Remember the 300-credit shared cap.

### GitHub Pages

Build locally, then publish the contents of `public` to a `gh-pages` branch, or set Pages source to `/public` in your main branch. Set `baseUrl` with the `/REPO/` path so asset links resolve.

## Use it with Pinterest

1. Open a topic page and click **Copy Pinterest link**. It copies a URL tagged with `utm_source=pinterest&utm_medium=organic&utm_campaign=<slug>`.
2. Open `public/pins.csv` for a ready-made brief: slug, title, pin angle and UTM link per topic. Create Pins using the headline and visual direction from `AGENT_PROMPTS.md`.
3. Link the Pin to that topic page, not the homepage.
4. After 14 days, export your analytics and run prompt 5.
5. Keep topics that earn signups. Replace the rest.

## Files

- `site.json` — global config
- `topics.json` — your topic experiments
- `template.html` — topic page layout
- `build.js` — generator, no dependencies
- `scripts/new-topic.js` — append or update a topic from the command line
- `assets/` — styles and UTM/copy-link logic
- `.github/workflows/deploy-cloudflare.yml` — build and deploy on push
- `public/` — generated output, deploy this folder
- `public/pins.csv` — generated Pin brief with UTM links
- `AGENT_PROMPTS.md` — the five agent prompts

## Caveats

Free tiers change; re-check the provider docs before relying on a limit. Do not automate Pin publishing without Pinterest approval. Disclose affiliate links. Keep a human in the loop.
