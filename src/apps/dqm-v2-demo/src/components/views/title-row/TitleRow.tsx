import { Flex } from "antd";
import type { FC, PropsWithChildren } from "react";
import style from "./TitleRow.module.css";

interface TitleRowProps {
  isAbsolute: boolean;
}

export const TitleRow: FC<PropsWithChildren<TitleRowProps>> = ({
  isAbsolute,
  children,
}) => {
  return (
    <Flex
      className={[style.container, isAbsolute && style.absolute].join(" ")}
      justify="space-between"
      align="center"
    >
      {children}
    </Flex>
  );
};
