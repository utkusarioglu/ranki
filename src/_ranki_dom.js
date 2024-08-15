import hljs from "./_ranki_hljs.js";
import { registerTerraform } from "./_ranki_hljs_terraform.js";

registerTerraform(hljs);

const CLASSES = {
  hud: "ranki-hud",
  hudScrollContainer: "ranki-hud-scroll-container",
  hudChip: "ranki-hud-chip",
  hudDeckStep: "ranki-hud-chip-deck-step",
  hudDeckStepSeparator: "ranki-hud-chip-deck-separator",
  hudTag: "ranki-hud-tag",
  hudTagContainer: "ranki ranki-hud-tag-container",

  renderedIndicator: "ranki-rendered",
  preCodeLanguageLabel: "ranki-pre-code-language-label",
};


export class Dom
{
  constructor(parent, { tokens, card })
  {
    this.parent = parent;
    this.tokens = tokens;
    this.card = card;
  }

  _decodeHtmlEntities(str)
  {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');
    return doc.documentElement.textContent;
  }

  _createElement(tag, { format, content, className, style, children } = {})
  {
    const elem = document.createElement(tag);

    if (content) {
      switch (format) {
        case "html":
          elem.innerHTML = content;
          break;

        case "text":
          elem.innerText = content;
          break;

        default:
          elem.innerHTML = content;
      }
    }

    if (className) {
      elem.className = className;
    }

    if (style) {
      elem.style = style;
    }

    if (children) {
      for (const child of children) {
        elem.appendChild(child);
      }
    }

    return elem;
  }

  _createElementChain(tags, { leaf } = {})
  {
    const root = this._createElement(tags[0]);
    const rest = tags.slice(1);

    let leafElem = root;
    for (const e of rest) {
      const child = this._createElement(e);
      leafElem.appendChild(child);
      leafElem = child;
    }

    if (leaf && leaf.content && leaf.format) {
      switch (leaf.format) {
        case "html":
          // leafElem.innerHTML = this._decodeHtmlEntities(leaf.content);
          leafElem.innerHTML = leaf.content;
          break;

        case "text":
          leafElem.innerText = leaf.content;
          break;
      }
    }

    return {
      root,
      leaf: leafElem
    };
  }

  renderError(message, stack)
  {
    const errorContainer = this._createElement("div", {
      className: "ranki ranki-global-error"
    });
    this.parent.appendChild(errorContainer);

    const messageElem = this._createElement("pre", {
      className: "ranki ranki-global-error error-message",
      format: "text",
      style: "text-align: center;",
      content: message,
    });
    errorContainer.appendChild(messageElem);

    const stackElem = this._createElement("pre", {
      className: "ranki ranki-global-error error-trace",
      format: "text",
      content: stack
    });
    errorContainer.appendChild(stackElem);
  }

  _hudTags(tags, classes)
  {
    const tagElems = [];
    for (const tag of tags.split(this.tokens.tagSeparator)) {
      if (!tag.length) {
        continue;
      }
      const tagsElem = this._createElement("span", {
        format: "text",
        content: tag,
        className: [classes.hudChip, classes.hudTag].join(" "),
      });
      tagElems.push(tagsElem);
    }

    return this._createElement("span", {
      className: classes.hudTagContainer,
      children: tagElems
    });
  }

  _hudDeck(deck, classes)
  {
    const deckElem = this._createElement("span", {
      className: classes.hudChip,
    });
    const deckSteps = deck.split(this.tokens.deckSeparator);
    deckSteps.forEach((step, i, all) =>
    {
      const stepSpan = this._createElement("span", {
        format: "text",
        content: step,
        className: classes.hudDeckStep,
      });
      deckElem.appendChild(stepSpan);
      if (i < all.length - 1) {
        const stepGlue = this._createElement("span", {
          format: "text",
          content: this.tokens.deckSeparator,
          className: classes.hudDeckStepSeparator,
        });
        deckElem.appendChild(stepGlue);
      }
    });

    return deckElem;
  }

  _hudCard(card, classes)
  {
    return this._createElement("span", {
      format: "text",
      content: card,
      className: classes.hudChip,
    });
  }

  _hudType(type, classes)
  {
    return this._createElement("span", {
      format: "text",
      content: type,
      className: classes.hudChip,
    });
  }

  renderHud()
  {
    const existingInfoBar = this.parent.querySelector(`.${CLASSES.hud}`);
    if (existingInfoBar) {
      // console.log("info bar already attached");
      return;
    }

    const { card, deck, type, tags } = this.card;

    const deckElem = this._hudDeck(deck, CLASSES);
    const cardElem = this._hudCard(card, CLASSES);
    const typeElem = this._hudType(type, CLASSES);
    const tagsElem = this._hudTags(tags, CLASSES);

    const hudScrollContainer = this._createElement("div", {
      className: CLASSES.hudScrollContainer,
      children: [
        deckElem,
        typeElem,
        cardElem,
        tagsElem,
      ]
    });

    const hudElem = this._createElement("div", {
      className: CLASSES.hud,
      children: [
        hudScrollContainer,
      ]
    });

    this.parent.appendChild(hudElem);
  }

  hasRendered()
  {
    return this.parent.className.includes(CLASSES.renderedIndicator);
  }

  _renderPartSpan(part)
  {
    return this._createElement("span", {
      format: "html",
      content: part.content
    });
  }

  _renderPartFrame(part)
  {
    let content = part.content.lines.join("\n");

    switch (part.content.tags.join(" ")) {
      case "code":
        const language = part.content.params[0];
        content = hljs.highlight(content, { language }).value;
        break;
    }

    const { root } = this._createElementChain(
      part.content.tags,
      {
        leaf: {
          format: "html",
          content,
        }
      }
    );

    return root;
  }

  _renderPart(part)
  {
    switch (part.flavor) {
      case "plain":
        return this._renderPartSpan(part);

      case "frame":
        return this._renderPartFrame(part);

      default:
        throw new Error(`Unrecognized part flavor: ${part.flavor}`);
    }
  }

  _renderContent(content, tagCallback)
  {
    const children = [];
    for (const item of content) {
      const hasMultipleParts = item.parts.length > 1;

      const container = this._createElement(
        tagCallback(item),
        {
          format: "html",
          className: [
            item.params.isCentered
              ? "ranki-center-aligned"
              : "ranki-left-aligned",
          ].join(" "),
          content: hasMultipleParts
            ? undefined
            : item.parts[0].content,
        });

      const parts = [];
      if (hasMultipleParts) {
        for (const part of item.parts) {
          parts.push(this._renderPart(part));
        }
      }
      parts.forEach((part) =>
      {
        container.appendChild(part);
      });

      children.push(container);
    }

    return children;
  }

  _renderHgroup(group)
  {
    const hgroup = this._createElement("hgroup");
    const children = this._renderContent(
      group.content,
      (item) => `h${item.params.level}`,
    );

    for (const child of children) {
      hgroup.appendChild(child);
    }

    return hgroup;
  }

  _renderParagraph(group)
  {
    const p = this._createElement("p");
    const children = this._renderContent(group.content, () => "div");

    for (const child of children) {
      p.appendChild(child);
    }

    return p;
  }

  _renderCode(group)
  {
    const language = group.params[0];

    const content = language
      ? hljs.highlight(group.content[0], { language }).value
      : group.content[0];

    const code = this._createElement("code", {
      format: "html",
      content,
    });

    return code;
  }

  _renderPreCode(group)
  {
    const language = group.params[0];
    const joined = group.content.join("\n");
    const content = language
      ? hljs.highlight(joined, { language }).value
      : joined;

    const { root } = this._createElementChain(group.tags, {
      leaf: {
        format: "html",
        content,
      }
    });

    const langLabelElem = this._createElement("span", {
      format: "text",
      content: language,
      className: CLASSES.preCodeLanguageLabel,
    });
    root.appendChild(langLabelElem);

    return root;
  }

  _renderTextKind(group)
  {
    switch (group.kind) {
      case "heading":
        return this._renderHgroup(group);

      case "paragraph":
        return this._renderParagraph(group);

      default:
        throw new Error([
          "Unrecognized text group kind:",
          JSON.stringify(group, null, 2)
        ].join("\n"));
    }
  }

  _renderUl(group, wrapperTag)
  {
    // console.log(group);
    const container = this._createElement(wrapperTag);
    const children = this._renderContent(group.content, () => "li");

    for (const child of children) {
      container.appendChild(child);
    }

    return container;
  }

  _renderDl(group)
  {

  }

  _renderTable(group)
  {

  }

  _renderFrameKind(group)
  {
    switch (group.kind) {
      case "code":
        return this._renderCode(group);

      case "pre code":
        return this._renderPreCode(group);

      case "ol":
      case "ul":
        return this._renderUl(group);

      case "dl":
        return this._renderDl(group);

      case "table":
        return this._renderTable(group);

      default:
        throw new Error([
          "Unrecognized frame group kind:",
          JSON.stringify(group, null, 2)
        ].join("\n"));
    }
  }

  _renderGroup(group)
  {
    switch (group.type) {
      case "text":
        return this._renderTextKind(group);

      case "frame":
        return this._renderFrameKind(group);

      default:
        throw new Error([
          "Unrecognized group type:",
          JSON.stringify(group, null, 2)
        ].join("\n"));
    }
  }

  renderFace(sections)
  {
    const renders = [];
    for (const section of sections) {
      const container = this._createElement("section", {
        className: section.field,
      });

      section.list.forEach((group) =>
      {
        const g = this._renderGroup(group);
        if (g) {
          container.appendChild(g);
        }
      });

      renders.push(container);
    }

    for (const render of renders) {
      this.parent.appendChild(render);
    }

    this.parent.classList.add(CLASSES.renderedIndicator);
  }
}
