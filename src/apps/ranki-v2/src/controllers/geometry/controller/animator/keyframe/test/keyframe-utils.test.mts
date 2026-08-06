import { describe, expect, test } from "vitest";

import type { Cases } from "./keyframe-utils.test.types.mjs";

import { KeyframeUtils } from "../keyframe-utils.mjs";

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
    cases: [
      ...SEQ.map((i) => ({
        expected: { transform: `translateX(${i}px)` },
        input: { left: i },
        name: `Happy ${i}`,
      })),
      {
        expected: {},
        input: { left: 0 },
        name: "Edge: 0",
      },
    ],
    group: "left",
  },
  {
    cases: [
      ...SEQ.map((i) => ({
        expected: { transform: `translateY(${i}px)` },
        input: { top: i },
        name: `Happy ${i}`,
      })),
      {
        expected: {},
        input: { top: 0 },
        name: "Edge: 0",
      },
    ],
    group: "top",
  },
  {
    cases: [
      ...SEQ2.map(([i, j]) => ({
        expected: { transform: `translateX(${i}px) translateY(${j}px)` },
        input: { left: i, top: j },
        name: `Happy ${i} ${j}`,
      })),
    ],
    group: "left + top",
  },
  {
    cases: [
      {
        expected: {},
        input: {},
        name: "Empty input",
      },
      {
        expected: {},
        input: {
          height: undefined,
          left: undefined,
          offset: undefined,
          opacity: undefined,
          rotate: undefined,
          scale: undefined,
          skewX: undefined,
          skewY: undefined,
          top: undefined,
          width: undefined,
        },
        name: "Undefined values",
      },
    ],
    group: "empty + undefined",
  },
  {
    cases: [
      ...SEQ.map((i) => ({
        expected: { width: `${i}px` },
        input: { width: i },
        name: `Happy ${i}`,
      })),
      {
        expected: { width: "0px" },
        input: { width: 0 },
        name: "Edge: 0",
      },
    ],
    group: "width",
  },
  {
    cases: [
      ...SEQ.map((i) => ({
        expected: { height: `${i}px` },
        input: { height: i },
        name: `Happy ${i}`,
      })),
      {
        expected: { height: "0px" },
        input: { height: 0 },
        name: "Edge: 0",
      },
    ],
    group: "height",
  },
  {
    cases: [
      ...OPACITY_SEQ.map((i) => ({
        expected: { opacity: i },
        input: { opacity: i },
        name: `Happy ${i}`,
      })),
      {
        expected: { opacity: 0 },
        input: { opacity: 0 },
        name: "Edge: 0",
      },
    ],
    group: "opacity",
  },
  {
    cases: [
      ...SEQ.map((i) => ({
        expected: { rotate: `${i}deg` },
        input: { rotate: i },
        name: `Happy ${i}`,
      })),
      {
        expected: { rotate: "0deg" },
        input: { rotate: 0 },
        name: "Edge: 0",
      },
    ],
    group: "rotate",
  },
  {
    cases: [
      ...SEQ.map((i) => ({
        expected: { scale: i },
        input: { scale: i },
        name: `Happy ${i}`,
      })),
      {
        expected: { scale: 0 },
        input: { scale: 0 },
        name: "Edge: 0",
      },
    ],
    group: "scale",
  },
  {
    cases: [
      ...SEQ.map((i) => ({
        expected: { transform: `skewX(${i}deg)` },
        input: { skewX: i },
        name: `Happy ${i}`,
      })),
      {
        expected: {},
        input: { skewX: 0 },
        name: "Edge: 0",
      },
    ],
    group: "skewX",
  },
  {
    cases: [
      ...SEQ.map((i) => ({
        expected: { transform: `skewY(${i}deg)` },
        input: { skewY: i },
        name: `Happy ${i}`,
      })),
      {
        expected: {},
        input: { skewY: 0 },
        name: "Edge: 0",
      },
    ],
    group: "skewY",
  },
  {
    cases: [
      ...SEQ.map((i) => ({
        expected: { offset: i },
        input: { offset: i },
        name: `Happy ${i}`,
      })),
      {
        expected: { offset: 0 },
        input: { offset: 0 },
        name: "Edge: 0",
      },
    ],
    group: "offset",
  },
];

CASES.forEach(({ cases, group }) => {
  describe(group, () => {
    cases.forEach(({ expected, input, name }) => {
      test(name, () => {
        const response = KeyframeUtils.produceKeyframe(input);
        expect(response).toEqual(expected);
      });
    });
  });
});
