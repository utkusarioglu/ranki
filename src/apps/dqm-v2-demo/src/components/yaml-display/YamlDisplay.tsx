import { Pre, Code } from "@blueprintjs/core";
import type { FC } from "react";
import hljs from "highlight.js";
import yamlLang from "highlight.js/lib/languages/yaml";
import yaml from "yaml";

hljs.registerLanguage("yaml", yamlLang);

interface YamlDisplayProps {
  obj: Record<string, any>;
}

export const YamlDisplay: FC<YamlDisplayProps> = ({ obj }) => {
  const code = yaml.stringify(obj);
  const highlighted = hljs.highlight(code, {
    language: "yaml",
  }).value;

  return (
    <Pre>
      <Code
        dangerouslySetInnerHTML={{
          __html: highlighted,
        }}
      />
    </Pre>
  );
};
