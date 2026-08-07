/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters site-wide cleanup.
 *
 * Removes non-authorable site chrome and framework noise so the import contains
 * only page-level authorable content. All selectors are taken from the captured
 * DOM in migration-work/cleaned.html.
 *
 * NOTE: The authorable intro hero is `#main-content > header.section.secondary-section`
 * (a <header> INSIDE <main>). A bare `header` selector would destroy that authorable
 * content, so it is deliberately NOT used. The real site header is `.navbar`.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Breadcrumb navigation inside the Featured Article section is non-authorable
    // navigation chrome. Removed before block parsing so the columns-article parser
    // does not pick it up. Found in cleaned.html: <div class="breadcrumbs"> inside
    // #main-content > section.section:nth-of-type(1).
    WebImporter.DOMUtils.remove(element, ['.breadcrumbs']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Site shell / global chrome (non-authorable). Found in cleaned.html:
    //  - a.skip-link : "Skip to main content" accessibility shortcut
    //  - .navbar     : top navigation bar (logo, nav-menu, mega-menu, mobile toggle)
    //  - footer.footer: site footer (logo, social icons, footer nav columns)
    WebImporter.DOMUtils.remove(element, ['a.skip-link', '.navbar', 'footer.footer']);

    // Strip Astro framework attributes left on elements (non-authorable noise).
    // Found in cleaned.html: data-astro-cid-* attributes.
    element.querySelectorAll('*').forEach((el) => {
      [...el.attributes].forEach((attr) => {
        if (attr.name.startsWith('data-astro-cid')) {
          el.removeAttribute(attr.name);
        }
      });
    });
  }
}
