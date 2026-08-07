/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters section breaks and section metadata.
 *
 * Runs in afterTransform only (block parsers run between the hooks). Drives entirely
 * off payload.template.sections so it stays template-agnostic:
 *  - Inserts an <hr> before every section except the first (section breaks).
 *  - Appends a "Section Metadata" block inside each section that has a `style`.
 *
 * For the homepage template this yields 6 <hr> breaks (7 sections - 1) and 3
 * Section Metadata blocks (sections with style "secondary": Intro Hero, Image
 * Gallery, Latest Articles). Sections with style null (Featured Article,
 * Testimonials, FAQ, Closing Hero) get no metadata — the Closing Hero's background
 * image belongs to the hero-overlay block design, not a section style.
 *
 * Section selectors come from payload.template.sections (populated from the captured
 * DOM in migration-work/cleaned.html).
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const template = payload && payload.template;
    const sections = template && template.sections;
    if (!sections || !Array.isArray(sections) || sections.length < 2) {
      return;
    }

    const doc = payload.document;

    // Process sections in reverse so DOM insertions never shift not-yet-processed
    // section elements.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section || !section.selector) {
        continue;
      }

      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) {
        continue;
      }

      // Section Metadata block for sections that carry a style. Appended at the
      // end of the section so it becomes the section's trailing block.
      if (section.style) {
        const block = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.append(block);
      }

      // Section break before every section except the first.
      if (i > 0) {
        const hr = doc.createElement('hr');
        sectionEl.parentNode.insertBefore(hr, sectionEl);
      }
    }
  }
}
