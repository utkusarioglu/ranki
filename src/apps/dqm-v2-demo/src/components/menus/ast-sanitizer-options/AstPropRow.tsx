import { type FC } from "react";
import { Button, Card, Flex, Typography } from "antd";
import {
  DragOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type {
  DragCardProps,
  ItemProps,
} from "_views/reorder-list/ReorderList.types.mjs";
import type { VisibleBooleanCommon } from "_stores/ast-view/ast-view.store.types.mjs";

interface AstPropRowBuilderProps {
  toggleVisible: ({ list, index, onChange }: ItemProps<any>) => void;
}

type AstPropRowBuilder = (
  p: AstPropRowBuilderProps,
) => FC<DragCardProps<VisibleBooleanCommon>>;

export const astPropRowBuilder: AstPropRowBuilder =
  ({ toggleVisible }) =>
  ({ isDragging, ref, list, onChange, item, index, enableDrag }) => {
    return (
      <Card
        style={{
          opacity: isDragging ? 0.8 : 1,
          cursor: enableDrag ? "move" : "default",
          marginBottom: "0.5em",
        }}
        variant="borderless"
        size="small"
        ref={ref}
      >
        <Flex justify="space-between">
          <DragOutlined style={{ opacity: +enableDrag }} />
          <Typography.Text code>{item.id}</Typography.Text>
          <Button
            icon={item.visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            size="small"
            onClick={() => toggleVisible({ list, index, onChange, item })}
          />
        </Flex>
      </Card>
    );
  };
