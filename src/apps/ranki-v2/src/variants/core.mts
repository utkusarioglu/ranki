import "../bootstrap/polyfills.mjs";
import "_error/listeners.mjs";
import "../config.mjs";
import "_store/app/app.mjs";
import "_components/registry.mjs";

if (!document.querySelector("r2-app")) {
  document.body.appendChild(document.createElement("r2-app"));
}
