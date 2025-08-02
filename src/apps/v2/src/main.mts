import { Plugins } from "@ranki/package-plugins";
// import { stringify } from "yaml";
import { parse } from "@ranki/package-parser";

const plugins = new Plugins();

const raw = `
%%%
debug

::: hello
aa
:::
`;
const parsed = parse(raw, plugins);
const validated = plugins.getValidator("tag")(parsed);
const rendered = plugins.getRenderer("tag")(validated);

const target = document.querySelector(".ranki-root");
if (!target) {
  throw new Error("cannot find root");
}
target.appendChild(rendered.element);
