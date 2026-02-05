import type {
  AnimationTypes,
  AnimationNames,
} from "_components/animation/animation.mts";
import type {
  ReconciliationInfo,
  WrappedState,
} from "_components/subtree/subtree.mjs";
import { assertNever } from "_error/assertions.mjs";

export type SetPropertiesArg = Record<string, string | number>;
export type ReconciliationAction =
  | "advance"
  | "create"
  | "remove"
  | "mutate"
  | "hide"
  | "show";

export class RankiWc<Props, InternalState = Props> extends HTMLElement {
  private curr!: InternalState;
  private prev: InternalState | null = null;
  protected animations: AnimationTypes = {};
  private hasShadow = false;
  protected initialized = false;

  constructor(hasShadow: boolean) {
    super();
    this.hasShadow = hasShadow;
    if (this.hasShadow) {
      this.attachShadow({ mode: "open" });
    }
  }

  connectedCallback() {
    this.runAnimation("enter");
  }

  // TODO
  isActive(): boolean {
    assertNever({ why: "This method should be overridden" });
  }

  static getName() {
    return this.name;
  }

  async remove(): Promise<void> {
    await this.runAnimation("exit");
    super.remove();
  }

  protected runAnimation(type: AnimationNames): Promise<Animation | void> {
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

  canReconcile(
    // @ts-expect-error
    s: WrappedState<Props>,
    // @ts-expect-error
    info: ReconciliationInfo<Props>,
  ): ReconciliationAction {
    assertNever({ why: "This method should be overridden" });
  }

  public removeProperties(c: string[]) {
    c.forEach((p) => {
      this.style.removeProperty(p);
    });
  }

  public twoRaf(cb: () => void): Promise<void> {
    return this.raf(2, cb);
  }

  public raf(count: number = 1, cb: () => void): Promise<void> {
    let curr = 0;
    function f(resolve: () => void, cb: () => void) {
      if (curr++ === count) {
        cb();
        resolve();
      } else {
        requestAnimationFrame(() => f(resolve, cb));
      }
    }

    return new Promise<void>((r) => f(r, cb));
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

  getCurr(): InternalState {
    return this.curr;
  }

  getPrev(): InternalState | null {
    return this.prev;
  }

  setProps(props: Props) {
    this.prev = this.curr;
    this.curr = this.buildInternalState(props);
    this.render(this.curr, this.prev);
  }

  protected buildInternalState(props: Props): InternalState {
    return props as unknown as InternalState;
  }

  protected render(
    // @ts-expect-error
    curr: InternalState,
    // @ts-expect-error
    prev: InternalState,
  ) {
    assertNever({ why: "this method needs to be overridden" });
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
