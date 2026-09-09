import "_controllers/geometry/o11y/mock/mock.mjs";
import type { R2C } from "_components/r2c/r2c.mjs";
import type { GeometryEvent } from "_controllers/geometry/controller/events/types/geometry-events.types.mjs";
import type { LitElement } from "lit";

import { TimingUtils } from "_controllers/geometry/controller/utils/timing.utils.mjs";
// @vitest-environment jsdom
import { expect, test, vi } from "vitest";

import type { GeometryChildrenProps } from "../../children.types.mjs";

import { GeometryChildren } from "../../children.mjs";
import type { LayoutSizing } from "../../layout/layout-utils.types.mjs";

const host = vi.fn() as unknown as LitElement;
const target = vi.fn() as unknown as R2C;
const props: GeometryChildrenProps<LitElement> = {};

test.only("single session single elem", async () => {
  const children = new GeometryChildren(host, props);
  const detail: GeometryEvent = {
    lifecycle: "update",
    style: {
      height: 11,
      width: 7,
    },
    type: "lifecycle",
  };
  const expected0: LayoutSizing = {
    container: {
      width: 0,
      height: 0,
      // ...detail.style,
    },
    set: [
      // {
      //   interaction: {
      //     drag: "none",
      //     focus: "none",
      //     hover: "none",
      //     press: "none",
      //   },
      //   lifecycle: detail.lifecycle,
      //   mode: "default",
      //   style: {
      //     ...detail.style,
      //     left: 0,
      //     top: 0,
      //   },
      // },
    ],
  };
  // const expectedTerm: LayoutSizing = {
  // session,
  // type: "terminate",
  // };
  const call = () => children.onEmit({ target, detail });
  const response = [call(), call(), call()];
  await TimingUtils.raf(10);
  expect(response[0]).toEqual(expected0);
  expect(response[1]).toEqual(expected0);
  expect(response[2]).toEqual(expected0);
  // expect(response[1]).toEqual(expectedTerm);
  // expect(response[2]).toEqual(expectedTerm);
});
