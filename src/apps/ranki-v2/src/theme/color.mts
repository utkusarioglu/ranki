import type {
  ColorLevel,
  Palette,
  PaletteSpecs,
} from "../config/config.types.mts";

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  const r = Math.round(255 * f(0));
  const g = Math.round(255 * f(8));
  const b = Math.round(255 * f(4));

  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function generatePalette({
  saturation,
  lightness,
  hues,
}: PaletteSpecs): Palette {
  const palette: Palette = {};

  for (const [name, hue] of Object.entries(hues)) {
    palette[name] = {} as Record<ColorLevel, string>;

    for (const [level, l] of Object.entries(lightness)) {
      palette[name][level as ColorLevel] = hslToHex(hue, saturation, l);
    }
  }

  palette["tone"] = {} as Record<ColorLevel, string>;
  for (const [level, l] of Object.entries(lightness)) {
    palette["tone"][level as ColorLevel] = hslToHex(0, 0, l);
  }

  return palette;
}

function generatePaletteVariables(s: PaletteSpecs) {
  const p = generatePalette(s);
  const vars = Object.entries(p)
    .map(([color, hues]) =>
      Object.entries(hues).map(([level, hex]) => [
        `--palette-${color}-${level}-hex`,
        hex,
      ]),
    )
    .flat();
  const staticColors = [
    ["--palette-tone-dark-hex", "#000"],
    ["--palette-tone-bright-hex", "#FFF"],
  ];
  vars.push(...staticColors);
  const id = "palette-" + s.name;
  return [`:root.${id} {`, ...vars.map(([n, v]) => `  ${n}: ${v};`), "}"].join(
    "\n",
  );
}

export function generatePaletteStyle(attach: HTMLElement, s: PaletteSpecs) {
  const html = generatePaletteVariables(s);
  const style = document.createElement("style");
  style.id = s.name;
  style.innerHTML = html;
  attach.appendChild(style);
}
