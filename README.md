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
| `npm run test:int` | Vitest: Bangla utilities + API smoke test |
| `npm run test:e2e` | Playwright: homepage SEO/a11y basics + admin panel |
| `npm run lint` / `npm run typecheck` | ESLint (next flat config) / `tsc` |
| `npm run generate:types` | Regenerate `src/payload-types.ts` after changing collections |

## Architecture

```
src/
  app/(frontend)/        public site (RSC, ISR, 1h revalidate + on-demand purge)
    page.tsx             home: ticker, photo hero, milestones, news, campaigns, CUCSU, ৫ দফা, gallery + videos, leaders
    news/, leadership/,  live pages
    about/, join/        live pages;  events/ services/ syllabus/ = placeholders
    next/revalidate/     POST cache purge for scripts (x-revalidate-secret)
  app/(payload)/         Payload admin + REST/GraphQL (generated — don't edit)
  collections/           Posts, People, PressCoverage, Videos, Albums, Media, Users
  globals/SiteSettings   tagline, hero photo + intro, contact, socials
  access/                roles + access helpers (super-admin, admin, editor, contributor, …)
  hooks/                 ensureSlug (Latin slugs), revalidate (cache tags)
  jobs/                  generateShareImage (queued on publish; lazy-loads Chromium)
  lib/bn.ts              Bangla toolkit — grapheme-safe splitting, digits, Dhaka dates,
                         legacy date parser, transliteration → URL slugs
  lib/og/                share-card HTML + Chromium renderer
  components/            home/ (one file per homepage section), content/, ui/ (SectionTitle, PageHeader, Icons),
                         motion/ (RevealObserver, CountUp, Marquee), art/ (SVG campus icons), layout/
  content/home.ts        homepage copy not yet in the CMS (milestones, campaigns, ৫ দফা, FAQ)
scripts/                 dev DB, seed, legacy import, share-image backfill
docs/spikes/             technical decisions with evidence
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
- **Weight budget.** On the production build, measured in a mobile viewport:
  - Homepage is well under 500 KB before the hero photo (old site: 3.7 MB).
  - Measured 2026-09-26: about 460 KB before lazy images. JS 147 KB, CSS 15 KB, HTML 50 KB.
  - Fonts are 218 KB: Hind Siliguri 400–700 (Bangla) and Montserrat (Latin), self-hosted by `next/font`.
- **Motion** is CSS plus one observer (`components/motion/RevealObserver`), not an animation library:
  - Elements opt in with `data-reveal` and animate **once**.
  - Nothing re-hides or stays blurred.
  - `prefers-reduced-motion` turns it all off.
- **Design rules** (keep them when adding pages):
  - Real photos of students beat illustrations.
  - One yellow button per screen, for the main action.
  - Red only for statements.
  - Labels and eyebrows in Bangla.

## Environment

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection |
| `PAYLOAD_SECRET` | 64 random hex chars |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin (used for OG/JSON-LD) |
| `REVALIDATE_SECRET` | Shared secret for `POST /next/revalidate` |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Local dev admin only |
| `CHROMIUM_PATH` | Optional system Chromium for share cards (production) |
| `PAYLOAD_DISABLE_JOBS` | `true` to stop the in-process job runner (e.g. extra replicas) |

## Before production (Phase 1 launch checklist)

- [ ] Replace Payload's dev "push" schema with migrations: `npm run payload migrate:create`, then run `migrate` on deploy.
- [ ] Update the `Dockerfile` (still the template's):
  - `output: 'standalone'`
  - Chromium via `npx playwright install --with-deps chromium`
  - a persistent `/media` volume, or R2 storage adapter
- [ ] Deploy to the VPS (Coolify). Put Cloudflare in front: DNS, WAF, cache rules, Access on `/admin`.
- [ ] Get the **vector logo** and full-resolution leader photos from the branch. Several legacy photos are only 180–256 px wide.
- [ ] 301 redirects from legacy routes (`/blogs`, `/blog_details/:id/:slug`, `/peoples`, `/sform`, …).
- [ ] Keep the legacy report builder running at `report.cushibir.org` until it is replaced.
