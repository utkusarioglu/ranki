import type {
  LayoutElemContext,
  LayoutSetName,
  TargetRec as SetRec,
} from "./set.types.mts";
import type { HostType, LayoutRole } from "./layout.controller.types.mts";
import type { AnimatableStylesPartial } from "./style/style.types.mts";

export interface LayoutParams<Instance extends HostType> {
  role: LayoutRole;
  events?: { hover?: boolean };
  sets?: SetRec<Instance>;
}

export type LayoutEventCallback<Instance> = (
  s: Instance,
  event: LayoutActionEvents,
) => void;

export type LayoutActionEvents = `${LayoutActions}-start` &
  `${LayoutActions}-end`;

export type LayoutActions = "none" | "resize" | "enter" | "leave" | "move";

export type LayoutSize = {
  role: string;
  setName: LayoutSetName;
  size: {
    width: number;
    height: number;
    // top: number;
    // left: number;
  };
  children: LayoutSize[];
  // actions: LayoutActions[];
  // sets: Record<LayoutRole, LayoutSize>;
};

export type LayoutInformedChildStyle = {
  // stagger: number;
  style: AnimatableStylesPartial;
  context: LayoutElemContext;
  // size: LayoutSize;
};
