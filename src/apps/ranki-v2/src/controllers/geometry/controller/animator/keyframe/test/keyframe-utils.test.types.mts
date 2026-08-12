import type { AnimationKeyframeStyles } from "../../types/animator.types.mjs";

export interface Case {
  expected: Partial<Keyframe>;
  input: AnimationKeyframeStyles;
  name: string;
}

export type Cases = Group[];

export interface Group {
  cases: Case[];
  group: string;
}
