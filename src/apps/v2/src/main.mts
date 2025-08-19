import { Plugins } from "@ranki/package-plugins";
import pluginDom from "@ranki/plugin-dom";
import pluginRoot from "@ranki/plugin-root";
import yaml from "yaml";
import { parse, createActions, produceGrammar } from "@ranki/package-parser";
import { validate } from "@ranki/package-validator";
import { render } from "@ranki/package-renderer";
import { transform } from "@ranki/package-transformer";
import type { RankiContext } from "@ranki/package-api";

function populate() {
  document.querySelector<HTMLScriptElement>(
    "script.ranki-field.a",
  )!.innerHTML = `
%%%
cat

# bunny _cat_

meow meow

:::pre; asdfs :::

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
  [pluginRoot, pluginDom].forEach((p) => plugins.register(p));

  const documentParser = await plugins.getParser("document");
  const directive = await plugins.getParser("directive");
  const rootParsers = {
    document: documentParser,
    directive,
  };

  const context: RankiContext = {
    plugins,
    config,
    root: {
      parsers: rootParsers,
    },
    language: {
      createActions,
      produceGrammar,
    },
  };

  const target = document.querySelector(".ranki-root");
  if (!target) {
    throw new Error("cannot find root");
  }
  for (const field of fields) {
    const parsed = await parse(field.innerText, context);
    const validated = await validate(parsed, context);
    const transformed = await transform(validated, context);
    const rendered = await render(transformed, context);
    rendered.rendered.forEach((r) => {
      target.appendChild(r.element);
    });
  }
}

populate();
main();
