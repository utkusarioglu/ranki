import yaml from "yaml";
import { Command } from "commander";
import { ast } from "./dqm.mjs";
import { readFiles } from "./read-files.mjs";
import { DEFAULT_RAW, DEFAULT_CONFIG } from "./constants.mjs";

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
      const fields = files.config.modes.ast.fields;
      const filter = Object.fromEntries(
        (options.fields.split(",") as string[]).map((f) => [f, fields[f]]),
      );
      const sanitized = ast(files.raw, filter);
      if (!options.print) {
        return console.log("`ast` ran with no errors");
      }
      console.log(yaml.stringify(sanitized));
    });

  program.parse(process.argv);
}

main();
