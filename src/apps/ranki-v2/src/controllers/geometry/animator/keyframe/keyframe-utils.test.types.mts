import type { AnimateableStyles } from "../animator.types.mts";

export interface Case {
  name: string;
  input: AnimateableStyles;
  expected: Partial<Keyframe>;
}

export interface Group {
  group: string;
  cases: Case[];
}

export type Cases = Group[];
