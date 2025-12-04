import type { FC } from "react";
import { YamlDisplay } from "../yaml-display/YamlDisplay";
import style from "./NodeDisplay.module.scss";
import { Pre, Code } from "@blueprintjs/core";

type Node = Record<string, any> & { subtree: Node[]; children: Node[] };

interface NodeDisplayProps {
  node: Node;
  path: string;
  depth: number;
  index: number;
}

const DEPTH_STEP = 30;

export const NodeDisplay: FC<NodeDisplayProps> = ({
  node: { subtree, children, source, isChild, ...rest },
  path,
  depth,
  index,
}) => {
  const newDepth = depth + 1;
  const newPath = path + "/" + newDepth + "-" + index;
  return (
    <div>
      <div
        className={[style.nodeRow, source && style.withSource]
          .filter((v) => !!v)
          .join(" ")}
      >
        <YamlDisplay obj={rest} />
        {source ? (
          <Pre className={style.rawSourcePre}>
            <Code className={style.rawSourceCode}>{source.raw}</Code>
          </Pre>
        ) : null}
      </div>
      {subtree && subtree.length ? (
        <div style={{ marginLeft: DEPTH_STEP }} className={style.subtree}>
          {subtree.map((c, i) => (
            <NodeDisplay
              key={newPath + i}
              node={c}
              path={newPath}
              index={i}
              depth={newDepth}
            />
          ))}
        </div>
      ) : null}
      {children && children.length ? (
        <div style={{ marginLeft: DEPTH_STEP }} className={style.children}>
          {children.map((c, i) => (
            <NodeDisplay
              key={newPath + i}
              node={c}
              index={i}
              path={newPath}
              depth={newDepth}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};
