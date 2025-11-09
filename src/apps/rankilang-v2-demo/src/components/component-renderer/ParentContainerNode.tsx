import type { FC } from "react";
import { createElement } from "react";
import style from "./child.module.css";
import type { TransformNodeParent } from "@ranki/package-api-v2";
import { ParentInfo } from "./ParentInfo";
import { ContainerNode } from "./ContainerNode";
import type { RenderClientOptions } from "@ranki/package-render-v2";

interface ParentContainerNodeProps {
  item: TransformNodeParent;
  options: RenderClientOptions;
}

const BORDER_COLORS = ["#D92949", "#A62E66", "#27498C", "#D9CD23", "#BF8A26"];

export const ParentContainerNode: FC<ParentContainerNodeProps> = ({
  item,
  options,
}) => {
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
          "div",
          {},
          item.children.map((c, i) => (
            <ContainerNode key={i} items={[c]} options={options} />
          )),
        )}
      </div>
    </div>
  );
};
