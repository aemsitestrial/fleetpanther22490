/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: tabs-testimonial
 * Base block: tabs-testimonial (xwalk item model tabs-testimonial-item: label (richtext), content (richtext))
 * Source: https://wknd-trendsetters.site/ (4 switchable testimonial panels + tab menu of avatar/name/role)
 * Structure: container block — one row per tab, 2 cells [label | content] with field hints.
 */
export default function parse(element, { document }) {
  // Content panels and the tab menu buttons.
  const panes = Array.from(element.querySelectorAll('.tabs-content .tab-pane, .tab-pane'));
  const menuLinks = Array.from(element.querySelectorAll('.tab-menu .tab-menu-link, .tab-menu-link'));

  // Empty-block guard
  if (!panes.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  panes.forEach((pane, i) => {
    // Label content: prefer the tab-menu button label; fall back to the name inside the pane.
    let label;
    const menu = menuLinks[i];
    if (menu) {
      // Use the name/role text block from the menu button (skip the avatar image).
      const nameBlock = menu.querySelector('.flex-horizontal > div:not(.avatar), div:not(.avatar) > div')
        ? menu.querySelector('.flex-horizontal > div:not(.avatar)')
        : null;
      label = nameBlock || menu;
    } else {
      const name = pane.querySelector('.paragraph-xl strong, strong');
      label = name ? name.closest('div') || name : null;
    }

    // Content: the full pane content (image + name + role + quote).
    const contentInner = pane.querySelector('.grid-layout') || pane;

    // Cell 1: field:label (tab label). Cell 2: field:content (panel richtext).
    const labelCell = label
      ? [document.createComment(' field:label '), label]
      : [document.createComment(' field:label '), `Tab ${i + 1}`];
    const contentCell = contentInner
      ? [document.createComment(' field:content '), contentInner]
      : '';

    cells.push([labelCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
