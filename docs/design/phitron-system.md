# Design system — modelled on phitron.io

The branch asked for the look and feel of [phitron.io](https://phitron.io/) and
[phitron.io/ai-ml-course](https://phitron.io/ai-ml-course). This file records what was
measured on those pages (CSS bundles, component code and screenshots) and how each
pattern maps onto this site.

We copy the **visual language only**: colours, type roles, layout patterns and motion.
Phitron's logo, illustrations, photos and copy are not used. Every image and text on this
site is the branch's own.

## Adapted for a student organisation (2026-09-26)

The first pass followed Phitron too literally and read like a site selling a course. These
patterns were changed or dropped:

| Course-site pattern | Replaced with |
|---|---|
| Centred sales hero with floating tech icons and a stats card | Photo collage of real events, the organisation's name and slogan, and the leaders' faces |
| English monospace tagline and scramble labels | Bangla labels that wipe in |
| Enrolment-dates toast | Dropped (a "সর্বশেষ" news ticker under the header was tried and removed) |
| Journey funnel, "4 easy steps", FAQ and price-style contact card on the home page | Moved to the About and Join pages |
| Yellow pulsing button repeated in every section | The yellow button appears once per screen |
| Replaying blur-to-focus reveals | Reveal once, starting a little before the element arrives |
| Neon lime/purple/orange folder cards | Blue, sky, teal, indigo and amber |

Kept: grid-paper hero, gradient highlight + swoosh titles, night sections with glows,
marquee, count-up, sliding tab pill, stacked ৫ দফা cards, light-sweep headings.

## Colour

| Token | Value | Phitron use | Our use |
|---|---|---|---|
| `--bg` | `#f6f6f6` | page background | page background |
| `--ink` | `#0b0f2e` | headings | headings, dark text |
| `--text` | `#1a1a1a` | card titles | card titles |
| `--muted` | `#5c5c5c` | body copy | body copy |
| `--subtle` | Phitron `#888888` | captions, dates | darkened to `#6b6b6b` for 5.3:1 contrast (WCAG AA) |
| `--primary` | `#0052d8` | links, buttons | links, active states |
| `--blue` | `#3564ff` | mono tagline, tab pill, highlights | same |
| `--gradient` | radial `#0060fa → #002b70` | primary button, highlighted words | same |
| `--yellow` | `#fbc900` (hover `#ffd52e`) | main CTA with pulse rings | main CTA "সমর্থক হোন" |
| `--tag` | `#f5c945` | "RANKED" tag | "চাকসু নির্বাচন ২০২৫" tag, top leaders' role badge |
| `--night` | `#000e1d` | success-story and mentor sections | CUCSU, leaders, footer |
| `--night-card` | `#070d18` | mentor cards | leader cards |
| `--navy` | `#002545` | stats card (border: radial `#00fb97`) | milestones card |
| `--deep` | `#061327` | AI/ML page sections | ৫ দফা section, leadership hero |
| stats | `#fbc900` `#00fb97` `#00fbee` | three counters | three counters |
| green highlight | `#7ef7a8 → #2fce55` | highlighted words on dark | same |
| `--lime` | `#e1fd14` / sweep band `#dcff3d` | AI/ML CTA, eyebrow text | ৫ দফা section accents |
| pastels | `#eff3ff` `#ebf0ff` `#dbe4ff` `#c3d3ff` | section fill, pills, grid squares | same |
| problem cards | sky `#deedf7`, sand `#f7f0d8`, pink `#f1d7f3` | "why Phitron" questions | student problems |
| red notice | red gradient | enrolment-dates toast | statement chips (branch red `#c82028`) |

Grid texture: 1px lines `rgba(53,100,255,.07)` every 72px, with a few `#c3d3ff` squares at 45% opacity.

## Type

- **Hind Siliguri** 400/600/700: all Bangla (500 was dropped for weight). Section titles are 700 at 56 / 40 / 32 px.
- **Montserrat**: Latin words and numbers.
- Phitron's monospace taglines are not used; every label is in Bangla.
- Body text is 16–18px at a 1.5–1.7 line height.

## Shape and depth

- Cards: 16–24px radius, white, shadow `0 4px 24px rgba(11,15,46,.06)`.
- Buttons: 8px radius, height 56px.
- Pills and tabs: fully rounded.
- Gradient borders use the `padding-box / border-box` background trick.
- Glows are coloured shadows (yellow `0 10px 30px rgba(251,201,0,.45)`, blue `0 12px 20px rgba(0,96,250,.3)`) and blurred radial ellipses behind dark sections.

## Motion catalogue

| Pattern | Phitron spec | Where here |
|---|---|---|
| Hero load | children fade up 28px, 0.55s ease-out, 0.12s stagger | hero |
| Typing caret | `|` blinks, 1.2s cycle | after hero headline |
| Floating icons | pop in (scale 0.5→1, backOut), then bob `y 0→−drift→0` and wobble rotate, 5–7s loop | join banner |
| Title blur-fade | each word group drops in with a blur, staggered (Phitron replays it; we play it once) | every section title |
| Shine | gradient text slides `background-position` 200%→−200%, 2–3s loop | highlighted words |
| Swoosh | curved gradient stroke under the highlight | section titles |
| Focus reveal | cards fade up from a light blur, (i mod 3)×120ms delay (Phitron parks them at 30% opacity and replays; we don't) | cards, FAQ |
| Count-up | 0 → value, 1.8s ease-out, on 50% visibility | stats |
| Pulse rings | two box-shadow rings, 2s, offset 1s | the one yellow button per screen |
| Play pulse | scale 1→1.25→1, 2s loop | video cards |
| Banner scale-in | 0.8→1, 0.5s after the hero text | not used |
| Marquee | track `translateX(0 → −50%)`, pauses on hover, drag to scroll | press coverage |
| Journey line | connecting lines fill with `scaleX` in sequence, 4.2s loop | কর্মী → সাথী → সদস্য (About); milestone line draws once (home) |
| Nudge arrows | chevrons `x 0→4→0`, 1.6s | tabs, steps |
| Tab pill | active background slides with a spring | news tabs |
| Scramble label | random glyphs settle left-to-right (45ms tick) | not used: Bangla labels wipe in instead |
| Page titles (h1) | — | words rise into place from the first paint (`title-now`), no fade, so they never wait for a script |
| Shared elements | — | news image → article hero, leader photo → profile (React `<ViewTransition>`) |
| Rail timeline | — | history stations on the shuttle line; pinned and scroll-driven on large screens (About) |
| Particle emblem | — | the logo gathers from scattered points, then re-forms as the slogan (About); in the home hero it is the title: the emblem gathers, then re-forms as বাংলাদেশ ইসলামী ছাত্রশিবির (white) over চট্টগ্রাম বিশ্ববিদ্যালয় (cyan), solid colours, finer dots, the name held 7 s; the real h1 is screen-reader only and reduced motion draws the name still |
| Hero video | — | a silent 16 s aerial loop of the campus (seamless crossfade) in its own colours, with no colour layer over it (the white text carries a soft shadow instead); landscape 1920×1072 or a full-resolution 608×1072 portrait crop for phones (the source's top 8 rows are black and cut off), AV1 where decoded smoothly (in hardware on phones), else H.264, 1.1–4 MB; loads only after the page has loaded and the browser is idle, fades in over a 25–56 KB still that is the hero's largest paint; data saver, 2G and reduced motion keep the still; pauses off screen (home) |
| Slogan rise | — | the slogan and intro rise into place from the first paint; the branch line is solid cyan #5ec8ff (no gradient on hero text), a cyan #29b6f6 button with navy text beside a frosted-glass one (home hero) |
| Light sweep | a lime band wipes across the heading and reveals the highlight, 1.2s | dark-section titles |
| Folder stack | full-width coloured "folder" cards pin and stack while scrolling | ৫ দফা; a covered card sinks back and each card's contents rise in as it arrives |
| Problem chain | — | the problem slides in, a green line draws across with a spark, the answer card arrives and its tick draws (সমস্যা তোমার, লড়াই আমাদের) |
| Procession of light | — | pinned road through night hills; a lime lamp travels with the scroll, cards light (grey → colour), the year turns, the trail glows, light rises; vertical road on phones (শহীদি কাফেলা, home and /martyrs) |
| Reading rail | — | a rail beside a martyr's story fills as it is read; each part's dot lights at mid-screen |
| Portrait | — | a memorial portrait comes from grey to colour under a slow blue halo (a martyr's page) |
| Toast | slides up after load, can be minimised to a round button | not used |

Phitron ships this with `motion` (Framer Motion). Here the same effects are built with CSS
and one small observer (`components/motion`), so the homepage stays light on mobile data.
Everything respects `prefers-reduced-motion`.
