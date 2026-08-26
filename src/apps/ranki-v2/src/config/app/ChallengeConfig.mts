import type { RawFields, CardFaceArray } from "_collect/collect.types.mjs";
import type {
  BuildRankiBaseConfigReturn,
  RankiDqmConfig,
  RankiChallengeState,
} from "_config/config.types.mjs";
import { getAnimation } from "./ranki-config.mjs";

export class ChallengeConfig {
  public static build(
    base: BuildRankiBaseConfigReturn,
    raw: RawFields,
    order: CardFaceArray,
    dqm: RankiDqmConfig,
  ): RankiChallengeState {
    const animation = getAnimation(base, "challenge");
    return {
      animation,
      dqm,
      face: raw.fields.face,
      order,
    };
  }
}
