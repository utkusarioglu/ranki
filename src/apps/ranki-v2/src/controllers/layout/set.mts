import type { LitElement } from "lit";
import type {
  ComponentDims,
  EmittedToParent,
  LayoutSetName,
  TargetProps as SetProps,
} from "./set.types.mts";
import type { R2C } from "_components/r2c/r2c.mjs";
import type { LayoutEvent } from "./layout.event.types.mts";
import { assertNotUndefined } from "_error/assertions.mjs";
import { TimingUtils } from "_utils/timing,utils.mjs";
import { PROPAGATE_DELAY } from "_/debug.constants.mjs";
import { LayoutUtils } from "./layout.utils.mts";
import type {
  LayoutActionEvents,
  LayoutInformedChildStyle,
  LayoutSize,
} from "./layout.types.mts";
import { Animator } from "./animator.mts";
import type { LayoutRole } from "./layout.controller.types.mts";
import type { InformSetTargetCallbackParams } from "./animator.types.mts";

export class LayoutSet<Instance extends LitElement> {
  private readonly host: Instance;
  private readonly props: SetProps<Instance>;
  private readonly setName: LayoutSetName;
  private readonly registered = new WeakMap<R2C, EmittedToParent>();
  private requested = false;
  private prev: LayoutInformedChildStyle | null = null;
  private curr: LayoutInformedChildStyle | null = null;
  private readonly animator: Animator;

  constructor(
    host: Instance,
    setName: LayoutSetName,
    role: LayoutRole,
    props: SetProps<Instance>,
  ) {
    this.host = host;
    this.props = props;
    this.setName = setName;
    this.animator = new Animator(this.host, role, {
      informSetTarget: this.informSetTarget.bind(this),
    });

    const sizingCallback = this.props.sizing;
    assertNotUndefined(sizingCallback, {
      why: "no sizing callback registered",
    });
  }

  private updateRegistry(target: R2C, detail: LayoutEvent) {
    switch (detail.intent) {
      case "leave":
        this.registered.set(target, {
          ...this.registered.get(target),
          intent: detail.intent,
        });
        break;
      case "disconnect":
        this.registered.delete(target);
        break;
      case "connect":
        this.registered.set(target, {});
        break;
      case "enter":
        this.registered.set(target, { intent: detail.intent });
        break;
      case "update":
        this.registered.set(target, {
          ...this.registered.get(target),
          intent: detail.intent,
        });
        break;
    }
  }

  // private getSizingCallback(): SizingCb {
  //   const s = this.props.sizing;
  //   assertNotUndefined(s, { why: "No sizing registered", details: { id } });
  //   return s;
  // }

  private informSetTarget(
    params: InformSetTargetCallbackParams,
  ): Promise<void> {
    // diff
    // plan
    // exec

    // TODO
    return Promise.resolve();
  }

  private orderTrackedNodes() {
    // const t = this.getTarget(target);
    const serial = this.props.selector(this.host);
    const ordered: ComponentDims[] = [];
    for (let component of serial) {
      const dims = this.registered.get(component);
      if (!dims) {
        // console.log("cannot find", component);
        continue;
        // FIX you may need to replace this with a boundingClientRect call
        // assertNever({ why: "The element should exist in weakmap" });
      }
      ordered.push({ component, dims });
    }
    return ordered;
  }

  private informAsRoot(size: LayoutSize) {
    // TODO
    const style = {
      width: size.size.width,
      height: size.size.height,
    };
    this.informSetStyle(
      {
        context: {
          index: 0,
          length: 1,
          stagger: 0,
        },
        style,
        // stagger: 0,
        // size: geo,
      },
      // , {
      // index: 0,
      // length: 1,
      // stagger: [0],
      // }
    );
  }

  private async informSetStyle(
    size: LayoutInformedChildStyle,
    // context: InformContext,
  ) {
    this.prev = this.curr;
    this.curr = size;

    const onEvent = this.props.on;
    if (onEvent) {
      this.curr.actions.forEach((action) => {
        onEvent(this.host, `${action}-start` as LayoutActionEvents);
      });
    }
    await this.animator.updateStyle(actions, this.curr, this.prev, context);
    if (onEvent) {
      actions.forEach((action) => {
        onEvent(this.host, `${action}-end` as LayoutActionEvents);
      });
    }
  }

  private evaluateEvent(detail: LayoutEvent) {
    const sizingCallback = this.props.sizing!;
    switch (detail.intent) {
      case "leave":
      case "update":
        if (!this.requested !== null) {
          this.requested = true;
          TimingUtils.raf().then(() => {
            setTimeout(() => {
              this.requested = false;

              const ordered = this.orderTrackedNodes();
              const sizing: LayoutSize = sizingCallback(this.host)(ordered);

              if (this.props.isRoot) {
                // const inform: LayoutEvent = {
                //   intent: sizing.intents[0],
                //   ...sizing,
                // };
                this.informAsRoot(sizing);
              } else {
                LayoutUtils.emit(this.host, { intent: "update", sizing });
                // this.emit("update", sizing);
              }
            }, PROPAGATE_DELAY);
          });
        }
    }
  }

  onEvent(elem: R2C, detail: LayoutEvent) {
    this.updateRegistry(elem, detail);
    this.evaluateEvent(detail);
  }
}
