import "../bootstrap/polyfills.mjs";
import "_error/listeners.mjs";

import "../config.mjs";
import "_components/registry.mjs";
import { onReady, shouldRender } from "_/bootstrap/startup.mjs";
import { appStore } from "_store/app/app.mjs";

onReady(() => {
  appStore.setState({
    epoch: Date.now(),
    shouldRender: shouldRender(),
  });
});

if (!document.querySelector("r2-app")) {
  document.body.appendChild(document.createElement("r2-app"));
}
