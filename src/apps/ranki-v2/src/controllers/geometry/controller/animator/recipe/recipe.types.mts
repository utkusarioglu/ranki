import type { LocalAction } from "_controllers/geometry/geometry-intent.types.mjs";

export interface GetAnimationRecipeProps {
  interaction: string;
  action: LocalAction;
  preset: string;
  role: string;
}
