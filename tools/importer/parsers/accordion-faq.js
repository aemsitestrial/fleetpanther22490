/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: accordion-faq
 * Base block: accordion-faq (xwalk item model accordion-faq-item: summary (text), text (richtext))
 * Source: https://wknd-trendsetters.site/ (4 details/summary Q&A items)
 * Structure: container block — one row per item, 2 cells [summary | text] with field hints.
 */
export default function parse(element, { document }) {
  // Each FAQ item is a <details> element.
  const items = Array.from(element.querySelectorAll(':scope > details.faq-item, details.faq-item, :scope > details'));

  // Empty-block guard
  if (!items.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  items.forEach((item) => {
    // Question: the text inside the summary (ignore the toggle icon image).
    const summary = item.querySelector('summary');
    const questionSpan = summary ? summary.querySelector('span') : null;
    const question = questionSpan || summary;

    // Answer: the body content.
    const answer = item.querySelector('.faq-answer') || item.querySelector('details > div:not(summary)');

    // Cell 1: field:summary (question). Cell 2: field:text (answer richtext).
    const summaryCell = question
      ? [document.createComment(' field:summary '), question]
      : '';
    const textCell = answer
      ? [document.createComment(' field:text '), answer]
      : '';

    cells.push([summaryCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
