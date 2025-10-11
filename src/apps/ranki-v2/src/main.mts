import yaml from "yaml";
import { populate } from "./populate.mts";
import { parserPlugins } from "./plugins.mts";
// @ts-expect-error this doesn't exist anymore, so...
import { createContext } from "@ranki/package-rankilang-v2";
import Prism from "prismjs";
import "./global.css";
import "./prism-atom-dark.css";
// import "prismjs/themes/prism-ghcolors.css";

// Make sure to import the language(s) you need
import "prismjs/components/prism-yaml.js";

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
  const context = createContext(config, parserPlugins);

  const target = document.querySelector(".ranki-root");
  if (!target) {
    throw new Error("cannot find root");
  }
  for (const field of fields) {
    const parsed = context.methods.parser({ frameType: "null" })(
      context,
      field.innerText,
    );
    const yamlStr = yaml.stringify(parsed);
    const highlighted = Prism.highlight(
      yamlStr,
      Prism.languages.yaml,
      "javascript",
    );
    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.className = "language-yaml";
    code.innerHTML = highlighted;
    pre.appendChild(code);
    target.appendChild(pre);
  }
}

populate();
main();
