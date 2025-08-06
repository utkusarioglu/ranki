import type {
  CreateElementChainOptions,
  CreateElementChainReturn,
  CreateElementOptions,
} from "./html.types.mjs";

export type Tags = string[];

export class Html {
  private static _assignElementContent(
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

  private static _appendElementChildren(
    elem: HTMLElement | undefined,
    children: HTMLElement[] = [],
  ) {
    if (elem && children.length) {
      for (const child of children) {
        elem.appendChild(child);
      }
    }
  }

  private static _assignElemClassName(
    elem: HTMLElement | undefined,
    className: string | undefined,
  ) {
    if (elem && className) {
      elem.className = className;
    }
  }

  static single<Root extends HTMLElement>(
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

    Html._assignElementContent(elem, content, format);
    Html._assignElemClassName(elem, className);
    Html._appendElementChildren(elem, children);

    if (style) {
      // @ts-ignore
      elem.style = style;
    }

    return elem as Root;
  }

  static chain<Root extends HTMLElement, Leaf extends HTMLElement>(
    tags: Tags,
    { leaf, root }: Partial<CreateElementChainOptions> = {},
  ): CreateElementChainReturn<Root, Leaf> {
    const rootElem = Html.single(tags[0]);
    const rest = tags.slice(1);

    let leafElem = rootElem;
    for (const e of rest) {
      const child = Html.single(e);
      leafElem.appendChild(child);
      leafElem = child;
    }

    Html._assignElementContent(leafElem, leaf?.content, leaf?.format);
    Html._appendElementChildren(leafElem, leaf?.children);
    Html._assignElemClassName(leafElem, leaf?.className);
    Html._assignElemClassName(rootElem, root?.className);

    return {
      root: rootElem as unknown as Root,
      leaf: leafElem as unknown as Leaf,
    };
  }

  static toString(elem: HTMLElement) {
    const div = document.createElement("div");
    div.appendChild(elem);
    return div.innerHTML;
  }
}
