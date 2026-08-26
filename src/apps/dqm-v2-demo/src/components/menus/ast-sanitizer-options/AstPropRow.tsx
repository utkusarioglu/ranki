import type { VisibleBooleanCommon } from "_stores/ast-view/ast-view.store.types.mjs";
import type {
  DragCardProps,
  ItemProps,
} from "_views/reorder-list/ReorderList.types.mjs";

import {
  DragOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Button, Card, Flex, Typography } from "antd";
import { type FC } from "react";

type AstPropRowBuilder = (
  p: AstPropRowBuilderProps,
) => FC<DragCardProps<VisibleBooleanCommon>>;

interface AstPropRowBuilderProps {
  toggleVisible: ({ index, list, onChange }: ItemProps<any>) => void;
}

export const astPropRowBuilder: AstPropRowBuilder =
  ({ toggleVisible }) =>
  ({ enableDrag, index, isDragging, item, list, onChange, ref }) => {
    return (
      <Card
        ref={ref}
        size="small"
        style={{
          cursor: enableDrag ? "move" : "default",
          marginBottom: "0.5em",
          opacity: isDragging ? 0.8 : 1,
        }}
        variant="borderless"
      >
        <Flex justify="space-between">
          <DragOutlined style={{ opacity: +enableDrag }} />
          <Typography.Text code>{item.id}</Typography.Text>
          <Button
            icon={item.visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            onClick={() => toggleVisible({ index, item, list, onChange })}
            size="small"
          />
        </Flex>
      </Card>
    );
  };
