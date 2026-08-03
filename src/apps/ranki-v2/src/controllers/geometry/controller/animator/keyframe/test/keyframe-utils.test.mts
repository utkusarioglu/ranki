import { describe, expect, test } from "vitest";
import { KeyframeUtils } from "../keyframe-utils.mjs";
import type { Cases } from "./keyframe-utils.test.types.mjs";

const SEQ = [
  Number.MIN_SAFE_INTEGER,
  -1000,
  -100,
  -10,
  -1,
  -0.5,
  0.25,
  1,
  1.5,
  10,
  10.5,
  100,
  1000,
  Number.MAX_SAFE_INTEGER,
];
const SEQ2 = [
  [Number.MIN_SAFE_INTEGER, -1000],
  [-100, -10],
  [-10, 10],
  [1, 2],
  [10, 20],
  [100, 200],
  [1000, 1000],
  [1.5, 2.5],
  [10.5, 20.5],
  [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
];
const OPACITY_SEQ = [0, 0.1, 0.25, 0.5, 0.75, 1];

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
  {
    group: "empty + undefined",
    cases: [
      {
        name: "Empty input",
        input: {},
        expected: {},
      },
      {
        name: "Undefined values",
        input: {
          left: undefined,
          top: undefined,
          width: undefined,
          height: undefined,
          opacity: undefined,
          rotate: undefined,
          scale: undefined,
          offset: undefined,
          skewX: undefined,
          skewY: undefined,
        },
        expected: {},
      },
    ],
  },
  {
    group: "width",
    cases: [
      ...SEQ.map((i) => ({
        name: `Happy ${i}`,
        input: { width: i },
        expected: { width: `${i}px` },
      })),
      {
        name: "Edge: 0",
        input: { width: 0 },
        expected: { width: "0px" },
      },
    ],
  },
  {
    group: "height",
    cases: [
      ...SEQ.map((i) => ({
        name: `Happy ${i}`,
        input: { height: i },
        expected: { height: `${i}px` },
      })),
      {
        name: "Edge: 0",
        input: { height: 0 },
        expected: { height: "0px" },
      },
    ],
  },
  {
    group: "opacity",
    cases: [
      ...OPACITY_SEQ.map((i) => ({
        name: `Happy ${i}`,
        input: { opacity: i },
        expected: { opacity: i },
      })),
      {
        name: "Edge: 0",
        input: { opacity: 0 },
        expected: { opacity: 0 },
      },
    ],
  },
  {
    group: "rotate",
    cases: [
      ...SEQ.map((i) => ({
        name: `Happy ${i}`,
        input: { rotate: i },
        expected: { rotate: `${i}deg` },
      })),
      {
        name: "Edge: 0",
        input: { rotate: 0 },
        expected: { rotate: "0deg" },
      },
    ],
  },
  {
    group: "scale",
    cases: [
      ...SEQ.map((i) => ({
        name: `Happy ${i}`,
        input: { scale: i },
        expected: { scale: i },
      })),
      {
        name: "Edge: 0",
        input: { scale: 0 },
        expected: { scale: 0 },
      },
    ],
  },
  {
    group: "skewX",
    cases: [
      ...SEQ.map((i) => ({
        name: `Happy ${i}`,
        input: { skewX: i },
        expected: { transform: `skewX(${i}deg)` },
      })),
      {
        name: "Edge: 0",
        input: { skewX: 0 },
        expected: {},
      },
    ],
  },
  {
    group: "skewY",
    cases: [
      ...SEQ.map((i) => ({
        name: `Happy ${i}`,
        input: { skewY: i },
        expected: { transform: `skewY(${i}deg)` },
      })),
      {
        name: "Edge: 0",
        input: { skewY: 0 },
        expected: {},
      },
    ],
  },
  {
    group: "offset",
    cases: [
      ...SEQ.map((i) => ({
        name: `Happy ${i}`,
        input: { offset: i },
        expected: { offset: i },
      })),
      {
        name: "Edge: 0",
        input: { offset: 0 },
        expected: { offset: 0 },
      },
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
