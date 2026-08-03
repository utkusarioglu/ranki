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

[
  {
    name: "height",
    input: "to.self.height",
    output: 21,
  },
  {
    name: "container height",
    input: "to.container.height",
    output: 33,
  },
].forEach(({ name, input, output }) => {
  test(name, () => {
    const RECIPE: AnimationBlock = {
      root: [
        {
          name: "hi",
          duration: 0,
          keyframes: [
            {
              height: input,
            },
          ],
        },
      ],
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
                height: output,
              },
            ],
          },
        },
      ],

      sets: undefined,
      then: undefined,
    };
    expect(response).toEqual(expected);
  });
});
