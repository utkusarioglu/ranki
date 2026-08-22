if (import.meta.env.MODE === "observable") {
  import("./o11y/o11y.mjs"); //here
}
import "./error/listeners.mjs";
import "./config.mjs";
import "_components/registry.mjs";

if (!document.querySelector("r2-app")) {
  document.body.appendChild(document.createElement("r2-app"));
}
