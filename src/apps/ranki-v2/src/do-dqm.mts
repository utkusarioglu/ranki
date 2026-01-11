import { Dqm } from "@dqm/package-dqm-v2";
import type {
  DqmParseInput,
  RenderRoots,
  IDqmRendererClientPreferences,
  DqmConfigPackPartial,
} from "@dqm/package-dqm-v2";
import { pluginsAsArray } from "./dqm.plugins.mts";
import { RankiAppError } from "./error.mts";

export function doDqm(
  inputs: DqmParseInput,
  roots: RenderRoots,
  config: DqmConfigPackPartial,
  pref: IDqmRendererClientPreferences,
) {
  try {
    const dqm = new Dqm(config, pluginsAsArray);
    dqm.render(inputs, roots, pref);
  } catch (e) {
    throw new RankiAppError({
      code: "PARSE_FAIL",
      why: "Dqm threw while parsing or rendering",
      cause: e,
      details: {
        config,
      },
    });
  }
}
