import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { Animator } from "../../animator.mjs";
import type { LitElement } from "lit";
import type { CurrentAppliedStyle } from "_controllers/geometry/controller/types/geometry-controller.types.mjs";
import type { AnimationBlock } from "../../animator.types.mjs";
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
  animator = new Animator(host as unknown as LitElement, "test", { informSet });
});

afterEach(() => {
  animate.mockClear();
  informSet.mockClear();
});

test("depth 2", async () => {
  const curr: CurrentAppliedStyle = {
    actions: ["enter"],
    self: {
      intent: "enter",
      style: {},
    },
    container: {
      style: {},
    },
    context: {
      index: 0,
      length: 1,
      stagger: 0,
    },
  };
  const prev = null;

  const RECIPE: AnimationBlock = {
    root: [
      {
        name: "hi",
        duration: 2000,
        keyframes: [
          {
            height: 5,
          },
        ],
      },
    ],
    then: {
      root: [
        {
          name: "two",
          duration: 3000,
          keyframes: [
            {
              height: 17,
            },
          ],
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
    self: {
      intent: "enter",
      style: {},
    },
    container: {
      style: {},
    },
    context: {
      index: 0,
      length: 1,
      stagger: 0,
    },
  };
  const prev = null;

  const RECIPE: AnimationBlock = {
    root: [
      {
        name: "hi",
        duration: 2000,
        keyframes: [
          {
            height: 5,
          },
        ],
        then: {
          root: [
            {
              name: "two",
              duration: 5000,
              keyframes: [
                {
                  height: 44,
                },
              ],
            },
          ],
        },
      },
    ],
    then: {
      root: [
        {
          name: "three",
          duration: 3000,
          keyframes: [
            {
              height: 17,
            },
          ],
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
