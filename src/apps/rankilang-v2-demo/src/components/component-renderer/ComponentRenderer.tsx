import type { FC } from "react";
import { ContainerNode } from "./ContainerNode";
import style from "./component-renderer.module.css";
import type { RankiLangParseResult } from "@ranki/package-api-v2";

interface ComponentRendererProps {
  parsed: RankiLangParseResult;
  customPath: string;
}

export const ComponentRenderer: FC<ComponentRendererProps> = ({
  parsed,
  customPath,
}) => {
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
            <ContainerNode item={o.stages.transform} />
          </div>
        );
      })}
    </div>
  );
};
