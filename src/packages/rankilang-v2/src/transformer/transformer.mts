import type {
  RankiPluginParser,
  RankiPluginParserTransformFunc,
  TransformerFunctionEntry,
  RankiLangParseSpecs,
  RankiLangParseHandlerCommon,
  ValidationNode,
  TransformNode,
  TransformNodeParent,
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

  transform<T extends RankiLangParseHandlerCommon>(
    obj: ValidationNode,
    spec: RankiLangParseSpecs<T>,
  ): TransformNode {
    try {
      const transformer = this.getTransformer(obj.type);
      if (obj.kind === "parent") {
        const transformed = transformer(obj) as TransformNodeParent;
        return {
          ...transformed,
          children: obj.children.map((c) => this.transform(c, spec)),
        };
      } else {
        return transformer(obj);
      }
    } catch (e) {
      console.error(obj, e);
      throw new Error(e.message);
    }
  }
}
