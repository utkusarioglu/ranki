import type { HudProps } from "../hud.types.mts";

export function createParserFeature(props: HudProps, attach: HTMLElement) {
  const parser = document.createElement("anki-hud");
  parser.classList.add("parser");
  parser.classList.add("outer-padding");
  parser.classList.add("curved-1");
  parser.classList.add("fill-1");
  const version = document.createElement("anki-hud");
  version.classList.add("version");
  version.classList.add("fill-2");
  version.classList.add("curved-2");
  version.classList.add("half-padding");
  version.innerText = props.parser.parseMode;
  parser.appendChild(version);
  if (props.parser.hasReplacements) {
    const replacements = document.createElement("anki-hud");
    replacements.classList.add("has-replacements");
    replacements.classList.add("half-padding");
    replacements.classList.add("smaller");
    replacements.innerText = "{Δ}";
    parser.appendChild(replacements);
  }
  attach.appendChild(parser);
}
