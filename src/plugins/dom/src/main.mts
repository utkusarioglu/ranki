import type { Plugin } from "@ranki/package-api";

const plugin: Plugin = {
  metadata: {
    name: "html dom elements",
  },
  components: [
    {
      tags: ["pre"],
      stages: async () => (await import("./stages/debug/main.mjs")).default,
    },
  ],
};

export default plugin;
