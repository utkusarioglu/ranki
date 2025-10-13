import type { FC } from "react";
import type { TransformNodeLeaf } from "@ranki/package-api-v2";
import style from "./info.module.css";

interface LeafInfoProps {
  item: TransformNodeLeaf;
}

export const LeafInfo: FC<LeafInfoProps> = ({ item }) => {
  return (
    <h6 className={[style.info, "monospace", style.infoLeaf].join(" ")}>
      {[
        item.creator,
        item.tag,
        item.dataType,
        item.kind,
        item.print ? "Printed" : "Hidden",
      ]
        .filter((v) => !!v)
        .join(" ")}
    </h6>
  );
};
