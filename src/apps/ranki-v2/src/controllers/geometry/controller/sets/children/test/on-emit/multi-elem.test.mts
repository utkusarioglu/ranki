import type { R2C } from "_components/r2c/r2c.mjs";
import type { GeometryEvent } from "_controllers/geometry/controller/events/geometry-events.types.mjs";
import type { LitElement } from "lit";

import { TimingUtils } from "_utils/timing.utils.mjs";
// @vitest-environment jsdom
import { expect, test, vi } from "vitest";

import type {
  ChildrenSizing,
  GeometryChildrenProps,
} from "../../children.types.mjs";

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
    type: "lifecycle",
    lifecycle: "update",
    interaction: "idle",
    style: {
      height: 11,
      width: 7,
    },
  };
  const detail2: GeometryEvent = {
    type: "lifecycle",
    lifecycle: "update",
    interaction: "idle",
    style: {
      height: 11,
      width: 13,
    },
  };
  const expected: ChildrenSizing = {
    sizing: {
      container: {
        height: 11,
        width: detail1.style.width + detail2.style.width,
      },
      set: [
        {
          lifecycle: detail1.lifecycle,
          interaction: detail1.interaction!,
          style: {
            ...detail1.style,
            left: 0,
            top: 0,
          },
        },
        {
          lifecycle: detail2.lifecycle,
          interaction: detail2.interaction!,
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
  const call1 = () => children.onEmit(target1, detail1);
  const call2 = () => children.onEmit(target2, detail2);
  const response = [call1(), call1(), call2(), call1(), call2()];
  await TimingUtils.raf(2);
  expect(await response[0]).toEqual(expected);
  expect(await response[1]).toBeNull();
  expect(await response[2]).toBeNull();
});

test("two sessions two elems", async () => {
  const target1 = vi.fn() as unknown as R2C;
  const target2 = vi.fn() as unknown as R2C;
  const props: GeometryChildrenProps<LitElement> = {
    selector: () => [target1, target2],
  };
  const children = new GeometryChildren(host, props);
  const detail1_1: GeometryEvent = {
    type: "lifecycle",
    lifecycle: "update",
    interaction: "idle",
    style: {
      height: 11,
      width: 7,
    },
  };
  const detail1_2: GeometryEvent = {
    type: "lifecycle",
    lifecycle: "update",
    interaction: "idle",
    style: {
      height: 11,
      width: 19,
    },
  };
  const detail2_1: GeometryEvent = {
    type: "lifecycle",
    lifecycle: "update",
    interaction: "idle",
    style: {
      height: 11,
      width: 13,
    },
  };
  const detail2_2: GeometryEvent = {
    type: "lifecycle",
    lifecycle: "update",
    interaction: "idle",
    style: {
      height: 11,
      width: 23,
    },
  };
  const expected1: ChildrenSizing = {
    sizing: {
      container: {
        height: 11,
        width: detail1_1.style.width + detail1_2.style.width,
      },
      set: [
        {
          lifecycle: detail1_1.lifecycle,
          interaction: detail1_1.interaction!,
          style: {
            ...detail1_1.style,
            left: 0,
            top: 0,
          },
        },
        {
          lifecycle: detail1_2.lifecycle,
          interaction: detail1_2.interaction!,
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
    sizing: {
      container: {
        height: 11,
        width: detail2_1.style.width + detail2_2.style.width,
      },
      set: [
        {
          lifecycle: detail2_1.lifecycle,
          interaction: detail2_1.interaction!,
          style: {
            ...detail2_1.style,
            left: 0,
            top: 0,
          },
        },
        {
          lifecycle: detail2_2.lifecycle,
          interaction: detail2_2.interaction!,
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
  const call1_1 = () => children.onEmit(target1, detail1_1);
  const call1_2 = () => children.onEmit(target2, detail1_2);
  const call2_1 = () => children.onEmit(target1, detail2_1);
  const call2_2 = () => children.onEmit(target2, detail2_2);
  const response1 = [call1_1(), call1_1(), call1_2(), call1_1(), call1_2()];
  await TimingUtils.raf(2);
  const response2 = [call2_1(), call2_1(), call2_2(), call2_1(), call2_2()];
  expect(await response1[0]).toEqual(expected1);
  expect(await response1[1]).toBeNull();
  expect(await response1[2]).toBeNull();
  expect(await response2[0]).toEqual(expected2);
  expect(await response2[1]).toBeNull();
  expect(await response2[2]).toBeNull();
});
