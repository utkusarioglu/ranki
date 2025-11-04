import type {
  RankiPluginParser,
  RankiPluginParserTransformFunc,
  TransformerFunctionEntry,
  ValidationNode,
  TransformNode,
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
    // context: RankiLangAstContext,
  ): TransformNode {
    try {
      // if (validation.shape.frame) {
      // !FIX this is supposed to come from the args
      // TODO

      // @ts-expect-error
      const current = validation.plugins.parser.current;
      if (!current) {
        console.log("ERROR VALIDATION NODE:", validation);
        throw new Error("NO CURRENT PARSER SET");
      }
      const handlerName = current.type;
      const component = validation.context.getComponent(
        handlerName,
        current.chain,
      );
      const transformed = component.stages.transform(validation);

      // if (transformed.kind === "parent") {
      // }
      // const children: TransformNode[] = [];
      if (transformed.kind === "parent") {
        if (validation.kind === "leaf") {
          throw new Error(
            "KIND INCONSISTENCY BETWEEN TRANSFORM AND VALIDATION",
          );
        }
        transformed.children = transformed.children.map((c) =>
          // TODO
          this.transform(c as unknown as ValidationNode),
        );
        // transformed.children = children;
      }

      return transformed;
      // }

      // const transformer = this.getTransformer(validation.creator);
      // if (validation.kind === "parent") {
      //   const transformed = transformer(validation) as TransformNodeParent;
      //   return {
      //     ...transformed,
      //     children: validation.children.map((c) => this.transform(c, context)),
      //   };
      // } else {
      //   return transformer(validation);
      // }
    } catch (e: unknown) {
      console.error(validation, e);
      throw new Error((e as Error).message);
    }
  }
}
