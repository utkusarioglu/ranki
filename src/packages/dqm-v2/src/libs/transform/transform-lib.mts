import type {
  Chain,
  IDqmComponent,
  IDqmComponentTransformFunction,
  IPluginLib,
  TransformClass,
} from "@dqm/package-dqm-api-v2";
import { assertNotExists } from "../../errors/dqm-app-error/assertions.mjs";
import { assertExists } from "@dqm/package-dqm-utils";
import { Serialize } from "../../utils/serialize.mjs";

type TransformMap = Map<TransformClass, IDqmComponentTransformFunction>;

type Criteria = { transformClass: TransformClass; chain: Chain };

export type ILibTransformer = IPluginLib<
  IDqmComponent,
  IDqmComponentTransformFunction,
  Criteria
>;

export class TransformLib implements ILibTransformer {
  private transformers: TransformMap = new Map();

  add(comp: IDqmComponent): this {
    Object.entries(comp.transformers).forEach(([tc, transformer]) => {
      const urn = Serialize.transformClassUrn(comp.meta.id.chain, tc);
      assertNotExists(this.transformers.get(urn), {
        why: "No two transformer should have the same transform class",
      });
      this.transformers.set(urn, transformer);
    });
    return this;
  }

  get(c: Criteria): IDqmComponentTransformFunction {
    const urn = Serialize.transformClassUrn(c.chain, c.transformClass);
    const transformer = this.transformers.get(urn);
    assertExists(transformer, {
      why: "A required transformer has not been installed by any of the plugins",
      details: {
        urn,
      },
    });
    return transformer;
  }
}
