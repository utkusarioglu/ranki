import type { R2C } from "_components/r2c/r2c.mjs";
import type { GeometryEvent } from "_controllers/geometry/controller/events/types/geometry-events.types.mjs";
import type { LitElement } from "lit";

import { TimingUtils } from "_controllers/geometry/controller/utils/timing.utils.mjs";
// @vitest-environment jsdom
import { expect, test, vi } from "vitest";

import type {
  ChildrenSizing,
  GeometryChildrenProps,
} from "../../children.types.mjs";

import { UpdateSession } from "../../session.mjs";

vi.spyOn(UpdateSession.prototype, "getValues").mockReturnValue({
  id: 2,
  index: 3,
  start: 7,
});
import { GeometryChildren } from "../../children.mjs";

const host = vi.fn() as unknown as LitElement;

test("single session two elems", async () => {
  const target1 = vi.fn() as unknown as R2C;
  const target2 = vi.fn() as unknown as R2C;
  const props: GeometryChildrenProps<LitElement> = {
    selector: () => [target1, target2],
  };
  const children = new GeometryChildren(host, props);
  const detail1: GeometryEvent = {
    lifecycle: "update",
    style: {
      height: 11,
      width: 7,
    },
    type: "lifecycle",
  };
  const detail2: GeometryEvent = {
    lifecycle: "update",
    style: {
      height: 11,
      width: 13,
    },
    type: "lifecycle",
  };
  const expected0: ChildrenSizing = {
    session: UpdateSession.prototype.getValues(),
    sizing: {
      container: {
        height: 11,
        width: detail1.style.width + detail2.style.width,
      },
      set: [
        {
          interaction: {
            drag: "none",
            focus: "none",
            hover: "none",
            press: "none",
          },
          lifecycle: detail1.lifecycle,
          mode: "default",
          style: {
            ...detail1.style,
            left: 0,
            top: 0,
          },
        },
        {
          interaction: {
            drag: "none",
            focus: "none",
            hover: "none",
            press: "none",
          },
          lifecycle: detail2.lifecycle,
          mode: "default",
          style: {
            ...detail2.style,
            left: detail1.style.width,
            top: 0,
          },
        },
      ],
    },
    type: "update",
  };

  const expected1: ChildrenSizing = {
    session: UpdateSession.prototype.getValues(),
    type: "terminate",
  };
  const call1 = () => children.onEmit(target1, detail1);
  const call2 = () => children.onEmit(target2, detail2);
  const response = [call1(), call1(), call2(), call1(), call2()];
  await TimingUtils.raf(2);
  expect(await response[0]).toEqual(expected0);
  expect(await response[1]).toEqual(expected1);
  expect(await response[2]).toEqual(expected1);
});

test("two sessions two elems", async () => {
  const target1 = vi.fn() as unknown as R2C;
  const target2 = vi.fn() as unknown as R2C;
  const props: GeometryChildrenProps<LitElement> = {
    selector: () => [target1, target2],
  };
  const children = new GeometryChildren(host, props);
  const detail1_1: GeometryEvent = {
    lifecycle: "update",
    style: {
      height: 11,
      width: 7,
    },
    type: "lifecycle",
  };
  const detail1_2: GeometryEvent = {
    lifecycle: "update",
    style: {
      height: 11,
      width: 19,
    },
    type: "lifecycle",
  };
  const detail2_1: GeometryEvent = {
    lifecycle: "update",
    style: {
      height: 11,
      width: 13,
    },
    type: "lifecycle",
  };
  const detail2_2: GeometryEvent = {
    lifecycle: "update",
    style: {
      height: 11,
      width: 23,
    },
    type: "lifecycle",
  };
  const expected1: ChildrenSizing = {
    session: UpdateSession.prototype.getValues(),
    sizing: {
      container: {
        height: 11,
        width: detail1_1.style.width + detail1_2.style.width,
      },
      set: [
        {
          interaction: {
            drag: "none",
            focus: "none",
            hover: "none",
            press: "none",
          },
          lifecycle: detail1_1.lifecycle,
          mode: "default",
          style: {
            ...detail1_1.style,
            left: 0,
            top: 0,
          },
        },
        {
          interaction: {
            drag: "none",
            focus: "none",
            hover: "none",
            press: "none",
          },
          lifecycle: detail1_2.lifecycle,
          mode: "default",
          style: {
            ...detail1_2.style,
            left: detail1_1.style.width,
            top: 0,
          },
        },
      ],
    },
    type: "update",
  };
  const expected2: ChildrenSizing = {
    session: UpdateSession.prototype.getValues(),
    sizing: {
      container: {
        height: 11,
        width: detail2_1.style.width + detail2_2.style.width,
      },
      set: [
        {
          interaction: {
            drag: "none",
            focus: "none",
            hover: "none",
            press: "none",
          },
          lifecycle: detail2_1.lifecycle,
          mode: "default",
          style: {
            ...detail2_1.style,
            left: 0,
            top: 0,
          },
        },
        {
          interaction: {
            drag: "none",
            focus: "none",
            hover: "none",
            press: "none",
          },
          lifecycle: detail2_2.lifecycle,
          mode: "default",
          style: {
            ...detail2_2.style,
            left: detail2_1.style.width,
            top: 0,
          },
        },
      ],
    },
    type: "update",
  };
  const expectedTerm: ChildrenSizing = {
    session: UpdateSession.prototype.getValues(),
    type: "terminate",
  };
  const call1_1 = () => children.onEmit(target1, detail1_1);
  const call1_2 = () => children.onEmit(target2, detail1_2);
  const call2_1 = () => children.onEmit(target1, detail2_1);
  const call2_2 = () => children.onEmit(target2, detail2_2);
  const response1 = [call1_1(), call1_1(), call1_2(), call1_1(), call1_2()];
  await TimingUtils.raf(2);
  const response2 = [call2_1(), call2_1(), call2_2(), call2_1(), call2_2()];
  expect(await response1[0]).toEqual(expected1);
  expect(await response1[1]).toEqual(expectedTerm);
  expect(await response1[2]).toEqual(expectedTerm);
  expect(await response2[0]).toEqual(expected2);
  expect(await response2[1]).toEqual(expectedTerm);
  expect(await response2[2]).toEqual(expectedTerm);
});
