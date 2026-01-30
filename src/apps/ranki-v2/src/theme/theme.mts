import type { RankiDesignState } from "_config/config.types.mts";
import { assertNotUndefined } from "_error/assertions.mts";
import { generatePaletteStyle } from "./color.mts";
import {
  CSS_FADE_ANIMATION_DURATION,
  REMOVED,
  SCHEME_PREFIX,
  THEME_PREFIX,
  GENERATED_PREFIX,
  PALETTE_PREFIX,
} from "./design.constants.mts";

export function createDesign(config: RankiDesignState) {
  const root = document.documentElement;
  const attach = document.body;
  root.style.setProperty(CSS_FADE_ANIMATION_DURATION, config.animation.fade);

  document.body.style.setProperty(
    "transition-duration",
    `var(${CSS_FADE_ANIMATION_DURATION})`,
    "important",
  );

  // TODO this should come from a variable;
  // tie css var --face-min-width to this.
  const match = window.matchMedia("(min-width: 500px)");
  if (match.matches) {
    document.body.classList.toggle("width-wide", match.matches);
  }
  match.addEventListener("change", (e) => {
    document.body.classList.toggle("width-wide", e.matches);
  });

  const n = config.palette;
  root.className = [
    ...root.className
      .split(" ")
      .filter((n) => !REMOVED.some((r) => n.startsWith(r))),
    `${SCHEME_PREFIX}-${config.scheme}`,
    `${THEME_PREFIX}-${config.theme}`,
  ].join(" ");

  if (n.startsWith(GENERATED_PREFIX)) {
    if (attach.querySelector("#" + n)) {
      return;
    }
    const palette = config.paletteCollection.find(({ name }) => n === name);
    assertNotUndefined(palette, {
      why: "Custom palette requires paletteSpecs to be defined",
    });

    document.documentElement.classList.add(
      PALETTE_PREFIX,
      `${PALETTE_PREFIX}-${palette.name}`,
    );

    const activePalettes = attach.querySelectorAll(
      `.${PALETTE_PREFIX}:not(#${palette.name})`,
    );
    for (let active of activePalettes) {
      active.parentElement?.removeChild(active);
    }
    generatePaletteStyle(attach, palette);
  }
}
