# Spike: Bangla share images (Open Graph)

**Question (plan §6.3):** can `next/og` (Satori) render Bangla titles for Facebook/Telegram previews, or do we need a real browser?

**Test string:** `ছাত্রশিবির চট্টগ্রাম বিশ্ববিদ্যালয় — শিক্ষার্থীদের অধিকার ও নিরাপত্তা`, font Anek Bangla Bold, 1200×630.

| Renderer | Result |
|---|---|
| `next/og` / Satori | **Broken** — [og-bangla-satori.png](og-bangla-satori.png). Pre-base vowel signs are not reordered (শিবির → "শবিরি", দের → "দরে") and every conjunct shows a visible hasanta (ত্‌র, ট্‌ট, ক্‌ষ, ত্ত). Satori has no complex-script (HarfBuzz) shaping. |
| Headless Chromium (Playwright) | **Correct** — [og-bangla-chromium.jpg](og-bangla-chromium.jpg). All conjuncts and কার/ফলা shaped properly; ~70 KB JPEG. |

**Decision:** share cards are rendered by Chromium (`src/lib/og/render.ts`) in a background job
(`generateShareImage`) whenever a post is published or its title/category changes, and stored as a Media item.
Never use `next/og` for Bangla text.

Production note: the Docker image must include Chromium (`npx playwright install --with-deps chromium`)
or set `CHROMIUM_PATH` to a system Chromium.
