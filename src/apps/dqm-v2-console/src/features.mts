import * as yaml from "yaml";
import fs from "node:fs";
import url from "node:url";
import path from "node:path";

export function getFilters(sectionConfig: any, fieldsOption: any) {
  const fields = sectionConfig.fields;
  const filter = Object.fromEntries(
    (fieldsOption.split(",") as string[]).map((f) => [f, fields[f]]),
  );
  return filter;
}

export function handleFormat(value: any, options: any) {
  switch (options.format) {
    case "json":
      return JSON.stringify(value);
    case "json-pretty":
      return JSON.stringify(value, null, 2);
    case "yaml":
      return yaml.stringify(value);
    case "yaml-extended":
      return yaml.stringify(JSON.parse(JSON.stringify(value)));
    default:
      // TODO this should throw a custom error
      throw new Error(`Unknown type: ${options.format}`);
  }
}

export function handleLog(formatted: string, options: any) {
  if (options.log) {
    console.log(formatted);
  } else {
    console.log("Run completed");
  }
}

export function handleOut(formatted: string, options: any) {
  if (!options.out) {
    return;
  }
  const resolved = path.resolve(options.out);
  const parsed = path.parse(resolved);
  fs.mkdirSync(parsed.dir, { recursive: true });
  fs.writeFileSync(options.out, formatted);
  console.log(`Out: ${resolved}`);
}
