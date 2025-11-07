import type {
  // RankiPluginParser,
  RankiPluginParserTransformFunc,
  TransformerFunctionEntry,
  ValidationNode,
  TransformNode,
} from "@ranki/package-api-v2";

export class TransformerLibrary {
  private list: Record<string, TransformerFunctionEntry> = {};

  // addPlugin(p: RankiPluginParser) {
  //   Object.entries(p.transformers()).forEach(([n, v]) => {
  //     const current = this.list[n];
  //     if (current) {
  //       throw new Error(
  //         `TRANSFORMER ${n} ALREADY REGISTERED BY ${current.source}`,
  //       );
  //     }
  //     this.list[n] = {
  //       source: n,
  //       callback: v,
  //     };
  //   });
  // }

  getTransformer(name: string): RankiPluginParserTransformFunc {
    const found = this.list[name];
    if (!found) {
      throw new Error(`TRANSFORMER ${name} NOT FOUND`);
    }
    return found.callback;
  }

  transform(validation: ValidationNode): TransformNode[] {
    try {
      // TODO
      const transformer = validation.plugins.transformer;
      if (!transformer) {
        throw new Error("NO TRANSFORMER ENTRY SET AT TRANSFORM BOUNDARY");
      }
      const chain = transformer.chain;
      const handler = transformer.handler;
      if (!chain) {
        console.log("ERROR VALIDATION NODE:", validation);
        throw new Error("NO CURRENT PARSER SET");
      }
      const component = validation.context.getComponent(handler, [chain]);
      return component.stages.transform(validation);
    } catch (e: unknown) {
      console.error(validation, e);
      throw new Error((e as Error).stack);
    }
  }
}
