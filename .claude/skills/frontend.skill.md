# Frontend Design Skill

Use this skill when creating or modifying UI components, pages, or visual design.

---

## This Project's Visual Identity

**Personality:** Enterprise-minimal. Clean, professional, trustworthy—but not sterile.

**Signature elements:**
- Semantic color-coded tool cards (blue → JSON Validator, cyan → Minifier, violet → JWT, emerald → Jasypt)
- Sky blue (`#0ea5e9`) as primary accent
- Neutral zinc scale for structure and typography
- Inter for UI, JetBrains Mono for code
- Subtle elevation via shadows, not heavy borders
- Light/dark mode via `data-theme` attribute

**The baseline:** These choices are intentional. Extend and evolve from here—don't ignore or accidentally override.

---

## Before Writing Code

**For large changes** (new pages, redesigns, new component systems):
- Ask: "Do you have a reference site, theme, or mood in mind?"
- If none: propose 2-3 distinct directions with tradeoffs
- Clarify: evolve existing identity or intentionally depart?

**For small changes** (adding a component, fixing styling, minor features):
- Match existing patterns by default
- Make it feel like it belongs, not like it was bolted on

---

## Creative Process (For Non-Trivial Work)

### Step 1: Pick One Anchor
Every distinctive design has ONE defining element. The rest supports it.
- A typeface with character
- An unexpected accent color
- A signature interaction
- An atmospheric background

Don't let multiple elements compete for attention.

### Step 2: Generate Then Eliminate
Before implementing, consider:
- What's the obvious choice?
- What's the opposite?
- What's a third option?

If you can't say why you're choosing one, you haven't thought enough.

### Step 3: The "Would I Notice?" Test
After building: "If I saw this among 10 similar tools, would anything make me pause?"

No? You've converged to the mean. Find the anchor.

---

## Red Flags in Your Output

Stop and reconsider if you're about to:
- Introduce a new font without checking availability and fallbacks
- Add a gradient that doesn't exist elsewhere in the app
- Apply inconsistent border-radius or shadow values
- Use hardcoded colors instead of CSS variables
- Add animation without `prefers-reduced-motion` handling
- Create a component that looks like it's from a different app

The existing system is the constraint. New elements should feel native.

---

## Project Constraints

### File Locations
```
src/styles/globals.css      → CSS variables, font imports, keyframes
src/styles/design-tokens.ts → Token definitions
tailwind.config.js          → Extended theme values
src/components/ui/          → Shared components (CVA variants)
```

### Technical Guards
- **Colors:** Always use CSS variables (`var(--text-primary)`)
- **Dark mode:** Must work via `[data-theme='dark']` selectors
- **Fonts:** Max 2 families, 3-4 weights. Use `font-display: swap`
- **Motion:** CSS-only preferred. Respect `prefers-reduced-motion`
- **Touch:** 44px minimum targets (already enforced)

### Accessibility
- Contrast: 4.5:1 for text, 3:1 for large text/UI components
- Focus states: visible outline on all interactive elements
- Screen readers: semantic HTML, ARIA labels where needed

---

## Adding New Elements

### New Colors
1. Define light AND dark mode variants
2. Add to `globals.css` CSS variables
3. Test all states: default, hover, active, disabled, focus
4. Verify contrast ratios

### New Typography
1. Confirm font is available (Google Fonts, Fontsource, or self-hosted)
2. Test weight range before committing
3. Check fallback renders acceptably during load
4. Update `design-tokens.ts` if adding to system

### New Animation
1. Define trigger: page load, interaction, or state change?
2. Durations: 150-300ms micro-interactions, 300-500ms reveals
3. Easing: `ease-out` for enters, `ease-in` for exits
4. Add reduced-motion fallback

### New Background Treatment
1. Test on both light and dark themes
2. Ensure text remains readable at all sizes
3. Gradients are cheap; filters and blur are expensive

---

## When Stuck

Look at these for principles (not copying):
- **IDE themes** — Nord, Dracula, One Dark—designed for focus
- **CLI tool sites** — Stripe CLI, Vercel, Railway
- **Dev tool interfaces** — Linear, Raycast, Warp

Ask: What makes it feel intentional? Extract that, not the surface.

---

## Delivery Checklist

- [ ] Matches existing visual identity (or intentionally evolves it with user approval)
- [ ] Works in both light and dark mode
- [ ] Contrast ratios pass (4.5:1 text, 3:1 UI)
- [ ] No hardcoded colors—all via CSS variables
- [ ] Motion respects `prefers-reduced-motion`
- [ ] Can articulate why this choice over alternatives
