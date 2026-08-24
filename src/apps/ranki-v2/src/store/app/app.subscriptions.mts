import { createAppConfig } from "_config/app/app.mjs";
import { appStore } from "./app.mjs";
import type { RawFields } from "_collect/collect.types.mjs";
import { collectConfig } from "_config/config.mjs";
import { collectRaw } from "_collect/collect.mjs";
import { onReady, shouldRender } from "_/bootstrap/startup.mjs";

appStore.subscribe(
  (s) => s.config,
  (config) => {
    const raw = appStore.getState().raw as RawFields;
    appStore.setState({
      state: config === null ? null : createAppConfig(config, raw),
    });
  },
);

appStore.subscribe(
  (s) => s.raw,
  () => {
    const raw = appStore.getState().raw;
    appStore.setState({ config: raw === null ? null : collectConfig(raw) });
  },
);

appStore.subscribe(
  (s) => s.epoch,
  async () => {
    const raw = await collectRaw();
    appStore.setState({ raw });
  },
);

onReady(() => {
  const should = shouldRender();
  appStore.setState({
    epoch: Date.now(),
    shouldRender: should,
  });
});
