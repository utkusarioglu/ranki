import "./o11y/otel.mjs";
import "_components/registry.mjs";
import type { RankiAppError } from "_error/ranki-app-error.mjs";

window.addEventListener("error", (e) => {
  e.preventDefault();
  try {
    console.error((e as unknown as RankiAppError).toExtendedJSON());
  } catch (_e: unknown) {
    console.error(e);
  }
});

window.addEventListener("unhandledrejection", (e) => {
  e.preventDefault();
  try {
    console.error(e.reason.toExtendedJSON());
  } catch (_e: unknown) {
    console.error(e);
  }
});

if (!document.querySelector("r2-app")) {
  document.body.appendChild(document.createElement("r2-app"));
}
