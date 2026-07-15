# CAB SAFARS — Brand Guide

> "Safe Loads. Smart Journeys."

---

## 1. Colors

### Core Palette

| Token | Hex | Usage |
|---|---|---|
| `dark-bg` | `#0B1220` | Page background |
| `surface` | `#111827` | Cards, panels |
| `surface-elevated` | `#1A2332` | Dropdowns, modals, toasts |
| `border` | `#243042` | Default border |
| `border-subtle` | `#1E2A3A` | Dividers, input outlines |

### Brand Colors

| Token | Hex | Usage |
|---|---|---|
| `brand-gold` | `#F5A623` | Primary CTA, highlights, accent |
| `brand-gold-dark` | `#D4891E` | Hover state for gold |
| `brand-green` | `#16A34A` | Logo green, success, brand icon |
| `brand-green-light` | `#22C55E` | "SAFARS" wordmark, success states |

### Text

| Token | Hex | Usage |
|---|---|---|
| `text-primary` | `#FFFFFF` | Headings, labels |
| `text-secondary` | `#94A3B8` | Body copy, metadata, taglines |

### Semantic

| Token | Hex |
|---|---|
| Success | `#22C55E` |
| Warning | `#F59E0B` |
| Error | `#EF4444` |
| Info | `#2D6BE4` |

---

## 2. Typography

**Font Family:** Inter (sans-serif) — loaded via Google Fonts or local.

| Role | Class | Size | Weight |
|---|---|---|---|
| Display | — | 48–72px | 900 (Black) |
| Heading 1 | `text-3xl` | 30px | 800 |
| Heading 2 | `text-2xl` | 24px | 700 |
| Heading 3 | `text-xl` | 20px | 600 |
| Body | `text-base` | 16px | 400 |
| Small / meta | `text-sm` | 14px | 400 |
| Label | `text-xs` | 12px | 500 |

**Rules:**
- Use `font-black tracking-tight` for brand wordmarks and hero text.
- Use `antialiased` on `<body>` for smooth rendering on dark backgrounds.
- Line-height default: `leading-normal` (1.5). Headings: `leading-tight` (1.25).

---

## 3. Logo Usage

### Variants

| Variant | When to Use |
|---|---|
| `full` | Splash screens, auth pages, marketing pages |
| `wordmark` | Navbars, headers, footers |
| `icon` | Favicons, app icons, compact navbars |

### Sizes

| Size | Height | Use Case |
|---|---|---|
| `xs` | 24px (h-6) | Dense UI, badges |
| `sm` | 32px (h-8) | Sidebar header |
| `md` | 48px (h-12) | Default navbar |
| `lg` | 64px (h-16) | Page headers |
| `xl` | 96px (h-24) | Splash / hero |

### Rules
- Always use the BrandLogo component — never recreate the logo manually.
- On dark backgrounds: use `full` or `wordmark` variant.
- Minimum clear space: equal to the height of the truck icon on all sides.
- Do not recolor the logo. Do not apply filters or opacity.
- The PNG logo (`/logo.png`) has a gray background — use `variant="wordmark"` or `variant="icon"` in navbars.

---

## 4. Button System

### Primary (Gold CTA)
```
bg: gradient-brand (#F5A623 → #D4891E)
text: #0B1220 (dark, for contrast)
shadow: btn-shadow (0 4px 14px rgba(245,166,35,0.4))
hover: brightness-110, shadow lifted
border-radius: rounded-xl (12px)
padding: px-6 py-3
font: font-semibold text-sm tracking-wide
```

### Secondary
```
bg: surface (#111827)
border: 1px solid #243042
text: #FFFFFF
hover: border-color → #F5A623
border-radius: rounded-xl
```

### Ghost / Link
```
bg: transparent
text: #94A3B8
hover: text-white
no border, no shadow
```

### Destructive
```
bg: rgba(239,68,68,0.1)
border: 1px solid rgba(239,68,68,0.3)
text: #EF4444
hover: bg rgba(239,68,68,0.2)
```

---

## 5. Card System

### Base Card
```css
background: #111827;          /* .surface */
border: 1px solid #243042;    /* .border-default */
border-radius: 12px;          /* rounded-xl */
box-shadow: card-shadow;
padding: p-6 (24px)
```

### Elevated Card (modal, popover)
```css
background: #1A2332;          /* .surface-elevated */
border: 1px solid #243042;
border-radius: 16px;          /* rounded-2xl */
box-shadow: 0 16px 48px rgba(0,0,0,0.4);
```

### Interactive Card (clickable)
Add `.card-hover` class for border-glow on hover.

### Skeleton Loading
Use `.skeleton` class on placeholder divs. Combines shimmer animation.

---

## 6. Spacing (8px Grid)

All spacing follows a base-8 grid:

| Value | px | Tailwind |
|---|---|---|
| 1 unit | 8px | `p-2` |
| 2 units | 16px | `p-4` |
| 3 units | 24px | `p-6` |
| 4 units | 32px | `p-8` |
| 6 units | 48px | `p-12` |
| 8 units | 64px | `p-16` |

**Gaps:** `gap-4` (16px) for card grids, `gap-2` (8px) for inline items.
**Section padding:** `py-16 px-4` on mobile, `py-24 px-8` on desktop.

---

## 7. Icon Library

**Use Lucide React exclusively.**

```bash
# Already a dependency — import directly:
import { Truck, MapPin, Package, Clock, User, ChevronRight } from 'lucide-react';
```

### Standard Sizes
| Context | Size |
|---|---|
| Inline with text | 16px |
| Button icon | 18px |
| Card header icon | 24px |
| Feature icon | 32px |
| Hero icon | 48px |

### Color Rules
- Decorative / muted icons: `color="#94A3B8"` (text-secondary)
- Active / primary icons: `color="#F5A623"` (brand-gold)
- Success icons: `color="#22C55E"` (brand-green-light)
- Inside green gradient containers: `color="#FFFFFF"`

### Do Not Use
- Heroicons, FontAwesome, Material Icons — consistency requires Lucide only.
- SVG files from external sources without review.

---

## 8. Gradients Reference

| Class | Value | Use |
|---|---|---|
| `.gradient-brand` | `135deg, #F5A623 → #D4891E` | Primary buttons, highlights |
| `.gradient-green` | `135deg, #16A34A → #15803D` | Brand icon backgrounds |
| `.gradient-gold` | `135deg, #F5A623 → #D4891E` | (alias, legacy) |
| `.gradient-dark` | `135deg, #161B22 → #1C2128` | Subtle section backgrounds |
| `.gradient-hero` | radial gold + blue over dark | Landing page hero |
| `.text-gradient-gold` | clip text gold | Display headings |

---

*Last updated: 2026-07-15*
