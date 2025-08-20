import type { PluginComponentParser } from "@ranki/package-api";
import { astNodeLeaf } from "@ranki/package-api/helpers";

export const parser: PluginComponentParser = (n) =>
  astNodeLeaf({
    type: "pre",
    // @ts-expect-error
    source: n.sourceString,
  });
