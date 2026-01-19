import type { RankiAppConfig } from "../config/config.types.mts";
import { assertExists } from "../error/assertions.mts";
import { generatePaletteStyle } from "./color.mts";

const GENERATED_PREFIX = "generated";
const SCHEME_PREFIX = "scheme";
const THEME_PREFIX = "theme";
const PALETTE_PREFIX = "palette";
const REMOVED = [SCHEME_PREFIX, THEME_PREFIX];

export function createDesign(
  document: Document,
  // root: HTMLElement,
  // attach: HTMLElement,
  config: RankiAppConfig,
) {
  const root = document.documentElement;
  const attach = document.body;
  root.style.setProperty(
    "--transition-duration",
    config.design.animationDuration,
  );

  if (config.face === "Q") {
    document.body.style.setProperty(
      "transition-property",
      "var(--transition-property)",
      "important",
    );
  } else {
    document.body.style.setProperty("transition-property", "none", "important");
  }
  document.body.style.setProperty(
    "transition-duration",
    "var(--transition-duration)",
    "important",
  );
  // const root = document.documentElement;
  const n = config.design.palette;
  root.className = [
    ...root.className
      .split(" ")
      .filter((n) => !REMOVED.some((r) => n.startsWith(r))),
    `${SCHEME_PREFIX}-${config.design.scheme}`,
    `${THEME_PREFIX}-${config.design.theme}`,
  ].join(" ");

  if (n.startsWith(GENERATED_PREFIX)) {
    // const target = document.body;
    if (attach.querySelector("#" + n)) {
      return;
    }
    const palette = config.palettes.find(({ name }) => n === name);
    assertExists(palette, {
      why: "Custom palette requires paletteSpecs to be defined",
    });

    document.documentElement.classList.add(`${PALETTE_PREFIX}-${palette.name}`);
    generatePaletteStyle(attach, palette);
  }
}
