---
name: Citum
description: Precise citation formatting for academic excellence.
colors:
  wall: "#FBFBF9"
  plaster: "#F0F0EC"
  hairline: "#E3E3DE"
  paper: "#FFFFFF"
  ink: "#131312"
  graphite: "#5F5F5A"
  navy: "#23407F"
  oxide: "#7A2B26"
typography:
  display:
    fontFamily: "Newsreader, serif"
    fontSize: "clamp(2.5rem, 6.5vw, 4.2rem)"
    fontWeight: 500
    lineHeight: 1.1
  body:
    fontFamily: "Newsreader, serif"
    fontSize: "1.12rem"
    lineHeight: 1.6
  label:
    fontFamily: "Archivo, sans-serif"
    fontSize: "0.7rem"
    letterSpacing: "0.3em"
    textTransform: "uppercase"
  mono:
    fontFamily: "ui-monospace, 'JetBrains Mono', 'Cascadia Code', monospace"
rounded:
  sm: "0px"
  md: "2px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.wall}"
    rounded: "{rounded.sm}"
    padding: "12px 22px"
  card:
    backgroundColor: "{colors.paper}"
    border: "1px solid {colors.hairline}"
    rounded: "{rounded.sm}"
    padding: "24px"
---

# Design System: Citum

## 1. Overview

**Creative North Star: "The Reading Room"**

The Citum design system reflects the quiet authority of a museum reading room: restrained, editorial, built for sustained attention rather than persuasion. It replaces the prior "Scholarly Workshop" system (Citum Blue, Libre Franklin, rounded cards, glass nav) with a paper-and-hairline palette, square corners, and a single disciplined accent color. The interface is calm and information-honest, letting typography and whitespace carry the authority that color and ornament used to.

**Key Characteristics:**
- **Restraint**: One accent color for interaction (navy), one reserved for marginalia (oxide). No decorative color.
- **Editorial Craft**: Display serif for reading, a distinct sans for institutional/UI voice — never blended into one "brand font."
- **Literal Naming**: Section headings and labels say exactly what they are. The museum character lives in the visual language, not in metaphor.

## 2. Colors

The palette is built from paper tones and hairline structure, with two accents used for strictly different jobs.

### Primary
- **Navy** (#23407F): The sole primary accent — links, focus states, selection. Never used decoratively.

### Neutral
- **Wall** (#FBFBF9): The base page background.
- **Plaster** (#F0F0EC): Recessed surfaces — code blocks, insets.
- **Hairline** (#E3E3DE): Borders and dividers.
- **Paper** (#FFFFFF): Framed "plate" and card surfaces, set against the wall tone.
- **Ink** (#131312): Primary text. The floor for text color — never pure black.
- **Graphite** (#5F5F5A): Secondary text, metadata, eyebrow labels.

### Reserved
- **Oxide** (#7A2B26): Reserved strictly for marginalia details — figure numbers, margin-note markers, small rules. Never used for buttons, links, or large surfaces.

### Named Rules
**The Tinted Neutral Rule.** Never use pure white (#fff) for large background areas. Use the wall tone (#FBFBF9) as the base; reserve paper (#FFFFFF) for framed plates and cards set against it.

**The Single-Accent Rule.** Navy is the only color that means "interactive." Oxide never appears on anything clickable — it marks marginalia only.

## 3. Typography

**Display/Emphasis Font:** Newsreader (variable, including italic) — the voice of scholarship, used for headlines, pull quotes, and running text.
**UI/Headings/Labels Font:** Archivo (variable, width axis) — the institutional voice, used for navigation, labels, and section eyebrows.
**Mono Font:** System stack — `ui-monospace, 'JetBrains Mono', 'Cascadia Code', monospace`.

All fonts are self-hosted as woff2 in `docs/fonts/`, with OFL license files alongside. No Google Fonts, no CDN font loading.

### Hierarchy
- **Display** (Newsreader, 500, clamp(2.5rem, 6.5vw, 4.2rem), 1.1): Hero headlines.
- **Headline** (Archivo, 600, 1.4rem, 1.4): Section headers.
- **Eyebrow** (Archivo, 500, 0.7rem, 0.3em+ tracking, uppercase, graphite): Device labels above section headings.
- **Body** (Newsreader, 400, 1.12rem, 1.6): Long-form reading text. Measure capped near 62ch.
- **Label/Mono** (500, 0.85rem): Code, citation output, and structured examples.

No drop caps anywhere in the system.

## 4. Elevation

Citum uses a flat, hairline-first approach with one deliberate exception: framed "plates" that hold featured output get a soft layered shadow to lift them off the wall.

### Shadow Vocabulary
- **Plate Shadow** (`0 2px 3px rgba(19,19,18,.035), 0 34px 68px -42px rgba(19,19,18,.38)`): Used only for framed plates presenting featured output (e.g. rendered citations, demo panels).

### Named Rules
**The Border-First Rule.** Hairline borders (#E3E3DE) are the primary method of separation. Shadow is reserved for plates that need to read as physically framed and lifted.

**The Margin Asymmetry Rule.** On wide screens, break the single reading column with a narrow margin-note rail (Tufte-style) rather than symmetric multi-column grids. The asymmetry comes from the running text vs. its annotations, not from card sizing.

**The Direct Naming Rule.** Section headings and UI labels are literal: "Four examples," "Who it's for," "Install," "On CSL," "News." Never metaphorical framing like "exhibits," "wall text," or "desks" — the museum quality is visual only.

**The Square Corner Rule.** Corners are square to 2px at most. No pill shapes, no rounded cards.

## 5. Components

### Buttons
- **Shape:** Square corners (0px radius).
- **Primary:** Ink background with wall-tone text (or navy ground with wall text where a link-adjacent action needs the accent).
- **Secondary:** Paper background with a hairline border.

### Cards
- **Corner Style:** Square (0–2px).
- **Background:** Paper (#FFFFFF), set against the wall page background.
- **Border:** 1px solid hairline (#E3E3DE).

### Navigation
- **Style:** Fixed "whisper" header — transparent at rest, blurred wall tone once the page scrolls.
- **Links:** Archivo labels, navy on hover/active, no background pills.

### Surface Texture
- Subtle SVG-noise paper grain may be applied to large wall-tone surfaces to avoid a flat digital look.
- Reveal-on-scroll transitions are permitted but must respect `prefers-reduced-motion`.

## 6. Do's and Don'ts

### Do:
- **Do** use framed plates (paper + plate shadow) to present featured output.
- **Do** maintain the ~62ch measure for running text.
- **Do** use Newsreader for display and body reading text, Archivo for UI/headings/labels.
- **Do** use oxide only for marginalia details (figure numbers, margin-note markers, small rules).

### Don't:
- **Don't** load Tailwind from a CDN, or any external font or script.
- **Don't** name sections or UI elements metaphorically ("exhibits," "wall text," "desks").
- **Don't** use drop caps.
- **Don't** use pill badges or rounded cards.
- **Don't** use pure black (#000) for text — ink (#131312) is the floor.
