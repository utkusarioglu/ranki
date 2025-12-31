import type {
  ISerializedNode,
  ISerializedLeaf,
  ISerializedParent,
} from "@dqm/package-dqm-api-v2";
import {
  DqmRenderError,
  type DqmRenderErrorConstructorParams,
} from "./dqm-render-error.mjs";

type AssertionParentLeaf = Pick<DqmRenderErrorConstructorParams, "details"> &
  Partial<Pick<DqmRenderErrorConstructorParams, "cause" | "why">>;

type AssertionOther = Pick<DqmRenderErrorConstructorParams, "details" | "why"> &
  Partial<Pick<DqmRenderErrorConstructorParams, "cause">>;

export function assertParent(
  ser: ISerializedNode,
  extra: AssertionParentLeaf,
): asserts ser is ISerializedParent {
  if (ser.kind !== "parent") {
    throw new DqmRenderError({
      code: "PARENT_EXPECTED",
      cause: null,
      ...extra,
      why:
        extra.why ||
        "This render node expects a parent but some other `kind` was given",
      details: {
        ...extra.details,
        ser,
      },
    });
  }
}

export function assertLeaf(
  ser: ISerializedNode,
  extra: AssertionParentLeaf,
): asserts ser is ISerializedLeaf {
  if (ser.kind !== "leaf") {
    throw new DqmRenderError({
      code: "LEAF_EXPECTED",
      ...extra,
      cause: extra.cause || null,
      why:
        extra.why ||
        "This render node expects a leaf but some other `kind` was given",
      details: {
        ...extra.details,
        ser,
      },
    });
  }
}

export function assertExists(
  a: any,
  extra: AssertionOther,
): asserts a is object {
  if (!a) {
    throw new DqmRenderError({
      code: "VALUE_UNDEFINED",
      cause: extra.cause || null,
      ...extra,
    });
  }
}
