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
  animator = new Animator(host as unknown as LitElement, "test", {
    informSets: informSet,
  });
});

afterEach(() => {
  animate.mockClear();
  informSet.mockClear();
});

test("single keyframe", async () => {
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
        duration: 1000,
        keyframes: [
          {
            height: 5,
          },
        ],
      },
    ],
  };
  getAnimationRecipeMock.mockReturnValueOnce(RECIPE);
  await animator.update(curr, prev);
  expect(animate).toHaveBeenCalledOnce();
  expect(animate).toHaveBeenCalledWith(
    [
      {
        height: "5px",
      },
    ],
    {
      ...KeyframeUtils.optionsDefaults,
      duration: 1000,
    },
  );
});

test("two keyframes", async () => {
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
          {
            height: 15,
          },
        ],
      },
    ],
  };
  getAnimationRecipeMock.mockReturnValueOnce(RECIPE);
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
      ...KeyframeUtils.optionsDefaults,
      duration: 2000,
    },
  );
});
