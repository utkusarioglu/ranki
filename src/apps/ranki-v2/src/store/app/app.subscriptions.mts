import { Collect } from "_collect/collect.mjs";
import { AppConfig } from "_config/app/app.mjs";
import { ConfigStream } from "_config/stream/config-stream.mjs";

import { appStore } from "./app.mjs";
import { RankiAppError } from "_error/ranki-app-error.mjs";

appStore.subscribe(
  (s) => s.state?.dev.throw,
  (throwSwitch) => {
    if (throwSwitch === true) {
      const state = appStore.getState();
      throw new RankiAppError({
        cause: null,
        code: "INTENTIONAL_ERROR",
        details: {
          state,
        },
        why: "Ranki was explicitly instructed to trigger this error",
      });
    }
  },
);

appStore.subscribe(
  (s) => s.config,
  (collected) => {
    const raw = appStore.getState().raw;
    appStore.setState({
      state: AppConfig.create({ collected, raw }),
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
