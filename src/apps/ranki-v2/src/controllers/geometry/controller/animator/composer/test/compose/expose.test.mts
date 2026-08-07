import type { CurrentAppliedStyle } from "_controllers/geometry/controller/types/geometry-controller.types.mjs";

import { expect, test } from "vitest";
import { vi } from "vitest";

import type { AnimationBlock, LayoutParsed } from "../../../animator.types.mjs";

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
        duration: 0,
        keyframes: [
          {
            height: "to.container.height",
            width: "to.self.width",
          },
        ],
        name: "hi",
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
        height: 33,
        width: 11,
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
        left: 0,
        top: 0,
        width: 17,
      },
    },
  };
  const prev = null;
  const response = AnimationComposer.compose({
    action: "enter",
    curr,
    preset: "debug",
    prev,
    role: "hud",
  });
  const expected: LayoutParsed = {
    root: [
      {
        apply: {
          keyframes: [
            {
              height: 33,
              width: 17,
            },
          ],
          name: "hi",
          options: {
            duration: 0,
          },
        },
      },
    ],
    sets: {
      a: {
        props: {
          containerExposed: {
            style: {
              width: 17,
            },
          },
          selfOverrides: {
            style: {},
          },
          setName: "a",
        },
      },
    },
    then: undefined,
  };
  expect(response).toEqual(expected);
});
