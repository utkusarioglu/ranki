import type {
  RankiLangParseSpecs,
  RankiLangParseHandlerHooks,
  RankiLangParseHandlerCommon,
  RankiLangParsedAst,
  RankiLangAstContext,
} from "@ranki/package-api-v2";
import { ast } from "./ast.mjs";

export class AstLibrary {
  parse<T extends RankiLangParseHandlerCommon>(
    theaterRaw: string,
    context: RankiLangAstContext<T>,
    // hooks: RankiLangParseHandlerHooks,
  ): RankiLangParsedAst {
    if (!context["plugin"]) {
      return this.parseAstDefault<T>(theaterRaw, context);
    }

    const handler = context.hooks.getHandler(context["plugin"].type);
    return handler(theaterRaw, context);
  }

  private parseAstDefault<T extends RankiLangParseHandlerCommon>(
    theaterRaw: string,
    context: RankiLangAstContext<T>,
    // hooks: RankiLangParseHandlerHooks,
  ): RankiLangParsedAst {
    const contentConfig = context.hooks.getConfig().merged.content;

    const theaterWithContent = [
      contentConfig.prefix,
      theaterRaw,
      contentConfig.suffix,
    ].join("");

    // TODO this isn't needed. it doesn't change anything
    const newContext: RankiLangAstContext = {
      hooks: context.hooks,
      blockDepth: context.blockDepth,
      inlineDepth: context.inlineDepth,
      theater: context.theater,
      role: context.role,
      startRule: context.startRule,
    };

    return ast(theaterWithContent, newContext);
  }
}
