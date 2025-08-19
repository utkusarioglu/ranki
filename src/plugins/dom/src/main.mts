import type { Plugin } from "@ranki/package-api";

const plugin: Plugin = {
  metadata: {
    name: "html dom elements",
  },
  components: [
    {
      tags: ["pre"],
      stages: async () => (await import("./stages/pre/main.mjs")).default,
    },
    {
      tags: ["p"],
      stages: async () => (await import("./stages/p/main.mjs")).default,
    },
    {
      tags: ["span"],
      stages: async () => (await import("./stages/span/main.mjs")).default,
    },
  ],
};

export default plugin;
