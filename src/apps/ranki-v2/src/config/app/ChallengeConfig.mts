import type { CardFaceArray, RawFields } from "_collect/collect.types.mjs";
import type {
  RankiAppDeterminedScheme,
  RankiBaseConfig,
  RankiChallengeState,
  RankiDqmConfig,
} from "_config/config.types.mjs";
import type {
  DqmParseInputStructured,
  DqmParseTheater,
} from "@dqm/package-dqm-v2";

import { RANKI_INTERNAL_FACE_PREFIX } from "_config/config.constants.mjs";
import { assertArrayNotEmpty } from "_error/assertions.mjs";
import { assertExists } from "_error/assertions.mjs";
import { RankiAppError } from "_error/ranki-app-error.mjs";

import { getAnimation } from "./app.mjs";
import { type AppConfigBuildParams } from "./app.types.mjs";

export class ChallengeConfig {
  public static build(
    { collected: { base }, raw }: AppConfigBuildParams,
    scheme: RankiAppDeterminedScheme,
  ): RankiChallengeState {
    const order = this.faceOrder(base.config, raw);
    const dqm = this.dqm(raw, order, base.config, scheme);
    const animation = getAnimation(base, "challenge");
    return {
      animation,
      dqm,
      face: raw.fields.face,
      order,
    };
  }

  /**
   * @dev
   * #1 DECIDE For some reason anki has two different attributes for theme. one in
   * className of html and the other is data-bs-theme again in html. I'm not sure
   * which one is the correct one to use.
   */
  private static dqm(
    raw: RawFields,
    order: CardFaceArray,
    config: RankiBaseConfig,
    scheme: RankiAppDeterminedScheme,
  ): RankiDqmConfig {
    const inputs = this.getInputs(
      raw,
      order.filter((v) => !v.startsWith(RANKI_INTERNAL_FACE_PREFIX)),
    );

    return {
      config: config.dqm,
      inputs,
      pref: { scheme },
    };
  }

  private static faceOrder(
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

  private static getInputs(
    raw: RawFields,
    theaterOrder: DqmParseTheater[],
  ): DqmParseInputStructured {
    assertArrayNotEmpty(theaterOrder, {
      details: { face: raw.fields.face, order: theaterOrder },
      why: "Given theater order has to be a non-empty array",
    });

    const inputs = theaterOrder.map((face) => {
      const r = raw.faces[face];
      if (!r) {
        throw new RankiAppError({
          cause: null,
          code: "NO_FACE",
          details: { face, theaterOrder },
          why: `Cannot find face ${face}`,
        });
      }
      return { dqm: r.innerHTML, theater: face };
    });
    if (!inputs.length) {
      throw new RankiAppError({
        cause: null,
        code: "NO_FACES",
        details: { theaterOrder },
        why: "Cannot find any faces to render. Ranki requires at least one face",
      });
    }
    return inputs;
  }
}
