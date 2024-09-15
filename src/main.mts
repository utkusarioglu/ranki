import "./style/main.scss";
import "./error-handling.mts";
import { getRanki } from "./config/config.mts";
import type { RankiRequiredProps } from "./config/config.types.mts";
import { Observer } from "./observer.mts";

// function runEval() {
//   console.log("eval");
//   const feat = ranki.content["JsFeatures-Object"]
//     .replace("&lt;", "<")
//     .replace("&gt;", ">");
//   console.log(feat);
//   if (feat) {
//     eval(feat);
//   }
// }

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

  new Observer("div.ranki-root").observe();
}

main();
