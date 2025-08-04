import { Plugins } from "@ranki/package-plugins";
import pluginDom from "@ranki/plugin-dom";
import yaml from "yaml";
import { parse } from "@ranki/package-parser";
import { validate } from "@ranki/package-validator";
import { render } from "@ranki/package-renderer";
import { transform } from "@ranki/package-transformer";

function populate() {
  document.querySelector<HTMLScriptElement>(
    "script.ranki-field.a",
  )!.innerHTML = `
%%%
cat

# bunny _cat_

meow meow

:::pre
dog
sdf
/rrrr/
:::
  `;
  document.querySelector<HTMLScriptElement>(
    "script.ranki-field.b",
  )!.innerHTML = `normal text`;
}

async function main() {
  const htmlConfig = document.querySelector(
    "script#ranki-config",
  ) as HTMLDataElement;
  if (!htmlConfig) {
    throw new Error("Cannot find ranki config data element");
  }
  const config = yaml.parse(htmlConfig.innerText);
  const fields = document.querySelectorAll<HTMLDataElement>(
    'script[class^="ranki-field"]',
  );

  const plugins = new Plugins();
  plugins.register(pluginDom);

  const target = document.querySelector(".ranki-root");
  if (!target) {
    throw new Error("cannot find root");
  }
  for (const field of fields) {
    const parsed = await parse(field.innerText, plugins, config.tokens);
    const validated = await validate(parsed);
    const transformed = await transform(validated);
    const rendered = await render(transformed);

    target.appendChild(rendered.rendered.element);
  }
}

populate();
main();
