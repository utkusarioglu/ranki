import type { LitElement } from "lit";

import type {
  GeometryChildrenOnEmitProps,
  GeometryChildrenProps,
} from "./children/children.types.mjs";
// import type { GeometryWatcherRecord } from "./watcher/watcher.types.mjs";

export type GeometrySetName = { type?: "GeometrySet" } & string;

export type GeometrySetOnEmitProps = GeometryChildrenOnEmitProps;
export interface GeometrySetsConstructorParams<Instance extends LitElement> {
  children?: GeometryChildrenProps<Instance>;
}
