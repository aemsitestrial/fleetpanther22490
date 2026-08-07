/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: cards
 * Base block: cards (existing repo block — blocks/cards/_cards.json)
 * Card model fields: image (reference), text (richtext). imageAlt is collapsed onto the img.
 * Source: https://wknd-trendsetters.site/ (4 article cards: image + tag + date + title, each linking to an article)
 * Structure: container block — one row per card, 2 cells (image | text). Card link kept inside text as CTA.
 */
export default function parse(element, { document }) {
  // Each card is an <a> article-card link (fallback to direct-child divs).
  let items = Array.from(element.querySelectorAll(':scope > a.article-card, :scope > a.card-link'));
  if (!items.length) items = Array.from(element.querySelectorAll(':scope > a'));
  if (!items.length) items = Array.from(element.querySelectorAll(':scope > div'));

  // Empty-block guard
  if (!items.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  items.forEach((item) => {
    const img = item.querySelector('img');
    const href = item.getAttribute('href');

    // Image cell (field:image).
    const imageCell = img ? [document.createComment(' field:image '), img] : '';

    // Text cell (field:text): tag + date + title, wrapped as a link to the article.
    const textCell = [document.createComment(' field:text ')];
    const tag = item.querySelector('.tag');
    const meta = item.querySelector('.article-card-meta');
    const date = meta ? meta.querySelector('.paragraph-sm, span:not(.tag)') : null;
    const title = item.querySelector('h1, h2, h3, h4, [class*="heading"]');

    // Build a link that carries the card content and preserves the article href.
    if (href) {
      const link = document.createElement('a');
      link.setAttribute('href', href);
      if (tag) link.appendChild(tag);
      if (date) link.appendChild(date);
      if (title) link.appendChild(title);
      // If nothing was collected, use the title text as link label.
      if (!link.childNodes.length) link.textContent = (title && title.textContent) || href;
      textCell.push(link);
    } else {
      if (tag) textCell.push(tag);
      if (date) textCell.push(date);
      if (title) textCell.push(title);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards', cells });
  element.replaceWith(block);
}
