import { RankiLogging } from "_/o11y/log.mjs";
import { geometry } from "_controllers/geometry/geometry.mjs";

const enabled = true;

geometry.configure({
  observability: {
    log: {
      enabled,
      drivers: RankiLogging.getDrivers(),
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
