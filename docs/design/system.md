# Design system: sea, hills and dawn

The site's look comes from the branch's own world:

- **Sea-blue** from the Shibir emblem, with Chattogram by the sea.
- **Green** of the CU hills for every action.
- **Dawn amber** on deep sea-navy for the night sections.
- An **eight-point star lattice** (khatam) for texture.

The motion is lively: titles settle in, highlights are drawn, numbers count, cards lift. It
always answers the reader or plays once, and `prefers-reduced-motion` turns it off.

Tokens live in `src/app/(frontend)/globals.css`; fonts in `src/app/(frontend)/fonts.ts`.

## Colour

| Token | Value | Use |
|---|---|---|
| `--bg` | `#f2f6f6` | page background (cool paper) |
| `--ink` | `#0a2233` | headings, dark text |
| `--text` / `--muted` / `--subtle` | `#1a2a33` / `#56646c` / `#62707a` | body copy, captions (5:1+ on white) |
| `--primary` | `#0b6fa4` | links, active states (5.4:1 on white) |
| `--blue` / `--blue-soft` / `--blue-deep` | `#1c9bd6` / `#5cc0ea` / `#06456a` | accents, focus ring, gradient ends |
| `--gradient` | `120deg #1596d1 → #0b6fa4 → #06456a` | primary buttons, featured cards |
| `--gradient-text` | `100deg #1ea5dd → #0b6fa4 → #0a2f4a` | highlighted words |
| `--cta` | `#19c37d` (hover `#2fd690`), ink text 7:1 | the one main action per screen, with pulse rings |
| `--night` / `--night-card` / `--navy` / `--deep` | `#04202e` / `#062a3b` / `#07334d` / `#052636` | night sections, cards on them |
| `--glow` | `#ffc561` (band `#ffd27f`) | amber accents, big numbers and highlights on night sections |
| `--mint` / `--aqua` | `#3ee0a4` / `#5fd4ff` | counters and small accents |
| pastels | `#e8f4f8` `#e0f0f6` `#c9e6f1` `#afdaeb` | section fills, pills, soft squares |
| `--crimson` | `#c0262d` | "সর্বশেষ" ticker, statements, the memorial |

## Type

- **Anek Bangla** (variable weight and width) for headlines and big numbers, `wdth` 94–96. Its
  English sibling **Anek Latin** does the same on `/en`.
- **Hind Siliguri** 400/600/700 for Bangla body and UI; **Hind** (its Latin sibling) for English body.
- Body text is 16–18px at a 1.5–1.7 line height; section titles 52 / 40 / 32px.

## Texture and ornament

- `.lattice`: an 88px eight-point star tile in sea-blue at 8.5% on light heroes; `.lattice-night`
  the same in white at 7% on night sections.
- `StarGlyph`: the same star, small, turning slowly in section labels (`EyebrowTab`).
- `.hero-wash`: a sky-to-hill wash under light heroes.

## Shape and depth

- Buttons and pills are fully rounded, 56px tall (40px small).
- Cards: 20px radius, white, a 1px hairline edge plus a soft shadow.
- Gradient borders use the `padding-box / border-box` background trick.
- Glows are coloured shadows (green under the main action, sea-blue under featured cards).

## Motion catalogue

| Pattern | What it does | Where |
|---|---|---|
| Dawn hero | sea-navy night warming to a dawn glow; three layers of CU hills rise at its foot (home) | home hero |
| Living picture | star dust gathers into a campus photo as a mosaic of dots, bursts, re-forms as the emblem ("thousands of students… one caravan"), then the next photo; dots shy from the pointer; ImageData buffer, runs only on screen, static first photo with reduced motion | home hero |
| Slogan settle | the slogan's letters arrive wide and light and tighten to firm and bold (Anek's width and weight axes), visible from first paint | home hero |
| Title settle | each word group drops in with a soft blur, once, when the title arrives | every section title |
| Highlighter | a hill-green (amber on night) marker stroke draws under highlighted words | section titles |
| Shine | gradient text slowly slides across highlighted words | highlighted words |
| Light sweep | an amber band wipes across a night heading and leaves the highlight | night-section titles |
| Reveal | cards rise and un-blur once as they arrive | cards, lists |
| Count-up | 0 → value on first view | statistics |
| Pulse rings | two soft green rings from the main button | the one main action per screen |
| Floating icons | campus-life icons pop in, then bob | join banner, services |
| Marquee | news ticker and press logos drift; hover pauses, drag scrolls | ticker, press |
| Tab pill | the active background slides between tabs | news tabs |
| Page titles (h1) | words rise into place from the first paint, no fade | page headers |
| Shared elements | news image → article hero, leader photo → profile (`<ViewTransition>`) | news, leaders |
| Rail timeline | history as stations on the shuttle line, pinned and scroll-driven on large screens | About |
| Particle emblem | the logo gathers from scattered points, then re-forms as the slogan | About |
| Folder stack | full-width cards pin and stack while scrolling | ৫ দফা |

Everything is CSS plus one small observer (`components/motion/RevealObserver`); canvas is used only
where the effect needs it. Elements animate once and never stay hidden or blurred.
