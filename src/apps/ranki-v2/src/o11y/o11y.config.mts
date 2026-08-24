import { basicRepresentation } from "./sanitizers/sorted-stringified.mjs";
import yaml from "yaml";
import { objectSorter } from "./formatters/object-sorter.mjs";
import { consoleLogRow, yamlRow } from "./printers/printers.mjs";
import { ConsoleBatchLogDriver } from "./log-drivers/console-batch/console-batch.mjs";
import { FileBatchLogDriver } from "./log-drivers/file-batch/file-batch.mjs";
import { LokiLogDriver } from "./log-drivers/loki/loki.mjs";
import { RankiO11y } from "./o11y.mjs";

RankiO11y.configure({
  debug: {
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
  processors: {
    sanitizers: {
      basicRepresentation,
    },
    formatters: {
      objectSorter,
    },
    stringifiers: {
      jsonOneLine: (v) => JSON.stringify(v),
      jsonMultiLine: (v) => JSON.stringify(v, null, 2),
      yaml: (v) => yaml.stringify(v),
    },
  },
  printers: {
    yamlRow,
    consoleLogRow,
  },
});
