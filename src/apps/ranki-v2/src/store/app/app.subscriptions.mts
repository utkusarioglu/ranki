import type { RawFields } from "_collect/collect.types.mjs";

import { Collect } from "_collect/collect.mjs";
import { AppConfig } from "_config/app/app.mjs";
import { Config } from "_config/config.mjs";

import { appStore } from "./app.mjs";

appStore.subscribe(
  (s) => s.config,
  (config) => {
    const raw = appStore.getState().raw as RawFields;
    appStore.setState({
      state: AppConfig.create(config, raw),
      // state: config === null ? null : createAppConfig(config, raw),
    });
  },
);

appStore.subscribe(
  (s) => s.raw,
  (raw) => {
    appStore.setState({ config: Config.collect(raw) });
  },
);

appStore.subscribe(
  (s) => s.epoch,
  async () => {
    const raw = await Collect.template();
    appStore.setState({ raw });
  },
);
