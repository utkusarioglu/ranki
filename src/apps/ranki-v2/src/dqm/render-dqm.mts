import type { RankiDqmConfig } from "_config/config.types.mjs";
import type { RenderReport, RenderRoots } from "@dqm/package-dqm-v2";

import { RankiAppError } from "_error/ranki-app-error.mjs";
import { Dqm } from "@dqm/package-dqm-v2";

import { pluginsAsArray } from "./dqm.plugins.mjs";

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
      cause: e,
      code: "PARSE_FAIL",
      details: {
        config,
      },
      why: "Dqm threw while parsing or rendering",
    });
  }
}
