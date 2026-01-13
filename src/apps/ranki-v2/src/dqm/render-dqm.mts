import { Dqm } from "@dqm/package-dqm-v2";
import type { RenderReport, RenderRoots } from "@dqm/package-dqm-v2";
import { pluginsAsArray } from "./dqm.plugins.mts";
import { RankiAppError } from "../error/ranki-app-error.mts";
import type { DataCollection } from "../collect/collect.types.mts";
import { DQM_BASE_CONFIG } from "./constants.mts";

export async function renderDqm(
  collected: DataCollection,
  roots: RenderRoots,
): Promise<RenderReport> {
  const inputs = collected.inputs;
  const pref = collected.pref;
  const config = [DQM_BASE_CONFIG];
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
