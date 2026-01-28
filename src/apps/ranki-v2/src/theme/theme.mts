import type { RankiAppConfig } from "../config/config.types.mts";
import { assertNotUndefined } from "../error/assertions.mts";
import { generatePaletteStyle } from "./color.mts";

const GENERATED_PREFIX = "generated";
const SCHEME_PREFIX = "scheme";
const THEME_PREFIX = "theme";
const PALETTE_PREFIX = "palette";
const REMOVED = [SCHEME_PREFIX, THEME_PREFIX];
const CSS_FADE_ANIMATION_DURATION = "--ranki-animation-fade-duration";

export function createDesign(config: RankiAppConfig) {
  const root = document.documentElement;
  const attach = document.body;
  root.style.setProperty(
    CSS_FADE_ANIMATION_DURATION,
    config.design.animation.fade,
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

  const n = config.design.palette;
  root.className = [
    ...root.className
      .split(" ")
      .filter((n) => !REMOVED.some((r) => n.startsWith(r))),
    `${SCHEME_PREFIX}-${config.design.scheme}`,
    `${THEME_PREFIX}-${config.design.theme}`,
  ].join(" ");

  if (n.startsWith(GENERATED_PREFIX)) {
    if (attach.querySelector("#" + n)) {
      return;
    }
    const palette = config.palettes.find(({ name }) => n === name);
    assertNotUndefined(palette, {
      why: "Custom palette requires paletteSpecs to be defined",
    });

    document.documentElement.classList.add(`${PALETTE_PREFIX}-${palette.name}`);
    generatePaletteStyle(attach, palette);
  }
}
