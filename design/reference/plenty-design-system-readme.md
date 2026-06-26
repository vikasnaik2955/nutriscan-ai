# Plenty — Design System

**Plenty** is a mobile-first donation app that connects people with surplus to the people and organizations who need it, coordinated by volunteers who handle pickup and delivery. The tagline: **"Share what's spare."**

This repository is the Plenty design system: tokens, reusable React components, foundation specimens, and a full interactive UI-kit recreation of the app.

> **Brand name note:** the source brief did not name the product. **"Plenty"** (warmth, abundance, sharing surplus) was chosen as a working brand — including the green leaf-heart mark in `assets/`. Rename freely if you have an official brand; it's referenced from `tokens/colors.css`, `assets/`, and the UI kit only.

## Product context

Plenty serves four roles, each with a tailored experience:

- **Donor** — creates food/clothes donations, picks a nearby recipient, tracks status, earns rewards.
- **Volunteer** — receives nearby request broadcasts, accepts, sees donor + drop-off contact, updates pickup/delivery status.
- **Consumer (recipient)** — NGO / shelter / community; registers a need, sees incoming & received donations, views reports.
- **Admin** — lightweight transport/vehicle management, allocation monitoring, audit log.

Two donation categories share one flow and are **color-coded everywhere**: **Food** (warm orange) and **Clothes** (calm teal).

**Donation lifecycle (status language used across every role):**
`REQUESTED → ACCEPTED → PICKED_UP → DELIVERED → COMPLETED` (plus `CANCELLED`).

### Sources
This system was generated from a written product/design brief (donation app spec — roles, end-to-end flow, data model, and design-token requirements). No external codebase, Figma file, or brand assets were provided; all visuals are original to this system. If you have the real brand or a codebase, attach it and we'll align the tokens, fonts, and screens to it.

---

## Content fundamentals

Plenty's voice is **warm, plain-spoken, and human** — like a helpful neighbour, never a logistics dashboard.

- **Second person, active verbs.** "Share what's spare." "A volunteer is on the way." "12 people near you need a meal." Avoid nominalized jargon ("facilitate surplus redistribution", "beneficiary demand detected").
- **Casing:** Sentence case for everything — headings, buttons, labels. No Title Case, no ALL CAPS except tiny overline labels (e.g. `ACTIVE REQUEST`) and status text.
- **Tone:** Encouraging and concrete. Lead empty states with possibility ("Share a meal or some clothes — someone nearby could use it today.") rather than dead ends.
- **Numbers are human:** "Serves 12", "2.4 km away", "Pickup before 8 PM" — round, scannable, with units.
- **Emoji:** Essentially none. A single 🎉 is acceptable in a celebratory reward toast; otherwise use Lucide icons, never emoji, as UI iconography.
- **Punctuation:** Em dashes and middots (`·`) separate metadata. Keep sentences short.

Examples in `guidelines/brand-voice.card.html`.

---

## Visual foundations

**Color.** Warm, trustworthy, community palette. Primary is a **fresh green** (`--brand` `#1F9D57`) for giving/freshness. Two **category accents** carry the two flows consistently: **Food orange** (`--food` `#EA7317`) and **Clothes teal** (`--clothes` `#0E9AA7`). **Reward gold** (`--reward`) for points. Neutrals are **warm-tinted grays** (off-white `#FAF8F5` page, white cards). Semantic + status colors are defined once as tokens and never recolored inline — see `tokens/colors.css`.

**Type.** One clean modern sans — **Plus Jakarta Sans** (400–800), friendly and rounded without being childish. Display/h1 are bold (700–800) with tight tracking (`-0.02em`); body is 15px at 1.5 line-height; mono is system-monospace for IDs/plate numbers. Mobile-first sizes (display 40 → caption 13). See `tokens/typography.css`.

**Spacing & shape.** 4/8-px spacing scale. **Cards round at 16px** (`--radius-lg`); pills/chips/avatars are fully round; bottom sheets use 28px top corners. Generous touch targets — **min 44px** everywhere.

**Backgrounds.** Mostly flat warm neutrals. Color enters through **role "hero" headers** — a subtle 150° linear gradient in the role's accent (green for donor/volunteer, gold for rewards, teal for recipient) with a rounded bottom. No photographic backgrounds, no noise/grain, no purple gradients. The map is a **CSS-only placeholder** (no tiles): a faint road grid with a dashed 10 km radius ring.

**Elevation.** Soft, warm-tinted shadows (rgba of near-black `#1A1714`), four steps `xs → xl`, plus a green `--shadow-brand` glow reserved for the primary CTA. Cards use `shadow-sm` at rest, `shadow-md` on hover/press.

**Borders & cards.** Hairline `1px` border in `--border-subtle` on resting cards; `1.5px` for inputs and selectable items, thickening to the accent color when selected/focused. Category cards and donation cards may show a **4px left accent bar** in the Food/Clothes color.

**Corner radii summary:** inputs/buttons 14px, cards 16px, chips/avatars full, sheets 28px (top only).

**Motion.** Restrained and functional. Standard ease `cubic-bezier(0.2,0,0,1)` at 140–320ms. Buttons **scale to 0.97 on press**; the bottom sheet **slides up** while the scrim fades; toasts **rise + fade** in. No bounces, no infinite/decorative loops, respects content-first (no opacity-0 traps).

**Hover / press states.** Hover = a step-darker fill (primary → `--brand-strong`) or a soft tint (ghost → `--brand-soft`); cards lift 1px. Press = scale-down 0.92–0.97. Focus = 3px `--focus-ring` halo.

**Transparency & blur.** Used sparingly: white-at-15–22% overlays on hero gradients for stat tiles and avatars. No glassmorphism/backdrop-blur.

**Imagery vibe.** No stock photography in the system; avatars fall back to **tinted initials**. When real photos are added (donation evidence), expect warm, candid, well-lit images — never cold or desaturated.

Specimen cards: `guidelines/*.card.html` (Colors, Type, Spacing, Brand groups in the Design System tab).

---

## Iconography

- **System:** [**Lucide**](https://lucide.dev) — consistent 2px stroke, rounded line caps; matches Plenty's friendly-but-clean feel. It is the **only** icon vocabulary; never hand-roll SVG icons or use emoji as UI icons.
- **Component:** the canonical `Icon` component (`components/icon/Icon.jsx`) renders a Lucide icon by kebab-case name (`<Icon name="map-pin" />`) and inherits `currentColor`. Every other component uses it internally.
- **Loading:** Lucide is loaded once per page via UMD CDN — `<script src="https://unpkg.com/lucide@0.471.0/dist/umd/lucide.min.js"></script>`. Cards and the UI kit all include this. If you ship offline, vendor the Lucide UMD file into `assets/`.
- **Common names in use:** `heart`, `hand-heart`, `utensils` (food), `shirt` (clothes), `map-pin`, `navigation`, `users`, `clock`, `truck`, `bike`, `award`, `trophy`, `gift`, `bell`, `phone`, `message-circle`, `camera`, `package`, `building-2`, `shield-check`, `chevron-left/right`, `plus`.
- **App mark:** `assets/mark.svg` (green tile, white heart with a leaf sprout) and `assets/logo.svg` (mark + "plenty" wordmark). These are brand artwork, not part of the icon set.

> **Substitution flag:** Lucide is a substitution for an unspecified product icon set, chosen for its clean 2px stroke. If Plenty has its own icon library, drop it into `assets/` and repoint `Icon`.

---

## Index / manifest

**Root**
- `styles.css` — global entry point (consumers link this). `@import`s only.
- `readme.md` — this guide.
- `SKILL.md` — Agent-Skill front matter for use in Claude Code.

**`tokens/`** — `fonts.css` (Plus Jakarta Sans), `colors.css`, `typography.css`, `spacing.css` (spacing, radii, shadows, layout, motion).

**`assets/`** — `mark.svg`, `logo.svg`.

**`guidelines/`** — foundation specimen cards: colors (brand, neutrals, semantic, status), type (headings, body, weights), spacing (scale, radius, elevation), brand (logo, voice).

**`components/`** (namespace `window.PlentyDesignSystem_a440a4`)
- `icon/` — **Icon**
- `forms/` — **Button**, **IconButton**, **Input**, **Select**, **Textarea**, **Switch**
- `data-display/` — **StatusBadge**, **Chip**, **Avatar**, **StatCard**, **Timeline**
- `cards/` — **Card**, **CategoryCard**, **DonationCard**, **ConsumerCard**, **VolunteerCard**, **RequestCard**, **NotificationCard**
- `navigation/` — **AppBar**, **BottomNav**, **Tabs**
- `feedback/` — **Toast**, **BottomSheet**, **EmptyState**, **MapPlaceholder**

Each directory has `<Name>.jsx` + `<Name>.d.ts` + `<Name>.prompt.md`, and one `@dsCard` HTML demoing its states.

**`ui_kits/plenty-app/`** — interactive recreation of the full app (all four roles, working navigation, the donor happy path, volunteer accept→deliver, consumer reports, admin tools). Entry: `index.html`. Screens are split across `*Screens.jsx`; sample data in `data.js`; shared layout in `kit.jsx`.

## Using it
Link `styles.css`, load the Lucide UMD script and `_ds_bundle.js`, then read components off `window.PlentyDesignSystem_a440a4`. See any `*.card.html` for the exact setup.
