/*
 * Accordion FAQ Block
 * Expandable question/answer list using native <details>/<summary>.
 * Icon: plus that rotates to an X when open (matches source design).
 */

import { moveInstrumentation } from '../../scripts/scripts.js';

function createIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'accordion-faq-icon');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '20');
  svg.setAttribute('height', '20');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>';
  return svg;
}

export default function decorate(block) {
  [...block.children].forEach((row) => {
    // question -> summary with text span + icon
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-faq-item-label';
    const question = document.createElement('span');
    question.className = 'accordion-faq-item-question';
    question.append(...label.childNodes);
    summary.append(question, createIcon());

    // answer -> body
    const body = row.children[1];
    body.className = 'accordion-faq-item-body';

    // wrap into details
    const details = document.createElement('details');
    moveInstrumentation(row, details);
    details.className = 'accordion-faq-item';
    details.append(summary, body);
    row.replaceWith(details);
  });
}
