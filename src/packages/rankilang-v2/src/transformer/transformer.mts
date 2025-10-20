import type {
  RankiPluginParser,
  RankiPluginParserTransformFunc,
  TransformerFunctionEntry,
  RankiLangParseSpecs,
  RankiLangParseHandlerCommon,
  ValidationNode,
  TransformNode,
  TransformNodeParent,
  RankiLangAstContext,
} from "@ranki/package-api-v2";
import { ComponentPlugins } from "../component/component-plugins.mjs";

type GetComponentHook = ComponentPlugins["getPlugin"];

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
    validation: ValidationNode,
    context: RankiLangAstContext<T>,
    // hooks: { getComponent: GetComponentHook },
  ): TransformNode {
    try {
      // @ts-ignore
      if (validation.args.frame) {
        // !FIX this is supposed to come from the args
        const handlerName = "RankiFrameV2";
        const component = context.hooks.getComponent(
          handlerName,
          // @ts-ignore
          validation.args.frame.chain,
        );
        const transformed = component.stages.transform({
          validation,
          spec: context,
        });
        return transformed;
        // if (obj.args.frame.chain.join(".") === "code") {
        //   return {
        //     // @ts-expect-error
        //     code: "code!",
        //   };
        // }
      }
      const transformer = this.getTransformer(validation.type);
      if (validation.kind === "parent") {
        const transformed = transformer(validation) as TransformNodeParent;
        return {
          ...transformed,
          children: validation.children.map((c) => this.transform(c, context)),
        };
      } else {
        return transformer(validation);
      }
    } catch (e) {
      console.error(validation, e);
      throw new Error(e.message);
    }
  }
}
