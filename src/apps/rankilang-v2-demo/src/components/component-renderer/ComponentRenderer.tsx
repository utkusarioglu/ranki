import { useState, type FC } from "react";
import { ContainerNode } from "./ContainerNode";
import style from "./component-renderer.module.css";
import type { RankiLangParseResult } from "@ranki/package-api-v2";
import { AsyncRender } from "./Async";
import type { RenderClientOptions } from "@ranki/package-render-v2";

interface ComponentRendererProps {
  parsed: RankiLangParseResult;
  customPath: string;
  options: RenderClientOptions;
}

export const ComponentRenderer: FC<ComponentRendererProps> = ({
  parsed,
  customPath,
  options,
}) => {
  const [showParts, setShowParts] = useState(false);
  const [width, setWidth] = useState(200);
  return (
    <div className={style.container}>
      {Object.entries(parsed.theaters).map(([theater, o]) => {
        if (!o.stages.transform) {
          return null;
        }
        return (
          <div key={theater}>
            <hgroup className={style.hgroup}>
              <h5 className={[style.hgroupTitle, "roboto"].join(" ")}>
                Theater:
              </h5>
              <h1 className={[style.theater, "monospace"].join(" ")}>
                {theater}
              </h1>
            </hgroup>
            {customPath !== "" ? <h2>{customPath}</h2> : null}

            <div
              className={style.nativePreviewContainer}
              // style={{ width: width + "px" }}
            >
              <div className={style.nativePreviewContainerInner}>
                <AsyncRender
                  items={o.stages.transform}
                  options={options}
                  width={width}
                />
              </div>
            </div>

            <div>
              <input
                type="range"
                min={100}
                defaultValue={width}
                max={1000}
                onChange={(e) => setWidth(+e.target.value)}
              />
            </div>

            {showParts ? (
              <>
                <button onClick={() => setShowParts(false)}>Hide Parts</button>
                <ContainerNode items={o.stages.transform} options={options} />
              </>
            ) : (
              <button onClick={() => setShowParts(true)}>Show Parts</button>
            )}
          </div>
        );
      })}
    </div>
  );
};
