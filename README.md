# OUKKA flagship design preview

## Review

- Home: `index.html`
- Product: `product.html`
- Product record / QR destination: `record.html`
- Previous visual files are preserved under `archive/`.

This is an interactive static design template, not an installed Shopify theme.

## Visual direction

Neutral gallery white `#fafafa`, silver `#ededed`, smoke-black `#111213`, a restrained red-orange accent `#ac381d`. Sans-serif typography, sharp corners, raw concrete, mountain and coastal media. The requested white theme is fixed; system dark mode does not change the art direction.

## Interactions

Product colour selection, separate product page, zoom, image gallery, reversible white-sample views, local preview bag with quantity/removal, accessible native dialogs, video playback/pause, reduced motion, locally imported video preview, and a subscription form demonstration. No checkout, order, email subscription or repair request is submitted.

## Video placements

The `MEDIA` object at the top of `script.js` has separate `hero`, `campaign` and `product` slots. Also update the initial poster/source in the corresponding HTML when replacing the media. Current clips are gentle motion treatments of generated concept stills, not approved filmed campaigns.

Use Shopify-hosted MP4 and a matching poster for production. The homepage background is muted/looping; the film dialog has native controls. The gallery film button can have a distinct product demonstration video. The local video picker does not upload or persist footage.

## Production data needed

Confirmed price, inventory, variants, dimensions, weight, material composition, product videos, delivery and returns, care label instructions, repair terms, contact details, and email/checkout integrations. The sample QR currently encodes an example address and must not be printed. Set the approved live record URL and regenerate it before launch. Click the label to preview the actual record page now.

## Shopify mapping

Home sections correspond to campaign video, brand text, featured product, film, Phase 0, repair, journal and newsletter blocks. Product gallery and purchase panel map to the product template and Shopify product/variant data. Product-record content maps to a product-linked metaobject. Native Shopify cart, consent, checkout, customer forms and policies must replace local demonstrations.

## Verification

Run `python3 validate_site.py` and `node --check script.js`. These are static checks, not an end-to-end browser or Lighthouse audit.

## Generated sharing asset

`assets/og.png` is generated using the built-in image tool. Prompt: premium original landscape OUKKA outdoor campaign cover, neutral white/gray concrete architecture meeting foggy mountains and steel-gray coast, Swiss sans typography; exact text “OUKKA”, “OUTSIDE. EVERY DAY.”, “QUIET UTILITY FOR OUTDOOR LIFE”; one small burnt-red accent, no other brands or products.
