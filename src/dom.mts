import hljs from "./_ranki_hljs.js";
import { registerTerraform } from "./_ranki_hljs_terraform.js";
import type {
  RankiCard,
  RankiTokens,
  WindowRankiConfig,
} from "./types/ranki.mjs";
import type {
  CreateElementChainOptions,
  CreateElementChainReturn,
  CreateElementOptions,
} from "./types/dom.mjs";
import {
  HeadingContent,
  ParagraphContent,
  ParserField,
  ParserKind,
  ParserKindFrame,
  ParserKindFrameCode,
  ParserKindFrameDl,
  ParserKindFrameList,
  ParserKindFramePreCode,
  ParserKindFrameTable,
  ParserKindHeading,
  ParserKindParagraph,
  ParserKindText,
  ParserPart,
  ParserPartFlavorFrame,
  ParserPartFlavorPlain,
  TableHeaderOrData,
  Tags,
} from "./types/parser.mjs";

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

  errorContainer: "ranki-global-error",
  errorMessage: "ranki-global-error error-message",
  errorStack: "ranki-global-error error-trace",
};

export class Dom {
  private parent: Element;
  private tokens: RankiTokens;
  private card: RankiCard;

  constructor(parent: Element, { tokens, card }: WindowRankiConfig) {
    this.parent = parent;
    this.tokens = tokens;
    this.card = card;
  }

  _decodeHtmlEntities(str: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, "text/html");
    return doc.documentElement.textContent!;
  }

  _createElement(
    tag: string,
    {
      format,
      content,
      className,
      style,
      children,
    }: Partial<CreateElementOptions> = {},
  ): HTMLElement {
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
      // @ts-ignore
      elem.style = style;
    }

    if (children) {
      for (const child of children) {
        elem.appendChild(child);
      }
    }

    return elem;
  }

  _createElementChain(
    tags: Tags,
    { leaf }: Partial<CreateElementChainOptions> = {},
  ): CreateElementChainReturn {
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

    if (leaf && leaf.children) {
      leaf.children.forEach((child) => {
        leafElem.appendChild(child);
      });
    }

    return {
      root,
      leaf: leafElem,
    };
  }

  /**
   * @dev
   * #1 This is for deduping, anki includes script tags and other things twice
   * in some platforms.
   */
  renderError(message: string, stack: string): void {
    // #1
    if (this._hasErrorRendered()) {
      return;
    }

    const errorContainer = this._createElement("div", {
      className: CLASSES.errorContainer,
    });
    this.parent.appendChild(errorContainer);

    const messageElem = this._createElement("pre", {
      className: CLASSES.errorMessage,
      format: "text",
      content: message,
    });
    errorContainer.appendChild(messageElem);

    const stackElem = this._createElement("pre", {
      className: CLASSES.errorStack,
      format: "text",
      content: stack,
    });
    errorContainer.appendChild(stackElem);
  }

  _hudTags(tags: string, classes: typeof CLASSES): HTMLElement {
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
      children: tagElems,
    });
  }

  _hudDeck(deck: string, classes: typeof CLASSES): HTMLElement {
    const deckElem = this._createElement("span", {
      className: classes.hudChip,
    });
    const deckSteps = deck.split(this.tokens.deckSeparator);
    deckSteps.forEach((step, i, all) => {
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

  _hudCard(card: string, classes: typeof CLASSES): HTMLElement {
    return this._createElement("span", {
      format: "text",
      content: card,
      className: classes.hudChip,
    });
  }

  _hudType(type: string, classes: typeof CLASSES): HTMLElement {
    return this._createElement("span", {
      format: "text",
      content: type,
      className: classes.hudChip,
    });
  }

  renderHud(): void {
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
      children: [deckElem, typeElem, cardElem, tagsElem],
    });

    const hudElem = this._createElement("div", {
      className: CLASSES.hud,
      children: [hudScrollContainer],
    });

    this.parent.appendChild(hudElem);
  }

  hasFaceRendered(): boolean {
    return this.parent.className.includes(CLASSES.renderedIndicator);
  }

  _hasErrorRendered(): boolean {
    return document.body.querySelector(`.${CLASSES.errorContainer}`) !== null;
  }

  _renderPartSpan(part: ParserPartFlavorPlain): HTMLElement {
    return this._createElement("span", {
      format: "html",
      content: part.content,
    });
  }

  _renderPartFrame(part: ParserPartFlavorFrame): HTMLElement {
    let content = part.content.lines.join("\n");

    switch (part.content.tags.join(" ")) {
      case "code":
        const language = part.content.params[0];
        if (language) {
          content = hljs.highlight(content, { language }).value;
        }
        break;
    }

    const { root } = this._createElementChain(part.content.tags, {
      leaf: {
        format: "html",
        content,
      },
    });

    return root;
  }

  _renderPart(part: ParserPart): HTMLElement {
    switch (part.flavor) {
      case "plain":
        return this._renderPartSpan(part);

      case "frame":
        return this._renderPartFrame(part);

      default:
        // @ts-ignore
        throw new Error(`Unrecognized part flavor: ${part.flavor}`);
    }
  }

  /**
   * @dev
   * #1 This is poorly typed. If the content has a single part, it is going to
   * be a string.
   */
  _renderTextContent(
    content: (HeadingContent | ParagraphContent)[],
    tagCallback: (item: any) => string,
  ): HTMLElement[] {
    const children = [];
    for (const item of content) {
      const hasMultipleParts = item.parts.length > 1;

      const container = this._createElement(tagCallback(item), {
        format: "html",
        className: [
          item.params.isCentered
            ? "ranki-center-aligned"
            : "ranki-left-aligned",
        ].join(" "),

        content: hasMultipleParts
          ? undefined
          : (item.parts[0].content as string), // #1
      });

      const parts = [];
      if (hasMultipleParts) {
        for (const part of item.parts) {
          parts.push(this._renderPart(part));
        }
      }
      parts.forEach((part) => {
        container.appendChild(part);
      });

      children.push(container);
    }

    return children;
  }

  _renderHgroup(group: ParserKindHeading): HTMLElement {
    const hgroup = this._createElement("hgroup");
    const children = this._renderTextContent(
      group.content,
      (item) => `h${item.params.level}`,
    );

    for (const child of children) {
      hgroup.appendChild(child);
    }

    return hgroup;
  }

  _renderParagraph(group: ParserKindParagraph): HTMLElement {
    const p = this._createElement("p");
    const children = this._renderTextContent(group.content, () => "div");

    for (const child of children) {
      p.appendChild(child);
    }

    return p;
  }

  _renderCode(group: ParserKindFrameCode): HTMLElement {
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

  _renderPreCode(group: ParserKindFramePreCode): HTMLElement {
    const language = group.params[0];
    const joined = group.content.join("\n");
    const content = language
      ? hljs.highlight(joined, { language }).value
      : joined;

    const { root } = this._createElementChain(group.tags, {
      leaf: {
        format: "html",
        content,
      },
    });

    const langLabelElem = this._createElement("span", {
      format: "text",
      content: language,
      className: CLASSES.preCodeLanguageLabel,
    });
    root.appendChild(langLabelElem);

    return root;
  }

  _renderTextKind(group: ParserKindText): HTMLElement {
    switch (group.kind) {
      case "heading":
        return this._renderHgroup(group);

      case "paragraph":
        return this._renderParagraph(group);

      default:
        throw new Error(
          [
            "Unrecognized text group kind:",
            JSON.stringify(group, null, 2),
          ].join("\n"),
        );
    }
  }

  _renderUl(group: ParserKindFrameList, wrapperTag: string): HTMLElement {
    // const children = this._renderTextContent(group.content, () => "li");

    // for (const child of children) {
    //   container.appendChild(child);
    // }
    // const container = this._createElement(wrapperTag);

    const children = group.content.map(({ tag, lines }) => {
      const { root, leaf } = this._createElementChain(tag);

      lines.forEach((line) => {
        const p = this._createElement("p", {
          children: line.parts.map((part) => this._renderPart(part)),
        });
        leaf.appendChild(p);
      });

      return root;
    });

    const container = this._createElement(wrapperTag, {
      children,
    });

    return container;
  }

  _renderDl(group: ParserKindFrameDl): HTMLElement {
    const container = this._createElement("dl", {
      children: group.content.map(({ title, lines }) => {
        const div = this._createElement("div");
        title.forEach((t) => {
          const { root, leaf } = this._createElementChain(t.tags);
          t.parts
            .map((part) => this._renderPart(part))
            .forEach((part) => leaf.appendChild(part));
          div.appendChild(root);
          return root;
        });

        lines.forEach((line) => {
          const p = this._createElement("p", {
            children: line.parts.map((part) => this._renderPart(part)),
          });
          div.appendChild(p);
        });

        return div;
      }),
    });

    return container;
  }

  _renderTable({
    content: { body, head, foot },
  }: ParserKindFrameTable): HTMLElement {
    if (!body.length) {
      throw new Error("The table body is empty");
    }

    const table = this._createElement("table");

    const createTablePart = (
      wrapperTag: string,
      rows: TableHeaderOrData[][],
    ): HTMLElement => {
      return this._createElement(wrapperTag, {
        children: rows.map((row) => {
          const tr = this._createElement("tr", {
            children: row.map((col) => {
              const { root } = this._createElementChain(col.tag, {
                leaf: {
                  children: col.parts.map((part) => this._renderPart(part)),
                },
              });

              return root;
            }),
          });

          return tr;
        }),
      });
    };

    if (head.length) {
      table.appendChild(createTablePart("thead", head));
    }

    table.appendChild(createTablePart("tbody", body));

    if (foot.length) {
      table.appendChild(createTablePart("tfoot", foot));
    }

    return table;
  }

  _renderFrameKind(group: ParserKindFrame): HTMLElement {
    switch (group.kind) {
      case "code":
        return this._renderCode(group);

      case "pre code":
        return this._renderPreCode(group);

      case "ol":
      case "ul":
        return this._renderUl(group, group.kind);

      case "dl":
        return this._renderDl(group);

      case "table":
        return this._renderTable(group);

      default:
        throw new Error(
          [
            "Unrecognized frame group kind:",
            JSON.stringify(group, null, 2),
          ].join("\n"),
        );
    }
  }

  _renderGroup(group: ParserKind): HTMLElement {
    switch (group.type) {
      case "text":
        return this._renderTextKind(group);

      case "frame":
        return this._renderFrameKind(group);

      default:
        throw new Error(
          ["Unrecognized group type:", JSON.stringify(group, null, 2)].join(
            "\n",
          ),
        );
    }
  }

  renderFace(sections: ParserField[]): void {
    const renders = [];
    for (const section of sections) {
      const container = this._createElement("section", {
        className: section.field,
      });

      section.list.forEach((group) => {
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
