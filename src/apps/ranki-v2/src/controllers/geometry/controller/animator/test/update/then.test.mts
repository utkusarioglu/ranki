import type { CurrentAppliedStyle } from "_controllers/geometry/controller/types/geometry-controller.types.mjs";
import type { LitElement } from "lit";

import { afterEach, beforeEach, expect, test, vi } from "vitest";

import type { AnimationBlock } from "../../animator.types.mjs";

import { Animator } from "../../animator.mjs";
import { KeyframeUtils } from "../../keyframe/keyframe-utils.mjs";

// ANKI
const { animate, getRecipeFromCollection } = vi.hoisted(() => ({
  animate: vi.fn().mockReturnValue({ finished: Promise.resolve() }),
  getRecipeFromCollection: vi.fn(),
}));

// ANKI
vi.mock("../../recipe/recipe-utils.mts", () => ({
  RecipeUtils: class {
    static getRecipeFromCollection = getRecipeFromCollection;
  },
}));

const Host = vi.fn(
  class {
    animate = animate;
  },
);

const informSet = vi.fn().mockReturnValue(Promise.resolve());
const getCollection = vi.fn();

// eslint-disable-next-line no-explicit-any
let animator: Animator<any>;

beforeEach(() => {
  const host = new Host();
  animator = new Animator(host as unknown as LitElement, "test", {
    informSet,
    getCollection,
  });
});

afterEach(() => {
  animate.mockClear();
  informSet.mockClear();
});

test("depth 2", async () => {
  const curr: CurrentAppliedStyle = {
    actions: ["enter"],
    container: {
      style: {},
    },
    context: {
      index: 0,
      length: 1,
      stagger: 0,
    },
    self: {
      lifecycle: "enter",
      mode: "idle",
      style: {
        height: 0,
        left: 0,
        top: 0,
        width: 0,
      },
    },
  };
  const prev = null;

  const RECIPE: AnimationBlock = {
    root: [
      {
        duration: 2000,
        keyframes: [
          {
            height: 5,
          },
        ],
        name: "hi",
      },
    ],
    then: {
      root: [
        {
          duration: 3000,
          keyframes: [
            {
              height: 17,
            },
          ],
          name: "two",
        },
      ],
    },
  };
  getRecipeFromCollection.mockReturnValueOnce(RECIPE);
  await animator.update(curr, prev);
  expect(animate).toHaveBeenCalledTimes(2);
  expect(animate).toHaveBeenNthCalledWith(
    1,
    [
      {
        height: "5px",
      },
    ],
    {
      ...KeyframeUtils.OPTIONS_DEFAULTS,
      duration: 2000,
    },
  );
  expect(animate).toHaveBeenNthCalledWith(
    2,
    [
      {
        height: "17px",
      },
    ],
    {
      ...KeyframeUtils.OPTIONS_DEFAULTS,
      duration: 3000,
    },
  );
});

test("depth 2 call 3", async () => {
  const curr: CurrentAppliedStyle = {
    actions: ["enter"],
    container: {
      style: {},
    },
    context: {
      index: 0,
      length: 1,
      stagger: 0,
    },
    self: {
      lifecycle: "enter",
      mode: "idle",
      style: {
        height: 0,
        left: 0,
        top: 0,
        width: 0,
      },
    },
  };
  const prev = null;

  const RECIPE: AnimationBlock = {
    root: [
      {
        duration: 2000,
        keyframes: [
          {
            height: 5,
          },
        ],
        name: "hi",
        then: {
          root: [
            {
              duration: 5000,
              keyframes: [
                {
                  height: 44,
                },
              ],
              name: "two",
            },
          ],
        },
      },
    ],
    then: {
      root: [
        {
          duration: 3000,
          keyframes: [
            {
              height: 17,
            },
          ],
          name: "three",
        },
      ],
    },
  };
  getRecipeFromCollection.mockReturnValueOnce(RECIPE);
  await animator.update(curr, prev);
  expect(animate).toHaveBeenCalledTimes(3);
  expect(animate).toHaveBeenNthCalledWith(
    1,
    [
      {
        height: "5px",
      },
    ],
    {
      ...KeyframeUtils.OPTIONS_DEFAULTS,
      duration: 2000,
    },
  );
  expect(animate).toHaveBeenNthCalledWith(
    2,
    [
      {
        height: "44px",
      },
    ],
    {
      ...KeyframeUtils.OPTIONS_DEFAULTS,
      duration: 5000,
    },
  );
  expect(animate).toHaveBeenNthCalledWith(
    3,
    [
      {
        height: "17px",
      },
    ],
    {
      ...KeyframeUtils.OPTIONS_DEFAULTS,
      duration: 3000,
    },
  );
});
