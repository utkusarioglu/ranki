import type { LitElement } from "lit";

import {
  type ReconciliationDiff,
  ReconciliationUtils,
} from "_utils/reconciliation.utils.mjs";

import type { InformSetProps } from "../../animator/types/animator.types.mjs";
import type { GeometrySetDiffCb } from "../children/children.types.mjs";
import type { LayoutSizing } from "../children/layout/layout-utils.types.mjs";
import type { GeometrySetSelectorCb } from "../sets.types.mjs";
import type { GeometryWatcherProps } from "../watcher/watcher.types.mjs";

import { Logger } from "../../logger/logger.mjs";
import { GeometrySetsUtils } from "../geometry-sets-utils.mjs";
import { context, trace, type Tracer } from "@opentelemetry/api";

export class WatcherSet<Instance extends LitElement> {
  protected diff?: GeometrySetDiffCb<Instance>;
  protected readonly host: Instance;
  protected readonly logger: Logger;
  protected readonly selector: GeometrySetSelectorCb<Instance>;
  protected readonly tracer: Tracer;

  constructor(
    host: Instance,
    props: GeometryWatcherProps<Instance>,
    tracerName: string = "WatcherSet",
  ) {
    this.host = host;
    this.selector = props.selector;
    this.logger = new Logger({ class: "WatcherSet", host: this.host });
    this.tracer = trace.getTracer(tracerName);
  }

  public async inform(
    props: InformSetProps,
    sizing: LayoutSizing | null,
  ): Promise<void> {
    const diff = this.getDiff();
    return this.tracer.startActiveSpan("inform", async (span) => {
      // const ctx = trace.setSpan(context.active(), span);
      try {
        await Promise.all(
          this.getElements().map((e, i, a) => {
            const informed = GeometrySetsUtils.prepareSetElementStyle(
              i,
              a,
              diff,
              props,
              sizing,
            );
            this.logger.debug("WatcherSet.informSet", { e, informed, props });
            span.addEvent("informStyle.before");
            // return context.with(ctx, () => e.informStyle(informed));
            return e.informStyle(informed);
          }),
        );
      } finally {
        span.end();
      }
    });
  }

  protected getElements() {
    return this.selector(this.host);
  }

  // FIX this will break the layout it assumes a single child
  private getDiff(): ReconciliationDiff {
    const diff = this.diff;
    if (!diff) {
      const elems = this.getElements();
      return ReconciliationUtils.noChanges(elems.length);
    }
    return diff(this.host);
  }
}
