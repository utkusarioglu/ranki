import type { CurrentAppliedStyle } from "_controllers/geometry/controller/types/geometry-controller.types.mjs";
import type { LitElement } from "lit";

import { afterEach, beforeEach, expect, test, vi } from "vitest";

import type { AnimationBlock } from "../../types/animator.types.mjs";

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
const getRecipe = vi.fn();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let animator: Animator<any>;

beforeEach(() => {
  const host = new Host();
  animator = new Animator(host as unknown as LitElement, "test", {
    getCollection: getRecipe,
    informSet: informSet,
  });
});

afterEach(() => {
  animate.mockClear();
  informSet.mockClear();
});

test("single keyframe", async () => {
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
      interaction: {
        drag: "none",
        focus: "none",
        hover: "none",
        press: "none",
      },
      lifecycle: "enter",
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
        duration: 1000,
        keyframes: [
          {
            height: 5,
          },
        ],
        name: "hi",
      },
    ],
  };
  getRecipeFromCollection.mockReturnValueOnce(RECIPE);
  await animator.update(curr, prev);
  expect(animate).toHaveBeenCalledOnce();
  expect(animate).toHaveBeenCalledWith(
    [
      {
        height: "5px",
      },
    ],
    {
      ...KeyframeUtils.OPTIONS_DEFAULTS,
      duration: 1000,
    },
  );
});

test("two keyframes", async () => {
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
      interaction: {
        drag: "none",
        focus: "none",
        hover: "none",
        press: "none",
      },
      lifecycle: "enter",
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
          {
            height: 15,
          },
        ],
        name: "hi",
      },
    ],
  };
  getRecipeFromCollection.mockReturnValueOnce(RECIPE);
  await animator.update(curr, prev);
  expect(animate).toHaveBeenCalledOnce();
  expect(animate).toHaveBeenCalledWith(
    [
      {
        height: "5px",
      },
      {
        height: "15px",
      },
    ],
    {
      ...KeyframeUtils.OPTIONS_DEFAULTS,
      duration: 2000,
    },
  );
});
