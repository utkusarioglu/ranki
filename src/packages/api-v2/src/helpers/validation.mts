import type {
  RankiPluginParserValidationFunc,
  ValidationNode,
  ValidationNodeLeaf,
  ValidationNodeParent,
} from "../stages/validation.type.mjs";

export const validationPlaceholder: RankiPluginParserValidationFunc = (n) => ({
  warnings: [["Placeholder:", n.kind, n.creator].join(" ")],
  errors: [],
});

export function assertValidationParent(
  t: ValidationNode,
): asserts t is ValidationNodeParent {
  if (t.kind !== "parent") {
    console.log("ERROR VALIDATION NODE:", t);
    throw new Error(`EXPECTED VALIDATION NODE ${t.creator} TO BE A PARENT`);
  }
}

export function assertValidationSingleChild(
  t: ValidationNodeParent,
): asserts t is ValidationNodeParent {
  if (t.children.length > 1) {
    console.log("ERROR VALIDATION NODE:", t);
    throw new Error(
      `EXPECTED VALIDATION NODE ${t.creator} TO HAVE A SINGLE CHILD`,
    );
  }
}

export function assertValidationLeaf(
  t: ValidationNode,
): asserts t is ValidationNodeLeaf {
  if (t.kind !== "leaf") {
    console.log("ERROR VALIDATION NODE:", t);
    throw new Error(`EXPECTED VALIDATION NODE ${t.creator} TO BE A LEAF`);
  }
}

export function flattenValidationChildren(v: ValidationNodeParent) {
  return v.children.reduce(
    (a, c) => [...a, ...(c as ValidationNodeParent).children],
    [] as ValidationNode[],
  );
}
