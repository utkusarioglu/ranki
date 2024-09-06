import { getRanki } from "./config/config.mts";
import { Dom } from "./dom/dom.mts";

function globalErrorHandler(e: ErrorEvent) {
  e.preventDefault();
  const ranki = getRanki();
  const dom = new Dom(document.body, ranki);
  dom.renderError(e.error.message, e.error.stack);
  console.error(e);
}

window.addEventListener("error", globalErrorHandler);
