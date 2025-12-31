import type {
  TrnBuilt,
  TrnBuiltLeaf,
  TrnBuiltParent,
} from "@dqm/package-dqm-api-v2";
import { DqmRenderError } from "./dqm-render-error.mjs";

export function assertParent(t: TrnBuilt): asserts t is TrnBuiltParent {
  if (t.kind !== "parent") {
    throw new DqmRenderError({
      code: "PARENT_EXPECTED",
      why: "This render node expects a parent but some other `kind` was given",
      cause: null,
      trn: t,
    });
  }
}

export function assertLeaf(t: TrnBuilt): asserts t is TrnBuiltLeaf {
  if (t.kind !== "leaf") {
    throw new DqmRenderError({
      code: "LEAF_EXPECTED",
      why: "This render node expects a leaf but some other `kind` was given",
      cause: null,
      trn: t,
    });
  }
}
