import { describe, expect, test } from "vitest";
import { KeyframeUtils } from "./keyframe-utils.mts";
import type { AnimateableStyles } from "../animator.types.mts";

interface Case {
  name: string;
  input: AnimateableStyles;
  expected: Keyframe;
}

interface Group {
  group: string;
  cases: Case[];
}

type Cases = Group[];

const SEQ = Array.from({ length: 10 }, (_, i) => (i + 1) * 10);
const SEQ2 = Array.from({ length: 10 }, (_, i) => [(i + 1) * 10, (i + 2) * 20]);

const CASES: Cases = [
  {
    group: "left",
    cases: [
      ...SEQ.map((i) => ({
        name: `Happy ${i}`,
        input: { left: i },
        expected: { transform: `translateX(${i}px)` },
      })),
      {
        name: "Edge: 0",
        input: { left: 0 },
        expected: {},
      },
    ],
  },
  {
    group: "top",
    cases: [
      ...SEQ.map((i) => ({
        name: `Happy ${i}`,
        input: { top: i },
        expected: { transform: `translateY(${i}px)` },
      })),
      {
        name: "Edge: 0",
        input: { top: 0 },
        expected: {},
      },
    ],
  },
  {
    group: "left + top",
    cases: [
      ...SEQ2.map(([i, j]) => ({
        name: `Happy ${i} ${j}`,
        input: { left: i, top: j },
        expected: { transform: `translateX(${i}px) translateY(${j}px)` },
      })),
    ],
  },
];

CASES.forEach(({ cases, group }) => {
  describe(group, () => {
    cases.forEach(({ input, expected, name }) => {
      test(name, () => {
        const response = KeyframeUtils.produceKeyframe(input);
        expect(response).toEqual(expected);
      });
    });
  });
});
