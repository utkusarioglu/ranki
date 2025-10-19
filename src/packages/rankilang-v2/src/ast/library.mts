import type {
  RankiLangParseSpecs,
  RankiLangParseHandlerHooks,
  RankiLangParseHandlerCommon,
  RankiLangParsedAst,
} from "@ranki/package-api-v2";
import type { RankiLangAstContext } from "@ranki/package-api-v2";
import { ast } from "./ast.mjs";

export class AstLibrary {
  parse<T extends RankiLangParseHandlerCommon>(
    theaterRaw: string,
    spec: RankiLangParseSpecs<T>,
    hooks: RankiLangParseHandlerHooks,
  ): RankiLangParsedAst {
    if (!spec["plugin"]) {
      return this.parseAstDefault(theaterRaw, spec, hooks);
    }

    const handler = hooks.getHandler(spec["plugin"].type);
    return handler(theaterRaw, spec, hooks);
  }

  private parseAstDefault<T extends RankiLangParseHandlerCommon>(
    theaterRaw: string,
    spec: RankiLangParseSpecs<T>,
    hooks: RankiLangParseHandlerHooks,
  ): RankiLangParsedAst {
    const contentConfig = hooks.getConfig().merged.content;

    const theaterWithContent = [
      contentConfig.prefix,
      theaterRaw,
      contentConfig.suffix,
    ].join("");

    const context: RankiLangAstContext = {
      hooks,
      blockDepth: spec.blockDepth,
      inlineDepth: spec.inlineDepth,
      theater: spec.theater,
      role: spec.role,
      startRule: spec.startRule,
    };

    return ast(theaterWithContent, context);
  }
}
