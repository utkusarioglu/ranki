import yaml from "yaml";

import { objectSorter } from "./formatters/object-sorter.mjs";
import { ConsoleBatchLogDriver } from "./log-drivers/console-batch/console-batch.mjs";
import { FileBatchLogDriver } from "./log-drivers/file-batch/file-batch.mjs";
import { LokiLogDriver } from "./log-drivers/loki/loki.mjs";
import { RankiO11y } from "./o11y.mjs";
import { consoleLogRow, yamlRow } from "./printers/printers.mjs";
import { basicRepresentation } from "./sanitizers/sorted-stringified.mjs";

RankiO11y.configure({
  devtools: {
    drivers: {
      consoleBatch: ConsoleBatchLogDriver,
      fileBatch: FileBatchLogDriver,
    },
  },
  log: {
    drivers: {
      consoleBatch: ConsoleBatchLogDriver,
      fileBatch: FileBatchLogDriver,
      loki: LokiLogDriver,
    },
  },
  printers: {
    consoleLogRow,
    yamlRow,
  },
  processors: {
    formatters: {
      objectSorter,
    },
    sanitizers: {
      basicRepresentation,
    },
    stringifiers: {
      jsonMultiLine: (v) => JSON.stringify(v, null, 2),
      jsonOneLine: (v) => JSON.stringify(v),
      yaml: (v) => yaml.stringify(v),
    },
  },
});
