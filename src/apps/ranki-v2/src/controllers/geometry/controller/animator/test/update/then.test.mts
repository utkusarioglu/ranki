import type { CurrentAppliedStyle } from "_controllers/geometry/controller/types/geometry-controller.types.mjs";
import type { LitElement } from "lit";

import { afterEach, beforeEach, expect, test, vi } from "vitest";

import type { AnimationBlock } from "../../animator.types.mjs";

import { Animator } from "../../animator.mjs";
import { KeyframeUtils } from "../../keyframe/keyframe-utils.mjs";

// ANKI
const { getAnimationRecipeMock } = vi.hoisted(() => ({
  getAnimationRecipeMock: vi.fn(),
}));

// ANKI
vi.mock("_store/app.getters.mjs", () => ({
  getAnimationRecipe: getAnimationRecipeMock,
}));

const { animate } = vi.hoisted(() => ({
  animate: vi.fn().mockReturnValue(Promise.resolve()),
}));

const Host = vi.fn(
  class {
    animate = animate;
  },
);

const informSet = vi.fn().mockReturnValue(Promise.resolve());

let animator: Animator;

beforeEach(() => {
  const host = new Host();
  animator = new Animator(host as unknown as LitElement, "test", {
    informSets: informSet,
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
      intent: "enter",
      style: {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
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
  getAnimationRecipeMock.mockReturnValueOnce(RECIPE);
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
      ...KeyframeUtils.optionsDefaults,
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
      ...KeyframeUtils.optionsDefaults,
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
      intent: "enter",
      style: {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
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
  getAnimationRecipeMock.mockReturnValueOnce(RECIPE);
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
      ...KeyframeUtils.optionsDefaults,
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
      ...KeyframeUtils.optionsDefaults,
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
      ...KeyframeUtils.optionsDefaults,
      duration: 3000,
    },
  );
});
