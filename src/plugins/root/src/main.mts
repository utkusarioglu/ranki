import type { Plugin } from "@ranki/package-api";
import { NODE_TYPES } from "@ranki/package-api/constants";
import document from "./stages/document/main.mjs";
import directive from "./stages/directive/main.mjs";
import paragraph from "./stages/paragraph/main.mjs";
import others from "./stages/others/main.mjs";
import word from "./stages/word/main.mjs";

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
      stages: () => Promise.resolve(paragraph),
    },
    {
      tags: [NODE_TYPES.heading],
      stages: () => Promise.resolve(others),
    },
    {
      tags: [NODE_TYPES.line],
      stages: () => Promise.resolve(others),
    },
    {
      tags: [NODE_TYPES.word],
      stages: () => Promise.resolve(word),
    },
  ],
};

export default plugin;
