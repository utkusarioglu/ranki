import { useState, type FC } from "react";
import { YamlDisplay } from "_views/yaml-display/YamlDisplay";
import style from "./NodeDisplay.module.css";
import { PreCode } from "_views/pre-code/PreCode";
import { BlockySwitch } from "_views/blocky-switch/BlockySwitch";
import { Flex, Typography } from "antd";
// import type { AstNodePartialSanitized } from "_stores/ast-view/utils/sanitized-ast-node.types.mts";
import type { AstNodePartialSanitized } from "@dqm/package-dqm-v2-debug";
import type { UniqueValue } from "@dqm/package-dqm-api-v2";
import { TryCatchView } from "_views/try-catch/try-catch";

interface AstNodeDisplayProps {
  node: AstNodePartialSanitized;
  path: string;
  depth: number;
  index: number;
  parentUnique?: UniqueValue | "(failed)";
}

const DEPTH_STEP = 30;

export const AstNodeDisplay: FC<AstNodeDisplayProps> = ({
  node: {
    key,
    fields: { props, children, stable, hidden },
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
  const cpxUniqueDefined = hidden.cpxUnique !== undefined;
  const parentUniqueDefined = parentUnique !== undefined;
  const cpxUnique = hidden.cpxUnique?.value || -1000;
  const isNewCpx =
    cpxUniqueDefined && parentUniqueDefined
      ? cpxUnique !== parentUnique
      : false;

  const childrenRenderList = Object.entries(children).filter(
    ([childType]) => childrenVisible[childType],
  );

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
              <YamlDisplay
                obj={Object.fromEntries(
                  Object.entries(props).map(([k, v]) => [k, v.value]),
                )}
              />
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
          <TryCatchView<string>
            item={stable.sourceString}
            Undefined={() => null}
            Success={({ item }) => <PreCode>{String(item.value)}</PreCode>}
          />
        </div>
      </div>

      {childrenRenderList
        .filter(([_, nodes]) => (nodes.value as Array<any>).length)
        .map(([childType, nodes]) => (
          <div
            key={childType + newPath}
            style={{ marginLeft: DEPTH_STEP }}
            className={style[childType]}
          >
            {nodes.state === "success" ? (
              (nodes.value as Array<any>).map((n, i) => (
                <AstNodeDisplay
                  parentUnique={cpxUnique}
                  key={key + n.key + i}
                  node={n}
                  path={newPath}
                  index={i}
                  depth={newDepth}
                />
              ))
            ) : (
              <p>fail</p>
            )}
          </div>
        ))}
    </div>
  );
};
