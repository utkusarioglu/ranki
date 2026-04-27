import yaml from "yaml";
import { Command } from "commander";
import { ast, cps, cpx, trn } from "./dqm.mjs";
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

  program
    .command("ast")
    .description("Work with AST data")
    .option("--print", "Print AST to console")
    .option("--raw <path>", "Raw dqm file to process", DEFAULT_RAW)
    .option("--config <path>", "Custom config file path", DEFAULT_CONFIG)
    .option(
      "--fields <value>",
      "Pick fields to display. Fields are defined in the config file",
      "default",
    )
    .action((options) => {
      const files = readFiles(options.raw, options.config);
      const filter = getFilters(files.config.modes.ast, options.fields);
      const sanitized = ast(files.raw, filter);
      handlePrint(sanitized, options.print);
    });

  program
    .command("cpx")
    .description("Work with CPX data")
    .option("--print", "Print CPX to console")
    .option("--raw <path>", "Raw dqm file to process", DEFAULT_RAW)
    .option("--config <path>", "Custom config file path", DEFAULT_CONFIG)
    .option(
      "--fields <value>",
      "Pick fields to display. Fields are defined in the config file",
      "default",
    )
    .action((options) => {
      const files = readFiles(options.raw, options.config);
      const filter = getFilters(files.config.modes.cpx, options.fields);
      const sanitized = cpx(files.raw, filter);
      handlePrint(sanitized, options.print);
    });

  program
    .command("cps")
    .description("Work with CPS data")
    .option("--print", "Print CPS to console")
    .option("--raw <path>", "Raw dqm file to process", DEFAULT_RAW)
    .option("--config <path>", "Custom config file path", DEFAULT_CONFIG)
    .option(
      "--fields <value>",
      "Pick fields to display. Fields are defined in the config file",
      "default",
    )
    .action((options) => {
      const files = readFiles(options.raw, options.config);
      const filter = getFilters(files.config.modes.cps, options.fields);
      const sanitized = cps(files.raw, filter);
      handlePrint(sanitized, options.print);
    });

  program
    .command("trn")
    .description("Work with TRN data")
    .option("--print", "Print CPS to console")
    .option("--raw <path>", "Raw dqm file to process", DEFAULT_RAW)
    .option("--config <path>", "Custom config file path", DEFAULT_CONFIG)
    .option(
      "--fields <value>",
      "Pick fields to display. Fields are defined in the config file",
      "default",
    )
    .action((options) => {
      const files = readFiles(options.raw, options.config);
      const filter = getFilters(files.config.modes.trn, options.fields);
      const sanitized = trn(files.raw, filter);
      handlePrint(sanitized, options.print);
    });

  program.parse(process.argv);
}

main();
