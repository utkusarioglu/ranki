import { expect, test } from "vitest";
import type { CurrentAppliedStyle } from "_controllers/geometry/controller/types/geometry-controller.types.mjs";
import type { AnimationBlock, LayoutParsed } from "../../../animator.types.mjs";
import { vi } from "vitest";

// ANKI
const { getAnimationRecipeMock } = vi.hoisted(() => ({
  getAnimationRecipeMock: vi.fn(),
}));

// ANKI
vi.mock("_store/app.getters.mjs", () => ({
  getAnimationRecipe: getAnimationRecipeMock,
}));
import { AnimationComposer } from "../../animation-composer.mjs";

test("expose single", () => {
  const RECIPE: AnimationBlock = {
    root: [
      {
        name: "hi",
        duration: 0,
        keyframes: [
          {
            height: "to.container.height",
            width: "to.self.width",
          },
        ],
      },
    ],
    sets: {
      a: {
        expose: {
          width: "to.self.width",
        },
        override: {},
      },
    },
  };
  getAnimationRecipeMock.mockReturnValue(RECIPE);
  const curr: CurrentAppliedStyle = {
    actions: [],
    container: {
      style: {
        width: 11,
        height: 33,
      },
    },
    context: {
      index: 0,
      length: 1,
      stagger: 0,
    },
    self: {
      intent: "enter",
      style: {
        height: 21,
        width: 17,
      },
    },
  };
  const prev = null;
  const response = AnimationComposer.compose({
    preset: "debug",
    role: "hud",
    action: "enter",
    curr,
    prev,
  });
  const expected: LayoutParsed = {
    root: [
      {
        apply: {
          name: "hi",
          options: {
            duration: 0,
          },
          keyframes: [
            {
              height: 33,
              width: 17,
            },
          ],
        },
      },
    ],
    sets: {
      a: {
        props: {
          setName: "a",
          containerExposed: {
            style: {
              width: 17,
            },
          },
          selfOverrides: {
            style: {},
          },
        },
      },
    },
    then: undefined,
  };
  expect(response).toEqual(expected);
});
