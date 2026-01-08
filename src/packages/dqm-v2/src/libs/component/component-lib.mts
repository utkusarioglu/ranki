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
    const c: GroupedPluginExamples = Object.fromEntries(
      Array.from(this.sets.entries())
        .map(([k, v]) =>
          v.list
            .filter((c) => c.meta.examples)
            .map((c) =>
              c.meta.examples!.map((e) => [`${k}/${v.meta.name}`, e]).flat(),
            ),
        )
        .flat()
        .filter((v) => v.length),
    );

    return c;
  }
}
