import type {
  AnimationTypes,
  AnimationNames,
} from "../animation/animation.mts";

export type SetPropertiesArg = Record<string, string | number>;

export class RankiWc<Props> extends HTMLElement {
  private curr!: Props;
  private prev: Props | null = null;
  protected animations: AnimationTypes = {};

  constructor(hasShadow: boolean) {
    super();
    if (hasShadow) {
      this.attachShadow({ mode: "open" });
    }
  }

  connectedCallback() {
    this.runAnimation("enter");
  }

  static getName() {
    return this.name;
  }

  async remove(): Promise<void> {
    await this.runAnimation("exit");
    super.remove();
  }

  protected runAnimation(type: AnimationNames): Promise<void> {
    const animation = this.animations[type];
    if (animation) {
      return animation();
    }
    return Promise.resolve();
  }

  public setProperties(c: SetPropertiesArg) {
    Object.entries(c).forEach(([p, v]) => {
      this.style.setProperty(p, v.toString());
    });
  }

  public removeProperties(c: string[]) {
    c.forEach((p) => {
      this.style.removeProperty(p);
    });
  }

  public twoRaf(cb: () => void): Promise<void> {
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

  getHeight(): number {
    return this.getBoundingClientRect().height;
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

  getCurr(): Props {
    return this.curr;
  }

  getPrev(): Props | null {
    return this.prev;
  }

  setProps(props: Props) {
    this.prev = this.curr;
    this.curr = props;
    this.render();
  }

  render(): this {
    return this;
  }

  addClass(...cl: string[]) {
    this.classList.add(...cl);
  }

  private static define() {
    if (customElements.get(this.name) === undefined) {
      customElements.define(this.name, this);
    }
  }

  static createAndAttach<T, C extends RankiWc<T>>(
    props: T,
    attach: Element | ShadowRoot,
  ) {
    this.define();
    const el = document.createElement(this.name) as C;
    attach.appendChild(el);
    el.setProps(props);
    return el;
  }

  static create<T, C extends RankiWc<T>>(props: T) {
    this.define();
    const el = document.createElement(this.name) as C;
    el.setProps(props);
    return el;
  }

  static singleton<T, C extends RankiWc<T>>(props: T, attach: HTMLElement) {
    let el: RankiWc<T> | null = attach.querySelector(this.name);

    if (!el) {
      this.define();
      el = document.createElement(this.name) as C;
      attach.appendChild(el);
    }
    el.setProps(props);

    return el;
  }
}
