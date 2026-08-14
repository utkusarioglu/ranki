import "./o11y/trace.mjs";
import "./o11y/log.mjs";
import "./error/listeners.mjs";
import "_components/registry.mjs";

if (!document.querySelector("r2-app")) {
  document.body.appendChild(document.createElement("r2-app"));
}
