// @vitest-environment jsdom
import { expect, test, vi } from "vitest";
import { GeometryChildren } from "../../children.mjs";
import type { LitElement } from "lit";
import type { R2C } from "_components/r2c/r2c.mjs";
import type { R2CNewChildSizeEvent } from "_controllers/geometry/controller/events/geometry-events.types.mjs";
import { TimingUtils } from "_utils/timing.utils.mjs";
import type {
  ChildrenSizing,
  GeometryChildrenProps,
} from "../../children.types.mjs";
import { LayoutUtils } from "_controllers/geometry/layout/layout-utils.mjs";

const host = vi.fn() as unknown as LitElement;

test("single session two elems", async () => {
  const target1 = vi.fn() as unknown as R2C;
  const target2 = vi.fn() as unknown as R2C;
  const props: GeometryChildrenProps<LitElement> = {
    layout: () => LayoutUtils.row({}),
    selector: () => [target1, target2],
  };
  const children = new GeometryChildren(host, props);
  const detail1: R2CNewChildSizeEvent = {
    intent: "update",
    style: {
      width: 7,
      height: 11,
    },
  };
  const detail2: R2CNewChildSizeEvent = {
    intent: "update",
    style: {
      width: 13,
      height: 11,
    },
  };
  const expected: ChildrenSizing = {
    type: "update",
    sizing: {
      container: {
        width: detail1.style.width + detail2.style.width,
        height: 11,
      },
      set: [
        {
          intent: detail1.intent,
          style: {
            ...detail1.style,
            top: 0,
            left: 0,
          },
        },
        {
          intent: detail2.intent,
          style: {
            ...detail2.style,
            top: 0,
            left: detail1.style.width,
          },
        },
      ],
    },
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
    layout: () => LayoutUtils.row({}),
    selector: () => [target1, target2],
  };
  const children = new GeometryChildren(host, props);
  const detail1_1: R2CNewChildSizeEvent = {
    intent: "update",
    style: {
      width: 7,
      height: 11,
    },
  };
  const detail1_2: R2CNewChildSizeEvent = {
    intent: "update",
    style: {
      width: 19,
      height: 11,
    },
  };
  const detail2_1: R2CNewChildSizeEvent = {
    intent: "update",
    style: {
      width: 13,
      height: 11,
    },
  };
  const detail2_2: R2CNewChildSizeEvent = {
    intent: "update",
    style: {
      width: 23,
      height: 11,
    },
  };
  const expected1: ChildrenSizing = {
    type: "update",
    sizing: {
      container: {
        width: detail1_1.style.width + detail1_2.style.width,
        height: 11,
      },
      set: [
        {
          intent: detail1_1.intent,
          style: {
            ...detail1_1.style,
            top: 0,
            left: 0,
          },
        },
        {
          intent: detail1_2.intent,
          style: {
            ...detail1_2.style,
            top: 0,
            left: detail1_1.style.width,
          },
        },
      ],
    },
  };
  const expected2: ChildrenSizing = {
    type: "update",
    sizing: {
      container: {
        width: detail2_1.style.width + detail2_2.style.width,
        height: 11,
      },
      set: [
        {
          intent: detail2_1.intent,
          style: {
            ...detail2_1.style,
            top: 0,
            left: 0,
          },
        },
        {
          intent: detail2_2.intent,
          style: {
            ...detail2_2.style,
            top: 0,
            left: detail2_1.style.width,
          },
        },
      ],
    },
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
