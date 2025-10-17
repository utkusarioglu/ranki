import type {
  RankiLanguageConfig,
  RankiLangInstance,
  RankiLangParseResult,
  RankiLangParseSpecs,
  RankiLangParseHandlerHooks,
  // RankiLangAstContext,
  RankiLanguageProvidedConfig,
  RankiLangParseReport,
  RankiLangParseHandlerCommon,
  ParserPluginsInstance,
  ComponentPluginsInstance,
  RankiLangInstancePluginsRecord,
  RankiLangAstResult,
  RankiLangParsedAst,
} from "@ranki/package-api-v2";
import type {
  RankiLangAstContext,
  RankiLangParseFunctionReturn,
} from "@ranki/package-api-v2";
import { ast } from "./ast.mjs";
import { RankiLang } from "../rankilang.mjs";

// interface ParseHooks {
//   getHandler: ParserPluginsInstance["getHandler"];
//   clone: RankiLang["clone"];
// }

export class AstLibrary {
  parse<T extends RankiLangParseHandlerCommon>(
    theaterRaw: string,
    spec: RankiLangParseSpecs<T>,
    hooks: RankiLangParseHandlerHooks,
  ): RankiLangParsedAst {
    console.log("ast", { hooks });
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
      // lang: this,
      blockDepth: spec.blockDepth,
      inlineDepth: spec.inlineDepth,
      theater: spec.theater,
      role: spec.role,
      startRule: spec.startRule,
    };

    return ast(theaterWithContent, context);
  }
}
