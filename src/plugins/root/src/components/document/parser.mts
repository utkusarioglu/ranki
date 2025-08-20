import { astNodeParentIndefinite } from "@ranki/package-api/helpers";
import { PARSE_TYPES } from "@ranki/package-api/constants";
import type { PluginComponentParser } from "@ranki/package-api";

export const parser: PluginComponentParser = (
  { whitespace, list },
  context,
) => {
  // const tokens = this.args.tokens;
  return astNodeParentIndefinite({
    type: PARSE_TYPES.document,
    attributes: [
      {
        keyword: "hello",
        values: [
          {
            type: "number",
            value: whitespace.sourceString.length,
          },
        ],
      },
    ],
    children: list.eval(context.config.tokens).children,
  });
};

// export default parser;
