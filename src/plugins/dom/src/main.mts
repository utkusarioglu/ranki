import type { Plugin } from "@ranki/package-api";
// import { p } from "./components/p/main.mjs";
// import { span } from "./components/span/main.mjs";
import { pre } from "./components/pre/main.mjs";

const plugin: Plugin = {
  metadata: {
    name: "html dom elements",
    loadMethod: "lazy",
  },
  components: [
    // TODO these are disabled because they clash with root
    // TODO and the error messages aren't informative enough, fix that
    // p,
    // span,
    pre,
  ],
};

export default plugin;
