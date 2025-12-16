import { Card, type CardProps } from "antd";
import { type FC } from "react";
import style from "./SkinnyCard.module.css";

type SkinnyCardProps = CardProps & {
  active?: boolean;
};

export const SkinnyCard: FC<SkinnyCardProps> = ({
  children,
  className,
  active,
  ...rest
}) => {
  return (
    <Card
      className={[style.container, active && style.active, className]
        .filter((v) => v)
        .join(" ")}
      {...rest}
    >
      {children}
    </Card>
  );
};
