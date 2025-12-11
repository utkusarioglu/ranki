import type { IDqmComponent } from "@dqm/package-dqm-api-v2";

export const frameV2CodeBlockComponent: IDqmComponent = {
  type: "component",
  meta: {
    id: {
      chain: ["frame", "v2", "code"],
      aliases: ["code"],
    },
    description: "Component that understands computer code",
    version: "0.0.0",
  },
  stages: {
    // DO NOT DO TRIMMING HERE, DO THAT IN TRANSFORM.
    // THIS IS FOR GETTING RID OF HTML ENCODING AND SUCH AT THE COMPONENT LEVEL
    preprocessing: (c) => c,
    ast: {
      configs: {
        positionals: [],
        params: [],
      },
      settings: {
        positionals: [],
        params: [
          {
            id: {
              chain: ["prettier", "auto_format"],
              aliases: ["p"],
            },
            values: [
              {
                name: "Auto Format",
                type: "boolean",
                defaultValue: true,
              },
            ],
          },
          {
            id: {
              chain: ["path", "cat"],
              aliases: ["h"],
            },
            values: [
              {
                name: "first_number",
                type: "number",
                defaultValue: 1,
              },
            ],
          },
        ],
      },
    },
  },
};
