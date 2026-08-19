import { consoleBatchLogDriver, lokiLogDriver } from "_/o11y/log.mjs";
import { geometry } from "_controllers/geometry/geometry.mjs";

geometry.configure({
  observability: {
    log: {
      enabled: true,
      drivers: [consoleBatchLogDriver, lokiLogDriver],
    },
    trace: {
      enabled: true,
    },
    metrics: {
      enabled: true,
    },
    debug: {
      enabled: true,
      // sequencer: {
      //   stutter: 1000,
      // },
    },
  },
});
