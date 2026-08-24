import "./bootstrap/polyfills.mjs";
import "./error/listeners.mjs";
import "./config.mjs";
import "./store/app.mjs";
import "_components/registry.mjs";

if (!document.querySelector("r2-app")) {
  document.body.appendChild(document.createElement("r2-app"));
}
