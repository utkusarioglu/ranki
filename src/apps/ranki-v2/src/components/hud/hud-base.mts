export type AnimationTypes = Record<"enter" | "exit", () => Promise<void>>;

export class HudShadowBase<Props> extends HTMLElement {
  private curr!: Props;
  protected animations: AnimationTypes = {
    enter: () => Promise.resolve(),
    exit: () => Promise.resolve(),
  };

  constructor(hasShadow: boolean) {
    super();
    if (hasShadow) {
      this.attachShadow({ mode: "open" });
    }
  }

  connectedCallback() {
    this.runAnimation("enter");
  }

  exit(): Promise<void> {
    return this.runAnimation("exit");
  }

  protected runAnimation(type: "enter" | "exit"): Promise<void> {
    const animation = this.animations[type];
    if (animation) {
      return animation();
    }
    return Promise.resolve();
  }

  protected setProperties(c: Record<string, string | number>) {
    Object.entries(c).forEach(([p, v]) => {
      this.style.setProperty(p, v.toString());
    });
  }

  protected twoRaf(cb: () => void): Promise<void> {
    return new Promise<void>((r) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          cb();
          r();
        });
      });
    });
  }

  getLeft(): number {
    return this.getBoundingClientRect().left;
  }

  getRight(): number {
    return this.getBoundingClientRect().right;
  }

  getWidth(): number {
    return this.getBoundingClientRect().width;
  }

  pushStyles(...styles: string[]) {
    if ("adoptedStyleSheets" in Document.prototype) {
      styles.forEach((cssString) => {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(cssString);

        this.shadowRoot!.adoptedStyleSheets = [
          ...this.shadowRoot!.adoptedStyleSheets,
          sheet,
        ];
      });
    } else {
      styles.forEach((cssString) => {
        const style = document.createElement("style");
        style.textContent = cssString;
        this.shadowRoot!.append(style);
      });
    }
  }

  getProps(): Props {
    return this.curr;
  }

  setProps(props: Props) {
    this.curr = props;
    this.render();
  }

  render() {}

  addClass(...cl: string[]) {
    this.classList.add(...cl);
  }

  private static define() {
    if (customElements.get(this.name) === undefined) {
      customElements.define(this.name, this);
    }
  }

  static create<T>(props: T, attach: Element) {
    this.define();
    const el = document.createElement(this.name) as HudShadowBase<T>;
    attach.appendChild(el);
    el.setProps(props);
    return el;
  }

  static singleton<T>(props: T, attach: HTMLElement) {
    let el: HudShadowBase<T> | null = attach.querySelector(this.name);

    if (!el) {
      this.define();
      el = document.createElement(this.name) as HudShadowBase<T>;
      attach.appendChild(el);
    }
    el.setProps(props);

    return el;
  }
}
