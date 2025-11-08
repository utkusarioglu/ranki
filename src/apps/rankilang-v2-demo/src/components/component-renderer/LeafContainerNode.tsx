import type { FC } from "react";
import { createElement } from "react";
import style from "./child.module.css";
import type { TransformNodeLeaf } from "@ranki/package-api-v2";
import { LeafInfo } from "./LeafInfo";
// import { Render } from "@ranki/package-render-v2";
import { AsyncRender } from "./Async";

interface LeafContainerNodeProps {
  item: TransformNodeLeaf;
}

export const LeafContainerNode: FC<LeafContainerNodeProps> = ({ item }) => {
  return (
    <div
      className={[
        style.childLeaf,
        item.print ? style.childLeafPrint : style.childLeafNoPrint,
      ].join(" ")}
    >
      <div className={style.childLeafRendersContainer}>
        <div>
          <LeafInfo item={item} />
          <div className={[style.childLeafValueContainer, "roboto"].join(" ")}>
            {createElement(
              "div",
              {},
              item.source.raw.trim() !== item.source.raw ? (
                <div className={style.childLeafValueUntrimmed}>
                  {item.source.raw.split("\n").map((l, i) => (
                    <div key={l + i}>
                      {l.split(" ").map((i, index) =>
                        i === "" ? (
                          <div
                            key={index}
                            className={style.childLeafValueSpace}
                          >
                            <span>s</span>
                          </div>
                        ) : (
                          i
                        ),
                      )}
                      <div className={style.childLeafValueNl}>
                        <span>n</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>{item.source.raw}</div>
              ),
            )}
          </div>
        </div>
        <div className={style.nativeRenderContainer}>
          <AsyncRender items={[item]} />
        </div>
      </div>
    </div>
  );
};
