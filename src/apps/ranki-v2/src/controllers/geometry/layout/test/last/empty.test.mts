import { expect, test } from "vitest";
import { LayoutUtils } from "../../layout-utils.mjs";
import type { LayoutGapsParams } from "../../layout-utils.types.mjs";
import type { EmittedComponentState } from "_controllers/geometry/controller/sets/children/registry/children-registr.types.mjs";

test("empty gapless", () => {
  const gaps: LayoutGapsParams = { main: {}, cross: {} };
  const dims: EmittedComponentState[] = [];
  const response = LayoutUtils.last(gaps)(dims);
  const expected = LayoutUtils.EMPTY_SIZING;
  expect(response).toEqual(expected);
});

test("empty main start gap", () => {
  const gaps: LayoutGapsParams = {
    main: {
      start: 3,
    },
    cross: {},
  };
  const dims: EmittedComponentState[] = [];
  const response = LayoutUtils.last(gaps)(dims);
  const expected = LayoutUtils.EMPTY_SIZING;
  expect(response).toEqual(expected);
});

test("empty main end gap", () => {
  const gaps: LayoutGapsParams = {
    main: {
      end: 3,
    },
    cross: {},
  };
  const dims: EmittedComponentState[] = [];
  const response = LayoutUtils.last(gaps)(dims);
  const expected = LayoutUtils.EMPTY_SIZING;
  expect(response).toEqual(expected);
});

test("empty main mid gap", () => {
  const gaps: LayoutGapsParams = {
    main: {
      gap: 3,
    },
    cross: {},
  };
  const dims: EmittedComponentState[] = [];
  const response = LayoutUtils.last(gaps)(dims);
  const expected = LayoutUtils.EMPTY_SIZING;
  expect(response).toEqual(expected);
});

test("empty cross start gap", () => {
  const gaps: LayoutGapsParams = {
    cross: {
      start: 3,
    },
    main: {},
  };
  const dims: EmittedComponentState[] = [];
  const response = LayoutUtils.last(gaps)(dims);
  const expected = LayoutUtils.EMPTY_SIZING;
  expect(response).toEqual(expected);
});

test("empty cross end gap", () => {
  const gaps: LayoutGapsParams = {
    cross: {
      end: 3,
    },
    main: {},
  };
  const dims: EmittedComponentState[] = [];
  const response = LayoutUtils.last(gaps)(dims);
  const expected = LayoutUtils.EMPTY_SIZING;
  expect(response).toEqual(expected);
});
