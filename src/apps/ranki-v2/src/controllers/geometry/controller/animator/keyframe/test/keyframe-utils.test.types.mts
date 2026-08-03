import type { AnimationKeyframeStyles } from "../../animator.types.mjs";

export interface Case {
  name: string;
  input: AnimationKeyframeStyles;
  expected: Partial<Keyframe>;
}

export interface Group {
  group: string;
  cases: Case[];
}

export type Cases = Group[];
