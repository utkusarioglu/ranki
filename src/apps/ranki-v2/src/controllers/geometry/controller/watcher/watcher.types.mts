import type { LitElement } from "lit";
import type { GeometrySetSelectorCb } from "../types/geometry-controller.constructor.types.mjs";

export type GeometryWatcherRecord<Instance extends LitElement> = Record<
  string,
  GeometryWatcherProps<Instance>
>;

export interface GeometryWatcherProps<Instance extends LitElement> {
  selector: GeometrySetSelectorCb<Instance>;
}
