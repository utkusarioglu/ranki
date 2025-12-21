import { type FC, type PropsWithChildren } from "react";
import { Typography } from "antd";
import style from "./SectionTitle.module.css";

export const SectionTitle: FC<PropsWithChildren> = ({ children }) => (
  <Typography.Title className={style.title} level={4}>
    {children}
  </Typography.Title>
);
