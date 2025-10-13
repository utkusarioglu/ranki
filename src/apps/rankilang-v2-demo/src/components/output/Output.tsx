import type { FC, CSSProperties } from "react";

import { useState } from "react";
// import Prism from "prismjs";
import style from "./output.module.css";
// import yaml from "yaml";
// import "./prism-atom-dark.css";

import { tabs } from "./constants.mts";
// import { crawl } from "./custom-tab-utils.mts";
import { TabButtonContainer } from "../tab/TabButtonContainer";
import { TabButton } from "../tab/TabButton";
import { YamlRenderer } from "../yaml-renderer/YamlRenderer";
import { ComponentRenderer } from "../component-renderer/ComponentRenderer";

interface OutputProps {
  parsed: any | null; // !FIX any
}

export type TabDefinition =
  | {
      type: "exact";
      format: "yaml" | "render";
      name: string;
      path: string;
    }
  | {
      type: "custom";
      format: "yaml" | "render";
      name: string;
      path: "";
    };

export const Output: FC<OutputProps> = ({ parsed }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [customPath, setCustomPath] = useState(tabs[tabIndex].path);

  if (parsed === null) {
    return <p>Nothing yet...</p>;
  }

  if (parsed.error) {
    return (
      <div className={style.errorContainer}>
        <h3 className={[style.errorHeading, "monospace"].join(" ")}>Error</h3>
        <pre>{parsed.error}</pre>
      </div>
    );
  }

  // const yamlStr = yaml.stringify(
  //   JSON.parse(JSON.stringify(crawl(parsed, customPath))),
  // );
  // const highlighted = Prism.highlight(
  //   yamlStr,
  //   Prism.languages.yaml,
  //   "javascript",
  // );

  // <button
  //   key={name}
  //   className={[
  //     style.tabButton,
  //     i === tabIndex && style.tabButtonActive,
  //   ]
  //     .filter((v) => !!v)
  //     .join(" ")}
  //   onClick={}
  // >
  //   {name}
  // </button>
  return (
    <div
      className={[style.component].join(" ")}
      style={
        {
          "--input-height": tabs[tabIndex].type === "custom" ? "3.5em" : "0em",
        } as CSSProperties
      }
    >
      <div className={style.ribbon}>
        <TabButtonContainer>
          {tabs
            .map((t) => t.name)
            .map((name, i) => (
              <TabButton
                key={name}
                isActive={i === tabIndex}
                onClick={() => {
                  setTabIndex(i);
                  if (tabs[i].type !== "custom") {
                    setCustomPath(tabs[i].path);
                  }
                }}
              >
                {name}
              </TabButton>
            ))}
        </TabButtonContainer>

        {tabs[tabIndex].type === "custom" ? (
          <div className={style.customInputContainer}>
            <input
              className={[style.customInput, "monospace"].join(" ")}
              value={customPath}
              onChange={(e) => setCustomPath(e.target.value)}
              placeholder="stages.parse.root.children.0.args"
            />
          </div>
        ) : null}
      </div>

      <div className={[style.output, style.scrollable].join(" ")}>
        {tabs[tabIndex].format === "yaml" ? (
          <YamlRenderer parsed={parsed} customPath={customPath} />
        ) : (
          <ComponentRenderer parsed={parsed} customPath={customPath} />
        )}
      </div>
    </div>
  );
};
