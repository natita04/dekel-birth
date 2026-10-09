# Dekel Raz Birth Site: Style Guide

Style guide for the birth photo site of Dekel Raz (דקל רז). It is based on design directions 5 ("Mix") and 6 ("Birth moment").
Use it as the single source of truth when implementing or restyling the site.

> **Instructions for Claude Code**
> - The site is Hebrew, RTL (`<html lang="he" dir="rtl">`).
> - **Keep the existing photo gallery's structure and behavior exactly as it is today.** Only restyle it with the tokens below: fonts, colors, spacing.
> - Replace the current top section (hero) with the hero described here.
> - Restyle the existing "birth moment" slide (the 16:08 circle) as described here, and make clicking it play the birth video.
> - Use CSS custom properties from section 1. Don't hardcode values.

---

## 1. Design tokens

```css
:root {
  /* Surfaces */
  --color-bg:            #F8F5EE;  /* cream page background, used everywhere */
  --color-surface:       #FFFFFF;  /* nav buttons, circle center */

  /* Text */
  --color-ink:           #2E2721;  /* primary text, borders on stats strip */
  --color-ink-soft:      #4A443C;  /* secondary text (gallery time, arrows) */
  --color-muted:         #6A6056;  /* labels, captions, credit line */

  /* Accent (sage) */
  --color-accent:        #5E6E4C;  /* name "דקל", 16:08, palm drawing, play pill, active dot */
  --color-accent-hover:  #4E5D3E;
  --color-accent-deep:   #3F4C30;  /* link hover */
  --color-heading-sage:  #6B7A5A;  /* gallery section headings, e.g. "היכרות ראשונה" */

  /* Blush (birth moment) */
  --color-blush:         #E2B6AC;  /* palm crown dot, pulse ring */
  --color-blush-ring:    #E8CFC6;  /* thin ring around the circle */
  --color-blush-fill:    #EBCFC6;  /* birth-moment dot in the dots row */

  /* Gallery dots */
  --color-dot-past:      #C9D0BE;  /* dots before the current one */
  --color-dot-future:    #7F8D6C;  /* dots after the current one */
  --color-dot-line:      #D5DACB;  /* thin line behind the dots */

  /* Lines */
  --color-divider:       rgba(46, 39, 33, 0.2);
  --color-nav-border:    #E4DED3;

  /* Video state */
  --color-video-bg:      #1E1A16;
  --color-video-text:    #F4ECE0;
  --color-video-muted:   #B8AC9C;

  /* Typography */
  --font-display: 'Varela Round', 'Rubik', sans-serif;  /* ONLY the name and the 16:08 time */
  --font-body:    'Rubik', sans-serif;                   /* everything else */

  /* Radii */
  --radius-photo: 12px;
  --radius-pill:  999px;

  /* Shadows */
  --shadow-photo: 0 18px 40px rgba(60, 50, 40, 0.18);
  --shadow-video: 0 18px 40px rgba(60, 50, 40, 0.22);

  /* Layout */
  --container-max: 1360px;
  --gutter: 40px;          /* 16px on phones */
}
```

Optional accent alternatives, if the color ever changes: terracotta `#B4643F`, dusty rose `#A8695B`. If you swap the accent, swap it everywhere: name, palm, 16:08, pill and active dot.

---

## 2. Typography

Load the fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Varela+Round&family=Rubik:wght@300;400;500&display=swap" rel="stylesheet">
```

**Rule: Varela Round is used only for the baby's name ("דקל", "רז") and the birth time "16:08" in the circle. Every other piece of text is Rubik.**

| Role | Font | Size | Weight | Line height | Color |
|---|---|---|---|---|---|
| Name "דקל" | Varela Round | `clamp(140px, 24vw, 340px)` | 400 | 0.9 | `--color-accent` |
| Name "רז" (outline) | Varela Round | `clamp(120px, 18vw, 270px)` | 400 | 0.9 | transparent fill, 2px stroke `--color-ink` |
| Parents line | Rubik | 22px | 400 | 1.5 | `--color-ink` |
| Stat label (נולד / בשעה...) | Rubik | 14px | 400 | normal | `--color-muted` |
| Stat value | Rubik | 36px | 500 | 1 | `--color-ink` |
| Credit line | Rubik | 15px | 400 | normal | `--color-muted` |
| Gallery heading ("היכרות ראשונה") | Rubik | 54px | 400 | 1.2 | `--color-heading-sage` |
| Gallery time ("16:18") | Rubik | 24px | 400 | normal | `--color-ink-soft` |
| Birth time "16:08" (circle) | Varela Round | 104px | 400 | 1 | `--color-accent` |
| "דקל נולד" (circle) | Rubik | 26px | 400 | normal | `--color-ink` |
| Play pill text | Rubik | 16px | 500 | normal | `#FFFFFF` |
| Date kicker (birth slide) | Rubik | 15px, `letter-spacing: 0.25em` | 400 | normal | `--color-muted` |

Outline text CSS:

```css
.name-outline {
  color: transparent;
  -webkit-text-stroke: 2px var(--color-ink);
}
```

---

## 3. The palm drawing (דקל)

A thin-line palm used above the name in the hero and inside the birth-moment circle. Stroke uses the accent color. The crown dot is blush.

```html
<svg aria-hidden="true" width="112" height="144" viewBox="0 0 110 140" fill="none"
     stroke="currentColor" stroke-width="1.8" stroke-linecap="round" class="palm">
  <path d="M55 138 C54 112 53 88 54 62"/>
  <path d="M54 62 C50 40 44 22 36 3"/>
  <path d="M54 62 C62 42 78 32 98 31"/>
  <path d="M54 62 C40 50 18 50 4 58"/>
  <path d="M54 62 C36 64 20 76 12 98"/>
  <path d="M54 62 C72 54 94 62 106 80"/>
  <circle cx="54" cy="63" r="2.6" fill="var(--color-blush)" stroke="none"/>
</svg>
```

```css
.palm { color: var(--color-accent); display: block; }
```

Sizes: **112×144** in the hero, **92×118** in the birth circle.
If the original palm illustration file from the current site exists, prefer it over this SVG and keep the same sizes and color.

---

## 4. Hero (top section)

A light hero: the first photo fills the background behind a cream wash that melts into the page background, so there is **no hard edge** between the hero and the gallery.

**Structure (top to bottom, RTL so content aligns right):**
1. Palm drawing (112×144), `margin: 0 8px 12px 0`
2. `<h1>` "דקל" (display font, accent)
3. A row (`display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:24px; margin-bottom:40px`):
   - "רז" in outline style
   - Parents text: "בן לצליל ונטי,<br>אח ליובל ועופרי" (`max-width: 360px; margin-bottom: 20px`)
4. Stats strip: 4 cells
5. Credit line: "תודה ל[אורטל רון] שצילמה אותנו ברגישות וכשרון" (`margin-top: 24px`, name is a link)

```css
.hero {
  position: relative;
  min-height: 900px;            /* use min-height: 100svh on phones */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;    /* content sits at the bottom */
  color: var(--color-ink);
}
.hero__bg {                      /* <img>, object-fit: cover */
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
}
.hero__wash {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom,
    rgba(248,245,238,0.45) 0%,
    rgba(248,245,238,0.72) 40%,
    rgba(248,245,238,0.94) 70%,
    var(--color-bg) 100%);       /* MUST end exactly on --color-bg */
}
.hero__content {
  position: relative;
  width: 100%;
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 40px var(--gutter) 48px;
  box-sizing: border-box;
}
```

### Stats strip

| Label | Value |
|---|---|
| נולד | 10.09.26 |
| בשעה | 16:08 |
| משקל | 3.590 ק״ג |
| מקום | אסותא אשדוד |

```css
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  border-top: 2px solid var(--color-ink);
  border-bottom: 2px solid var(--color-ink);
}
.stats__cell {
  padding: 24px;
  display: flex; flex-direction: column; gap: 8px;
  border-left: 1px solid var(--color-divider);   /* RTL: divider on the left */
}
.stats__cell:first-child { padding-right: 0; }
.stats__cell:last-child  { border-left: none; }
```

Use a semantic `<dl>` (`<dt>` label, `<dd>` value) if possible.

---

## 5. Photo gallery (keep the existing one, restyle only)

**Do not change the gallery's structure, order, behavior or JS.** Only apply these styles:

- Section background: `--color-bg` (same as the end of the hero wash, so it's seamless). Padding: `40px 0 56px`.
- Heading per moment ("היכרות ראשונה"): Rubik 54px, `--color-heading-sage`. Time underneath ("16:18"): Rubik 24px, `--color-ink-soft`, `margin: 6px 0 28px`.
- Center slide: ~50.6% of viewport width, aspect ratio 1013/698, `border-radius: var(--radius-photo)`, `box-shadow: var(--shadow-photo)`.
- Side slides: same size, `opacity: 0.55; transform: scale(0.94)`, cut off by the viewport edges. Gap between slides about 2.5%.
- Nav arrows: 60×60 circles, `background: rgba(255,255,255,0.92)`, `border: 1px solid var(--color-nav-border)`, `color: var(--color-ink-soft)`, 24px from the edges, vertically centered. Hover: `background: #FFFFFF`. Must be real `<button>`s with `aria-label` (in Hebrew: "התמונה הבאה" / "התמונה הקודמת").
- Dots row: dots 8–9px, `gap: 12–14px`, on a 1px line `--color-dot-line`.
  - Past dots: `--color-dot-past`
  - Future dots: `--color-dot-future`
  - Current dot: 16px, `--color-accent`
  - Birth-moment dot: 18px, `--color-blush-fill` with ring `box-shadow: 0 0 0 4px var(--color-bg), 0 0 0 5px var(--color-blush)`

---

## 6. Birth moment slide (the 16:08 circle) + video

This slide sits inside the gallery in its existing position. Instead of a photo, the center slot shows a circle. **Clicking the circle plays the birth video in the same slot.**

### 6a. Idle state: the circle

The whole circle is one `<button>` (`aria-label="לצפייה בסרטון הלידה"`). Its content is stacked and centered:
1. Palm drawing (92×118)
2. "16:08" (Varela Round, 104px, accent)
3. "דקל נולד" (Rubik 26px)
4. Play pill: "▶ לצפייה ברגע הלידה"

Above the carousel, a date kicker: "10 בספטמבר 2026".

```css
.moment {
  height: 92%;                       /* of the center slot */
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 10px;
  font-family: var(--font-body);
  color: var(--color-ink);
  background: radial-gradient(circle, #FFFFFF 0%, #F6F1E8 58%, #EDE4D5 100%);
  animation: ringPulse 2.6s ease-out infinite;
  transition: transform .3s ease;
}
.moment:hover { transform: scale(1.02); }
.moment:hover .play-pill { background: var(--color-accent-hover); }
.moment:focus-visible { outline: 3px solid var(--color-accent); outline-offset: 14px; }

/* thin blush ring + soft "breathing" pulse that invites a click */
@keyframes ringPulse {
  0%   { box-shadow: 0 0 0 10px var(--color-bg), 0 0 0 11px var(--color-blush-ring), 0 0 0 11px rgba(226,182,172,.5); }
  70%  { box-shadow: 0 0 0 10px var(--color-bg), 0 0 0 11px var(--color-blush-ring), 0 0 0 30px rgba(226,182,172,0); }
  100% { box-shadow: 0 0 0 10px var(--color-bg), 0 0 0 11px var(--color-blush-ring), 0 0 0 30px rgba(226,182,172,0); }
}
@media (prefers-reduced-motion: reduce) {
  .moment { animation: none; box-shadow: 0 0 0 10px var(--color-bg), 0 0 0 11px var(--color-blush-ring); }
}

.play-pill {
  margin-top: 14px;
  display: inline-flex; align-items: center; gap: 10px;
  background: var(--color-accent);
  color: #FFFFFF;
  border-radius: var(--radius-pill);
  padding: 12px 24px 12px 20px;
  font-size: 16px; font-weight: 500;
  transition: background .2s ease;
}
```

Play icon inside the pill (mirrored for RTL so it points left, the "forward" direction in Hebrew):

```html
<svg aria-hidden="true" width="14" height="16" viewBox="0 0 14 16" style="transform:scaleX(-1)">
  <path d="M1 1 L13 8 L1 15 Z" fill="#FFFFFF"/>
</svg>
```

### 6b. Playing state: the video

On click, replace the circle with a video player that fills the center slot. It uses the same size and aspect ratio as the photos.

```html
<div class="moment-video">
  <video src="[PATH_TO_BIRTH_VIDEO]" controls autoplay playsinline></video>
  <button class="moment-video__close" aria-label="סגירת הסרטון">✕</button>
</div>
```

```css
.moment-video {
  position: relative;
  width: 100%; height: 100%;
  border-radius: var(--radius-photo);
  overflow: hidden;
  background: var(--color-video-bg);
  box-shadow: var(--shadow-video);
}
.moment-video video { width: 100%; height: 100%; object-fit: contain; display: block; }
.moment-video__close {
  position: absolute; top: 16px; left: 16px;   /* RTL: close sits on the left */
  width: 44px; height: 44px; border-radius: 50%;
  border: none; background: rgba(255,255,255,0.9);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
}
```

**Behavior:**
- Click circle → swap to the video, call `video.play()`, and move focus to the video.
- Close button, `Esc` or navigating to another slide → pause the video, reset `currentTime = 0`, and show the circle again.
- When the video ends → return to the circle.
- While the video is playing, the carousel must not auto-advance (if it does today).
- Use `preload="metadata"` and a `poster` frame so the page stays light.

---

## 7. Responsive

- Breakpoint for phone: `max-width: 640px`.
- `--gutter` becomes 16px. No horizontal page scroll.
- Hero: `min-height: 100svh`. Name sizes are already fluid via `clamp()`. On phones the "רז" row wraps, so the parents text drops below "רז".
- Stats strip: 2 columns on phones (`grid-template-columns: repeat(2, minmax(0,1fr))`). Remove the left divider on every 2nd cell.
- Gallery: keep the current mobile behavior of the existing carousel.
- Birth circle: keep `height: 92%` of the slot. On small slots, scale the inner text down: 16:08 to `clamp(44px, 9vw, 104px)`, "דקל נולד" to `clamp(16px, 3vw, 26px)`, and the palm to ~60px tall. Hide the pill text and keep only the play icon if the space is too tight.

---

## 8. Accessibility

- Text contrast on `--color-bg`: ink 13.5:1, ink-soft 8.8:1, muted 5.6:1, accent 5.1:1 (all pass 4.5:1). `--color-heading-sage` is 4.2:1, so use it **only for large headings (24px+)**. Keep labels on `--color-muted`, not lighter.
- All interactive things are real `<button>` or `<a href>` elements, with `aria-label` on icon-only buttons (in Hebrew).
- Touch targets ≥ 44×44px.
- Hero background image: meaningful `alt` text ("דקל על אמא, רגעים אחרי הלידה"). Decorative SVGs get `aria-hidden="true"`.
- Respect `prefers-reduced-motion` (turn off the pulse ring).

---

## 9. Copy (exact strings)

| Key | Text |
|---|---|
| Name | דקל רז |
| Parents | בן לצליל ונטי, אח ליובל ועופרי |
| Born | 10.09.26 (long form: 10 בספטמבר 2026) |
| Time | 16:08 |
| Weight | 3.590 ק״ג |
| Place | אסותא אשדוד |
| Credit | תודה לאורטל רון שצילמה אותנו ברגישות וכשרון |
| Birth slide | דקל נולד |
| Play CTA | לצפייה ברגע הלידה |
| First meeting | היכרות ראשונה · 16:18 |
