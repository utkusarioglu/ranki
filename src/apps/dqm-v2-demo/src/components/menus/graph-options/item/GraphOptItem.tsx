import { LOOKUP } from "_displays/graph/LOOKUP";
import type {
  GraphViewStore,
  GraphViewStoreStateKey,
} from "_stores/graph-view/graph-view.store.types.mjs";
import { BlockySwitch } from "_views/blocky-switch/BlockySwitch";
import { Flex, Typography } from "antd";
import type { FC } from "react";
import style from "./GraphOptItem.module.css";

interface GraphOptItemProps {
  k: GraphViewStoreStateKey;
  setVisibility: GraphViewStore["setVisibility"];
  value: boolean;
}

export const GraphOptItem: FC<GraphOptItemProps> = ({
  k,
  value,
  setVisibility,
}) => {
  return (
    <Flex className={style.container} justify="space-between">
      <div>
        {/* <div>
          <Typography.Text>{LOOKUP[k].title}</Typography.Text>
        </div> */}
        <Typography.Text className={style.code} code>
          {k}
        </Typography.Text>
      </div>
      <BlockySwitch onChange={(e) => setVisibility(k, e)} value={value} />
    </Flex>
  );
};
