import { useState, type FC } from "react";
import { YamlDisplay } from "../yaml-display/YamlDisplay";
import style from "./NodeDisplay.module.css";
import type { SanitizedNode } from "../../utils/dqm.utils.types.mjs";
import { PreCode } from "../pre-code/PreCode";
import { BlockySwitch } from "../blocky-switch/BlockySwitch";
import { Flex } from "antd";

interface NodeDisplayProps {
  node: SanitizedNode;
  path: string;
  depth: number;
  index: number;
  parentUnique: string | undefined;
}

const DEPTH_STEP = 30;

export const NodeDisplay: FC<NodeDisplayProps> = ({
  node: {
    subtreeNodes,
    childrenNodes,
    spaceNodes,
    tokenNodes,
    source,
    ...rest
  },
  path,
  depth,
  index,
  parentUnique,
}) => {
  const [lineage, setLineage] = useState(
    [
      {
        title: "Subtree",
        visible: true,
        className: "subtree",
        nodes: subtreeNodes,
      },
      {
        title: "Spaces",
        visible: true,
        className: "space",
        nodes: spaceNodes,
      },
      {
        title: "Tokens",
        visible: true,
        className: "token",
        nodes: tokenNodes,
      },
      {
        title: "Children",
        visible: true,
        className: "children",
        nodes: childrenNodes,
      },
    ].filter((v) => v.nodes && v.nodes.length),
  );

  const newDepth = depth + 1;
  const newPath = path + "/" + newDepth + "-" + index;
  const isNewCpx =
    rest.cpxUnique !== undefined && parentUnique !== undefined
      ? rest.cpxUnique !== parentUnique
      : false;
  return (
    <div
      className={[style.lineage, isNewCpx && style.newCpx]
        .filter((v) => v)
        .join(" ")}
    >
      <div className={style.parent}>
        <div
          className={[style.yaml, source && style.withSource]
            .filter((v) => !!v)
            .join(" ")}
        >
          <div>
            <YamlDisplay obj={rest} />
            <Flex className={style.switches}>
              {lineage.map(({ title, visible }, i) => (
                <BlockySwitch
                  key={title}
                  size="small"
                  checkedChildren={title}
                  value={visible}
                  onChange={(e) =>
                    setLineage((l) => {
                      const n = [...l];
                      n[i] = {
                        ...n[i],
                        visible: e,
                      };
                      console.log(n, i);
                      return n;
                    })
                  }
                />
              ))}
            </Flex>
          </div>
          {source ? <PreCode>{source.raw}</PreCode> : null}
        </div>
      </div>
      {lineage
        .filter((v) => v.visible)
        .map(({ nodes, className }) =>
          nodes && nodes.length ? (
            <div
              key={[style.dashed, className].join(" ")}
              style={{ marginLeft: DEPTH_STEP }}
              className={style[className]}
            >
              {nodes.map((c, i) => (
                <NodeDisplay
                  parentUnique={rest.cpxUnique}
                  key={newPath + i}
                  node={c}
                  path={newPath}
                  index={i}
                  depth={newDepth}
                />
              ))}
            </div>
          ) : null,
        )}
      {/* {subtreeNodes && subtreeNodes.length ? (
        <div style={{ marginLeft: DEPTH_STEP }} className={style.subtree}>
          {subtreeNodes.map((c, i) => (
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
      {childrenNodes && childrenNodes.length ? (
        <div
          style={{
            marginLeft: DEPTH_STEP,
          }}
          className={style.children}
        >
          {childrenNodes.map((c, i) => (
            <NodeDisplay
              key={newPath + i}
              node={c}
              index={i}
              path={newPath}
              depth={newDepth}
            />
          ))}
        </div>
      ) : null} */}
    </div>
  );
};
