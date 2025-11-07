import type { FC } from "react";
import style from "./child.module.css";
import type { TransformNode } from "@ranki/package-api-v2";
import { ParentContainerNode } from "./ParentContainerNode";
import { LeafContainerNode } from "./LeafContainerNode";

interface ContainerNodeProps {
  items: TransformNode[] | null;
}

export const ContainerNode: FC<ContainerNodeProps> = ({ items }) => {
  if (!items) {
    return <span>Null</span>;
  }
  return (
    <>
      {items.map((item, i) => (
        <ContainerNodeItem key={i} item={item} />
      ))}
    </>
  );
};

interface ContainerNodeItemProps {
  item: TransformNode;
}

const ContainerNodeItem: FC<ContainerNodeItemProps> = ({ item }) => {
  switch (item.kind) {
    case "parent":
      if (item.creator === "root_structure" && item.depth !== 1) {
        return (
          <div className={style.boundary}>
            <ParentContainerNode item={item} />
          </div>
        );
      } else {
        return <ParentContainerNode item={item} />;
      }
    case "leaf":
      return <LeafContainerNode item={item} />;
  }
};
