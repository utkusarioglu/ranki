import yaml from "yaml";
import { Command, Option } from "commander";
import { debugCall } from "./dqm.mjs";
import { readFiles } from "./read-files.mjs";
import { DEFAULT_RAW, DEFAULT_CONFIG } from "./constants.mjs";

function getFilters(sectionConfig: any, fieldsOption: any) {
  const fields = sectionConfig.fields;
  const filter = Object.fromEntries(
    (fieldsOption.split(",") as string[]).map((f) => [f, fields[f]]),
  );
  return filter;
}

function handlePrint(
  value: any,
  isJson: boolean,
  isYaml: boolean,
  isYamlExtended: boolean,
) {
  if (isYamlExtended) {
    return console.log(yaml.stringify(JSON.parse(JSON.stringify(value))));
  }
  if (isYaml) {
    return console.log(yaml.stringify(value));
  }
  if (isJson) {
    return console.log(JSON.stringify(value, null, 2));
  }
  return console.log("Run completed");
}

function main() {
  const program = new Command();

  program.name("dqm-v2-console").description("DqmV2 console tool");

  const yamlOption = new Option("--yaml", "Print yaml to console");
  const yamlExtendedOption = new Option(
    "--yaml-extended",
    "Print yaml to console",
  );
  const jsonOption = new Option("--json", "Print json to console");
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

  ["ast", "cpx", "cps", "tcpx", "tcps", "trn", "ser"].forEach((t) => {
    program
      .command(t)
      .description(`Work with ${t.toUpperCase()} data`)
      .addOption(yamlOption)
      .addOption(yamlExtendedOption)
      .addOption(jsonOption)
      .addOption(rawOption)
      .addOption(configOption)
      .addOption(fieldsOption)
      .action((options) => {
        const files = readFiles(options.raw, options.config);
        const filter = getFilters(files.config.modes[t], options.fields);
        const tt = t as keyof typeof debugCall;
        const sanitized = debugCall[tt](files.raw, filter);
        handlePrint(
          sanitized,
          options.json,
          options.yaml,
          options.yamlExtended,
        );
      });
  });

  program.parse(process.argv);
}

main();
