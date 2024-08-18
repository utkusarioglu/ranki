import { Dom } from "./dom.mts";
import type { CustomWindow } from "./types/window.d.mts";

declare var window: CustomWindow;

function globalErrorHandler(e: ErrorEvent) {
  e.preventDefault();
  const dom = new Dom(document.body, window.ranki);
  dom.renderError(e.error.message, e.error.stack);
  console.error(e);
}

window.addEventListener("error", globalErrorHandler);
