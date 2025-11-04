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
import type { SharedState } from "../app/shared-state.mts";
import { ComponentRenderer } from "../component-renderer/ComponentRenderer";

interface OutputProps {
  state: SharedState;
  // parsed: any | null; // !FIX any
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

export const Output: FC<OutputProps> = ({ state }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const renderAvailable =
    state?.type === "loaded" && state.config.stage === "transform";

  const filteredTabs = renderAvailable
    ? tabs
    : tabs.filter(({ format }) => format !== "render");

  const [customPath, setCustomPath] = useState(filteredTabs[tabIndex].path);

  if (state === null) {
    return <p>Nothing yet...</p>;
  }

  if (state.type === "error") {
    return (
      <div className={style.errorContainer}>
        <h3 className={[style.errorHeading, "monospace"].join(" ")}>Error</h3>
        <pre>{state.error}</pre>
      </div>
    );
  }

  return (
    <div
      className={[style.component].join(" ")}
      style={
        {
          "--input-height":
            filteredTabs[tabIndex].type === "custom" ? "3.5em" : "0em",
        } as CSSProperties
      }
    >
      <div className={style.ribbon}>
        <TabButtonContainer>
          {filteredTabs
            .map((t) => t.name)
            .map((name, i) => (
              <TabButton
                key={name}
                isActive={i === tabIndex}
                onClick={() => {
                  setTabIndex(i);
                  if (filteredTabs[i].type !== "custom") {
                    setCustomPath(filteredTabs[i].path);
                  }
                }}
              >
                {name}
              </TabButton>
            ))}
        </TabButtonContainer>

        {filteredTabs[tabIndex].type === "custom" ? (
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
        {renderAvailable && filteredTabs[tabIndex].format === "render" ? (
          <ComponentRenderer parsed={state.parsed} customPath={customPath} />
        ) : (
          <YamlRenderer
            parsed={state.parsed}
            customPath={customPath}
            astNodeSelectedProps={state.astNodeSelectedProps}
            validationNodeSelectedProps={state.validationNodeSelectedProps}
            transformNodeSelectedProps={state.transformNodeSelectedProps}
          />
        )}
      </div>
    </div>
  );
};
