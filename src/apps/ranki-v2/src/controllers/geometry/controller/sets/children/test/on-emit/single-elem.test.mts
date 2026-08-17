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
const target = vi.fn() as unknown as R2C;
const props: GeometryChildrenProps<LitElement> = {
  selector: () => [target],
};

test("single session single elem", async () => {
  const children = new GeometryChildren(host, props);
  const detail: GeometryEvent = {
    lifecycle: "update",
    style: {
      height: 11,
      width: 7,
    },
    type: "lifecycle",
  };
  const expected0: ChildrenSizing = {
    session: UpdateSession.prototype.getValues(),
    sizing: {
      container: {
        ...detail.style,
      },
      set: [
        {
          interaction: {
            drag: "none",
            focus: "none",
            hover: "none",
            press: "none",
          },
          lifecycle: detail.lifecycle,
          mode: "default",
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
  const expectedTerm: ChildrenSizing = {
    session: UpdateSession.prototype.getValues(),
    type: "terminate",
  };
  const call = () => children.onEmit(target, detail);
  const response = [call(), call(), call()];
  await TimingUtils.raf(2);
  expect(await response[0]).toEqual(expected0);
  expect(await response[1]).toEqual(expectedTerm);
  expect(await response[2]).toEqual(expectedTerm);
});

test("two sessions single elem", async () => {
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
      height: 17,
      width: 13,
    },
    type: "lifecycle",
  };
  const expected1: ChildrenSizing = {
    session: UpdateSession.prototype.getValues(),
    sizing: {
      container: {
        ...detail1.style,
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
      ],
    },
    type: "update",
  };
  const expected2: ChildrenSizing = {
    session: UpdateSession.prototype.getValues(),
    sizing: {
      container: {
        ...detail2.style,
      },
      set: [
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
            left: 0,
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
  const call1 = () => children.onEmit(target, detail1);
  const call2 = () => children.onEmit(target, detail2);

  const response1 = [call1(), call1(), call1()];
  await TimingUtils.raf(2);
  const response2 = [call2(), call2(), call2()];

  expect(await response1[0]).toEqual(expected1);
  expect(await response1[1]).toEqual(expectedTerm);
  expect(await response1[2]).toEqual(expectedTerm);
  expect(await response2[0]).toEqual(expected2);
  expect(await response2[1]).toEqual(expectedTerm);
  expect(await response2[2]).toEqual(expectedTerm);
});
