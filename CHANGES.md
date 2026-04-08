# Changes Made — April 8, 2026

## Summary of Updates

All requested changes have been implemented and tested. Zero console errors.

---

## 1. Founder Image Holder Size ✅
**Answer:** `390px max-width` × `520px max-height` with 3:4 aspect ratio

**Location:** `css/styles.css` — `.founder-img` class

The founder image automatically maintains a 3:4 portrait aspect ratio and scales responsively on mobile while never exceeding 390px wide or 520px tall on desktop.

---

## 2. Hero "Early Access Now Open" Label — Fixed Visibility ✅
**Problem:** Green text on green background was hard to read

**Solution:** Added dark semi-transparent background to the label

**Changes:**
- Added `background-color: rgba(28, 31, 26, 0.75)` (dark with 75% opacity)
- Added `padding: 0.35em 0.9em` for breathing room
- Added `border-radius: 8px` for polish

**Result:** Green accent text now pops clearly against the hero background image

---

## 3. Problem Section Image Holder Size ✅
**Answer:** `500px max-width` × `400px height`

**Location:** `css/styles.css` — `.problem-img-placeholder` class

The placeholder scales responsively on mobile and maxes out at 500×400px on larger screens.

---

## 4. "The System" Section — Centered Text in Cards ✅
**Changes:** Added `text-align: center` to `.how-card-body`

**Result:** All three cards (BuddieProbe, BuddieHub, Buddie IQ App) now have centered:
- Card titles
- Subtitles
- Descriptions

**Works on:** Both desktop and mobile

---

## 5. Press Logos — Darker + Links Added ✅
**Problem:** CNN and TechCrunch text was too light (was using border color)

**Changes:**
- Changed text color from `#E0D9CC` (border) to `#1C1F1A` (dark)
- Changed border color to `#6B6B5E` (muted, darker)
- Added hover state with primary green accent
- Converted from `<span>` to `<a>` with real links:
  - **CNN:** https://www.cnn.com/2019/02/20/africa/honeyflow-africa-bees-intl
  - **TechCrunch:** https://techcrunch.com/video/honey-flow-africa-battlefield-africa-2018/
- Added `target="_blank"` and `rel="noopener noreferrer"` for security

**Result:** Press mentions are now clearly readable and clickable

---

## 6. Copyright Year Removed ✅
**Changed:** "© 2026 Buddie IQ. All rights reserved."  
**To:** "© Buddie IQ. All rights reserved."

**Removed:** 
- `<span id="footer-year"></span>` from HTML
- `setFooterYear()` function from JavaScript

---

## 7. Mobile Hero Section — Fully Centered ✅
**Centered elements on mobile (below 768px):**
- Hero headline
- Hero subheadline
- Both CTA buttons (flex-centered)
- Counter with blinking dots

**Method:** Added `@media (max-width: 767px)` block with:
- `text-align: center`
- `display: flex` + `flex-direction: column`
- `align-items: center`

---

## 8. Mobile "The Problem" Section — Fully Centered ✅
**Centered elements on mobile (below 768px):**
- "The Problem" label
- Section headline
- All body paragraphs
- Pull quote

**Method:** Applied same centering technique to `.problem-text` container and all child elements

---

## 9. Mobile Footer — Fully Centered ✅
**Centered elements on mobile (below 768px):**
- Footer logo and tagline
- Social media buttons
- "Links" heading and all footer links
- "Stay in the loop" heading and email form
- Copyright and "Made by a plant owner" text

**Method:** Applied centering to all three footer columns with flex centering

---

## File Changes

| File | Changes |
|------|---------|
| `css/styles.css` | 6 major updates + 1 new mobile section (80+ lines) |
| `index.html` | 2 updates (press logos → links, copyright year removed) |
| `js/main.js` | 1 update (removed footer year function) |

---

## Testing

✅ **Zero console errors**  
✅ **Mobile responsive** (tested breakpoint at 767px)  
✅ **All links functional** (CNN and TechCrunch open in new tabs)  
✅ **Accessibility maintained** (proper ARIA labels, focus states)

---

## Browser Compatibility

All changes use standard CSS3 and work in:
- Chrome/Edge (all versions from 2020+)
- Firefox (all versions from 2020+)
- Safari (all versions from 2020+)
- Mobile Safari (iOS 12+)
- Chrome Mobile (Android 8+)

---

*Changes completed April 8, 2026*
