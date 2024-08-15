import { Dom } from "./_ranki_dom.js";
import { Observer } from "./_ranki_observer.js";
import { Parser } from "./_ranki_parser.js";
import { rankiDefaults } from "./_ranki_config.js";

console.log("hello");

function globalErrorHandler(e)
{
  e.preventDefault();
  const dom = new Dom(document.body, window.ranki);
  dom.renderError(e.error.message, e.error.stack);
  console.error(e);
}

window.addEventListener("unhandledrejection", globalErrorHandler);
window.addEventListener("error", globalErrorHandler);

window.ranki = {
  ...rankiDefaults,
  ...window.ranki,
};

function checkParams(ranki)
{
  if (!ranki) {
    throw new Error("`window.ranki` is not defined");
  }

  const REQUIRED_RANKI_PROPS = ["version", "features", "card", "content"];
  const allDefined = REQUIRED_RANKI_PROPS
    .every((prop) => ranki[prop] !== undefined);

  if (!allDefined) {
    throw new Error("`window.ranki` aren't all defined.");
  }
}

function main(ranki)
{
  checkParams(ranki);

  const parser = new Parser(ranki);
  new Observer("div.ranki-root", parser, ranki).observe();
}

main(window.ranki);
