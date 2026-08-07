/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: cards-gallery
 * Base block: cards (blocks/cards/_cards.json — card model: image (reference), text (richtext))
 * Source: https://wknd-trendsetters.site/ (image-only 8-image grid)
 * Structure: container block — one row per card, 2 cells (image | text).
 * Image-only gallery: image cell has field:image; text cell is empty (still included per description).
 */
export default function parse(element, { document }) {
  // Each direct child div is a card wrapping a single cover image.
  let items = Array.from(element.querySelectorAll(':scope > div'));
  // Fallback: if the grid nests differently, collect image containers.
  if (!items.length) {
    items = Array.from(element.querySelectorAll('.utility-aspect-1x1'));
  }

  // Empty-block guard
  if (!items.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  items.forEach((item) => {
    const img = item.querySelector('img');
    // Image cell (field:image) + empty text cell — kept per Cards description.
    const imageCell = img ? [document.createComment(' field:image '), img] : '';
    cells.push([imageCell, '']);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
