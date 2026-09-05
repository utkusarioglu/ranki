import type { R2C } from "_components/r2c/r2c.mjs";
import type { LitElement } from "lit";

import type {
  GeometryChildrenOnEmitProps,
  GeometryChildrenProps,
} from "./children/children.types.mjs";
import type { GeometryWatcherRecord } from "./watcher/watcher.types.mjs";

export type GeometrySetName = { type?: "GeometrySet" } & string;

export type GeometrySetOnEmitProps = GeometryChildrenOnEmitProps;
export interface GeometrySetsConstructorParams<Instance extends LitElement> {
  children?: GeometryChildrenProps<Instance>;
  watchers?: GeometryWatcherRecord<Instance>;
}

export type GeometrySetSelectorCb<Instance extends LitElement> = (
  s: Instance,
) => R2C[];
