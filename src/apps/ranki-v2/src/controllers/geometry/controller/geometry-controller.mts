import { PROPAGATE_DELAY } from "_/debug/debug.constants.mjs";
import type { R2C } from "_components/r2c/r2c.mjs";
import { assertExists, assertNotUndefined } from "_error/assertions.mjs";
import { RankiAppError } from "_error/ranki-app-error.mjs";
import {
  ReconciliationUtils,
  type ReconciliationDiff,
} from "_utils/reconciliation.utils.mjs";
import { TimingUtils } from "_utils/timing.utils.mjs";
import type { LitElement, ReactiveController } from "lit";
import { Animator } from "./animator/animator.mjs";
import type { InformSetProps } from "./animator/animator.types.mjs";
import { GeometryMerger } from "./merger/geometry-merger.mjs";
import type { R2CNewChildSizeEvent } from "../events/geometry-events.types.mts";
import type { LayoutSizing } from "../layout/layout-utils.types.mts";
import type {
  ComponentDims,
  CurrentAppliedStyle,
  GeometrySetName,
  InformContext,
  InformedChildStyle,
  OnEmitParams,
} from "./types/geometry-controller.types.mts";
import type {
  GeometryControllerConstructorParams,
  GeometrySetLayoutCb,
  GeometrySetProps,
  GeometrySetRecord,
} from "./types/geometry-controller.constructor.types.mts";
import { DebugUtils } from "_/debug/debug-utils.mjs";
import { GeometryEvents } from "../events/geometry-events.mts";

export class GeometryController<
  Instance extends LitElement,
> implements ReactiveController {
  private readonly host: Instance;
  private readonly registered = new WeakMap<R2C, ComponentDims>();
  private readonly targets: GeometrySetRecord<Instance> | undefined;
  private readonly animator: Animator;
  private sizing: LayoutSizing | null = null;
  private requested = false;
  private curr: CurrentAppliedStyle | null = null;
  private prev: CurrentAppliedStyle | null = null;
  private events: GeometryEvents<Instance>;

  constructor(
    host: Instance,
    params: GeometryControllerConstructorParams<Instance>,
  ) {
    host.addController(this);
    this.host = host;
    this.targets = params.sets;
    this.animator = new Animator(this.host, params.role, {
      informSet: this.informSet.bind(this),
    });
    this.events = new GeometryEvents({
      host: this.host,
      events: params.events,
      on: params.on,
    });
    this.bindInformStyle();
  }

  /**
   * This is the method parent uses to tell its child what style it's
   * supposed to animate towards
   */
  private bindInformStyle() {
    // @ts-expect-error
    this.host.informStyle = this.informStyle.bind(this);
  }

  private getSet(set: GeometrySetName): GeometrySetProps<Instance> {
    const s = this.targets && this.targets[set]!;
    assertExists(s, {
      why: "Subtree selector hasn't been registered",
      details: { id: set },
    });
    return s;
  }

  private getSizing(): LayoutSizing | null {
    return this.sizing;
  }

  private informAsRoot(geo: LayoutSizing) {
    const inform: InformedChildStyle = {
      context: {
        index: 0,
        length: 1,
        stagger: 0,
      },
      containerExposed: {
        style: geo.container,
      },
      selfOverrides: {
        style: {},
      },
    };
    this.informStyle(inform);
  }

  private getIsRoot(setName: GeometrySetName): boolean {
    const set = this.getSet(setName);
    return !!set.isRoot;
  }

  private getSizingCallback(setName: GeometrySetName): GeometrySetLayoutCb {
    const set = this.getSet(setName);
    const layout = set.layout;
    assertNotUndefined(layout, {
      why: "No sizing registered",
      details: { setName },
    });
    return layout;
  }

  private orderTrackedNodes(setName: GeometrySetName) {
    const set = this.getSet(setName);
    const serial = set.selector(this.host);
    const ordered: ComponentDims[] = [];
    for (let component of serial) {
      const dims = this.registered.get(component);
      if (!dims) {
        // console.log("cannot find", component);
        continue;
        // FIX you may need to replace this with a boundingClientRect call
        // assertNever({ why: "The element should exist in weakmap" });
      }
      ordered.push(dims);
    }
    return ordered;
  }

  private getDiff(setName: GeometrySetName): ReconciliationDiff {
    const set = this.getSet(setName);
    // const t = this.changes[target];
    const diff = set.diff;
    if (!diff) {
      // console.log("diff detection not registered for target:", id);
      return ReconciliationUtils.noChanges();
    }
    return diff(this.host);
  }

  onEmit({ set }: OnEmitParams) {
    return (e: CustomEvent<R2CNewChildSizeEvent>) => {
      e.stopPropagation();
      const detail = e.detail;
      const target = e.composedPath()[0] as R2C;
      if (!target)
        throw new RankiAppError({
          code: "NO_TARGET",
          why: "No valid target given",
          cause: {},
        });
      switch (detail.intent) {
        case "leave":
          this.registered.set(target, {
            intent: detail.intent,
            style: {
              width: 0,
              height: 0,
            },
          });
          break;
        case "disconnected":
          this.registered.delete(target);
          break;
        case "update":
          if (this.registered.has(target)) {
            this.registered.set(target, {
              intent: detail.intent,
              style: detail.style,
              // ...detail.rect,
            });
          } else {
            this.registered.set(target, {
              intent: "enter",
              style: detail.style,
            });
          }
          break;
        case "mode":
          this.registered.set(
            target,
            // @ts-expect-error
            {
              ...this.registered.get(target),
              intent: "enter",
              mode: detail.mode,
            },
          );
      }
      switch (detail.intent) {
        case "leave":
        case "update":
          const sz = this.getSizingCallback(set);
          const ordered = this.orderTrackedNodes(set);
          this.sizing = sz(this.host)(ordered);
          if (!this.requested) {
            this.requested = true;
            TimingUtils.raf().then(() => {
              setTimeout(() => {
                this.requested = false;
                if (this.sizing)
                  if (this.getIsRoot(set)) {
                    this.informAsRoot(this.sizing);
                  } else {
                    this.events.emit("update", this.sizing.container);
                  }
              }, PROPAGATE_DELAY);
            });
          }
      }
    };
  }

  private async informSet(props: InformSetProps): Promise<void> {
    const diff = this.getDiff(props.setName);
    const sizing = this.getSizing();
    await Promise.all(
      this.getSet(props.setName)
        .selector(this.host)
        .map((e, i, a) => {
          const context: InformContext = {
            index: i,
            length: a.length,
            stagger: diff.stagger.indices[i],
          };
          const informed = GeometryMerger.createSetItemInformer({
            context,
            props,
            sizing,
          });

          DebugUtils.informSet({ e, host: this.host, informed, props });
          return e.informStyle(informed);
        }),
    );
  }

  public async informStyle(informed: InformedChildStyle): Promise<void> {
    const sizing = this.getSizing();
    this.prev = this.curr;
    this.curr = GeometryMerger.createCurrStyle(informed, sizing, this.prev);

    DebugUtils.informStyle({
      host: this.host,
      curr: this.curr,
      prev: this.prev,
      sizing,
    });

    this.events.onActionsStart(this.curr.actions);
    await this.animator.update(this.curr, this.prev);
    this.events.onActionsEnd(this.curr.actions);
  }

  hostConnected(): void {
    this.events.registerListeners();
  }

  hostDisconnected(): void {
    this.events.deregisterListeners();
  }
}
