/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: tabs-testimonial
 * Base block: tabs (no UE model; tabs component excluded from field hinting per hinting.md Rule 5)
 * Source: https://wknd-trendsetters.site/ (4 switchable testimonial panels + tab menu of avatar/name/role)
 * Structure: 2 columns, one row per tab — [tab label | tab content]. No field hints.
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
    // Label cell: prefer the tab-menu button label; fall back to the name inside the pane.
    let labelCell;
    const menu = menuLinks[i];
    if (menu) {
      // Use the name/role text block from the menu button (skip the avatar image).
      const nameBlock = menu.querySelector('.flex-horizontal > div:not(.avatar), div:not(.avatar) > div')
        ? menu.querySelector('.flex-horizontal > div:not(.avatar)')
        : null;
      labelCell = nameBlock || menu;
    } else {
      const name = pane.querySelector('.paragraph-xl strong, strong');
      labelCell = name ? name.closest('div') || name : `Tab ${i + 1}`;
    }

    // Content cell: the full pane content (image + name + role + quote).
    const contentInner = pane.querySelector('.grid-layout') || pane;

    cells.push([labelCell, contentInner]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
