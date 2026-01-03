import type { Alias, Chain, IPluginLib } from "@dqm/package-dqm-api-v2";
import type { In, Out } from "./component-lib.types.mjs";
import { IdLib } from "../../id/id-lib.mjs";
import { DqmAppError } from "../../errors/dqm-app-error/dqm-app-error.mjs";

type Criteria = {
  id: Alias | Chain;
};

type ILibComponent = IPluginLib<In, Out, Criteria>;

export class ComponentLib implements ILibComponent {
  private sets = new Map<string, In>();
  private idLib = new IdLib<Out>();

  private buildKey(type: string, name: string) {
    return [type, name].join(":");
  }

  add(plugin: In): this {
    const setKey = this.buildKey(plugin.type, plugin.meta.name);
    if (this.sets.has(setKey)) {
      throw new DqmAppError({
        code: "PLUGIN_ALREADY_REGISTERED",
        why: "Another plugin with the same name has already been registered",
        cause: null,
        details: {
          component: this.sets,
          plugin,
        },
      });
    }
    this.sets.set(setKey, plugin);
    plugin.list.forEach((c) => {
      this.idLib.add(c.meta.id, c);
    });
    return this;
  }

  get({ id }: Criteria): Out {
    return this.idLib.getObjectById(id);
  }
}
