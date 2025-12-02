import type { IDqmPluginGrammar } from "@dqm/package-dqm-api-v2";
import { tokenizer } from "./tokenizer.mjs";
import { config } from "./frame-v2.config.mjs";
import type { FrameV2GrammarConfig } from "./frame-v2.types.mjs";
import { actions } from "./actions/actions.mjs";
import { version, grammar } from "./frame-v2.grammar.mjs";

export const frameV2Grammar: IDqmPluginGrammar<FrameV2GrammarConfig> = {
  type: "grammar",
  meta: {
    name: "FrameV2",
    description: "The parser required to interpret FrameV2 syntax",
    version,
  },
  dependencies: ["ParamsV2", "BaseV2"],
  config: () => config,
  tokenizer: () => tokenizer(config),
  grammar: () => grammar,
  actions: () => actions,
};
