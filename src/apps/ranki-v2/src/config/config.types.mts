import type {
  DqmConfigPackPartial,
  DqmParseInputStructured,
  IDqmRendererClientPreferences,
} from "@dqm/package-dqm-v2";
import type { HudProps } from "../components/hud/hud.types.mts";
import type { CardFaceArray } from "../collect/collect.types.mts";

export interface RankiAppConfig {
  hud: HudProps;
  order: CardFaceArray;
}

export interface RankiDqmConfig {
  inputs: DqmParseInputStructured;
  config: DqmConfigPackPartial;
  pref: IDqmRendererClientPreferences;
}

export interface Conf {
  ranki: RankiAppConfig;
  dqm: RankiDqmConfig;
}
