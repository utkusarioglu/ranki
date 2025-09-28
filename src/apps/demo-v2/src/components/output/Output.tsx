import type { FC, CSSProperties } from "react";

import { useState } from "react";
import Prism from "prismjs";
import style from "./output.module.css";
import yaml from "yaml";
import "./prism-atom-dark.css";

import "prismjs/components/prism-yaml.js";

interface OutputProps {
  parsed: any | null; // !FIX any
}

function crawl(c: any, path?: string) {
  if (!path) {
    return c;
  }
  const splat = path.split(".");
  try {
    let current = c;
    while (splat.length) {
      const u = splat.shift();
      if (u && current[u] !== undefined) {
        current = current[u];
      } else {
        return {
          ...current,
        };
      }
    }
    return {
      [path]: current,
    };
  } catch (e) {
    return c;
  }
}

type TabDefinition =
  | {
      type: "exact";
      name: string;
      path: string;
    }
  | {
      type: "custom";
      name: string;
      path: "";
    };

const tabs: TabDefinition[] = [
  {
    type: "exact",
    name: "All",
    path: "",
  },
  {
    type: "exact",
    name: "Report",
    path: "report",
  },
  {
    type: "exact",
    name: "Raw",
    path: "stages.raw",
  },
  {
    type: "exact",
    name: "Root",
    path: "stages.parse.root",
  },
  {
    type: "exact",
    name: "Lexeme",
    path: "stages.parse.root.children.children.0.children.0.children.0.children.",
  },
  {
    type: "custom",
    name: "Custom",
    path: "",
  },
];

export const Output: FC<OutputProps> = ({ parsed }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [customPath, setCustomPath] = useState(tabs[tabIndex].path);

  if (parsed === null) {
    return <p>Nothing yet...</p>;
  }

  if (parsed.error) {
    return (
      <div className={style.errorContainer}>
        <h3 className={style.errorHeading}>Error</h3>
        <pre>{parsed.error}</pre>
      </div>
    );
  }

  const yamlStr = yaml.stringify(crawl(parsed, customPath));
  const highlighted = Prism.highlight(
    yamlStr,
    Prism.languages.yaml,
    "javascript",
  );

  return (
    <div
      className={[style.component].join(" ")}
      style={
        {
          "--tab-height": "3em",
          "--input-height": tabs[tabIndex].type === "custom" ? "3.5em" : "0em",
        } as CSSProperties
      }
    >
      <div className={style.ribbon}>
        <div className={style.tabButtonContainer}>
          {tabs
            .map((t) => t.name)
            .map((name, i) => (
              <button
                key={name}
                className={[
                  style.tabButton,
                  i === tabIndex && style.tabButtonActive,
                ]
                  .filter((v) => !!v)
                  .join(" ")}
                onClick={() => {
                  setTabIndex(i);
                  if (tabs[i].type !== "custom") {
                    setCustomPath(tabs[i].path);
                  }
                }}
              >
                {name}
              </button>
            ))}
        </div>

        {tabs[tabIndex].type === "custom" ? (
          <div className={style.customInputContainer}>
            <input
              className={style.customInput}
              value={customPath}
              onChange={(e) => setCustomPath(e.target.value)}
              placeholder="stages.parse.root.children.0.args"
            />
          </div>
        ) : null}
      </div>

      {/* {ribbonRef.current?.clientHeight ? ( */}
      <div className={[style.output, style.scrollable].join(" ")}>
        <pre
          className={style.outputPre}
          // style={{
          //   marginTop: tabIndex === tabs.length - 1 ? 100 : "3.5em",
          // }}
        >
          <code
            className="language-yaml"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </pre>
      </div>
      {/* ) : null} */}
    </div>
  );
};
