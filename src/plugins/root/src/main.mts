import type { Plugin } from "@ranki/package-api";
import { NODE_TYPES } from "@ranki/package-api/constants";
import document from "./stages/document/main.mjs";
import directive from "./stages/directive/main.mjs";

const plugin: Plugin = {
  metadata: {
    name: "Ranki root elements",
  },
  components: [
    {
      tags: [NODE_TYPES.document],
      stages: () => Promise.resolve(document),
    },
    {
      tags: [NODE_TYPES.directive],
      stages: () => Promise.resolve(directive),
    },
    {
      tags: [NODE_TYPES.paragraph],
      stages: async () => (await import("./stages/others/main.mjs")).default,
    },
    {
      tags: [NODE_TYPES.heading],
      stages: async () => (await import("./stages/others/main.mjs")).default,
    },
    {
      tags: [NODE_TYPES.line],
      stages: async () => (await import("./stages/others/main.mjs")).default,
    },
    {
      tags: [NODE_TYPES.word],
      stages: async () => (await import("./stages/others/main.mjs")).default,
    },
  ],
};

export default plugin;
