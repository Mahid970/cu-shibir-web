# cushibir.org — next generation

The new website of **Bangladesh Islami Chhatrashibir, University of Chittagong branch**
(বাংলাদেশ ইসলামী ছাত্রশিবির, চট্টগ্রাম বিশ্ববিদ্যালয় শাখা). It is built to replace the current cushibir.org.

- **Stack:** Next.js 16 (App Router) + Payload CMS 3 + PostgreSQL + Tailwind CSS 4.
- **Design:** the visual language of phitron.io (light grid-paper pages, blue gradient highlights, yellow call to action,
  deep night sections, lively motion), adapted for a student organisation: real campus photos, news and statements first,
  people and history over sales-style stats. Details in `docs/design/phitron-system.md`.
- **Content:** Bangla first, English second.
- **Plan:** research, targets and roadmap are in the approved plan (§ numbers in code comments refer to it).

## Quick start (local development)

Requires Node 20+ (tested on 24). No Docker needed. The dev database is a real PostgreSQL 18 run by
[`embedded-postgres`](https://github.com/leinelissen/embedded-postgres).

```bash
npm install
cp .env.example .env          # then fill PAYLOAD_SECRET, SEED_ADMIN_PASSWORD, REVALIDATE_SECRET
npm run db                    # terminal 1 — starts Postgres on :54329 (keep running)
npm run seed:admin            # creates the local super-admin from .env
npm run import:legacy         # imports public content from the old cushibir.org API
npm run og:backfill           # renders Bangla share cards for imported posts
npm run dev                   # terminal 2 — http://localhost:3000 (CMS at /admin)
```

The first `npx playwright install chromium` is needed for share images and e2e tests.

## Scripts

| Script | What it does |
|---|---|
| `npm run db` | Local Postgres (data in `.data/pg`, gitignored), with `pg_trgm` and `pgcrypto` |
| `npm run seed:admin` | Creates the first super-admin (dev only; refuses in production) |
| `npm run import:legacy` | Idempotent import of posts, leaders, press links, videos and gallery from the legacy API. Re-run safe. `-- --dry-run` to preview |
| `npm run og:backfill` | Generates share cards for posts missing one (`-- --all` to regenerate). Fonts: `src/assets/fonts` (Hind Siliguri, OFL) |
| `npm run search:reindex` | Rebuilds the posts' search index (after an import or a change to the normaliser) |
| `npx tsx scripts/make-icons.ts [logo]` | Regenerates the app icons in `public/icons` (run again with the vector logo) |
| `npm run test:int` | Vitest: Bangla utilities, encryption, form validation, API smoke test |
| `npm run test:e2e` | Playwright: home, English page, redirects, SEO shell, search, forms, syllabus, admin |
| `npm run lint` / `npm run typecheck` | ESLint (next flat config) / `tsc` |
| `npm run generate:types` | Regenerate `src/payload-types.ts` after changing collections |
| `npm run payload migrate:create <name>` | New migration after a schema change (production applies them on start) |

## Architecture

```
src/
  app/(frontend)/(bn)/   Bangla site, root layout lang="bn" (RSC, ISR 1h + on-demand purge)
    page.tsx             home: ticker, photo hero, milestones, news, campaigns, CUCSU, ৫ দফা, gallery + videos, leaders
    about/ leadership/[slug] news/[slug] gallery/[slug] videos/ press/
    join/ supporter/ feedback/         forms (server actions, encrypted)
    services/ assistance/ status/ campus/
    syllabus/[level]/    কর্মী / সাথী / সদস্য with an on-device reading checklist
    martyrs/             শহীদ স্মরণ (hidden until entries are published)
    search/ (+ suggest/) site search
    offline/ privacy/ events/ (placeholder, Phase 3)
    blog_details/ responsible/         legacy id → new URL redirects
    next/revalidate/ next/health/      cache purge for scripts, health check
  app/(frontend)/(en)/en English overview, root layout lang="en"
  app/(payload)/         Payload admin + REST/GraphQL (generated — don't edit)
  app/sitemap.ts robots.ts manifest.ts
  collections/           Posts, People, Martyrs, PressCoverage, Videos, Albums, Media, Users
  collections/forms/     Supporters, Feedback, Assistance (encrypted personal data)
  globals/SiteSettings   tagline, hero photo + intro, contact, socials
  access/                roles + access helpers (super-admin, admin, editor, contributor, …)
  fields/encrypted.ts    AES-256-GCM text field, decrypted only for permitted roles
  hooks/                 ensureSlug (Latin slugs), revalidate (cache tags)
  jobs/                  generateShareImage (on publish), purgeSubmissions (daily retention)
  migrations/            production schema (dev pushes the schema directly)
  lib/bn.ts              Bangla toolkit — grapheme-safe splitting, digits, Dhaka dates, transliteration → slugs
  lib/crypto.ts          field encryption, blind index, tracking codes
  lib/forms/             validation, anti-abuse guard, server actions
  lib/search.ts          posts via a normalised index + small collections in memory
  lib/campus.ts          CU faculties, departments, halls, sessions
  lib/og/                share-card HTML + Chromium renderer
  components/            home/, campus/ (3D scene, poster, tiers), about/ (rail timeline, particle emblem),
                         content/, forms/, syllabus/, ui/, motion/, art/, layout/ (incl. SearchPalette)
  lib/sky.ts             prayer times and time-of-day sky palettes for the campus scene
  content/               copy not in the CMS: home.ts, en.ts, history.ts, syllabus.json
public/sw.js             service worker: offline reading, cached assets and images
scripts/                 dev DB, seed, legacy import, share-image backfill, search reindex, icons
docs/                    design system, deploy guide, spikes
```

### Key decisions

- **Bangla-safe animation.** Text is split with `Intl.Segmenter`. It also merges clusters after a
  hasanta, so যুক্তাক্ষর never break on older engines. See `splitGraphemes()` and its tests.
- **Share images use Chromium, never `next/og`.** Satori misplaces ি/ে-kar and breaks conjuncts.
  Evidence is in `docs/spikes/og-bangla.md`. Cards are rendered in a background job on publish.
- **Latin slugs.** URLs like `/news/islami-andolon-o-allahor-sathe-chukti` share cleanly on Facebook. The title stays Bangla.
- **Cache purge uses `revalidateTag(tag, { expire: 0 })`.** Next 16's `'max'` profile would serve one stale
  response after publish.
- **Contributors can only save drafts.** Editors and admins publish. Trusted server scripts are not restricted.
- **Personal data is encrypted field by field** (AES-256-GCM, `FIELD_ENCRYPTION_KEY`):
  - Names, phone numbers and messages are unreadable in the database and in backups.
  - Duplicate checks use a keyed hash, never the number itself.
  - The public cannot create submissions through the REST API; only the site's server actions can.
  - Finished submissions are deleted after a year (`jobs/purgeSubmissions`), as `/privacy` promises.
  - The legacy form's parents' names, district and thana are no longer collected.
- **Two root layouts.** `(bn)` and `(en)` each render their own `<html lang>`. Switching language reloads the page, which is fine for two languages.
- **Payload's client-hint headers stay on `/admin`.** Payload adds `Critical-CH` to every path by default. On public pages that
  doubles first navigations in Chrome, splits the CDN cache and breaks service-worker registration (see `next.config.ts`).
- **Search needs no extra service.**
  - Posts carry a normalised `searchText` (NFC, Bangla digits → Latin, no ZWJ).
  - Payload's `like` matches every word.
  - People, albums, videos, press and campus lists are searched in memory.
- **Weight budget.** Production build, Pixel-class phone, measured 2026-09-26:
  - Homepage transfer is about 700 KB including photos (old site: 3.7 MB).
  - Initial JS is 173 KB gzipped, most of it React and the Next.js router. The site's own home code is about 10 KB.
  - Fonts are about 170 KB: Hind Siliguri 400/600/700 (Bangla), preloaded, plus Montserrat (Latin), not preloaded.
  - The 3D campus chunk (three.js, about 138 KB gzipped) and the prayer-time maths load only when their section comes near.
- **Lighthouse (mobile, simulated 4G, 4× CPU)**, measured 2026-09-26:

  | Page | Performance | Accessibility | Best practices |
  |---|---|---|---|
  | Home | 79–86 | 100 | 100 |
  | Other pages | 86–91 | 96–100 | 100 |

  - CLS is 0 everywhere. Blocking time is 40–200 ms.
  - The simulated LCP (3.5–4.6 s) is limited by the Bangla fonts and the React runtime sharing bandwidth. A real throttled Chromium paints the LCP at about 1.9 s.
  - How the numbers were improved:
    - Above-the-fold text rises in without fading (`load-rise`, `title-now`), so it never waits for a script.
    - Far home sections use `content-visibility: auto`.
    - The first news cards skip the reveal.
- **Motion** is CSS plus one observer (`components/motion/RevealObserver`) for the page chrome:
  - Elements opt in with `data-reveal` and animate **once**.
  - Nothing re-hides or stays blurred.
  - `prefers-reduced-motion` turns it all off.
- **Phase 2 layer**:
  - **Living campus** (home, `components/campus`):
    - A procedural three.js scene, no model files: hills, forest, the shuttle line and train, campus blocks, কাটা পাহাড়.
    - The sky follows Chattogram time, and the next prayer time is shown (`lib/sky.ts`: Karachi method, Hanafi Asr).
    - Device tiers: an SVG poster for reduced motion, Save-Data, ≤2 GB or software GPUs; a lighter scene for phones; the full scene elsewhere.
    - Rendering pauses off-screen. `?campus3d=0|1|2` and `?campusHour=` are QA overrides.
  - **Particle emblem** (About): a 2D canvas. The logo's pixels gather from scattered stars, then re-form as the slogan, drawn with the page's Bangla font.
  - **Rail timeline** (About): the history as stations on the shuttle line. It is pinned and scroll-driven on large screens and a vertical list elsewhere.
  - **View transitions**: news card image → article hero, and leader photo → profile, with React `<ViewTransition>`.
  - **শহীদ স্মরণ** (`/martyrs`): a calm constellation plus a full list. It stays a 404 until the branch publishes verified entries.
- **Design rules** (keep them when adding pages):
  - Real photos of students beat illustrations.
  - One yellow button per screen, for the main action.
  - Red only for statements.
  - Labels and eyebrows in Bangla.

## Environment

Every variable is listed with its purpose in [`.env.example`](.env.example). Production deployment:
[`docs/deploy.md`](docs/deploy.md).

## Launch checklist

- [x] Migrations instead of dev "push" (applied on start); standalone Docker image with Chromium; compose stack with backups.
- [x] 301 redirects from every legacy route, including id-based `/blog_details/:id/:slug` and `/responsible/people/:id`.
- [x] Encrypted supporter, ehtesab and assistance forms; privacy policy; retention job.
- [x] Sitemap, robots, hreflang, web manifest, offline reading.
- [ ] Deploy to the VPS and put Cloudflare in front (DNS, WAF, cache rules, Access on `/admin`, Turnstile). See `docs/deploy.md`.
- [ ] Generate `FIELD_ENCRYPTION_KEY` for production and store a copy offline.
- [ ] Get the **vector logo** and full-resolution leader photos from the branch. Several legacy photos are only 180–256 px wide.
  Then re-run `scripts/make-icons.ts`.
- [ ] English names for the committee (CMS → People → English). Positions already have English fallbacks.
- [ ] Branch to verify the history stops (`src/content/history.ts`) and send the verified শহীদ list (CMS → শহীদ স্মরণ).
- [ ] Keep the legacy report builder running at `report.cushibir.org` until it is replaced.
