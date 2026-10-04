# janeys.work

Portfolio and services site for Janey Annis: product & systems thinker specializing in content.

- **Zero dependencies.** A ~100-line Node script (`build.mjs`) renders every page to static HTML in `dist/`. There's nothing to `npm install`, nothing to keep updated, and nothing to break.
- **Content lives in plain JS files** in `src/content/`, so editing a case study is editing text.
- **Visible TODO notes** mark every missing piece of content. The build also writes them all to `CONTENT-TODO.md`.

## Run it locally

Requires [Node.js](https://nodejs.org) 18 or newer.

```bash
npm run dev     # builds, watches for changes, serves http://localhost:4321
npm run build   # one-off build into dist/
```

## Put it on GitHub

1. Create a new, empty repository on GitHub (for example `janeys-work`). Don't add a README.
2. In this folder, run:
   ```bash
   git remote add origin https://github.com/<your-username>/janeys-work.git
   git branch -M main
   git push -u origin main
   ```
   (The folder is already a git repository with one commit.)

## Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repository.
2. Leave the settings as they are. `vercel.json` already sets the build command (`npm run build`) and output directory (`dist`).
3. Click **Deploy**. Every push to `main` redeploys automatically, and pull requests get preview URLs.
4. To use `janeys.work`: in the Vercel project, go to **Settings → Domains**, add `www.janeys.work` and `janeys.work`, then update your DNS records where you bought the domain (Vercel shows exactly which records). Do this after the new site is ready, because it replaces the Squarespace site.

`vercel.json` also redirects your old Squarespace URLs (`/case-studies`, `/work-with-me`, `/contact-janey`, `/work-archives`) to the new pages, so existing links keep working.

**Hiding TODO notes on the live site:** in Vercel go to **Settings → Environment Variables** and add `HIDE_TODOS` = `1`, then redeploy. They'll still show when you run the site locally.

## Where things are

| To change… | Edit |
| --- | --- |
| Name, LinkedIn, email, contact form ID, booking/Ko-fi links | `src/site.mjs` |
| Testimonials, company list, disciplines ticker | `src/site.mjs` |
| Case studies (text, outcomes, links, screenshots, and the hook question, teaser and color used on the Selected Work cards) | `src/content/work.mjs` |
| Services, engagement models, FAQ | `src/content/services.mjs` |
| Bio, principles, experience, fun facts | `src/content/about.mjs` |
| Archive (2020 and earlier) | `src/content/archive.mjs` |
| Page layouts and sections | `src/pages.mjs` |
| Header and footer | `src/layout.mjs` |
| Colors, type, spacing | `public/styles.css` (the `:root` block at the top; dark mode colors are in the `:root[data-theme='dark']` block right after it) |
| Pixel art | `src/art/*.svg` |
| Header art shapes (`pixel-art-1`, `pixel-art-2`, `pixel-art-3`) | `ART_SHAPES` in `src/lib.mjs` |
| Images, PDFs, favicon, social preview image | `public/` |

### Adding a case-study screenshot

1. Save the image in `public/images/work/<case-study-slug>/`, for example `public/images/work/github-sponsors/landing-before-after.png`.
2. In `src/content/work.mjs`, find the highlight and set `src: '/images/work/github-sponsors/landing-before-after.png'`. Keep the `alt` text accurate.

### Adding a case study

Copy one of the objects in `src/content/work.mjs`, give it a new `slug`, and pick one of the pixel compositions for `art`. It shows up on the home page, the Work page and gets its own page automatically.

### Connecting the contact form

1. Create a free form at [formspree.io](https://formspree.io).
2. Copy the form ID (the part after `/f/` in its endpoint, like `xayzabcd`).
3. Paste it into `formspreeId` in `src/site.mjs`.

## Design notes

- **Palette:** cream `#F6F3EC` (background), gray-blue `#DBE0E6` (surfaces), purple `#4F33CC` (accent and links), red `#CC3333` (highlights), charcoal `#4F4F4F` (text).
- **Type:** Bricolage Grotesque (headings), Instrument Sans (body), JetBrains Mono (labels). These load from Google Fonts.
- **Dark mode:** follows the visitor's system setting until they use the pixel sun/moon switch in the header, then remembers their choice.
- **Pixel art:** the hero uses a composition recolored to the site palette. Case studies and other accents keep the original colors. Tiles assemble when they scroll into view and pop on hover, and the hero has a "Shuffle the tiles" button. All motion is turned off for visitors who prefer reduced motion.

### Header art versions

The pixel art at the top of the home, case-study and About pages has three "organic" shapes, and each page load shows a different one from the last:

- **pixel-art-1** (default, also shown if JavaScript is off): builds up from left to right, like a growing chart
- **pixel-art-2**: a mound that builds up in the middle
- **pixel-art-3**: blocky stairs climbing from right to left

To look at one version, add `?art=1`, `?art=2` or `?art=3` to any page address, for example `/?art=2`. To change a shape, edit its line in `ART_SHAPES` in `src/lib.mjs`.

