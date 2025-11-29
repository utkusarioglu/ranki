import type { Alias, Chain, IPluginLib } from "@ranki/package-dqm-api-v2";
import { DqmError } from "@ranki/package-utils";
import type { In, Out } from "./component-lib.types.mjs";
import { IdLib } from "../../id/id-lib.mjs";

type Criteria = {
  // type: string;
  id: Alias | Chain;
};

type ILibComponent = IPluginLib<In, Out, Criteria>;

export class ComponentLib implements ILibComponent {
  private sets = new Map<string, In>();
  private idLib = new IdLib<Out>();

  add(plugin: In): ILibComponent {
    if (this.sets.has(plugin.meta.name)) {
      throw new DqmError("PLUGIN_ALREADY_REGISTERED", {
        component: this.sets,
        plugin,
      });
    }
    this.sets.set(plugin.meta.name, plugin);
    plugin.list.forEach((c) => {
      this.idLib.add(c.meta.id, c);
    });
    return this;
  }

  get({ id }: Criteria): Out {
    return this.idLib.getObjectById(id.join("."));
  }
}
