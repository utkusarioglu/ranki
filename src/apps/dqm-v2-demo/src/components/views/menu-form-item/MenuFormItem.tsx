import { Flex, Form } from "antd";
import type { FC, PropsWithChildren, ReactNode } from "react";
import style from "./MenuFormItem.module.css";

interface MenuFormItemProps {
  label: string | ReactNode;
}

export const MenuFormItem: FC<PropsWithChildren<MenuFormItemProps>> = ({
  label,
  children,
}) => {
  return (
    <Form.Item label={label} className={style.container}>
      <Flex className={style.row}>{children}</Flex>
    </Form.Item>
  );
};
