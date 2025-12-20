import type { FC } from "react";
import hljs from "highlight.js";
import yamlLang from "highlight.js/lib/languages/yaml";
import yaml from "yaml";
import style from "./YamlDisplay.module.css";
import { DqmDemoError } from "../../../errors/dqm-demo-error.mts";

hljs.registerLanguage("yaml", yamlLang);

interface YamlDisplayProps {
  obj: Record<string, any>;
}

export const YamlDisplay: FC<YamlDisplayProps> = ({ obj }) => {
  let code = "";
  try {
    code = yaml.stringify(obj);
  } catch (e) {
    throw new DqmDemoError({
      code: "PARSE_FAIL",
      why: "Yaml parse failed for a node",
      cause: e,
      details: {
        obj,
      },
    });
  }
  const highlighted = hljs.highlight(code, {
    language: "yaml",
  }).value;

  return (
    <pre className={style.pre}>
      <code
        dangerouslySetInnerHTML={{
          __html: highlighted,
        }}
      />
    </pre>
  );
};
