# Design system: navy and sky

One colour family, taken from Shibir's own identity:

- **Navy** (`#114575`, the central brand colour) for text, links and the main action on light pages.
- **Sky blue** for accents and light: the one bright colour, used on deep navy night sections.
- A **thin line grid** for texture, faint and fading out at the edges.
- No other hues, except status colours (red for urgent and statements, green for "live") and
  the map's place categories.

The motion is lively: titles settle in, numbers count, cards lift, the martyrs' journey is lit
by a travelling lamp. It always answers the reader or plays once, and `prefers-reduced-motion`
turns it off.

Tokens live in `src/app/(frontend)/globals.css`; fonts in `src/app/(frontend)/fonts.ts`.

## Colour

| Token | Value | Use |
|---|---|---|
| `--bg` | `#f5f8fb` | page background |
| `--ink` | `#0b1f33` | headings, dark text |
| `--text` / `--muted` / `--subtle` | `#1b2a38` / `#55636f` / `#5e6b77` | body copy, captions (5:1+ on white) |
| `--primary` | `#114575` (hover `#17599a`) | links, highlighted title words, the main button, active tabs (9.8:1 on white) |
| `--blue` | `#1fa3dc` | accents, graphics, focus ring |
| `--blue-soft` | `#5cc8f2` | sky on night sections: highlighted words, big numbers, the sky button, the journey's light |
| `--blue-deep` | `#0a2f52` | gradient ends |
| `--gradient` | `120deg #1f8fcf → #114575 → #0a2f52` | gradient buttons, featured cards |
| `--night` / `--night-card` / `--navy` / `--deep` | `#071a2c` / `#0c2238` / `#0e2e4d` / `#0a1d30` | night sections, cards on them |
| pale blues | `#eaf3f9` `#e3eef6` `#cfe3f0` `#b5d5ea` | section fills, pills, problem cards |
| `--crimson` / `--danger` | `#c0262d` / `#e5402f` | "সর্বশেষ" ticker, urgent statements, errors |
| `--success` | `#1f9d55` | success messages, "live" chips |

The ৫ দফা cards step from navy through sky to white. Text on sky fills is ink, never white, so it
stays readable.

## Type

- **Hind Siliguri** 400/600/700 for all Bangla: headlines, UI and body.
- **Montserrat** for Latin words, numbers and the English pages.
- Body text is 16–18px at a 1.5–1.7 line height; section titles 52 / 40 / 32px.

## Texture and ornament

- `.grid-lines`: 1px navy lines at 7% every 32px behind light headers, faded with a radial mask;
  `.grid-lines-night`: the same in white at 5% on night sections.
- `.hero-wash`: a pale-blue wash under light page headers.
- Section labels on night sections (`EyebrowTab`) open with a small pulsing sky dot.
- No stars, no highlighter marks, no gradient text: highlighted title words are simply navy
  (sky on night sections).

## Shape and depth

- Buttons and pills are fully rounded, 56px tall (40px small).
- `.btn-cta` (navy) is the main action on light pages; `.btn-sky` (sky with ink text) on night
  sections. One per screen, each with soft pulse rings in its own colour.
- Cards: 20px radius, white, a 1px hairline edge plus a soft shadow.
- Gradient borders use the `padding-box / border-box` background trick.
- Glows are coloured shadows (navy under light-page actions, sky under featured cards on night).

## Motion catalogue

| Pattern | What it does | Where |
|---|---|---|
| Night-to-sky hero | deep navy lifting to sky blue, a slow sky glow under the horizon; three layers of CU hills rise at its foot | home hero |
| Living picture | points of light gather into a campus photo as a mosaic of dots, burst, re-form as the emblem ("thousands of students… one caravan"), then the next photo; dots shy from the pointer; ImageData buffer, runs only on screen, static first photo with reduced motion | home hero |
| Slogan settle | the slogan's letters arrive spaced out and soft, then draw together and sharpen; visible from first paint | home hero |
| Title settle | each word group drops in with a soft blur, once, when the title arrives | every section title |
| Light sweep | a sky band wipes across a night heading and leaves the highlight | night-section titles |
| Reveal | cards rise and un-blur once as they arrive | cards, lists |
| Count-up | 0 → value on first view | statistics |
| Pulse rings | two soft rings from the main button | the one main action per screen |
| Floating icons | campus-life icons pop in, then bob | join banner, services |
| Marquee | news ticker and press logos drift; hover pauses, drag scrolls | ticker, press |
| Tab pill | the active background slides between tabs | news tabs |
| Page titles (h1) | words rise into place from the first paint, no fade | page headers |
| Shared elements | news image → article hero, leader photo → profile (`<ViewTransition>`) | news, leaders |
| Rail timeline | history as stations on the shuttle line, pinned and scroll-driven on large screens | About |
| Particle emblem | the logo gathers from scattered points, then re-forms as the slogan | About |
| Folder stack | full-width cards pin and stack while scrolling; a covered card sinks back | ৫ দফা |
| Problem chain | the problem slides in, a line draws across with a spark, the answer card arrives, its tick draws | সমস্যা তোমার, লড়াই আমাদের |
| Procession of light | pinned road through night hills; a lamp travels with the scroll, cards light (grey → colour), the year turns, the trail glows, the sky lifts towards light; vertical road on phones | শহীদি কাফেলা (home, /martyrs) |
| Reading rail | a rail beside a story fills as it is read; each part's dot lights at mid-screen | a martyr's page |
| Portrait | a memorial portrait comes from grey to colour under a slow sky halo | a martyr's page |

Everything is CSS plus one small observer (`components/motion/RevealObserver`); canvas is used only
where the effect needs it. Elements animate once and never stay hidden or blurred.
