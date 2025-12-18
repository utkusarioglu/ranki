import { Card, type CardProps } from "antd";
import { type FC, type Ref } from "react";
import style from "./SkinnyCard.module.css";

type SkinnyCardProps = CardProps & {
  active?: boolean;
  ref?: Ref<HTMLDivElement>;
};

export const SkinnyCard: FC<SkinnyCardProps> = ({
  children,
  className,
  active,
  ref,
  ...rest
}) => {
  return (
    <Card
      ref={ref}
      className={[style.container, active && style.active, className]
        .filter((v) => v)
        .join(" ")}
      {...rest}
    >
      {children}
    </Card>
  );
};
