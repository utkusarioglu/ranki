import { Flex } from "antd";
import type { FC, PropsWithChildren } from "react";
import style from "./TitleRow.module.css";

interface TitleRowProps {}

export const TitleRow: FC<PropsWithChildren<TitleRowProps>> = ({
  children,
}) => {
  return (
    <Flex className={style.container} justify="space-between" align="center">
      {children}
    </Flex>
  );
};
