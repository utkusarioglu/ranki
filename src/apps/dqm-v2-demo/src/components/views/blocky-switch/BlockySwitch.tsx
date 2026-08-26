import type { FC } from "react";

import { Switch, type SwitchProps } from "antd";

import style from "./BlockySwitch.module.css";

type BlockySwitchProps = {
  size?: "large" | SwitchProps["size"];
} & Omit<SwitchProps, "size">;

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
