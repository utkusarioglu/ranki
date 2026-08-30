import type { InformSetProps } from "../animator/types/animator.types.mjs";
import type { LayoutSizing } from "../sets/children/layout/layout-utils.types.mjs";
import type { InformContext } from "../types/geometry-controller.types.mjs";

export interface CreateSetItemInformerProps {
  context: InformContext;
  index: number;
  props: InformSetProps;
  sizing: LayoutSizing | null;
}
