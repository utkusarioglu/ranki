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
import { Timing } from "_utils/timing.mjs";

export function createDesign(
  config: RankiDesignState,
  root: HTMLElement,
  attach: HTMLElement,
) {
  // FIX this fade duration relates to so many things in hud. but it should be getting its state from hud animation
  root.style.setProperty(
    CSS_FADE_ANIMATION_DURATION,
    config.animation.enabled ? config.animation.fade : "0",
  );

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

  attachClasses(root, config);

  const n = config.palette;
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

/**
 * @dev
 * #1 TODO this is ugly and error prone and it's just a heuristic. This
 * prevents new components from starting with the target color scheme already
 * applied.
 */
async function attachClasses(root: HTMLElement, config: RankiDesignState) {
  await Timing.waitLayout(); // #1
  root.className = [
    ...root.className
      .split(" ")
      .filter((n) => !REMOVED.some((r) => n.startsWith(r))),
    `${SCHEME_PREFIX}-${config.scheme}`,
    `${THEME_PREFIX}-${config.theme}`,
  ].join(" ");
}
