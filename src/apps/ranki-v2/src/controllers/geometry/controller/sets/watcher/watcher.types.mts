import type { LitElement } from "lit";

import type { GeometrySetSelectorCb } from "../sets.types.mjs";

export interface GeometryWatcherProps<Instance extends LitElement> {
  selector: GeometrySetSelectorCb<Instance>;
}

export type GeometryWatcherRecord<Instance extends LitElement> = Record<
  string,
  GeometryWatcherProps<Instance>
>;
