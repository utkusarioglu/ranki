import type {
  ReconciliationInfo,
  WrappedState,
} from "_components/subtree/subtree.mjs";
import { assertNever } from "_error/assertions.mjs";
import { WcAnimation } from "./animation.mts";
import { WcCss } from "./css.mts";
import { WcCreate } from "./create.mts";
import { WcState } from "./state.mts";
import { WcElements } from "./elements.mts";

export type ReconciliationAction =
  | "advance"
  | "create"
  | "remove"
  | "mutate"
  | "hide"
  | "show";

export class Wc<Props, InternalState = Props> extends HTMLElement {
  public static tag = "wc-component";
  public readonly animation = new WcAnimation(this);
  public readonly css = new WcCss(this);
  public readonly state = new WcState<Props, InternalState>(
    this.onStateChange.bind(this),
    this.onStateSame.bind(this),
  );
  public isShadow = false;
  protected readonly elements = new WcElements(this);

  constructor(isShadow: boolean) {
    super();
    this.isShadow = isShadow;
    if (this.isShadow) {
      this.attachShadow({ mode: "open" });
    }
  }

  static get create() {
    return WcCreate(this as any, this.tag);
  }

  connectedCallback() {
    this.animation.runPreset("enter");
  }

  isActive(): boolean {
    assertNever({ why: "This method should be overridden" });
  }

  async remove(): Promise<void> {
    await this.animation.runPreset("exit");
    super.remove();
  }

  canReconcile(
    // @ts-expect-error
    s: WrappedState<Props>,
    // @ts-expect-error
    info: ReconciliationInfo<Props>,
  ): ReconciliationAction {
    assertNever({ why: "This method should be overridden" });
  }

  initialize() {
    assertNever({ why: "this method needs to be overridden" });
  }

  protected onStateSame(
    // @ts-expect-error
    curr: InternalState,
  ) {}

  protected onStateChange(
    // @ts-expect-error
    curr: InternalState,
    // @ts-expect-error
    prev: InternalState | null,
  ) {
    assertNever({ why: "this method needs to be overridden" });
  }
}
