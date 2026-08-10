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
const target = vi.fn() as unknown as R2C;
const props: GeometryChildrenProps<LitElement> = {
  selector: () => [target],
};

test("single session single elem", async () => {
  const children = new GeometryChildren(host, props);
  const detail: GeometryEvent = {
    type: "lifecycle",
    lifecycle: "update",
    mode: "idle",
    style: {
      height: 11,
      width: 7,
    },
  };
  const expected: ChildrenSizing = {
    sizing: {
      container: {
        ...detail.style,
      },
      set: [
        {
          lifecycle: detail.lifecycle,
          mode: detail.mode!,
          style: {
            ...detail.style,
            left: 0,
            top: 0,
          },
        },
      ],
    },
    type: "update",
  };
  const call = () => children.onEmit(target, detail);
  const response = [call(), call(), call()];
  await TimingUtils.raf(2);
  expect(await response[0]).toEqual(expected);
  expect(await response[1]).toBeNull();
  expect(await response[2]).toBeNull();
});

test("two sessions single elem", async () => {
  const children = new GeometryChildren(host, props);
  const detail1: GeometryEvent = {
    type: "lifecycle",
    lifecycle: "update",
    mode: "idle",
    style: {
      height: 11,
      width: 7,
    },
  };
  const detail2: GeometryEvent = {
    type: "lifecycle",
    lifecycle: "update",
    mode: "idle",
    style: {
      height: 17,
      width: 13,
    },
  };
  const expected1: ChildrenSizing = {
    sizing: {
      container: {
        ...detail1.style,
      },
      set: [
        {
          lifecycle: detail1.lifecycle,
          mode: detail1.mode!,
          style: {
            ...detail1.style,
            left: 0,
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
        ...detail2.style,
      },
      set: [
        {
          lifecycle: detail2.lifecycle,
          mode: detail2.mode!,
          style: {
            ...detail2.style,
            left: 0,
            top: 0,
          },
        },
      ],
    },
    type: "update",
  };
  const call1 = () => children.onEmit(target, detail1);
  const call2 = () => children.onEmit(target, detail2);

  const response1 = [call1(), call1(), call1()];
  await TimingUtils.raf(2);
  const response2 = [call2(), call2(), call2()];

  expect(await response1[0]).toEqual(expected1);
  expect(await response1[1]).toBeNull();
  expect(await response1[2]).toBeNull();
  expect(await response2[0]).toEqual(expected2);
  expect(await response2[1]).toBeNull();
  expect(await response2[2]).toBeNull();
});
