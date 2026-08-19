import yaml from "yaml";
import type { ConsoleBatchLoggerPrinterFunc } from "./console-batch.types.mjs";
import { sanitize } from "../utils/sanitize.utils.mjs";

export const yamlPrinter: ConsoleBatchLoggerPrinterFunc = (v, e) => {
  console.log(
    [v.length, "entries since", new Date(e).toTimeString()].join(" "),
  );
  v.forEach((a) => {
    console.log(yaml.stringify(sanitize(a)));
  });
};
