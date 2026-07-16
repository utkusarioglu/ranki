import type { ReactiveController } from "lit";
import type { LayoutParams } from "./layout.types.mts";
import type {
  HostType,
  LayoutOnEmitProps,
} from "./layout.controller.types.mts";
import { LayoutSet } from "./set.mts";
import type { LayoutEvent } from "./layout.event.types.mts";
import type { R2C } from "_components/r2c/r2c.mjs";
import { RankiAppError } from "_error/ranki-app-error.mjs";
import { assertNotUndefined } from "_error/assertions.mjs";
import type { InformSetTargetCallbackParams } from "./animator.types.mts";
import type { LayoutSetName } from "./set.types.mts";

export class LayoutController<
  Instance extends HostType,
> implements ReactiveController {
  private readonly host: Instance;
  private readonly params: LayoutParams<Instance>;
  private sets: Record<LayoutSetName, LayoutSet<Instance>> = {};

  constructor(host: Instance, params: LayoutParams<Instance>) {
    host.addController(this);
    this.host = host;
    this.params = params;
    this.registerTargets();
  }

  private registerTargets() {
    if (!this.params.sets) return;
    Object.entries(this.params.sets).forEach(([setName, props]) => {
      this.sets[setName] = new LayoutSet(
        this.host,
        setName,
        this.params.role,
        props,
      );
    });
  }

  private informTarget(params: InformSetTargetCallbackParams): Promise<void> {
    // TODO
    return Promise.resolve();
  }

  onEmit({ set }: LayoutOnEmitProps) {
    return (e: CustomEvent<LayoutEvent>) => {
      e.stopPropagation();
      const detail = e.detail;
      const elem = e.composedPath()[0] as R2C;
      if (!elem)
        throw new RankiAppError({
          code: "NO_TARGET",
          why: "No valid target given",
          cause: {},
        });
      assertNotUndefined(this.sets[set], {
        why: "Cannot emit to a set that hasn't been defined",
        details: { set },
      });
      this.sets[set].onEvent(elem, detail);
    };
  }

  hostConnected(): void {}

  hostDisconnected(): void {}
}
