import type {
  CreateElementChainOptions,
  CreateElementChainReturn,
  CreateElementOptions,
} from "./html.types.mjs";

export type Tags = string[];

export class Html {
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

  single<Root extends HTMLElement>(
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

    return elem as Root;
  }

  chain<Root extends HTMLElement, Leaf extends HTMLElement>(
    tags: Tags,
    { leaf, root }: Partial<CreateElementChainOptions> = {},
  ): CreateElementChainReturn<Root, Leaf> {
    const rootElem = this.single(tags[0]);
    const rest = tags.slice(1);

    let leafElem = rootElem;
    for (const e of rest) {
      const child = this.single(e);
      leafElem.appendChild(child);
      leafElem = child;
    }

    this._assignElementContent(leafElem, leaf?.content, leaf?.format);
    this._appendElementChildren(leafElem, leaf?.children);
    this._assignElemClassName(leafElem, leaf?.className);
    this._assignElemClassName(rootElem, root?.className);

    return {
      root: rootElem as unknown as Root,
      leaf: leafElem as unknown as Leaf,
    };
  }

  toString(elem: HTMLElement) {
    const div = document.createElement("div");
    div.appendChild(elem);
    return div.innerHTML;
  }
}
