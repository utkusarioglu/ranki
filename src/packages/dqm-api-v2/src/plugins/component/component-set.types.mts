import type {
  DqmPluginName,
  DqmPluginVersion,
} from "../../config/dqm-config.types.mjs";
import type { IDqmComponent } from "./component.types.mjs";

export interface IDqmPluginComponentSet {
  type: "component-set";
  meta: {
    name: DqmPluginName;
    description: string;
    version: DqmPluginVersion;
  };
  list: IDqmComponent[];
}
