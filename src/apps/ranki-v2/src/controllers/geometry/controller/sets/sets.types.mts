import type { LitElement } from "lit";
import type { GeometryChildrenProps } from "../children/children.types.mjs";
import type { GeometryWatcherRecord } from "../watcher/watcher.types.mjs";

export interface GeometrySetsConstructorParams<Instance extends LitElement> {
  watchers?: GeometryWatcherRecord<Instance>;
  children?: GeometryChildrenProps<Instance>;
}
