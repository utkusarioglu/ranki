import type { IAstNodeActionDict } from "@dqm/package-dqm-api-v2";
import { grabAst } from "@dqm/package-plugin-utils";

export const nodeValueItem: IAstNodeActionDict = {
  paramsV2ValueItemPrimitive_number(n) {
    return grabAst(this)
      .newAst(this)
      .pushIgnoredNodes(n)
      .setLeafViewDecoder("number", (v) => ({ value: +v }));
  },

  paramsV2ValueItemPrimitive_lowercase(lower, sBaseV2Clearance, lowerPlus) {
    return grabAst(this)
      .newAst(this)
      .pushIgnoredNodes(lower, sBaseV2Clearance, lowerPlus)
      .setLeafViewDecoder("string", (value) => ({
        subtype: "lowercase",
        value,
      }));
  },

  paramsV2ValueItemPrimitive_uppercase(upper, sBaseV2Clearance, upperPlus) {
    return grabAst(this)
      .newAst(this)
      .pushIgnoredNodes(upper, sBaseV2Clearance, upperPlus)
      .setLeafViewDecoder("string", (value) => ({
        subtype: "uppercase",
        value,
      }));
  },

  paramsV2ValueItemPrimitive_chars(letter, sBaseV2Clearance, letterPlus) {
    return grabAst(this)
      .newAst(this)
      .pushIgnoredNodes(letter, sBaseV2Clearance, letterPlus)
      .setLeafViewDecoder("string", (value) => ({
        subtype: "chars",
        value,
      }));
  },

  paramsV2ValueItemPrimitive_mixed(letterDigit) {
    return grabAst(this)
      .newAst(this)
      .pushIgnoredNodes(letterDigit)
      .setLeafViewDecoder("string", () => ({
        value: "mixed",
      }));
  },

  paramsV2ValueItemPrimitive_true(n) {
    return grabAst(this)
      .newAst(this)
      .pushIgnoredNodes(n)
      .setLeafViewDecoder("boolean", () => ({
        value: true,
      }));
  },

  paramsV2ValueItemPrimitive_false(n) {
    return grabAst(this)
      .newAst(this)
      .pushIgnoredNodes(n)
      .setLeafViewDecoder("boolean", () => ({
        value: false,
      }));
  },
};
