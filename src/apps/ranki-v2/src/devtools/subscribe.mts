import { appStore } from "_store/app/app.mjs";

import { RankiDevtools } from "./devtools.mjs";

const dev = appStore.getState().state?.dev;
RankiDevtools.update(dev);

appStore.subscribe(
  (s) => s.state?.dev,
  (dev) => {
    RankiDevtools.update(dev);
  },
);
