import type { LitElement } from "lit";
import type { GeometryChildrenProps } from "./children/children.types.mjs";
import type { GeometryWatcherRecord } from "./watcher/watcher.types.mjs";
import type { R2C } from "_components/r2c/r2c.mjs";

export interface GeometrySetsConstructorParams<Instance extends LitElement> {
  watchers?: GeometryWatcherRecord<Instance>;
  children?: GeometryChildrenProps<Instance>;
}

export type GeometrySetSelectorCb<Instance extends LitElement> = (
  s: Instance,
) => R2C[];
