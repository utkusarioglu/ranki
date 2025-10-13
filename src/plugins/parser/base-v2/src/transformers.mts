import type {
  RankiPluginParserTransformCallback,
  RankiPluginParserTransformFunc,
  ValidationNode,
  ValidationNodeLeaf,
} from "@ranki/package-api-v2";

const placeholder: RankiPluginParserTransformFunc = (v: ValidationNode) => {
  switch (v.kind) {
    case "parent":
      return {
        kind: "parent",
        tag: "div",
        children: [],
      };
    case "leaf":
      let value;
      switch (v.source.type) {
        case "number":
          value = v.source.number.toString();
          break;
        default:
          value = v.source.value;
        // case "lowercase":
        //   value = v.source.
        // case "uppercase":
        // case "mixedcase":
        // case "propercase":
        // case "text":
        // case "mixed":
        // case "punctuation":
        //   case "token"
      }
      return {
        kind: "leaf",
        tag: "span",
        value,
      };
    default:
      // @ts-expect-error
      throw new Error(`UNRECOGNIZED VALIDATION NODE TYPE: ${v.kind}`);
  }
};

export const transformers: RankiPluginParserTransformCallback = () => ({
  root_structure: placeholder,
  section_base: placeholder,
  p: placeholder,
  line: placeholder,
  lexemes: placeholder,
  decorated_base: placeholder,
  word_base: placeholder,
  clearance: placeholder,
});
