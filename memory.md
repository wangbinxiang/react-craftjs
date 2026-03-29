# React Example Memory

## Purpose

- This workspace is the React + Vite port of the legacy `examples/landing` demo.
- It preserves the full Craft.js editing flow instead of flattening the page into static markup.

## Runtime Structure

- `src/main.tsx` is the only browser entrypoint and replaces Next's `_app.tsx`.
- `src/App.tsx` now acts as a lightweight pathname router that resolves `/`, `/editor`, and `/preview/:slug` into the editor shell or a page-specific read-only preview.
- `src/lib/editor-config.tsx` is the shared source of truth for Craft's resolver map, MUI theme, the default landing-page node tree, the case-detail starter tree, and the blank page fallback tree used when a saved page has no persisted frame data.
- `src/lib/editor-config.tsx` now also defines the fixed product-detail starter tree that seeds the editor's permanent `Product` tab.
- `src/data/product.ts` is the canonical product data source and provides the helper that reapplies product-bound fields onto saved Craft node JSON before editor/preview render.
- `src/data/landing.ts` retrofits saved legacy Home-page node trees with the responsive landing class contract so old localStorage drafts still react to the editor's viewport shell.
- `src/data/product.ts` also upgrades legacy product CTA nodes from `Button` to `ProductCta` during hydration so old saved product pages gain the modal without reauthoring.
- `src/components/editor/*` renders the editor shell: viewport, header, toolbox, sidebar, layers, toolbar, and node overlay.
- `src/components/editor/Viewport/devicePreview.ts` is the shared contract for editor-only device preview modes and keeps the header labels aligned with the fixed canvas widths.
- `src/components/editor/Viewport/PageTabs.tsx` now renders only the top-level page switching tabs; the secondary management strip for slug display, rename, and reorder was removed from the editor header.
- `src/components/selectors/*` defines the editable user components and their move-in / move-out rules; the custom `Image` selector is now part of the default toolbox and resolver map.
- `src/components/selectors/ProductCta/index.tsx` is the product-only CTA selector that opens the purchase confirmation modal in both editor and preview while still attaching the Craft connector to the trigger button.
- `src/pages/EditorPage.tsx` now manages a site document with `pages[]`, `pageOrder[]`, and `currentPageId`, commits the active page draft before page switches / preview opens / finish-edit transitions, remounts the current Craft editor per page to avoid cross-page render warnings, and injects live product data into the fixed `Product` page before render.
- `src/pages/EditorPage.tsx` also owns the transient `desktop / tablet / mobile` preview mode for the editor shell; that preference is session-only and never persists into the saved site document.
- `src/pages/PreviewPage.tsx` resolves the target page by `slug`, renders that page's saved draft into a read-only `Editor` + `Frame` pair, and shows an explicit unavailable state when the slug is missing or unsaved.
- `src/pages/PreviewPage.tsx` uses the same product-data injection path as the editor so `/preview/product` reflects source-of-truth data without forcing users to resave layout.
- `src/utils/preview.ts` owns landing/detail/product template sentinel values, route helpers, site-document storage, and the shared `resolvePageFrameSource()` helper so editor and preview keep matching fallback behavior.

## Build Constraints

- SVG icons live under `src/assets/icons` because Vite can only turn source assets into React components through SVGR.
- Detail-page illustration assets under `src/assets/images` must be imported with `?url`; plain `*.svg` imports resolve to React components in this example's Vite setup.
- `vite.config.ts` uses `base: '/examples/react/'` so the built example can be hosted under the examples path.
- Tailwind only provides utility styling; styled-components still owns most editor chrome and overlay styling.
- Route helpers in `src/utils/preview.ts` must always respect `import.meta.env.BASE_URL`, otherwise `/editor` and `/preview/:slug` work in dev but break when the example is hosted under `/examples/react/`.
- The fixed product page is previewed through `/preview/product`, not through a separate standalone route.
- Site persistence now lives under `SITE_STORAGE_KEY` in `src/utils/preview.ts`, with a legacy migration path from the old single-page preview key.
- The editor no longer lets users add pages; retained multi-page behavior exists only to keep old saved documents editable and previewable, while hydration ensures the fixed `Product` page is always present.

## Maintenance Notes

- If drag/drop or selection breaks, inspect `Viewport`, `RenderNode`, and `Resizer` first because they wire Craft.js connectors into real DOM nodes.
- If a selector stops accepting children correctly, check its `*.craft.rules` block before changing surrounding layout.
- The example still posts `LANDING_PAGE_LOADED` to `window.parent` to preserve parity with the original landing integration.
- The initial site document seeds a single `Home` page whose `frameData` uses a landing sentinel value, so untouched home pages still render the original demo tree after reload.
- The initial site document now also seeds a fixed `Product` page whose sentinel resolves to the product-detail Craft template.
- Previously saved extra pages are still switchable and previewable, but the editor header no longer exposes inline rename or reorder controls for any page.
- Preview now reads the saved site document, not transient in-memory editor state, so page-switch and finish-edit flows must commit pending drafts before navigation.
- Product-bound fields are marked on Craft node props and rehydrated from `src/data/product.ts`; if product preview stops updating after a data change, inspect that binding helper before debugging layout code.
- The product modal is intentionally local UI state only: it should never be persisted into site storage, and `Confirm` currently only closes the dialog instead of following `ctaHref`.
- Corrupted site documents or unknown preview slugs should surface the explicit unavailable preview state instead of falling back to a different saved page.
- Detail-page responsiveness is intentionally driven by a small set of CSS classes in `src/styles/app.css` rather than expanding the Container schema with breakpoint props; those classes are part of the template contract.
- Home-page responsiveness now follows the same pattern: the landing template and `src/data/landing.ts` share `landing-*` class names, so Home viewport bugs should be debugged in template markup, landing hydration, and `src/styles/app.css` together.
- The Home root no longer applies its own `800px` max-width; `landing-page-root` stays `width: 100%` and `landing-page-shell` now inherits width from the editor's device preview shell, while Product and Detail still keep their dedicated width shells.
- Product-detail responsiveness is also class-driven in `src/styles/app.css`, but it uses a separate `product-*` namespace so the fixed product template can change without affecting the legacy case-detail template.
- The editor header now includes device preview toggles and the viewport wraps the Craft frame in a fixed-width shell, so responsive checks should be debugged through `devicePreview.ts`, `Header.tsx`, `Viewport/index.tsx`, and the `.viewport-canvas-*` styles together.
- The editor sidebar is now strictly workspace UI; the previous Carbon Ads footer script and its global `#carbonads` styling were removed and should not be reintroduced when adjusting sidebar layout.
