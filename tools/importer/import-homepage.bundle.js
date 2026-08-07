/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
    const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
    const subheading = element.querySelector('p, .subheading, [class*="subheading"]');
    const ctas = Array.from(element.querySelectorAll(".button-group a, a.button"));
    const image = element.querySelector("img.cover-image, img");
    if (!heading && !subheading && !image) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (image) {
      cells.push([[document.createComment(" field:image "), image]]);
    }
    const textCell = [document.createComment(" field:text ")];
    if (heading) textCell.push(heading);
    if (subheading) textCell.push(subheading);
    ctas.forEach((a) => textCell.push(a));
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-article.js
  function parse2(element, { document }) {
    const columns = Array.from(element.querySelectorAll(":scope > div"));
    const imageCol = columns.find((c) => c.querySelector("img")) || columns[0];
    const textCol = columns.find((c) => c.querySelector('h1, h2, h3, [class*="heading"]')) || columns.find((c) => c !== imageCol) || columns[1];
    if (!imageCol && !textCol) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push([
      imageCol || "",
      textCol || ""
    ]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document }) {
    let items = Array.from(element.querySelectorAll(":scope > div"));
    if (!items.length) {
      items = Array.from(element.querySelectorAll(".utility-aspect-1x1"));
    }
    if (!items.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector("img");
      const imageCell = img ? [document.createComment(" field:image "), img] : "";
      cells.push([imageCell, ""]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonial.js
  function parse4(element, { document }) {
    const panes = Array.from(element.querySelectorAll(".tabs-content .tab-pane, .tab-pane"));
    const menuLinks = Array.from(element.querySelectorAll(".tab-menu .tab-menu-link, .tab-menu-link"));
    if (!panes.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    panes.forEach((pane, i) => {
      let label;
      const menu = menuLinks[i];
      if (menu) {
        const nameBlock = menu.querySelector(".flex-horizontal > div:not(.avatar), div:not(.avatar) > div") ? menu.querySelector(".flex-horizontal > div:not(.avatar)") : null;
        label = nameBlock || menu;
      } else {
        const name = pane.querySelector(".paragraph-xl strong, strong");
        label = name ? name.closest("div") || name : null;
      }
      const contentInner = pane.querySelector(".grid-layout") || pane;
      const labelCell = label ? [document.createComment(" field:label "), label] : [document.createComment(" field:label "), `Tab ${i + 1}`];
      const contentCell = contentInner ? [document.createComment(" field:content "), contentInner] : "";
      cells.push([labelCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards.js
  function parse5(element, { document }) {
    let items = Array.from(element.querySelectorAll(":scope > a.article-card, :scope > a.card-link"));
    if (!items.length) items = Array.from(element.querySelectorAll(":scope > a"));
    if (!items.length) items = Array.from(element.querySelectorAll(":scope > div"));
    if (!items.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector("img");
      const href = item.getAttribute("href");
      const imageCell = img ? [document.createComment(" field:image "), img] : "";
      const textCell = [document.createComment(" field:text ")];
      const tag = item.querySelector(".tag");
      const meta = item.querySelector(".article-card-meta");
      const date = meta ? meta.querySelector(".paragraph-sm, span:not(.tag)") : null;
      const title = item.querySelector('h1, h2, h3, h4, [class*="heading"]');
      if (href) {
        const link = document.createElement("a");
        link.setAttribute("href", href);
        if (tag) link.appendChild(tag);
        if (date) link.appendChild(date);
        if (title) link.appendChild(title);
        if (!link.childNodes.length) link.textContent = title && title.textContent || href;
        textCell.push(link);
      } else {
        if (tag) textCell.push(tag);
        if (date) textCell.push(date);
        if (title) textCell.push(title);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse6(element, { document }) {
    const items = Array.from(element.querySelectorAll(":scope > details.faq-item, details.faq-item, :scope > details"));
    if (!items.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    items.forEach((item) => {
      const summary = item.querySelector("summary");
      const questionSpan = summary ? summary.querySelector("span") : null;
      const question = questionSpan || summary;
      const answer = item.querySelector(".faq-answer") || item.querySelector("details > div:not(summary)");
      const summaryCell = question ? [document.createComment(" field:summary "), question] : "";
      const textCell = answer ? [document.createComment(" field:text "), answer] : "";
      cells.push([summaryCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-overlay.js
  function parse7(element, { document }) {
    const bgImage = element.querySelector('img.cover-image, img[class*="overlay"], img');
    const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
    const subheading = element.querySelector('p, .subheading, [class*="subheading"]');
    const ctas = Array.from(element.querySelectorAll(".button-group a, a.button"));
    if (!heading && !subheading && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) {
      cells.push([[document.createComment(" field:image "), bgImage]]);
    }
    const textCell = [document.createComment(" field:text ")];
    if (heading) textCell.push(heading);
    if (subheading) textCell.push(subheading);
    ctas.forEach((a) => textCell.push(a));
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-overlay", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [".breadcrumbs"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, ["a.skip-link", ".navbar", "footer.footer"]);
      element.querySelectorAll("*").forEach((el) => {
        [...el.attributes].forEach((attr) => {
          if (attr.name.startsWith("data-astro-cid")) {
            el.removeAttribute(attr.name);
          }
        });
      });
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const template = payload && payload.template;
      const sections = template && template.sections;
      if (!sections || !Array.isArray(sections) || sections.length < 2) {
        return;
      }
      const doc = payload.document;
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section || !section.selector) {
          continue;
        }
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) {
          continue;
        }
        if (section.style) {
          const block = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.append(block);
        }
        if (i > 0) {
          const hr = doc.createElement("hr");
          sectionEl.parentNode.insertBefore(hr, sectionEl);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "WKND Trendsetters homepage: intro hero with image stack, featured article, image gallery, testimonial tabs, article cards, FAQ accordion, and closing overlay hero.",
    urls: [
      "https://wknd-trendsetters.site/"
    ],
    blocks: [
      {
        name: "hero",
        instances: ["#main-content > header.section.secondary-section > div.container > div.grid-layout"]
      },
      {
        name: "columns-article",
        instances: ["#main-content > section.section:nth-of-type(1) .grid-layout"]
      },
      {
        name: "cards-gallery",
        instances: ["#main-content > section.section.secondary-section:nth-of-type(2) .grid-layout.grid-gap-sm"]
      },
      {
        name: "tabs-testimonial",
        instances: ["#main-content > section.section:nth-of-type(3) .tabs-wrapper"]
      },
      {
        name: "cards",
        instances: ["#main-content > section.section.secondary-section:nth-of-type(4) .grid-layout.grid-gap-md"]
      },
      {
        name: "accordion-faq",
        instances: ["#main-content > section.section:nth-of-type(5) .faq-list"]
      },
      {
        name: "hero-overlay",
        instances: ["#main-content > section.section.inverse-section .grid-layout.desktop-1-column"]
      }
    ],
    sections: [
      { id: "section-1", name: "Intro Hero", selector: "#main-content > header.section.secondary-section", style: "secondary", blocks: ["hero"], defaultContent: [] },
      { id: "section-2", name: "Featured Article", selector: "#main-content > section.section:nth-of-type(1)", style: null, blocks: ["columns-article"], defaultContent: [] },
      { id: "section-3", name: "Image Gallery", selector: "#main-content > section.section.secondary-section:nth-of-type(2)", style: "secondary", blocks: ["cards-gallery"], defaultContent: [] },
      { id: "section-4", name: "Testimonials", selector: "#main-content > section.section:nth-of-type(3)", style: null, blocks: ["tabs-testimonial"], defaultContent: [] },
      { id: "section-5", name: "Latest Articles", selector: "#main-content > section.section.secondary-section:nth-of-type(4)", style: "secondary", blocks: ["cards"], defaultContent: [] },
      { id: "section-6", name: "FAQ", selector: "#main-content > section.section:nth-of-type(5)", style: null, blocks: ["accordion-faq"], defaultContent: [] },
      { id: "section-7", name: "Closing Hero", selector: "#main-content > section.section.inverse-section", style: null, blocks: ["hero-overlay"], defaultContent: [] }
    ]
  };
  var parsers = {
    "hero": parse,
    "columns-article": parse2,
    "cards-gallery": parse3,
    "tabs-testimonial": parse4,
    "cards": parse5,
    "accordion-faq": parse6,
    "hero-overlay": parse7
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
