import type { RankiAppDeterminedScheme } from "_config/config.types.mjs";

import type { AppConfigBuildParams } from "./app.types.mjs";

export class DesignConfig {
  public static build(
    { collected: { base } }: AppConfigBuildParams,
    scheme: RankiAppDeterminedScheme,
  ) {
    return {
      animation: base.config.design.animation,
      animationCollection: base.config.animations,
      layout: base.config.design.layout,
      palette: base.config.design.palette,
      paletteCollection: base.config.palettes,
      scheme,
      theme: base.config.design.theme,
    };
  }
}
