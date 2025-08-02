import * as fs from "node:fs";
import { Plugins } from "@ranki/package-plugins";
import { stringify } from "yaml";
import { parse } from "@ranki/package-parser";

const plugins = new Plugins();

const raw = fs
  .readFileSync("./test/1.ranki")
  .toString()
  .trim()
  .split("\n")
  .slice(1, -1)
  .join("\n");

const parsed = parse(raw, plugins);
const validated = plugins.getValidator("tag")(parsed);
const rendered = plugins.getRenderer("tag")(validated);
console.log(stringify(rendered));
