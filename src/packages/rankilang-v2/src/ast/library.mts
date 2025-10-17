import type {
  // ParserPluginsInstance,
  RankiLangAstContext,
  RankiLangParseFunctionReturn,
} from "@ranki/package-api-v2";
// import { buildGrammar, compileOhmActionDicts } from "./grammar.mjs";
import { ast } from "./ast.mjs";

export class AstLibrary {
  // parse(raw: string context) {

  // }

  parse(
    raw: string,
    context: RankiLangAstContext,
  ): RankiLangParseFunctionReturn {
    return ast(raw, context);
  }
}
