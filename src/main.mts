import "./style/main.scss";
import "./error-handling.mjs";
import { type CustomWindow } from "./types/window.mjs";
import {
  type RankiRequiredProps,
  type WindowRankiConfig,
} from "./types/ranki.mjs";
import { Observer } from "./observer.mjs";
import { Parser } from "./parser.mjs";
import { rankiDefaults } from "./config.mjs";

declare var window: CustomWindow;

window.ranki = {
  ...rankiDefaults,
  ...window.ranki,
};

function checkParams(ranki: WindowRankiConfig) {
  if (!ranki) {
    throw new Error("`window.ranki` is not defined");
  }

  const REQUIRED_RANKI_PROPS: RankiRequiredProps[] = [
    "version",
    "features",
    "card",
    "content",
  ];

  const allDefined = REQUIRED_RANKI_PROPS.every(
    (prop) => ranki[prop] !== undefined,
  );

  if (!allDefined) {
    throw new Error("`window.ranki` aren't all defined.");
  }
}

function main(ranki: WindowRankiConfig) {
  checkParams(ranki);

  const parser = new Parser(ranki);
  new Observer("div.ranki-root", parser, ranki).observe();
}

main(window.ranki);
