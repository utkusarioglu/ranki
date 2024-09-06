import "./style/main.scss";
import "./error-handling.mts";
import { getRanki } from "./config/config.mts";
import type { RankiRequiredProps } from "./types/ranki.d.mts";
import { Observer } from "./observer.mts";
import { Parser } from "./parser/parser.mts";

function checkParams() {
  const ranki = getRanki();
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

function main() {
  checkParams();

  // const parser = new Parser(ranki);
  new Observer("div.ranki-root").observe();
}

main();
