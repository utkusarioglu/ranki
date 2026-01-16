import { Dqm } from "@dqm/package-dqm-v2";
import type { RenderReport, RenderRoots } from "@dqm/package-dqm-v2";
import { pluginsAsArray } from "./dqm.plugins.mjs";
import { RankiAppError } from "../error/ranki-app-error.mjs";
import type { RankiDqmConfig } from "../config/config.types.mts";

export async function renderDqm(
  collected: RankiDqmConfig,
  roots: RenderRoots,
): Promise<RenderReport> {
  const inputs = collected.inputs;
  const pref = collected.pref;
  const config = collected.config;
  try {
    const dqm = new Dqm(config, pluginsAsArray);
    return dqm.render(inputs, roots, pref);
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
