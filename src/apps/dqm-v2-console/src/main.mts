import { Command } from "commander";
import { debugCall } from "./dqm.mjs";
import { readFiles } from "./read-files.mjs";
import {
  configOption,
  fieldsOption,
  outOption,
  inputOption,
  logOption,
  formatOption,
} from "./options.mjs";
import {
  getFilters,
  handleOut,
  handleFormat as handleFormat,
  handleLog,
} from "./features.mjs";

function main() {
  const program = new Command();

  program.name("dqm-v2-console").description("DqmV2 console tool");

  ["ast", "cpx", "cps", "tcpx", "tcps", "trn", "ser"].forEach((t) => {
    program
      .command(t)
      .description(`Work with ${t.toUpperCase()} data`)
      .addOption(logOption)
      .addOption(formatOption)
      .addOption(inputOption)
      .addOption(configOption)
      .addOption(fieldsOption)
      .addOption(outOption)
      .action((options) => {
        const files = readFiles(options);
        const filter = getFilters(files.config.modes[t], options.fields);
        const callKey = t as keyof typeof debugCall;
        const sanitized = debugCall[callKey](files.raw, filter);
        const formatted = handleFormat(sanitized, options);
        handleLog(formatted, options);
        handleOut(formatted, options);
      });
  });

  program.parse(process.argv);
}

main();
