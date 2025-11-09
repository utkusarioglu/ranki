import type { FC } from "react";
import style from "./child.module.css";
import type { TransformNode } from "@ranki/package-api-v2";
import { ParentContainerNode } from "./ParentContainerNode";
import { LeafContainerNode } from "./LeafContainerNode";
import type { RenderClientOptions } from "@ranki/package-render-v2";

interface ContainerNodeProps {
  items: TransformNode[] | null;
  options: RenderClientOptions;
}

export const ContainerNode: FC<ContainerNodeProps> = ({ items, options }) => {
  if (!items) {
    return <span>Null</span>;
  }
  return (
    <>
      {items.map((item, i) => (
        <ContainerNodeItem key={i} item={item} options={options} />
      ))}
    </>
  );
};

interface ContainerNodeItemProps {
  item: TransformNode;
  options: RenderClientOptions;
}

const ContainerNodeItem: FC<ContainerNodeItemProps> = ({ item, options }) => {
  switch (item.kind) {
    case "parent":
      if (item.creator === "root_structure" && item.depth !== 1) {
        return (
          <div className={style.boundary}>
            <ParentContainerNode item={item} options={options} />
          </div>
        );
      } else {
        return <ParentContainerNode item={item} options={options} />;
      }
    case "leaf":
      return <LeafContainerNode item={item} options={options} />;
  }
};
