import { Switch, type SwitchProps } from "antd";
import type { FC } from "react";
import style from "./BlockySwitch.module.css";

type BlockySwitchProps = Omit<SwitchProps, "size"> & {
  size?: SwitchProps["size"] | "large";
};

export const BlockySwitch: FC<BlockySwitchProps> = ({
  className,
  size,
  ...rest
}) => {
  return (
    <Switch
      className={[style.container, className, size === "large" && style.large]
        .filter((v) => v)
        .join(" ")}
      {...rest}
    />
  );
};
