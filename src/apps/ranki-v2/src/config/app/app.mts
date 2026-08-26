import type { CardFaceArray, RawFields } from "_collect/collect.types.mjs";
import type {
  BuildRankiBaseConfigReturn,
  RankiBaseConfig,
  RankiCollectedConfig,
  RankiState,
} from "_config/config.types.mjs";

import { SYSTEM_CONTROLLED_SCHEME_TOKEN } from "_config/config.constants.mjs";
import { RankiAppError } from "_error/ranki-app-error.mjs";
import { assertExists } from "@dqm/package-dqm-utils";

import { assertNotNull } from "_error/assertions.mjs";
import { buildRankiConfig } from "./buildRankiConfig.mjs";

export class AppConfig {
  private static getScheme(base: BuildRankiBaseConfigReturn, raw: RawFields) {
    return base.config.design.scheme === SYSTEM_CONTROLLED_SCHEME_TOKEN
      ? raw.htmlAttr.scheme
      : base.config.design.scheme;
  }
  public static create(
    collected: RankiCollectedConfig | null,
    raw: RawFields | null,
  ): RankiState | null {
    assertNotNull(raw, {
      why: "Raw fields shouldn't be null at this stage of resolution",
    });
    return collected === null ? null : this.createAppConfig(collected, raw);
  }

  private static createAppConfig(
    { base, tags }: RankiCollectedConfig,
    raw: RawFields,
  ): RankiState {
    const order = this.getFaceOrder(base.config, raw);
    const scheme = this.getScheme(base, raw);
    const ranki = buildRankiConfig(base, raw, tags, order, scheme);
    if (ranki.dev.throw) {
      throw new RankiAppError({
        cause: null,
        code: "INTENTIONAL_ERROR",
        details: {
          order,
          ranki,
          scheme,
        },
        why: "The app was asked to throw this error through a trigger",
      });
    }
    return ranki;
  }

  private static getFaceOrder(
    config: RankiBaseConfig,
    collected: RawFields,
  ): CardFaceArray {
    const order: CardFaceArray | undefined =
      config.faces[collected.fields.face];
    assertExists(order, {
      details: { face: collected.fields.face, faces: config.faces },
      why: "Cannot process without a valid face assignment",
    });
    return order;
  }
}
