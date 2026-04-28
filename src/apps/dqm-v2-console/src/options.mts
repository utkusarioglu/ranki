import { Option } from "commander";
import { DEFAULT_RAW, DEFAULT_CONFIG } from "./constants.mjs";

export const formatOption = new Option("--format <type>", "Output format")
  .default("json")
  .choices(["json", "yaml", "yaml-extended", "json-pretty"]);

export const logOption = new Option("--log", "Log the output to screen");

export const inputOption = new Option(
  "--in <path>",
  "Raw dqm file to process",
).default(DEFAULT_RAW);

export const configOption = new Option(
  "--config <path>",
  "Custom config file path",
).default(DEFAULT_CONFIG);

export const fieldsOption = new Option(
  "--fields <value>",
  "Pick fields to display. Fields are defined in the config file",
).default("default");

export const outOption = new Option(
  "--out <path>",
  "Pipe the output to a file",
).default("");
