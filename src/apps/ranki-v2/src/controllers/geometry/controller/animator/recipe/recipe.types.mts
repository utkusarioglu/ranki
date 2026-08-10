import type { LocalAction } from "_controllers/geometry/geometry-intent.types.mjs";

export interface GetAnimationRecipeProps {
  mode: string;
  action: LocalAction;
  preset: string;
  role: string;
}
