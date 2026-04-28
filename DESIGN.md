---
name: Citum
description: Precise citation formatting for academic excellence.
colors:
  primary: "#2a94d6"
  neutral-bg: "#fdfbf7"
  text-primary: "#374151"
  text-secondary: "#6b7280"
  accent-subtle: "rgba(42,148,214,0.08)"
typography:
  display:
    fontFamily: "Newsreader, serif"
    fontSize: "clamp(2.5rem, 6.5vw, 4.2rem)"
    fontWeight: 700
    lineHeight: 1.1
  body:
    fontFamily: "Libre Franklin, sans-serif"
    fontSize: "1.12rem"
    lineHeight: 1.6
  mono:
    fontFamily: "JetBrains Mono, monospace"
rounded:
  sm: "8px"
  md: "12px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "10px 20px"
  card:
    backgroundColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "24px"
---

# Design System: Citum

## 1. Overview

**Creative North Star: "The Scholarly Workshop"**

The Citum design system reflects the precision and transparency required for academic work. It avoids the neon flash of modern tech in favor of a warm, paper-like palette (`#fdfbf7`) and authoritative, technical typography. The interface is high-density and information-rich, reflecting the complexity of citation data while maintaining a clean, intentional structure.

**Key Characteristics:**
- **Empirical Transparency**: Information is presented with supporting evidence and technical examples.
- **Asymmetric Balance**: Breaking generic symmetry to highlight specialized tools and logic.
- **Scholarly Authority**: Professional font pairings and a paper-like palette for a focused reading experience.

## 2. Colors

The palette is anchored by a warm neutral base and a professional, trustworthy blue accent.

### Primary
- **Citum Blue** (#2a94d6): Used for primary actions and branding. It represents the "engine" of the product.

### Neutral
- **Paper White** (#fdfbf7): The base background color. Warm and reduced in glare.
- **Ink Gray** (#374151): Primary text color.
- **Slate Secondary** (#4b5563): Secondary text and metadata.

### Named Rules
**The Tinted Neutral Rule.** Never use pure white (#fff) for large background areas. Use paper-like tints to reduce eye strain and establish an academic tone.

## 3. Typography

**Display Font:** Newsreader (700 weight for headers)
**Body Font:** Libre Franklin (400 weight)
**Label/Mono Font:** JetBrains Mono

### Hierarchy
- **Display** (700, clamp(2.5rem, 6.5vw, 4.2rem), 1.1): Hero headlines.
- **Headline** (600, 1.4rem, 1.4): Section headers.
- **Body** (400, 1.12rem, 1.6): Long-form descriptions. Max line length 64ch.
- **Label/Mono** (500, 0.85rem): Code, citation output, and workshop examples.

## 4. Elevation

Citum uses a "flat-but-layered" approach. Depth is conveyed through subtle borders, paper-like backgrounds, and soft shadows.

### Shadow Vocabulary
- **Subtle Lift** (0 2px 12px rgba(0,0,0,0.06)): Used for cards and panels.

### Named Rules
**The Asymmetric Rule.** Favor asymmetric grids (e.g., 1.2fr/0.8fr) over identical card grids to create visual interest and highlight technical details.

## 5. Components

### Buttons
- **Shape:** Softened square (8px radius).
- **Primary:** Citum Blue background with white text.
- **Secondary:** White background with a subtle blue border.

### Cards
- **Corner Style:** Rounded (12px).
- **Background:** Pure white (#ffffff).
- **Border:** Subtle blue tint (1px solid rgba(42,148,214,0.12)).

### Navigation
- **Style:** Glass-nav with backdrop-filter blur.
- **Links:** Tracked Title Case with subtle blue background pills on hover.

## 6. Do's and Don'ts

### Do:
- **Do** use `workshop-block` snippets to show technical data and logic.
- **Do** maintain the 64ch line length for readability.
- **Do** use Newsreader for any primary heading.

### Don't:
- **Don't** use identical 3-column card grids for everything.
- **Don't** use all-caps for long labels or headers; favor small-caps or title case.
- **Don't** use Inter or generic "SaaS" fonts.
