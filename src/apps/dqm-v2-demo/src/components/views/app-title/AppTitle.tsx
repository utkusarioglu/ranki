import { useNavigate } from "@tanstack/react-router";
import { Typography } from "antd";

import style from "./AppTitle.module.css";

export const AppTitle = () => {
  const navigate = useNavigate();
  return (
    <Typography.Title
      className={style.title}
      level={3}
      onClick={() => navigate({ to: "/" })}
    >
      Dqm<span className={style.version}>v2</span>
    </Typography.Title>
  );
};
