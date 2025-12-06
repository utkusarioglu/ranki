import { Typography } from "antd";
import style from "./AppTitle.module.css";

export const AppTitle = () => (
  <Typography.Title style={{ margin: 0 }} level={3}>
    Dqm<span className={style.version}>v2</span>
  </Typography.Title>
);
