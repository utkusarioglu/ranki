import type { FC } from "react";

import hljs from "highlight.js";
import yamlLang from "highlight.js/lib/languages/yaml";
import yaml from "yaml";

import { DqmDemoError } from "../../../errors/dqm-demo-error.mts";
import style from "./YamlDisplay.module.css";

hljs.registerLanguage("yaml", yamlLang);

interface YamlDisplayProps {
  obj: Record<string, any> | string;
  padded?: boolean;
}

export const YamlDisplay: FC<YamlDisplayProps> = ({ obj, padded = true }) => {
  let code = "";
  if (typeof obj !== "string") {
    try {
      code = yaml.stringify(obj);
    } catch (e) {
      throw new DqmDemoError({
        cause: e,
        code: "PARSE_FAIL",
        why: "Yaml parse failed for a node",
        // details: {
        //   obj,
        // },
      });
    }
  } else {
    code = obj;
  }

  const highlighted = hljs.highlight(code, {
    language: "yaml",
  }).value;

  return (
    <pre
      className={[style.pre, padded && style.padded]
        .filter((v) => !!v)
        .join(" ")}
    >
      <code
        dangerouslySetInnerHTML={{
          __html: highlighted,
        }}
      />
    </pre>
  );
};
