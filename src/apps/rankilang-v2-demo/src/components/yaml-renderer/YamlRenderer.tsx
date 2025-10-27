import type { FC } from "react";
import style from "./yaml-renderer.module.css";
import yaml from "yaml";
import "./prism-atom-dark.css";
import Prism from "prismjs";
import { crawl } from "../output/custom-tab-utils.mts";
import "prismjs/components/prism-yaml.js";

interface YamlRendererProps {
  parsed: any | null; // !FIX any
  customPath: string;
}

export const YamlRenderer: FC<YamlRendererProps> = ({ parsed, customPath }) => {
  const yamlStr = yaml.stringify(crawl(parsed, customPath));
  const highlighted = Prism.highlight(
    yamlStr,
    Prism.languages.yaml,
    "javascript",
  );
  return (
    <pre className={style.outputPre}>
      <code
        className="language-yaml"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </pre>
  );
};
