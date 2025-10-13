import type { FC } from "react";
import type { TransformNodeParent } from "@ranki/package-api-v2";
import style from "./info.module.css";

interface ParentInfoProps {
  item: TransformNodeParent;
  color: string;
}

export const ParentInfo: FC<ParentInfoProps> = ({ item, color }) => {
  return (
    <h6
      className={[style.info, "monospace", style.infoParent].join(" ")}
      style={{
        backgroundColor: color,
      }}
    >
      {[item.creator, item.tag, item.kind].filter((v) => !!v).join(" ")}
    </h6>
  );
};
