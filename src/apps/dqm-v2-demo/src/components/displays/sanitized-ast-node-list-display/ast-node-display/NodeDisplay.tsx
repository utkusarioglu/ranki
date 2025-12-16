import { useState, type FC } from "react";
import { YamlDisplay } from "_views/yaml-display/YamlDisplay";
import style from "./NodeDisplay.module.css";
import { PreCode } from "_views/pre-code/PreCode";
import { BlockySwitch } from "_views/blocky-switch/BlockySwitch";
import { Flex, Typography } from "antd";
import type { SanitizedNodePartial } from "_stores/ast-view/utils/sanitized-ast-node.types.mts";
import type { IdUnique } from "@dqm/package-dqm-api-v2";

interface AstNodeDisplayProps {
  node: SanitizedNodePartial;
  path: string;
  depth: number;
  index: number;
  parentUnique?: IdUnique;
}

const DEPTH_STEP = 30;

export const AstNodeDisplay: FC<AstNodeDisplayProps> = ({
  node: {
    key,
    fields: { props, children, stable },
  },
  path,
  depth,
  index,
  parentUnique,
}) => {
  const childrenKeys = Object.keys(children);
  const [childrenVisible, setChildrenVisible] = useState<
    Record<string, boolean>
  >(Object.fromEntries(childrenKeys.map((k) => [k, true])));

  const newDepth = depth + 1;
  const newPath = path + "/" + newDepth + "-" + index;
  const cpxUniqueDefined = props.cpxUnique !== undefined;
  const parentUniqueDefined = parentUnique !== undefined;
  const isNewCpx =
    cpxUniqueDefined && parentUniqueDefined
      ? props.cpxUnique !== parentUnique
      : false;

  const childrenRenderList = Object.entries(children)
    .filter(([childType]) => childrenVisible[childType])
    .filter((v) => (v[1] as SanitizedNodePartial[]).length) as [
    string,
    SanitizedNodePartial[],
  ][];

  return (
    <div
      className={[style.lineage, isNewCpx && style.newCpx]
        .filter((v) => v)
        .join(" ")}
    >
      <div className={style.parent}>
        <div
          className={[style.yaml, stable.sourceString && style.withSource]
            .filter((v) => v)
            .join(" ")}
        >
          <div>
            {Object.keys(props).length ? (
              <YamlDisplay obj={props} />
            ) : (
              <Typography className={style.selectNodeProp}>
                No node properties selected
              </Typography>
            )}
            <Flex className={style.switches}>
              {Object.keys(childrenVisible).map((name) => (
                <BlockySwitch
                  key={name}
                  size="small"
                  checkedChildren={name}
                  value={childrenVisible[name]}
                  onChange={() =>
                    setChildrenVisible((l) => {
                      return {
                        ...l,
                        [name]: !l[name],
                      };
                    })
                  }
                />
              ))}
            </Flex>
          </div>
          {stable.sourceString ? (
            <PreCode>{stable.sourceString}</PreCode>
          ) : null}
        </div>
      </div>

      {childrenRenderList.map(([childType, nodes]) => (
        <div
          key={childType + newPath}
          style={{ marginLeft: DEPTH_STEP }}
          className={style[childType]}
        >
          {nodes.map((n, i) => (
            <AstNodeDisplay
              parentUnique={props.cpxUnique}
              key={key + n.key + i}
              node={n}
              path={newPath}
              index={i}
              depth={newDepth}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
