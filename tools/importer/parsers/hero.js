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
  // The hero model defines `image` as a single reference (multi: false), so only
  // ONE image maps into the field:image cell. The source intro shows a 3-image
  // stack, but the existing hero block cannot preserve that (accepted tradeoff);
  // pushing multiple images breaks md2jcr model mapping. Use the first image only.
  const image = element.querySelector('img.cover-image, img');

  // Empty-block guard
  if (!heading && !subheading && !image) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: image cell (field:image) — single image to match the model reference.
  if (image) {
    cells.push([[document.createComment(' field:image '), image]]);
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
