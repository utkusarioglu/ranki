import type { UniqueValue } from "@dqm/package-dqm-api-v2";
// import type { AstNodePartialSanitized } from "_stores/ast-view/utils/sanitized-ast-node.types.mts";
import type { AstNodeFilteredSanitizedKey } from "@dqm/package-dqm-v2-debug";

import { BlockySwitch } from "_views/blocky-switch/BlockySwitch";
import { PreCode } from "_views/pre-code/PreCode";
import { TryCatchView } from "_views/try-catch/try-catch";
import { YamlDisplay } from "_views/yaml-display/YamlDisplay";
import { Flex, Typography } from "antd";
import { type FC, useState } from "react";

import style from "./NodeDisplay.module.css";

interface AstNodeDisplayProps {
  depth: number;
  index: number;
  node: AstNodeFilteredSanitizedKey;
  parentUnique?: "(failed)" | UniqueValue;
  path: string;
}

const DEPTH_STEP = 30;

export const AstNodeDisplay: FC<AstNodeDisplayProps> = ({
  depth,
  index,
  node: {
    fields: { children, hidden, props, stable },
    key,
  },
  parentUnique,
  path,
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
                  checkedChildren={name}
                  key={name}
                  onChange={() =>
                    setChildrenVisible((l) => {
                      return {
                        ...l,
                        [name]: !l[name],
                      };
                    })
                  }
                  size="small"
                  value={childrenVisible[name]}
                />
              ))}
            </Flex>
          </div>
          <TryCatchView<string>
            item={stable.sourceString}
            Success={({ item }) => <PreCode>{String(item.value)}</PreCode>}
            Undefined={() => null}
          />
        </div>
      </div>

      {childrenRenderList
        .filter(([_, nodes]) => (nodes.value as Array<any>).length)
        .map(([childType, nodes]) => (
          <div
            className={style[childType]}
            key={childType + newPath}
            style={{ marginLeft: DEPTH_STEP }}
          >
            {nodes.state === "success" ? (
              (nodes.value as Array<any>).map((n, i) => (
                <AstNodeDisplay
                  depth={newDepth}
                  index={i}
                  key={key + n.key + i}
                  node={n}
                  parentUnique={cpxUnique}
                  path={newPath}
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
