import { Collect } from "_collect/collect.mjs";
import { AppConfig } from "_config/app/app.mjs";
import { ConfigStream } from "_config/stream/config-stream.mjs";

import { appStore } from "./app.mjs";

appStore.subscribe(
  (s) => s.config,
  (config) => {
    const raw = appStore.getState().raw;
    appStore.setState({
      state: AppConfig.create(config, raw),
    });
  },
);

appStore.subscribe(
  (s) => s.raw,
  (raw) => {
    appStore.setState({ config: ConfigStream.collect(raw) });
  },
);

appStore.subscribe(
  (s) => s.epoch,
  async () => {
    const raw = await Collect.template();
    appStore.setState({ raw });
  },
);
