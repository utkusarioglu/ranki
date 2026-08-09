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

[
  {
    input: "to.self.height",
    name: "height",
    output: 21,
  },
  {
    input: "to.container.height",
    name: "container height",
    output: 33,
  },
].forEach(({ input, name, output }) => {
  test(name, () => {
    const RECIPE: AnimationBlock = {
      root: [
        {
          duration: 0,
          keyframes: [
            {
              height: input,
            },
          ],
          name: "hi",
        },
      ],
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
        mode: "idle",
        style: {
          height: 21,
          left: 0,
          top: 0,
          width: 0,
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
                height: output,
              },
            ],
            name: "hi",
            options: {
              duration: 0,
            },
          },
        },
      ],

      sets: undefined,
      then: undefined,
    };
    expect(response).toEqual(expected);
  });
});
