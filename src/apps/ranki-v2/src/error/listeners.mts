import type { RankiAppError } from "_error/ranki-app-error.mjs";

function errorCallback(e: ErrorEvent | PromiseRejectionEvent) {
  e.preventDefault();
  if (Object.hasOwn(e, "toExtendedJSON")) {
    console.error((e as unknown as RankiAppError).toExtendedJSON());
  } else {
    console.error(e);
  }
}

window.addEventListener("error", errorCallback);
window.addEventListener("rejectionhandled", errorCallback);
window.addEventListener("unhandledrejection", errorCallback);
