import anki from "./vendor-anki.css?inline";
import schemes from "./schemes.css?inline";
import palettes from "./palettes.css?inline";
import variables from "./variables.css?inline";
import theme from "./theme.css?inline";
import dqm from "./vendor-dqm.css?inline";
import root from "./ranki-v2-root.css?inline";

const LIST = [
  {
    id: "anki",
    css: anki,
  },
  {
    id: "schemes",
    css: schemes,
  },
  {
    id: "palettes",
    css: palettes,
  },
  {
    id: "variables",
    css: variables,
  },
  {
    id: "theme",
    css: theme,
  },
  {
    id: "dqm",
    css: dqm,
  },
  {
    id: "dqm",
    css: root,
  },
];

export function setStyles() {
  LIST.forEach(({ id, css }) => {
    const c = document.createElement("style");
    c.id = id;
    c.innerHTML = css;
    document.head.appendChild(c);
  });
}
