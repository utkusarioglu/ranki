import type {
  // RankiLangParseSpecs,
  // RankiLangParseHandlerHooks,
  RankiLangParseHandlerCommon,
  RankiLangParsedAst,
  RankiLangAstContext,
} from "@ranki/package-api-v2";
import { createParser } from "./ast.mjs";

export class AstLibrary {
  parse<T extends RankiLangParseHandlerCommon>(
    theaterRaw: string,
    context: RankiLangAstContext<T>,
  ): RankiLangParsedAst {
    const handler = context.hooks.getHandler(context["plugin"].type);
    context.hooks.createAstParser = createParser;
    return handler(theaterRaw, context);
  }
}
