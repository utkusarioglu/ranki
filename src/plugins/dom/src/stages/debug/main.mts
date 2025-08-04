// import type * as ohm from "ohm-js";
import { astNode } from "@ranki/package-api/helpers";
import { Html } from "@ranki/package-html";
import yaml from "yaml";

export default {
  parser: (n) =>
    astNode({
      type: "pre",
      source: n.sourceString,
      // children: [
      //   astNode({
      //     type: "code",
      //     source: n.sourceString,
      //   }),
      // ],
    }),
  validator: (v) => v,
  renderer: (p) => {
    const html = new Html();
    const element = html.single("pre", {
      format: "text",
      // content: JSON.stringify(p, null, 2),
      content: yaml.stringify(JSON.parse(JSON.stringify(p, null, 2))),
    });
    return {
      element,
    };
  },
};
