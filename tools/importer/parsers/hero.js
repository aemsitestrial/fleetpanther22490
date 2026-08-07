/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: hero
 * Base block: hero (existing repo block — blocks/hero/_hero.json)
 * Model fields: image (reference), imageAlt (collapsed → img alt), text (richtext)
 * Source: https://wknd-trendsetters.site/ (intro hero: text/CTA column + column of 3 stacked images)
 * Structure: 1 column. Row 2 = image cell (field:image), Row 3 = text cell (field:text).
 */
export default function parse(element, { document }) {
  // --- Extraction (selectors validated against source.html) ---
  // Heading, subheading and CTAs live in the first grid child (text column).
  const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
  const subheading = element.querySelector('p, .subheading, [class*="subheading"]');
  const ctas = Array.from(element.querySelectorAll('.button-group a, a.button'));
  // All cover images (second grid child holds the 3 stacked images).
  const images = Array.from(element.querySelectorAll('img.cover-image, img'));

  // Empty-block guard
  if (!heading && !subheading && images.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: image cell (field:image) — keeps all source images together.
  if (images.length) {
    const imageCell = [document.createComment(' field:image ')];
    images.forEach((img) => imageCell.push(img));
    cells.push([imageCell]);
  }

  // Row 3: text cell (field:text) — heading + subheading + CTAs as richtext.
  const textCell = [document.createComment(' field:text ')];
  if (heading) textCell.push(heading);
  if (subheading) textCell.push(subheading);
  ctas.forEach((a) => textCell.push(a));
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
