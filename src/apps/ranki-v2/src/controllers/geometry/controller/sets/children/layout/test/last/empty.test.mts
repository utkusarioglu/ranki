import type { EmittedComponentState } from "_controllers/geometry/controller/sets/children/registry/children-registry.types.mjs";

import { expect, test } from "vitest";

import type { LayoutGapsParams } from "../../layout-utils.types.mjs";

import { LayoutUtils } from "../../layout-utils.mjs";

test("empty no gaps", () => {
  const gaps: LayoutGapsParams = { cross: {}, main: {} };
  const dims: EmittedComponentState[] = [];
  const response = LayoutUtils.last(gaps)(dims);
  const expected = LayoutUtils.EMPTY_SIZING;
  expect(response).toEqual(expected);
});

test("empty main start gap", () => {
  const gaps: LayoutGapsParams = {
    cross: {},
    main: {
      start: 3,
    },
  };
  const dims: EmittedComponentState[] = [];
  const response = LayoutUtils.last(gaps)(dims);
  const expected = LayoutUtils.EMPTY_SIZING;
  expect(response).toEqual(expected);
});

test("empty main end gap", () => {
  const gaps: LayoutGapsParams = {
    cross: {},
    main: {
      end: 3,
    },
  };
  const dims: EmittedComponentState[] = [];
  const response = LayoutUtils.last(gaps)(dims);
  const expected = LayoutUtils.EMPTY_SIZING;
  expect(response).toEqual(expected);
});

test("empty main mid gap", () => {
  const gaps: LayoutGapsParams = {
    cross: {},
    main: {
      gap: 3,
    },
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
