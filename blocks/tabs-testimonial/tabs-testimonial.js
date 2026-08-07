// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Testimonial tabs.
 * Authored structure per row: [ cell1: name + role ] [ cell2: image, name, role, quote ].
 * Rendered layout: active panel on top (image | text), tab menu below (avatar + name + role).
 */
export default async function decorate(block) {
  const rows = [...block.children];

  const panels = document.createElement('div');
  panels.className = 'tabs-testimonial-panels';

  const tablist = document.createElement('div');
  tablist.className = 'tabs-testimonial-list';
  tablist.setAttribute('role', 'tablist');
  tablist.setAttribute('aria-label', 'Testimonials');

  rows.forEach((row, i) => {
    const label = row.children[0];
    const content = row.children[1];
    if (!label || !content) return;

    const id = toClassName(label.textContent);

    // --- build panel from the content cell ---
    const panel = document.createElement('div');
    panel.className = 'tabs-testimonial-panel';
    panel.id = `tabpanel-${id}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    panel.setAttribute('aria-hidden', i !== 0 ? 'true' : 'false');
    moveInstrumentation(content, panel);

    const picP = [...content.children].find((el) => el.querySelector('picture, img'));
    const textPs = [...content.children].filter((el) => el !== picP);

    // image column
    const imageWrap = document.createElement('div');
    imageWrap.className = 'tabs-testimonial-image';
    const picture = picP ? picP.querySelector('picture, img') : null;
    if (picture) imageWrap.append(picture);

    // text column
    const textCol = document.createElement('div');
    textCol.className = 'tabs-testimonial-content';

    const meta = document.createElement('div');
    meta.className = 'tabs-testimonial-meta';
    const nameEl = textPs[0];
    const roleEl = textPs[1];
    if (nameEl) { nameEl.classList.add('tabs-testimonial-name'); meta.append(nameEl); }
    if (roleEl) { roleEl.classList.add('tabs-testimonial-role'); meta.append(roleEl); }

    const quoteEl = textPs[2];
    textCol.append(meta);
    if (quoteEl) { quoteEl.classList.add('tabs-testimonial-quote'); textCol.append(quoteEl); }

    panel.append(imageWrap, textCol);
    panels.append(panel);

    // --- build tab button from the label cell (reuse panel image as avatar) ---
    const button = document.createElement('button');
    button.className = 'tabs-testimonial-tab';
    button.id = `tab-${id}`;
    button.setAttribute('type', 'button');
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', i === 0 ? 'true' : 'false');

    const inner = document.createElement('div');
    inner.className = 'tabs-testimonial-tab-inner';

    if (picture) {
      const avatar = document.createElement('div');
      avatar.className = 'tabs-testimonial-avatar';
      avatar.append(picture.cloneNode(true));
      inner.append(avatar);
    }

    const tabText = document.createElement('div');
    tabText.className = 'tabs-testimonial-tab-text';
    tabText.innerHTML = label.innerHTML;
    inner.append(tabText);
    button.append(inner);

    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((p) => p.setAttribute('aria-hidden', 'true'));
      tablist.querySelectorAll('button').forEach((b) => b.setAttribute('aria-selected', 'false'));
      panel.setAttribute('aria-hidden', 'false');
      button.setAttribute('aria-selected', 'true');
    });

    tablist.append(button);
    row.remove();
  });

  block.append(panels, tablist);
}
