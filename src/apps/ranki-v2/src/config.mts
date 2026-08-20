import { consoleBatchLogDriver, lokiLogDriver } from "_/o11y/log.mjs";
import { geometry } from "_controllers/geometry/geometry.mjs";

const enabled = true;

geometry.configure({
  observability: {
    log: {
      enabled,
      drivers: [consoleBatchLogDriver, lokiLogDriver],
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
