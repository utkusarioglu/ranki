import { expect, test } from "vitest";
import type { CurrentAppliedStyle } from "_controllers/geometry/controller/types/geometry-controller.types.mjs";
import type { AnimationBlock, LayoutParsed } from "../../../animator.types.mts";
import { vi } from "vitest";

// ANKI
const { getAnimationRecipeMock } = vi.hoisted(() => ({
  getAnimationRecipeMock: vi.fn(),
}));

// ANKI
vi.mock("_store/app.getters.mjs", () => ({
  getAnimationRecipe: getAnimationRecipeMock,
}));
import { AnimationComposer } from "../../animation-composer.mts";

test("override single", () => {
  const RECIPE: AnimationBlock = {
    root: [
      {
        name: "hi",
        duration: 0,
        keyframes: [
          {
            height: "to.container.height",
            // width: "to.self.width",
          },
        ],
      },
    ],
    sets: {
      a: {
        expose: {
          // width: "to.self.width",
        },
        override: {
          width: "to.self.width + 13",
        },
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
        width: 77,
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
              // width: 77,
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
              // width: 77,
            },
          },
          selfOverrides: {
            style: {
              width: 90,
            },
          },
        },
      },
    },
    then: undefined,
  };
  expect(response).toEqual(expected);
});
