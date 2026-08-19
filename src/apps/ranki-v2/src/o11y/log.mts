import { serialize } from "./log-drivers/stringify.mjs";
import { ConsoleBatchLogDriver } from "./log-drivers/console-batch/console-batch.mjs";
import { LokiLogDriver } from "./log-drivers/loki/loki.mjs";
import yaml from "yaml";

export const consoleBatchLogDriver = new ConsoleBatchLogDriver({
  printer: (v, e) => {
    console.log(
      [v.length, "entries since", new Date(e).toTimeString()].join(" "),
    );
    v.forEach((a) => {
      console.log(yaml.stringify(serialize(a)));
    });
  },
});

export const lokiLogDriver = new LokiLogDriver();
