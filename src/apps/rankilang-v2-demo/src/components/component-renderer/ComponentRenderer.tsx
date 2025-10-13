import type { FC } from "react";
import { Child } from "./Child";
import style from "./component-renderer.module.css";

interface ComponentRendererProps {
  parsed: any | null; // !FIX any
  customPath: string;
}

export const ComponentRenderer: FC<ComponentRendererProps> = ({
  parsed,
  customPath,
}) => {
  return (
    <div className={style.container}>
      {Object.entries(parsed.theaters).map(([theater, o]) => (
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
          <Child
            // @ts-expect-error
            item={o.stages.transform}
          />
        </div>
      ))}
    </div>
  );
};
