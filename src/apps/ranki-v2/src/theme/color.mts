import type {
  ColorFormat,
  ColorLevel,
  Palette,
  PaletteSpecs,
} from "../config/config.types.mts";
import { PALETTE_PREFIX } from "./design.constants.mts";

type Rgb = [number, number, number];

function hslToRgb(h: number, s: number, l: number): Rgb {
  s /= 100;
  l /= 100;

  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  const r = Math.round(255 * f(0));
  const g = Math.round(255 * f(8));
  const b = Math.round(255 * f(4));

  return [r, g, b];
}

function rgbToHex([r, g, b]: Rgb): string {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function rgbToRgbCsv(rgb: Rgb): string {
  return rgb.join(", ");
}

function generatePalette({
  saturation,
  lightness,
  hues,
}: PaletteSpecs): Palette {
  const palette: Palette = {};

  for (const [name, hue] of Object.entries(hues)) {
    palette[name] = {} as Record<ColorLevel, Record<ColorFormat, string>>;

    for (const [level, l] of lightness.entries()) {
      palette[name][level] = {} as Record<ColorFormat, string>;

      const rgb = hslToRgb(hue, saturation[level], l);
      palette[name][level]["hex"] = rgbToHex(rgb);
      palette[name][level]["rgb-csv"] = rgbToRgbCsv(rgb);
    }
  }

  palette["tone"] = {} as Record<ColorLevel, Record<ColorFormat, string>>;
  for (const [level, l] of Object.entries(lightness)) {
    palette["tone"][level] = {} as Record<ColorFormat, string>;
    const rgb = hslToRgb(0, 0, l);
    palette["tone"][level as ColorLevel]["hex"] = rgbToHex(rgb);
    palette["tone"][level as ColorLevel]["rgb-csv"] = rgbToRgbCsv(rgb);
  }

  return palette;
}

function generatePaletteVariables(s: PaletteSpecs) {
  const p = generatePalette(s);
  const vars = Object.entries(p)
    .map(([color, hues]) =>
      Object.entries(hues).map(([level, formats]) =>
        Object.entries(formats).map(([format, value]) => [
          `--palette-${color}-${level}-${format}`,
          value,
        ]),
      ),
    )
    .flat()
    .flat();
  const staticColors = [
    ["--palette-tone-dark-hex", "#000"],
    ["--palette-tone-dark-rgb-csv", "0, 0, 0"],
    ["--palette-tone-bright-hex", "#FFF"],
    ["--palette-tone-bright-rgb-csv", "255, 255, 255"],
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
  style.className = PALETTE_PREFIX;
  style.innerHTML = html;
  attach.appendChild(style);
}
