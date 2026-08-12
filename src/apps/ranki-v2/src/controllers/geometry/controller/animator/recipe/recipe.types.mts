import type { LocalAction } from "_controllers/geometry/geometry-intent.types.mjs";

export interface GetAnimationRecipeProps {
  action: LocalAction;
  interaction: string;
  preset: string;
  role: string;
}
