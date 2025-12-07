import { Empty } from "antd";
import type { CSSProperties, FC } from "react";
import style from "./AppNonIdeal.module.css";

interface AppNonIdealProps {
  Icon: FC<{ style: CSSProperties }>;
  text: string;
}

export const AppNonIdeal: FC<AppNonIdealProps> = ({ Icon, text }) => (
  <div className={style.container}>
    <Empty image={<Icon style={{ fontSize: "80px" }} />} description={text} />
  </div>
);
