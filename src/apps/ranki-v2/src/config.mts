import { geometry } from "_controllers/geometry/geometry.mjs";
import { RankiO11y } from "./o11y/o11y.mjs";

const enabled = true;

geometry.configure({
  observability: {
    log: {
      enabled,
      drivers: RankiO11y.log.getDrivers(),
    },
    trace: {
      enabled,
    },
    metrics: {
      enabled,
    },
    debug: {
      enabled,
      // sequencer: {
      //   stutter: 1000,
      // },
    },
  },
});
