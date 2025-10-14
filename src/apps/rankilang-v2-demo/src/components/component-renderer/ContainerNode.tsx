import type { FC } from "react";
import style from "./child.module.css";
import type { TransformNode } from "@ranki/package-api-v2";
import { ParentContainerNode } from "./ParentContainerNode";
import { LeafContainerNode } from "./LeafContainerNode";

interface ContainerNodeProps {
  item: TransformNode;
}

export const ContainerNode: FC<ContainerNodeProps> = ({ item }) => {
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
