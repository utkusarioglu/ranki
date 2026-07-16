import { describe, expect, test } from "vitest";
import { Style } from "./style.mts";

interface CaseGroup<T> {
  groupName: string;
  cases: {
    caseName: string;
    arg: Record<string, number>;
    expected: T;
  }[];
}
type SingleGroup = Record<string, string | number>;

type CompositeGroup = { prop: string; includes: string };

const SINGLE_CASES: CaseGroup<SingleGroup>[] = [
  {
    groupName: "px",
    cases: [
      ...Array.from({ length: 10 }, (_, i) => i * 100).map((left) => ({
        caseName: `Happy case: (left, ${left})`,
        arg: { left: left },
        expected: { transform: `translateX(${left}px)` },
      })),

      ...Array.from({ length: 10 }, (_, i) => i * 100).map((top) => ({
        caseName: `Happy case: (top, ${top})`,
        arg: { top },
        expected: { transform: `translateY(${top}px)` },
      })),

      ...Array.from({ length: 10 }, (_, i) => i * 100).map((width) => ({
        caseName: `Happy case: (width, ${width})`,
        arg: { width },
        expected: { width: `${width}px` },
      })),

      ...Array.from({ length: 10 }, (_, i) => i * 100).map((height) => ({
        caseName: `Happy case: (height, ${height})`,
        arg: { height },
        expected: { height: `${height}px` },
      })),
    ],
  },
  {
    groupName: "deg",
    cases: [
      ...Array.from({ length: 10 }, (_, i) => i * 100).map((rotate) => ({
        caseName: `Happy case: (rotate, ${rotate})`,
        arg: { rotate },
        expected: { rotate: `${rotate}deg` },
      })),

      ...Array.from({ length: 10 }, (_, i) => i * 100).map((skewX) => ({
        caseName: `Happy case: (skewX, ${skewX})`,
        arg: { skewX },
        expected: { transform: `skewX(${skewX}deg)` },
      })),

      ...Array.from({ length: 10 }, (_, i) => i * 100).map((skewY) => ({
        caseName: `Happy case: (skewY, ${skewY})`,
        arg: { skewY },
        expected: { transform: `skewY(${skewY}deg)` },
      })),
    ],
  },

  {
    groupName: "string",
    cases: [
      ...Array.from({ length: 10 }, (_, i) => i * 100).map((scale) => ({
        caseName: `Happy case: (scale, ${scale})`,
        arg: { scale },
        expected: { scale: scale.toString() },
      })),

      ...Array.from({ length: 10 }, (_, i) => i * 100).map((opacity) => ({
        caseName: `Happy case: (opacity, ${opacity})`,
        arg: { opacity },
        expected: { opacity: opacity.toString() },
      })),
    ],
  },

  {
    groupName: "number",
    cases: [
      ...Array.from({ length: 10 }, (_, i) => i * 100).map((offset) => ({
        caseName: `Happy case: (offset, ${offset})`,
        arg: { offset },
        expected: { offset },
      })),
    ],
  },
];

SINGLE_CASES.forEach(({ groupName, cases }) => {
  describe(groupName, () => {
    cases.forEach(({ caseName, arg, expected }) => {
      test(caseName, () => {
        const response = Style.produceKeyframe(arg);
        expect(response).toEqual(expected);
      });
    });
  });
});

const COMPOSITE_CASES: CaseGroup<CompositeGroup>[] = [
  {
    groupName: "Composite: transform",
    cases: [
      {
        caseName: "left",
        arg: { left: 2, top: 3 },
        expected: { prop: "transform", includes: `transformX(2px)` },
      },
    ],
  },
];

COMPOSITE_CASES.forEach(({ groupName, cases }) => {
  describe(groupName, () => {
    cases.forEach(({ caseName, arg, expected }) => {
      test(caseName, () => {
        const response = Style.produceKeyframe(arg);
        expect(Object.keys(response)[0]).toContain(expected.prop);
      });
    });
  });
});
