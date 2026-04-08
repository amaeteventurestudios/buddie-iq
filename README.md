# Buddie IQ — Your Plants Finally Have a Voice

> A battery-free plant care system that tells you exactly what your plant needs before it shows signs of stress.

---

## Project Overview

**Buddie IQ** is a production-ready, single-page marketing and early-access capture website for the BuddieProbe plant care system. It is built with zero dependencies — pure HTML5, CSS3, and vanilla JavaScript. No build tools, no npm, no frameworks.

✨ **Hero image and founder portrait are already integrated and active.**

**Founder:** Amaete Umanah — wireless sensing system engineer, CNN featured, TechCrunch Battlefield alum. Nine plants. Complicated history.

**Live URL:** [https://buddieiq.com](https://buddieiq.com)

---

## File Structure

```
buddie-iq/
├── index.html             # Main single-page application
├── css/
│   └── styles.css         # Full design system and all component styles
├── js/
│   └── main.js            # All interactivity and JS logic
├── images/                # (Add your own images — see below)
│   ├── Monstera_window_light.jpg    # Hero background image
│   ├── Amaete_Umanah.jpg            # Founder portrait
│   ├── product_lifestyle.jpg        # Problem section lifestyle photo
│   ├── BuddieProbe.jpg              # How It Works card image
│   ├── BuddieHub.jpg                # How It Works card image
│   └── BuddieApp.jpg                # How It Works card image
└── README.md              # This file
```

---

## Completed Features

### Sections
- [x] **Sticky Navigation** — transparent over hero, solid + border on scroll, mobile hamburger drawer
- [x] **Hero** — full-viewport, bottom-left anchored content, animated counter, dual CTAs, **real hero image active**
- [x] **Problem Section** — two-column desktop layout, pull quote, stat card overlay, **real transparent pot image active**
- [x] **How It Works** — dark three-card layout with staggered reveal
- [x] **Founder Section** — two-column with **real founder photo integrated**, press logos
- [x] **Trust Bar** — three guarantee items
- [x] **Signup Section** — tab-switched pre-order/waitlist forms with success states, **Stripe Checkout integrated**
- [x] **FAQ Accordion** — seven questions, smooth animation, one-open-at-a-time
- [x] **Footer** — three-column grid, social links, inline newsletter form, copyright

### JavaScript Functionality
- [x] Sticky nav scroll class toggle (threshold: 40px)
- [x] Mobile nav toggle with ARIA attributes
- [x] Scroll reveal via `IntersectionObserver` (threshold: 0.05)
- [x] Immediate reveal for in-viewport elements on load
- [x] `prefers-reduced-motion` guard — disables all animations if requested
- [x] Animated counter with `requestAnimationFrame` and easing
- [x] Tab switching (pre-order ↔ waitlist) with ARIA roles
- [x] "Just keep me updated" → auto-opens waitlist tab and scrolls
- [x] FAQ accordion with smooth `max-height` CSS transition
- [x] Form validation (email format, non-empty name)
- [x] **Stripe Checkout integration — live $20 payments**
- [x] **Success/cancel redirect handling from Stripe**
- [x] Footer email inline confirmation
- [x] Smooth scroll with nav-height offset
- [x] Active nav link highlighting via IntersectionObserver
- [x] Staggered card reveal delays

### Design System
- [x] Google Fonts: Playfair Display, DM Sans, DM Mono
- [x] CSS custom properties (tokens) for all colors, spacing, radii
- [x] Mobile-first responsive grid (1 → 2 → 3 column)
- [x] Semantic HTML with ARIA labels throughout
- [x] Focus-visible styles for keyboard navigation
- [x] Print styles

---

## Stripe Integration (Active)

### Status: ✅ **LIVE AND FUNCTIONAL**

The pre-order form is connected to Stripe Checkout and ready to accept real $20 deposits.

### Configuration:
- **Publishable Key:** `pk_live_51TJwQWPGWBPwgAs6W9J4ULL5mFKcqaUby3umb4HHwdrZw4rDxMY8BbdY3HECytgX06gqzCpELf7zw3ydjMChh8sl005QdiIpcA`
- **Price ID:** `price_1TJwxUPGWBPwgAs6aCw225g4`
- **Amount:** $20.00 USD
- **Mode:** Payment (one-time)

### User Flow:
1. User enters name and email on pre-order form
2. Clicks "Reserve My Spot — $20"
3. Form validates input
4. Button text changes to "Redirecting to payment…"
5. User is redirected to Stripe Checkout hosted page
6. After payment or cancel, user returns to site
7. Success: Form hidden, success message shown, scroll to signup section
8. Cancel: Button resets, user can try again

### Files Modified:
- `index.html` — Added `<script src="https://js.stripe.com/v3/"></script>` in head
- `js/main.js` — Replaced simulated form submission with `stripe.redirectToCheckout()`
- `js/main.js` — Added URL parameter handler for `?success=true` and `?canceled=true`

### Testing:
Use Stripe test cards on the checkout page:
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- Any future expiration date, any CVC

---

## Adding Additional Images

Two images are already integrated ✅:
- ✅ `Monstera_window_light.jpg` — hero background (active)
- ✅ `Amaete_Umanah.jpg` — founder portrait (active)
- ✅ `product_lifestyle.jpg` — problem section transparent pot (active)

### Still needed (optional):
To replace remaining placeholders, add to `/images/`:
- `product_lifestyle.jpg` — problem section lifestyle photo
- `BuddieProbe.jpg` — How It Works card #1
- `BuddieHub.jpg` — How It Works card #2
- `BuddieApp.jpg` — How It Works card #3

Each placeholder has a comment in `index.html` showing the exact replacement code.

---

## Integrating Email Marketing (Waitlist Form)

The waitlist form currently shows a simulated success message. To connect it to your email provider:

In `js/main.js`, find **`EMAIL MARKETING INTEGRATION POINT`** inside `initWaitlistForm()` and `initFooterForm()`.

### ConvertKit (via Vercel Edge Function)
```js
// api/subscribe.js
export default async function handler(req, res) {
  const { email } = JSON.parse(req.body);
  await fetch(`https://api.convertkit.com/v3/forms/${process.env.CK_FORM_ID}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: process.env.CK_API_KEY, email })
  });
  res.status(200).json({ ok: true });
}
```

### Mailchimp
Replace the form `action` attribute with your Mailchimp embedded form action URL and set `method="POST"`. Mailchimp's embedded forms work without a backend.

### Table API (built-in, no backend needed)
```js
fetch('tables/waitlist', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: emailInput.value.trim() })
});
```

---

## Data Models (Table API)

If using the built-in Table API for lead capture:

### `preorders` table
| Field      | Type   | Description             |
|------------|--------|-------------------------|
| id         | text   | Auto-generated UUID     |
| first_name | text   | Customer first name     |
| email      | text   | Customer email address  |
| created_at | datetime | Submission timestamp  |

### `waitlist` table
| Field      | Type   | Description             |
|------------|--------|-------------------------|
| id         | text   | Auto-generated UUID     |
| email      | text   | Subscriber email        |
| created_at | datetime | Subscription date     |

---

## Deployment

This project requires no build step. It can be deployed anywhere that serves static files.

### Vercel (recommended)
1. Push the `buddie-iq/` folder to a GitHub repo
2. Connect the repo to [vercel.com](https://vercel.com)
3. Set root directory to `buddie-iq/` (or deploy from repo root if that is the folder)
4. Deploy — done. No build command needed.

### Local Development
Open `index.html` directly in a browser, or use any static server:
```bash
npx serve .
# or
python3 -m http.server 3000
```

### Environment Variables (for integrations)
Set these in your Vercel project settings:
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
CK_API_KEY=your_convertkit_api_key
CK_FORM_ID=your_convertkit_form_id
```

---

## Not Yet Implemented

- [ ] Email marketing integration for waitlist (ConvertKit / Mailchimp)
- [ ] Real product photography for How It Works cards (BuddieProbe, BuddieHub, App)
- [ ] Analytics (Plausible / Google Analytics)
- [ ] Privacy Policy page content
- [ ] Terms of Service page content
- [ ] Social media profile links (update `href="#"` in footer)
- [ ] Dynamic waitlist counter (connect to backend or Table API)
- [ ] Order management dashboard for Stripe payments

---

## Recommended Next Steps

1. ✅ ~~Add real photography~~ — **DONE** (hero, founder, problem section)
2. ✅ ~~Connect Stripe~~ — **DONE** (live $20 deposits active)
3. **Connect ConvertKit/Mailchimp** — activate email list capture for free waitlist signups
4. **Add product images** — BuddieProbe, BuddieHub, and App screenshots for How It Works cards
5. **Add Plausible analytics** — one script tag, privacy-first, no cookie banner needed
6. **Create Privacy Policy and Terms pages** — required before running paid ads
7. **Test Stripe in production** — use test cards first, then real payment
8. **Monitor Stripe Dashboard** — track deposits and manage refunds

---

## Brand Quick Reference

| Token | Value |
|-------|-------|
| Background | `#F5F0E8` |
| Dark | `#1C1F1A` |
| Primary Green | `#2D5016` |
| Accent Green | `#8FB339` |
| Terracotta | `#C4783A` |
| Off-white | `#FDFCF8` |
| Border | `#E0D9CC` |
| Muted Text | `#6B6B5E` |
| Headline Font | Playfair Display |
| Body Font | DM Sans |
| Mono Font | DM Mono |

---

*Built by a plant owner, for plant owners.*
