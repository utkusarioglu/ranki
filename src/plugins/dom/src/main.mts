import { Plugin, astNode } from "@ranki/package-api";
import { Html } from "@ranki/package-html";

const plugin: Plugin = {
  metadata: {
    name: "html dom elements",
  },
  components: [
    {
      tags: ["a"],
      parser: (n) =>
        astNode({
          type: "a",
          children: [
            astNode({
              type: "code",
              source: n.sourceString,
            }),
          ],
        }),
      validator: (v) => v,
      renderer: (p) => {
        const html = new Html();
        const element = html.single("pre", {
          format: "text",
          content: JSON.stringify(p, null, 2),
        });
        return {
          element,
        };
      },
    },
  ],
};

export default plugin;
