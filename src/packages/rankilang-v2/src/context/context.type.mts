import type {
  ComponentPluginsInstance,
  ParserPluginsInstance,
} from "@ranki/package-api-v2";
import type { RankiLangConfig } from "../config.mjs";
import type { AstLibrary } from "../stages/ast/library.mjs";
// import type { TransformerLibrary } from "../stages/transformer/transformer.mjs";
import type { ValidatorLibrary } from "../stages/validator/library.mjs";

export interface RankiLangContextHooks {
  ast: AstLibrary;
  components: ComponentPluginsInstance;
  parsers: ParserPluginsInstance;
  config: RankiLangConfig;
  validators: ValidatorLibrary;
  // transformers: TransformerLibrary;
}
