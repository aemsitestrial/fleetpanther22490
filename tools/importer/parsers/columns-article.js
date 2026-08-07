/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: columns-article
 * Base block: columns (blocks/columns/_columns.json)
 * Columns blocks do NOT use field hints (hinting.md Rule 4 exception) — cells hold default content.
 * Source: https://wknd-trendsetters.site/ (featured article: large image | breadcrumb + heading + author meta)
 * Structure: 1 header row + 1 content row with 2 columns (image cell, text cell).
 */
export default function parse(element, { document }) {
  // Direct children of the grid are the columns.
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Image column: the one containing the cover image.
  const imageCol = columns.find((c) => c.querySelector('img')) || columns[0];
  // Text column: the one containing the heading (breadcrumb + heading + author meta).
  const textCol = columns.find((c) => c.querySelector('h1, h2, h3, [class*="heading"]'))
    || columns.find((c) => c !== imageCol)
    || columns[1];

  // Empty-block guard
  if (!imageCol && !textCol) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  // Content row: 2 columns.
  cells.push([
    imageCol || '',
    textCol || '',
  ]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-article', cells });
  element.replaceWith(block);
}
