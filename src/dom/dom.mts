// @ts-expect-error: For some reason ts doesn't see the types for hljs
import hljs from "highlight.js";
import { AudioSynthesis } from "../audio-synthesis/audio-synthesis.mts";
import { hljsDefineTerraform } from "../hljs/terraform.js";
import { hljsDefineSolidity } from "../hljs/solidity/solidity.js";
import { hljsDefineYul } from "../hljs/solidity/yul.js";
import { hljsDefineSuperCollider } from "../hljs/supercollider.js";
import { getMathjaxSvg } from "./mathjax.mts";

import { ContentControl } from "../content-control/content-control.mts";
import type {
  CardFaces,
  MermaidConfig,
  RankiCard,
  RankiCode,
  RankiTokens,
  WindowRankiConfig,
} from "../config/config.types.mts";
import type {
  CreateElementChainOptions,
  CreateElementChainReturn,
  CreateElementOptions,
} from "./dom.types.mts";
import type {
  HeadingContent,
  ParagraphContent,
  ParserField,
  ParserKind,
  ParserKindFrame,
  ParserKindFrameAudioSynthesis,
  ParserKindFrameCode,
  ParserKindFrameDl,
  ParserKindFrameLatex,
  ParserKindFrameList,
  ParserKindFrameMermaid,
  ParserKindFrameMnemonic,
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
} from "../parser/parser.types.mts";

hljs.registerLanguage("terraform", hljsDefineTerraform);
hljs.registerLanguage("solidity", hljsDefineSolidity);
hljs.registerLanguage("yul", hljsDefineYul);
hljs.registerLanguage("supercollider", hljsDefineSuperCollider);

const CLASSES = {
  hud: "ranki-hud",
  hudScrollContainer: "ranki-hud-scroll-container",
  hudChip: "ranki-hud-chip",
  hudDeckStep: "ranki-hud-chip-deck-step",
  hudDeckStepSeparator: "ranki-hud-chip-deck-separator",
  hudTag: "ranki-hud-tag",
  hudTagContainer: "ranki ranki-hud-tag-container",

  renderedIndicator: "ranki-rendered",

  fencedFrame: "ranki-fenced-frame",
  fencedFrameTagContainer: "ranki-fenced-frame-tag-container",
  fencedFrameTag: "ranki-fenced-frame-tag",
  fencedFrameHasTags: "ranki-fenced-frame-has-tags",

  errorContainer: "ranki-global-error",
  errorMessage: "ranki-global-error error-message",
  errorStack: "ranki-global-error error-trace",

  codeLanguageAbsent: "ranki-code-language-absent",
  codeLanguageAliasRegistered: "ranki-code-language-alias-registered",
  codeLanguageAliasUnregistered: "ranki-code-language-alias-unregistered",
  codeCloze: "ranki-code-cloze",

  codeFrame: "ranki-code-frame",
  codeInline: "ranki-code-inline",
  mnemonicFrame: "ranki-mnemonic-frame",
  latexFrame: "ranki-latex-frame",
  latexLineNumber: "ranki-latex-line-number",

  featureActive: "ranki-feature-active",
  synthPlayer: "ranki-synth-player",
  synthStopButton: "ranki-synth-stop-button",
  synthPlayButton: "ranki-synth-play-button",

  pathInline: "ranki-path-inline",

  urlInline: "ranki-url-inline",

  graphContainer: "ranki-graph-container",
};

export class Dom {
  private parent: Element;
  private tokens: RankiTokens;
  private card: RankiCard;
  private content: ContentControl;
  private mermaid: MermaidConfig;
  private code: RankiCode;
  private flagAssignments: WindowRankiConfig["flagAssignments"];

  constructor(
    parent: Element,
    { tokens, card, code, mermaid, flagAssignments }: WindowRankiConfig,
  ) {
    this.parent = parent;
    this.tokens = tokens;
    this.card = card;
    this.mermaid = mermaid;
    this.code = code;
    this.flagAssignments = flagAssignments;
    this.content = new ContentControl(code);
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

  removeError() {
    const errorContainer = this.parent.querySelector(
      `.${CLASSES.errorContainer}`,
    );
    if (errorContainer) {
      console.log("Remove error container");
      this.parent.removeChild(errorContainer);
    }
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

  _hudTags(tags: string): HTMLElement {
    const tagElems = [];
    for (const tag of tags.split(this.tokens.tagSeparator)) {
      if (!tag.length) {
        continue;
      }
      const tagsElem = this._createElement("span", {
        format: "text",
        content: tag,
        className: [CLASSES.hudChip, CLASSES.hudTag].join(" "),
      });
      tagElems.push(tagsElem);
    }

    return this._createElement("span", {
      className: CLASSES.hudTagContainer,
      children: tagElems,
    });
  }

  _hudDeck(deck: string): HTMLElement {
    const deckElem = this._createElement("span", {
      className: CLASSES.hudChip,
    });
    const deckSteps = deck.split(this.tokens.deckSeparator);
    deckSteps.forEach((step, i, all) => {
      const stepSpan = this._createElement("span", {
        format: "text",
        content: step,
        className: CLASSES.hudDeckStep,
      });
      deckElem.appendChild(stepSpan);
      if (i < all.length - 1) {
        const stepGlue = this._createElement("span", {
          format: "text",
          content: this.tokens.deckSeparator,
          className: CLASSES.hudDeckStepSeparator,
        });
        deckElem.appendChild(stepGlue);
      }
    });

    return deckElem;
  }

  _hudCard(card: string): HTMLElement {
    return this._createElement("span", {
      format: "text",
      content: card,
      className: CLASSES.hudChip,
    });
  }

  _hudFlag(flag: string): HTMLElement | null {
    if (!Object.keys(this.flagAssignments).includes(flag)) {
      return null;
    }

    const style = [
      `color: var(--color-${flag}-fg-hex);`,
      `background-color: var(--color-${flag}-bg-hex);`,
    ].join(" ");

    return this._createElement("span", {
      format: "text",
      content: this.flagAssignments[flag],
      className: CLASSES.hudChip,
      style,
    });
  }

  _hudType(type: string): HTMLElement {
    return this._createElement("span", {
      format: "text",
      content: type,
      className: CLASSES.hudChip,
    });
  }

  /**
   * @dev
   * #1 Currently the hud is only rendered once per card view. This would be
   * the wrong strategy if Anki shared changes in the states of flags or marks.
   * But it appears that there are no callbacks or events that allows Ranki to
   * access this information.
   *
   * If such an option emerges, this logic would have to be altered to allow
   * rerender of the hud even if another hud is available on the screen.
   */
  renderHud(): void {
    const tokens = this.tokens;
    const existingInfoBar = this.parent.querySelector(`.${CLASSES.hud}`);
    // #1
    if (existingInfoBar) {
      return;
    }

    const { card, deck, type, tags, flag } = this.card;

    const flagElem = this._hudFlag(flag);
    const deckElem = this._hudDeck(deck);
    const cardElem = this._hudCard(card);
    const typeElem = this._hudType(type.replace(tokens.cardTypesPrefix, ""));
    const tagsElem = this._hudTags(tags);

    const hudScrollContainer = this._createElement("div", {
      className: CLASSES.hudScrollContainer,
      children: [flagElem, deckElem, typeElem, cardElem, tagsElem].filter(
        (v) => !!v,
      ),
    });

    const hudElem = this._createElement("div", {
      className: CLASSES.hud,
      children: [hudScrollContainer],
    });

    // #1
    // if (existingInfoBar) {
    //   console.log("removing");
    //   this.parent.removeChild(existingInfoBar);
    // }
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
    const html = hljs.highlight(content, {
      language: hljsName,
    }).value;
    const className = [
      CLASSES.fencedFrameHasTags,
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
  }

  _renderPartFrame(part: ParserPartFlavorFrame): HTMLElement {
    const tagsJoined = part.content.tags.join(" ");
    let content = part.content.lines.join("\n");
    let className = "";
    let tags: string[];

    switch (tagsJoined) {
      case "code":
        const languageAlias = part.content.params[0];
        const renderedCode = this._renderHljs(content, languageAlias);
        content = this._replaceAnkiClozeStandIn(renderedCode.html);
        className = [CLASSES.codeInline, renderedCode.className].join(" ");
        tags = ["code"];
        break;

      case "latex":
        content = getMathjaxSvg(content, { scale: 0.8 });
        tags = ["span"];
        break;

      case "path":
        className = CLASSES.pathInline;
        tags = ["code"];
        break;

      case "url":
        className = CLASSES.urlInline;
        tags = ["code"];
        break;

      default:
        throw new Error(`Unrecognized inline frame tag: ${tagsJoined}`);
    }

    const { root } = this._createElementChain(tags, {
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
    const content = this._replaceAnkiClozeStandIn(renderedCode.html);

    const { root } = this._createElementChain(["div", "code"], {
      leaf: {
        format: "html",
        // content: renderedCode.html,
        content,
        className: renderedCode.className,
      },
      root: {
        className: CLASSES.codeFrame,
      },
    });

    // return code;
    return root;
  }

  _replaceAnkiClozeStandIn(phrase: string) {
    const content = phrase.replace(
      "[...]",
      `<span class="${CLASSES.codeCloze}">[...]</span>`,
    );
    return content;
  }

  _renderPreCode(group: ParserKindFramePreCode): HTMLElement {
    const languageAlias = group.params[0];
    const replaced = group.content.join("\n");
    const renderedCode = this._renderHljs(replaced, languageAlias);
    const content = this._replaceAnkiClozeStandIn(renderedCode.html);

    const { root } = this._createElementChain(group.tags, {
      leaf: {
        format: "html",
        content,
        className: renderedCode.className,
      },
      root: {
        className: [CLASSES.fencedFrame, renderedCode.className].join(" "),
      },
    });

    if (group.params.length) {
      root.appendChild(
        this._renderFencedFrameTags([
          renderedCode.displayName,
          ...group.params.slice(1),
        ]),
      );
    }

    return root;
  }

  _renderFencedFrameTags(tags: string[]) {
    return this._createElement("div", {
      className: CLASSES.fencedFrameTagContainer,
      children: tags.map((tag) =>
        this._createElement("span", {
          format: "text",
          content: tag,
          className: CLASSES.fencedFrameTag,
        }),
      ),
    });
  }

  _renderMnemonic(group: ParserKindFrameMnemonic): HTMLElement {
    const MNEMONIC_DEVICE_STRING = "Mnemonic";

    const { root } = this._createElementChain(["div", "span"], {
      leaf: {
        format: "html",
        content: group.content[0],
        // className: renderedCode.className,
      },
      root: {
        className: [
          CLASSES.fencedFrame,
          CLASSES.fencedFrameHasTags,
          CLASSES.mnemonicFrame,
        ].join(" "),
      },
    });

    root.appendChild(
      this._renderFencedFrameTags([MNEMONIC_DEVICE_STRING, ...group.params]),
    );

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

  async _renderLatex(group: ParserKindFrameLatex) {
    const { getMathjaxSvg } = await import(
      /* webpackChunkName: "_ranki_mathjax" */ "./mathjax.mts"
    );
    const mathLines = group.content.map((line) => getMathjaxSvg(line));
    const mathDivs = mathLines.map((content, i) => {
      const lineNumber = this._createElement("span", {
        format: "text",
        content: "(" + (i + 1).toString() + ")",
        className: CLASSES.latexLineNumber,
      });

      const mathLine = this._createElement("div", {
        format: "html",
        content,
        style: "position: relative;",
      });

      mathLine.appendChild(lineNumber);
      return mathLine;
    });

    const container = this._createElement("div", {
      className: CLASSES.latexFrame,
      format: "html",
      children: mathDivs,
    });
    return container;
  }

  _renderSynth(group: ParserKindFrameAudioSynthesis) {
    let as: AudioSynthesis | undefined;
    let stopButton: HTMLElement;
    let playButton: HTMLElement;
    const duration = 2;
    let timeoutTicket: number;

    const container = this._createElement("div", {
      // children: [playButton, stopButton],
      className: CLASSES.synthPlayer,
    });

    const playAction = () => {
      if (!as) {
        // @ts-expect-error
        as = new AudioSynthesis(group.content, 2);
        playButton.classList.add(CLASSES.featureActive);
        container.classList.add(CLASSES.featureActive);
        // stopButton.classList.remove(CLASSES.featureActive);
        as.play();
      }

      timeoutTicket = setTimeout(() => {
        stopAction();
      }, duration * 1000);
    };

    const stopAction = () => {
      if (timeoutTicket) {
        clearTimeout(timeoutTicket);
      }
      if (as) {
        as.stop();
        as = undefined;
        // stopButton.classList.add(CLASSES.featureActive);
        playButton.classList.remove(CLASSES.featureActive);
        container.classList.remove(CLASSES.featureActive);
      }
    };

    stopButton = this._createElement("button", {
      className: CLASSES.synthStopButton,
      children: [
        this._createElement("span", {
          format: "text",
          content: "■",
        }),
      ],
    });
    stopButton.addEventListener("click", () => stopAction());

    playButton = this._createElement("button", {
      className: CLASSES.synthPlayButton,
      children: [
        this._createElement("span", {
          format: "text",
          content: "▶",
        }),
      ],
    });
    playButton.addEventListener("click", () => playAction());

    container.appendChild(playButton);
    container.appendChild(stopButton);

    playAction();

    return container;
  }

  async _renderMermaid(
    faceName: CardFaces,
    groupIndex: number,
    group: ParserKindFrameMermaid,
  ): Promise<HTMLElement> {
    const { default: mermaid } = await import(
      // @ts-expect-error
      /* webpackChunkName: "_ranki_mermaid" */ "mermaid"
    );
    const content = group.content.join("\n");
    mermaid.initialize({ startOnLoad: false, ...this.mermaid });
    const { svg } = await mermaid.render(`${faceName}-${groupIndex}`, content);
    const container = this._createElement("div", {
      format: "html",
      content: svg,
      className: CLASSES.graphContainer,
    });
    return container;
  }

  _renderFrameKind(
    faceName: CardFaces,
    groupIndex: number,
    group: ParserKindFrame,
  ): Promise<HTMLElement> {
    switch (group.kind) {
      case "ignore":
        return Promise.resolve(
          this._createElement("div", {
            format: "html",
            content: group.content,
          }),
        );

      case "mermaid":
        return this._renderMermaid(faceName, groupIndex, group);

      case "synth":
        return Promise.resolve(this._renderSynth(group));

      case "code":
        return Promise.resolve(this._renderCode(group));

      case "pre code":
        return Promise.resolve(this._renderPreCode(group));

      case "ol":
      case "ul":
        return Promise.resolve(this._renderUl(group, group.kind));

      case "dl":
        return Promise.resolve(this._renderDl(group));

      case "table":
        return Promise.resolve(this._renderTable(group));

      case "mnemonic":
        return Promise.resolve(this._renderMnemonic(group));

      case "latex":
        return this._renderLatex(group);

      default:
        throw new Error(
          [
            "Unrecognized frame group kind:",
            JSON.stringify(group, null, 2),
          ].join("\n"),
        );
    }
  }

  _renderGroup(
    faceName: CardFaces,
    groupIndex: number,
    group: ParserKind,
  ): Promise<HTMLElement> {
    switch (group.type) {
      case "text":
        return Promise.resolve(this._renderTextKind(group));

      case "frame":
        return this._renderFrameKind(faceName, groupIndex, group);

      default:
        throw new Error(
          ["Unrecognized group type:", JSON.stringify(group, null, 2)].join(
            "\n",
          ),
        );
    }
  }

  renderFace(faceName: CardFaces, sections: ParserField[]): void {
    const renders = [];
    for (const section of sections) {
      const container = this._createElement("section", {
        className: section.field.name,
      });

      section.list.forEach(async (group, groupIndex) => {
        const g = await this._renderGroup(faceName, groupIndex, group);
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
