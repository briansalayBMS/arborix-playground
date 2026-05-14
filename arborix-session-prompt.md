# Arborix Session Anchor

You are helping me build Arborix, an AI coaching product for senior professionals. Read this prompt and the two attached files in full before producing any UI, code, or copy.

## Ground truth

Two files define the system. Read both before generating anything.

- **`DESIGN.md`** is the system contract. It contains every token (primitives, semantic, components), the composition rule, the voice rules, and the antipatterns. Resolve every value through this file.
- **`atomic-composition.html`** is the rendered specimen. It is the visual proof of the contract. When DESIGN.md and the specimen disagree, the specimen wins. Flag the disagreement so I can update the contract.

## The six rules

1. **Composition flows one direction.** Primitives become semantic tokens become components become surfaces. Each tier consumes only the one directly beneath it. Surfaces and components reference semantic tokens. Only semantic tokens reference primitives. Reaching across tiers is the most common failure mode. Do not do it.

2. **Use the five components.** Button (primary and secondary), Input, Card, Badge. Compose every surface from these. When a surface seems to need something new, stop and ask before inventing a variant.

3. **Token references travel through the file.** Use the `{semantic.color.action.default}` syntax when referring to tokens in prose or YAML. Use the CSS custom property form (`var(--color-action)`) in stylesheets. Cite which token you used and which tier it belongs to.

4. **Voice rules apply to every line of copy.** Speak in positives. State what something is or does. Skip em dashes; use commas, periods, or new sentences. Skip the buzzword list: leverage, unlock, supercharge, paradigm, synergy, revolutionary. Skip AI-helper microcopy: "Let me help you with that," "I noticed," "I'd be happy to." Read every line aloud. If it sounds like a deck, rewrite.

5. **Sienna is the single moment of color per surface.** Primary button. One italic-highlighted phrase in the hero, set in Fraunces. The occasional hairline rule. The Rams ET 66 principle: a quiet object with one moment of warm color. Used everywhere, the color loses its meaning.

6. **The trusted-colleague register sets the tone.** Microcopy reads as a perceptive peer who has read the record. The user opens Arborix on a Tuesday morning forty-seven minutes before a meeting that matters. They arrive capable, not panicked. They want help, not reassurance. If a generic coaching app could say the line, rewrite it.

## Stay clear of

The prevailing AI-product visual idiom: purple-to-blue gradients, glassmorphism, dense iconography, decorative noise.

Tailwind default blue. Material 3 components. Generic shadcn theming. Anthropic and Vercel typography defaults (Instrument Serif, Geist).

Friendly-app geometry: radii larger than `radius.md` for surfaces, larger than `radius.sm` for controls.

Multiple serif moments per surface. One per surface is the budget.

Emoji in UI labels, microcopy, or AI-flavored helpfulness anywhere in the product.

Surfaces or components that touch primitives directly. Escalate to the semantic layer instead.

## Audit step

Run this self-check at the end of every generation. Report findings before showing me the output.

1. List every token used. Confirm each resolves through the semantic layer.
2. Confirm no primitives are referenced directly outside the semantic layer.
3. Confirm the five components are doing the work. Flag any custom markup.
4. Confirm microcopy passes the trusted-colleague test. Read each line aloud.
5. Confirm nothing leaked in from Tailwind defaults, Material defaults, shadcn defaults, or contemporary AI-product visual conventions.

If any check fails, fix it before showing me the output.

## When the system seems insufficient

When a surface needs a value the system lacks, the sequence is fixed.

First, find the nearest existing semantic token and use it. The system rarely lacks something the surface actually needs.

If no semantic token fits, stop and ask. Adding a primitive or a new semantic token is a deliberate, system-level decision. We make it together, separately from the surface that surfaced the need.

Concept-specific primitives are not introduced.

## Format for output

For UI mockups: produce a self-contained HTML file styled with CSS custom properties that resolve through the three tiers. Match the structural pattern of `atomic-composition.html`.

For React or Next.js code: produce TSX with Tailwind classes that map to CSS custom properties wired through `@theme`. Use shadcn/ui primitives where they fit. Cite the DESIGN.md token reference next to each styled element in a comment.

For copy alone: produce the line. Then list which voice rule each phrase satisfies. Then read the line back as the trusted colleague would say it. If those three steps land, ship it.
