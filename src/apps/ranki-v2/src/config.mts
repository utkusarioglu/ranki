import { batchLogger } from "_/o11y/log.mjs";
import { geometry } from "_controllers/geometry/geometry.mjs";

geometry.configure({
  observability: {
    log: {
      drivers: [batchLogger],
    },
    // debug: {
    //   sequencer: {
    //     stutter: 1000,
    //   },
    // },
  },
});
