import type { FC } from "react";
import { useLayoutEffect, useRef, useState } from "react";
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
    const produced = splat.reduce((a, c) => ((a = a[c]), a), c);
    if (produced === undefined) {
      return c;
    }
    const prop = splat.at(-1);
    if (!prop) {
      return c;
    }
    return {
      [path]: produced,
    };
  } catch (e) {
    return c;
  }
}

type TabCrawler = (c: any, path?: string) => any;

type TabDefinition = {
  name: string;
  cb: TabCrawler;
};

const tabs: TabDefinition[] = [
  {
    name: "All",
    cb: (c) => crawl(c, ""),
  },
  {
    name: "Report",
    cb: (c) => crawl(c, "report"),
  },
  {
    name: "Stages.Raw",
    cb: (c) => crawl(c, "stages.raw"),
  },
  {
    name: "Stages.Parse.Root",
    cb: (c) => crawl(c, "stages.parse.root"),
  },
  {
    name: "Custom",
    cb: (c, path) => crawl(c, path),
  },
];

export const Output: FC<OutputProps> = ({ parsed }) => {
  const [marginTop, setMarginTop] = useState(0);
  const ribbonRef = useRef<HTMLDivElement>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [customPath, setCustomPath] = useState("");

  useLayoutEffect(() => {
    if (!ribbonRef.current) {
      return;
    }
    setMarginTop(ribbonRef.current.clientHeight);
  }, [tabIndex]);

  if (parsed === null) {
    return <p>Nothing yet</p>;
  }

  if (parsed.error) {
    return <h1>{parsed.error}</h1>;
  }

  const yamlStr = yaml.stringify(tabs[tabIndex].cb(parsed, customPath));
  const highlighted = Prism.highlight(
    yamlStr,
    Prism.languages.yaml,
    "javascript",
  );

  return (
    <div className={[style.component].join(" ")}>
      <div ref={ribbonRef} className={style.ribbon}>
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
                onClick={() => setTabIndex(i)}
              >
                {name}
              </button>
            ))}
        </div>

        {tabs[tabIndex].name === "Custom" ? (
          <div
            style={{ display: tabIndex === tabs.length - 1 ? "block" : "none" }}
            className={style.customInputContainer}
          >
            <input
              className={style.customInput}
              value={customPath}
              onChange={(e) => setCustomPath(e.target.value)}
              placeholder="stages.parse.root.children.0.args"
            />
          </div>
        ) : null}
      </div>

      <div className={[style.output, style.scrollable].join(" ")}>
        <pre
          style={{
            marginTop,
          }}
        >
          <code
            className="language-yaml"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </pre>
      </div>
    </div>
  );
};
