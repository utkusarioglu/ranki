import yaml from "yaml";
import { Command, Option } from "commander";
import { ast, cps, cpx, tcpx, trn, tcps } from "./dqm.mjs";
import { readFiles } from "./read-files.mjs";
import { DEFAULT_RAW, DEFAULT_CONFIG } from "./constants.mjs";

function getFilters(sectionConfig: any, fieldsOption: any) {
  const fields = sectionConfig.fields;
  const filter = Object.fromEntries(
    (fieldsOption.split(",") as string[]).map((f) => [f, fields[f]]),
  );
  return filter;
}

function handlePrint(value: any, isPrint: boolean) {
  if (!isPrint) {
    return console.log("`ast` ran with no errors");
  }
  console.log(yaml.stringify(value));
}

function main() {
  const program = new Command();

  program.name("dqm-v2-console").description("DqmV2 console tool");

  const printOption = new Option("--print", "Print AST to console");
  const rawOption = new Option(
    "--raw <path>",
    "Raw dqm file to process",
  ).default(DEFAULT_RAW);
  const configOption = new Option(
    "--config <path>",
    "Custom config file path",
  ).default(DEFAULT_CONFIG);
  const fieldsOption = new Option(
    "--fields <value>",
    "Pick fields to display. Fields are defined in the config file",
  ).default("default");

  program
    .command("ast")
    .description("Work with AST data")
    .addOption(printOption)
    .addOption(rawOption)
    .addOption(configOption)
    .addOption(fieldsOption)
    .action((options) => {
      const files = readFiles(options.raw, options.config);
      const filter = getFilters(files.config.modes.ast, options.fields);
      const sanitized = ast(files.raw, filter);
      handlePrint(sanitized, options.print);
    });

  program
    .command("cpx")
    .description("Work with CPX data")
    .addOption(printOption)
    .addOption(rawOption)
    .addOption(configOption)
    .addOption(fieldsOption)
    .action((options) => {
      const files = readFiles(options.raw, options.config);
      const filter = getFilters(files.config.modes.cpx, options.fields);
      const sanitized = cpx(files.raw, filter);
      handlePrint(sanitized, options.print);
    });

  program
    .command("cps")
    .description("Work with CPS data")
    .addOption(printOption)
    .addOption(rawOption)
    .addOption(configOption)
    .addOption(fieldsOption)
    .action((options) => {
      const files = readFiles(options.raw, options.config);
      const filter = getFilters(files.config.modes.cps, options.fields);
      const sanitized = cps(files.raw, filter);
      handlePrint(sanitized, options.print);
    });

  program
    .command("trn")
    .description("Work with TRN data")
    .addOption(printOption)
    .addOption(rawOption)
    .addOption(configOption)
    .addOption(fieldsOption)
    .action((options) => {
      const files = readFiles(options.raw, options.config);
      const filter = getFilters(files.config.modes.trn, options.fields);
      const sanitized = trn(files.raw, filter);
      handlePrint(sanitized, options.print);
    });

  program
    .command("tcpx")
    .description("Work with TCpx data")
    .addOption(printOption)
    .addOption(rawOption)
    .addOption(configOption)
    .addOption(fieldsOption)
    .action((options) => {
      const files = readFiles(options.raw, options.config);
      const filter = getFilters(files.config.modes.tcpx, options.fields);
      const sanitized = tcpx(files.raw, filter);
      handlePrint(sanitized, options.print);
    });

  program
    .command("tcps")
    .description("Work with TCps data")
    .addOption(printOption)
    .addOption(rawOption)
    .addOption(configOption)
    .addOption(fieldsOption)
    .action((options) => {
      const files = readFiles(options.raw, options.config);
      const filter = getFilters(files.config.modes.tcps, options.fields);
      const sanitized = tcps(files.raw, filter);
      handlePrint(sanitized, options.print);
    });

  program.parse(process.argv);
}

main();
