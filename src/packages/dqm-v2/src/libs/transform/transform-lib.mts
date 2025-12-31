import type {
  CreatorName,
  IDqmComponent,
  IDqmComponentTransformer,
  IPluginLib,
} from "@dqm/package-dqm-api-v2";
import { assertNotExists } from "../../errors/dqm-app-error/assertions.mjs";
import { assertExists } from "@dqm/package-dqm-utils";

type TransformMap = Map<CreatorName, IDqmComponentTransformer>;

type Criteria = { creator: CreatorName };

export type ILibTransformer = IPluginLib<
  IDqmComponent,
  IDqmComponentTransformer,
  Criteria
>;

export class TransformLib implements ILibTransformer {
  private transformers: TransformMap = new Map();

  add(comp: IDqmComponent): ILibTransformer {
    Object.entries(comp.transformers).forEach(([creator, transformer]) => {
      assertNotExists(this.transformers.get(creator), {
        why: "No two transformer should have the same creator",
      });
      this.transformers.set(creator, transformer);
    });
    return this;
  }

  get(c: Criteria): IDqmComponentTransformer {
    const t = this.transformers.get(c.creator);
    assertExists(t, {
      why: "A required transformer has not been installed by any of the plugins",
      details: {
        creator: c.creator,
      },
    });
    return t;
  }
}
