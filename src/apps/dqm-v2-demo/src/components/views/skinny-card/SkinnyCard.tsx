import { Card, type CardProps } from "antd";
import { type FC, type Ref } from "react";

import style from "./SkinnyCard.module.css";

type SkinnyCardProps = {
  active?: boolean;
  ref?: Ref<HTMLDivElement>;
} & CardProps;

export const SkinnyCard: FC<SkinnyCardProps> = ({
  active,
  children,
  className,
  ref,
  ...rest
}) => {
  return (
    <Card
      className={[style.container, active && style.active, className]
        .filter((v) => v)
        .join(" ")}
      ref={ref}
      {...rest}
    >
      {children}
    </Card>
  );
};
