import yaml from "yaml";

import type { ConsoleBatchLoggerPrinterFunc } from "../log-drivers/console-batch/console-batch.types.mjs";
import type { LogValue } from "_/o11y/log/ranki-logging.types.mjs";

function summaryLine(values: LogValue[], elapsed: number) {
  return [
    values.length,
    "entries since",
    new Date(elapsed / 1e6).toTimeString(),
  ].join(" ");
}

export const yamlRow: ConsoleBatchLoggerPrinterFunc = (values, elapsed) => {
  console.log(summaryLine(values, elapsed));
  values.forEach((a) => {
    console.log(yaml.stringify(a));
  });
};

export const consoleLogRow: ConsoleBatchLoggerPrinterFunc = (
  values,
  elapsed,
) => {
  console.log(summaryLine(values, elapsed));
  values.forEach((v) => {
    console.log(v);
  });
};
