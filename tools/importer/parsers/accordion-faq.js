/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: accordion-faq
 * Base block: accordion (no UE model; 2-column library structure, no field hints)
 * Source: https://wknd-trendsetters.site/ (4 details/summary Q&A items)
 * Structure: 2 columns, one row per item — [question (summary) | answer (body)]. No field hints.
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
    const questionCell = questionSpan || summary || '';

    // Answer: the body content.
    const answer = item.querySelector('.faq-answer') || item.querySelector('details > div:not(summary)');
    const answerCell = answer || '';

    cells.push([questionCell, answerCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
