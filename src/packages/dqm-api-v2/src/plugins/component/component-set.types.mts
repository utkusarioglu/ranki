import type { IdSummary } from "./id/id.types.mjs";
import type { ComponentParamsSchema } from "./component.types.mjs";

export interface IDqmPluginComponentSet {
  type: "component-set";
  meta: {
    name: string;
    description: string;
    version: string;
  };
  list: IDqmComponent[];
}

export interface IDqmComponent {
  type: "component";
  meta: {
    id: IdSummary;
    description: string;
  };
  stages: {
    preprocessing?: (v: string) => string;
    ast: ComponentParamsSchema;
  };
}
