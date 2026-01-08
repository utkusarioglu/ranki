import type {
  Alias,
  Chain,
  IDqmComponent,
  IDqmPluginComponentSet,
  IPluginLib,
} from "@dqm/package-dqm-api-v2";
import { IdLib } from "../../id/id-lib.mjs";
import { DqmAppError } from "../../errors/dqm-app-error/dqm-app-error.mjs";
import type { GroupedPluginExamples } from "@dqm/package-dqm-api-v2";
import { Serialize } from "../../utils/serialize.mjs";

type Criteria = {
  id: Alias | Chain;
};

export type In = IDqmPluginComponentSet;

export type Out = IDqmComponent;

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

  getPluginExamples(): GroupedPluginExamples {
    // REPLACE this is hard to debug
    return Object.fromEntries(
      Array.from(this.sets.entries())
        .map(([packageName, s]) => [
          packageName,
          s.list
            .map((component) => [
              Serialize.chain(component.meta.id.chain),
              component.meta.examples,
            ])
            .filter((v) => v[1]),
        ])
        .filter((v) => v[1].length)
        // @ts-ignore
        .map(([p, r]) => [p, Object.fromEntries(r)]),
    );
  }
}
