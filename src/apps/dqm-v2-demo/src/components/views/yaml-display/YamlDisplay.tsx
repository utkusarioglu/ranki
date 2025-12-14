import type { FC } from "react";
import hljs from "highlight.js";
import yamlLang from "highlight.js/lib/languages/yaml";
import yaml from "yaml";
import style from "./YamlDisplay.module.css";

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
    <pre className={style.pre}>
      <code
        dangerouslySetInnerHTML={{
          __html: highlighted,
        }}
      />
    </pre>
  );
};
