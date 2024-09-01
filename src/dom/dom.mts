// @ts-expect-error: For some reason ts doesn't see the types for hljs
import hljs from "highlight.js";
import { hljsDefineTerraform } from "../hljs/terraform.js";
import { hljsDefineSolidity } from "../hljs/solidity/solidity.js";
import { hljsDefineYul } from "../hljs/solidity/yul.js";
import { hljsDefineSuperCollider } from "../hljs/supercollider.js";

import { ContentControl } from "../content-control/content-control.mts";
import type {
  RankiCard,
  RankiTokens,
  WindowRankiConfig,
} from "../config/config.d.mjs";
import type {
  CreateElementChainOptions,
  CreateElementChainReturn,
  CreateElementOptions,
} from "./dom.d.mjs";
import type {
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
} from "../types/parser.mjs";

hljs.registerLanguage("terraform", hljsDefineTerraform);
hljs.registerLanguage("solidity", hljsDefineSolidity);
hljs.registerLanguage("yul", hljsDefineYul);
// hljs.registerLanguage("supercollider", hljsDefineSuperCollider);

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

  codeLanguageAbsent: "ranki-code-language-absent",
  codeLanguageAvailable: "ranki-code-language-available",
  codeLanguageAliasRegistered: "ranki-code-language-alias-registered",
  codeLanguageAliasUnregistered: "ranki-code-language-alias-unregistered",
  codeFrame: "ranki-code-frame",
  codeInline: "ranki-code-inline",
};

export class Dom {
  private parent: Element;
  private tokens: RankiTokens;
  private card: RankiCard;
  private content: ContentControl;

  constructor(parent: Element, { tokens, card, aliases }: WindowRankiConfig) {
    this.parent = parent;
    this.tokens = tokens;
    this.card = card;
    this.content = new ContentControl(aliases);
  }

  _assignElementContent(
    elem: HTMLElement | undefined,
    content: string | undefined,
    format: string = "text",
  ) {
    if (elem && content) {
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
  }

  _appendElementChildren(
    elem: HTMLElement | undefined,
    children: HTMLElement[] = [],
  ) {
    if (elem && children.length) {
      for (const child of children) {
        elem.appendChild(child);
      }
    }
  }

  _assignElemClassName(
    elem: HTMLElement | undefined,
    className: string | undefined,
  ) {
    if (elem && className) {
      elem.className = className;
    }
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

    this._assignElementContent(elem, content, format);
    this._assignElemClassName(elem, className);
    this._appendElementChildren(elem, children);

    if (style) {
      // @ts-ignore
      elem.style = style;
    }

    return elem;
  }

  _createElementChain(
    tags: Tags,
    { leaf, root }: Partial<CreateElementChainOptions> = {},
  ): CreateElementChainReturn {
    const rootElem = this._createElement(tags[0]);
    const rest = tags.slice(1);

    let leafElem = rootElem;
    for (const e of rest) {
      const child = this._createElement(e);
      leafElem.appendChild(child);
      leafElem = child;
    }

    this._assignElementContent(leafElem, leaf?.content, leaf?.format);
    this._appendElementChildren(leafElem, leaf?.children);
    this._assignElemClassName(leafElem, leaf?.className);
    this._assignElemClassName(rootElem, root?.className);

    return {
      root: rootElem,
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
    const tokens = this.tokens;
    const existingInfoBar = this.parent.querySelector(`.${CLASSES.hud}`);
    if (existingInfoBar) {
      return;
    }

    const { card, deck, type, tags } = this.card;

    const deckElem = this._hudDeck(deck, CLASSES);
    const cardElem = this._hudCard(card, CLASSES);
    const typeElem = this._hudType(
      type.replace(tokens.cardTypesPrefix, ""),
      CLASSES,
    );
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

  _renderHljs(content: string, languageAlias: string) {
    if (!languageAlias) {
      return {
        html: content,
        highlighted: false,
        displayName: "",
        className: CLASSES.codeLanguageAbsent,
      };
    }

    const { displayName, hljsName, found } =
      this.content.codeAlias(languageAlias);
    // const language = content.params[0];
    // if (language) {
    const html = hljs.highlight(content, { language: hljsName }).value;
    const className = [
      CLASSES.codeLanguageAvailable,
      found
        ? "ranki-code-language-alias-registered"
        : "ranki-code-language-alias-unregistered",
    ].join(" ");

    return {
      html,
      displayName,
      highlighted: false,
      className,
    };
    // className = "ranki-inline-frame-code";
    // }
  }

  _renderPartFrame(part: ParserPartFlavorFrame): HTMLElement {
    const tagsJoined = part.content.tags.join(" ");
    let content = part.content.lines.join("\n");
    let className = "";

    switch (tagsJoined) {
      case "code":
        const languageAlias = part.content.params[0];
        // if (languageAlias) {
        //   content = hljs.highlight(content, { language: languageAlias }).value;
        //   className = "ranki-inline-frame-code";
        // }
        const renderedCode = this._renderHljs(content, languageAlias);
        content = renderedCode.html;
        className = [CLASSES.codeInline, renderedCode.className].join(" ");
        break;

      default:
        throw new Error(`Unrecognized inline frame tag: ${tagsJoined}`);
    }

    const { root } = this._createElementChain(part.content.tags, {
      leaf: {
        format: "html",
        content,
        className,
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
      const container = this._createElement(tagCallback(item), {
        format: "html",
        className: [
          item.params.isCentered
            ? "ranki-center-aligned"
            : "ranki-left-aligned",
        ].join(" "),
      });

      const parts = [];
      for (const part of item.parts) {
        parts.push(this._renderPart(part));
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
    const languageAlias = group.params[0];
    const renderedCode = this._renderHljs(group.content[0], languageAlias);

    const { root } = this._createElementChain(["div", "code"], {
      leaf: {
        format: "html",
        content: renderedCode.html,
        className: renderedCode.className,
      },
      root: {
        className: CLASSES.codeFrame,
      },
    });

    // return code;
    return root;
  }

  _renderPreCode(group: ParserKindFramePreCode): HTMLElement {
    const languageAlias = group.params[0];
    const joined = group.content.join("\n");
    const renderedCode = this._renderHljs(joined, languageAlias);

    const { root } = this._createElementChain(group.tags, {
      leaf: {
        format: "html",
        content: renderedCode.html,
        className: renderedCode.className,
      },
      root: {
        className: renderedCode.className,
      },
    });

    if (languageAlias) {
      const langLabelElem = this._createElement("span", {
        format: "text",
        content: renderedCode.displayName,
        className: CLASSES.preCodeLanguageLabel,
      });
      root.appendChild(langLabelElem);
    }

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

        const dd = this._createElement("dd", {
          children: lines.map((line) => {
            return this._createElement("p", {
              children: line.parts.map((part) => this._renderPart(part)),
            });
          }),
        });
        div.appendChild(dd);
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
      case "ignore":
        return this._createElement("div", {
          format: "html",
          content: group.content,
        });

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
    console.log({ sections });
    const renders = [];
    for (const section of sections) {
      const container = this._createElement("section", {
        className: section.field.name,
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
