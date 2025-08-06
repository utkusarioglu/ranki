import type { Plugin } from "@ranki/package-api";

const plugin: Plugin = {
  metadata: {
    name: "Ranki root elements",
  },
  components: [
    {
      tags: ["directive"],
      stages: async () => (await import("./stages/directive/main.mjs")).default,
    },
  ],
};

export default plugin;
