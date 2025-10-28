import type {
  RankiPluginParser,
  RankiPluginParserTransformFunc,
  TransformerFunctionEntry,
  ValidationNode,
  TransformNode,
  TransformNodeParent,
  RankiLangAstContext,
} from "@ranki/package-api-v2";

export class TransformerLibrary {
  private list: Record<string, TransformerFunctionEntry> = {};

  addPlugin(p: RankiPluginParser) {
    Object.entries(p.transformers()).forEach(([n, v]) => {
      const current = this.list[n];
      if (current) {
        throw new Error(
          `TRANSFORMER ${n} ALREADY REGISTERED BY ${current.source}`,
        );
      }
      this.list[n] = {
        source: n,
        callback: v,
      };
    });
  }

  getTransformer(name: string): RankiPluginParserTransformFunc {
    const found = this.list[name];
    if (!found) {
      throw new Error(`TRANSFORMER ${name} NOT FOUND`);
    }
    return found.callback;
  }

  transform(
    validation: ValidationNode,
    context: RankiLangAstContext,
  ): TransformNode {
    try {
      // @ts-ignore
      if (validation.shape.frame) {
        // !FIX this is supposed to come from the args
        const handlerName = "RankiFrameV2";
        const component = context.getComponent(
          handlerName,
          // @ts-ignore
          validation.shape.frame.chain,
        );
        const transformed = component.stages.transform({
          validation,
          spec: context,
        });
        return transformed;
      }

      const transformer = this.getTransformer(validation.creator);
      if (validation.kind === "parent") {
        const transformed = transformer(validation) as TransformNodeParent;
        return {
          ...transformed,
          children: validation.children.map((c) => this.transform(c, context)),
        };
      } else {
        return transformer(validation);
      }
    } catch (e: unknown) {
      console.error(validation, e);
      throw new Error((e as Error).message);
    }
  }
}
