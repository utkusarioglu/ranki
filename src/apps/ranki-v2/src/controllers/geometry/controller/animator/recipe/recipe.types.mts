import type { LocalAction } from "../../events/geometry-events.types.mjs";

export interface GetAnimationRecipeProps {
  action: LocalAction;
  interaction: string;
  preset: string;
  role: string;
}
