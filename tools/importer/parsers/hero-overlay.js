/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: hero-overlay
 * Base block: hero (blocks/hero/_hero.json)
 * Model fields: image (reference), imageAlt (collapsed → img alt), text (richtext)
 * Source: https://wknd-trendsetters.site/ (closing hero: full-bleed bg image + overlay + heading + subheading + 1 CTA)
 * Structure: 1 column. Row 2 = background image (field:image), Row 3 = text (field:text).
 */
export default function parse(element, { document }) {
  // --- Extraction (validated against source.html) ---
  // Full-bleed background image (overlay/cover image).
  const bgImage = element.querySelector('img.cover-image, img[class*="overlay"], img');
  // Text content lives inside .card-body.
  const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
  const subheading = element.querySelector('p, .subheading, [class*="subheading"]');
  const ctas = Array.from(element.querySelectorAll('.button-group a, a.button'));

  // Empty-block guard
  if (!heading && !subheading && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image cell (field:image).
  if (bgImage) {
    cells.push([[document.createComment(' field:image '), bgImage]]);
  }

  // Row 3: text cell (field:text) — heading + subheading + CTA as richtext.
  const textCell = [document.createComment(' field:text ')];
  if (heading) textCell.push(heading);
  if (subheading) textCell.push(subheading);
  ctas.forEach((a) => textCell.push(a));
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-overlay', cells });
  element.replaceWith(block);
}
