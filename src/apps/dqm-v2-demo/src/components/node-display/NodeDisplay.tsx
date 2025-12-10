import type { FC } from "react";
import { YamlDisplay } from "../yaml-display/YamlDisplay";
import style from "./NodeDisplay.module.css";
import type { SanitizedNode } from "../../stores/code/utils.types.mts";
import { PreCode } from "../pre-code/PreCode";

interface NodeDisplayProps {
  node: SanitizedNode;
  path: string;
  depth: number;
  index: number;
}

const DEPTH_STEP = 30;

export const NodeDisplay: FC<NodeDisplayProps> = ({
  node: { subtree, children, source, ...rest },
  path,
  depth,
  index,
}) => {
  const newDepth = depth + 1;
  const newPath = path + "/" + newDepth + "-" + index;
  return (
    <div>
      <div className={style.parent}>
        <div
          className={[style.yaml, source && style.withSource]
            .filter((v) => !!v)
            .join(" ")}
        >
          <YamlDisplay obj={rest} />
          {source ? <PreCode>{source.raw}</PreCode> : null}
        </div>
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
        <div
          style={{
            marginLeft: DEPTH_STEP,
          }}
          className={style.children}
        >
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
