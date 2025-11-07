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
  if (t.kind !== "parent")
    throw new Error(`EXPECTED VALIDATION NODE ${t.creator} TO BE A PARENT`);
}

export function assertValidationLeaf(
  t: ValidationNode,
): asserts t is ValidationNodeLeaf {
  if (t.kind !== "leaf")
    throw new Error(`EXPECTED VALIDATION NODE ${t.creator} TO BE A LEAF`);
}
