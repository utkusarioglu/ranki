import type { FC, PropsWithChildren } from "react";

import { Flex } from "antd";

import style from "./TitleRow.module.css";

interface TitleRowProps {
  isAbsolute: boolean;
}

export const TitleRow: FC<PropsWithChildren<TitleRowProps>> = ({
  children,
  isAbsolute,
}) => {
  return (
    <Flex
      align="center"
      className={[style.container, isAbsolute && style.absolute].join(" ")}
      justify="space-between"
    >
      {children}
    </Flex>
  );
};
