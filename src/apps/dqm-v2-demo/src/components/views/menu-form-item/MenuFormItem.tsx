import type { FC, PropsWithChildren, ReactNode } from "react";

import { Flex, Form } from "antd";

import style from "./MenuFormItem.module.css";

interface MenuFormItemProps {
  label: ReactNode | string;
}

export const MenuFormItem: FC<PropsWithChildren<MenuFormItemProps>> = ({
  children,
  label,
}) => {
  return (
    <Form.Item className={style.container} label={label}>
      <Flex align="center" className={style.row}>
        {children}
      </Flex>
    </Form.Item>
  );
};
