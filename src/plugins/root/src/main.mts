import type { Plugin } from "@ranki/package-api";
import { directive } from "./components/directive/main.mjs";
import { paragraph } from "./components/paragraph/main.mjs";
import { others } from "./components/others/main.mjs";
import { word } from "./components/word/main.mjs";
import { document } from "./components/document/main.mjs";

const plugin: Plugin = {
  metadata: {
    name: "Ranki root elements",
  },
  components: [document, directive, paragraph, word, others],
};

export default plugin;
