import { Dom } from "./_ranki_dom.mjs";
import { type CustomWindow } from "./types/window.mjs";

declare var window: CustomWindow;

function globalErrorHandler(e: ErrorEvent) {
  e.preventDefault();
  const dom = new Dom(document.body, window.ranki);
  dom.renderError(e.error.message, e.error.stack);
  console.error(e);
}

window.addEventListener("error", globalErrorHandler);
