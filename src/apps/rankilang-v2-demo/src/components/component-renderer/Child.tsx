import type { FC } from "react";
import { createElement } from "react";
import style from "./child.module.css";
import type {
  TransformNode,
  TransformNodeParent,
  TransformNodeLeaf,
} from "@ranki/package-api-v2";
import { ParentInfo } from "./ParentInfo";
import { LeafInfo } from "./LeafInfo";

interface ChildProps {
  item: TransformNode;
}

const BORDER_COLORS = ["#D92949", "#A62E66", "#27498C", "#D9CD23", "#BF8A26"];

export const Child: FC<ChildProps> = ({ item }) => {
  switch (item.kind) {
    case "parent":
      if (item.creator === "root_structure" && item.depth !== 1) {
        return (
          <div className={style.boundary}>
            <ChildParent item={item} />
          </div>
        );
      } else {
        return <ChildParent item={item} />;
      }
    case "leaf":
      return <ChildLeaf item={item} />;
  }
};

interface ChildLeafProps {
  item: TransformNodeLeaf;
}

const ChildLeaf: FC<ChildLeafProps> = ({ item }) => {
  console.log(item);
  return (
    <div
      className={[
        style.childLeaf,
        item.print ? style.childLeafPrint : style.childLeafNoPrint,
      ].join(" ")}
    >
      <LeafInfo item={item} />
      <div className={[style.childLeafValueContainer, "roboto"].join(" ")}>
        {createElement(
          item.tag,
          {},
          item.value.trim() !== item.value ? (
            <div className={style.childLeafValueUntrimmed}>
              {item.value.split("\n").map((l) => (
                <div>
                  {l.split(" ").map((i) =>
                    i === "" ? (
                      <div className={style.childLeafValueSpace}>
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
            item.value
          ),
        )}
      </div>
    </div>
  );
};

interface ChildParentProps {
  item: TransformNodeParent;
}

const ChildParent: FC<ChildParentProps> = ({ item }) => {
  const color = BORDER_COLORS[item.depth % BORDER_COLORS.length];
  return (
    <div className={style.childParentBg}>
      <ParentInfo item={item} color={color} />
      <div
        className={[style.childParent, style.childParentBg].join(" ")}
        style={{
          borderLeftColor: color,
        }}
      >
        {createElement(
          item.tag,
          {},
          item.children.map((c, i) => <Child key={i} item={c} />),
        )}
      </div>
    </div>
  );
};
