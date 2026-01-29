import anki from "./vendor-anki.css?inline";
import schemes from "./schemes.css?inline";
import palettes from "./palettes.css?inline";
import variables from "./variables.css?inline";
import theme from "./theme.css?inline";
import dqm from "./vendor-dqm.css?inline";

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
];

export function setStyles() {
  LIST.forEach(({ id, css }) => {
    let s = document.head.querySelector(`style#${id}`);
    if (s) {
      return;
    }
    s = document.createElement("style");
    s.id = id;
    s.innerHTML = css;
    document.head.appendChild(s);
  });
}
