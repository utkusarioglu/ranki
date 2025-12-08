import { Typography } from "antd";
import style from "./AppTitle.module.css";
import { useNavigate } from "@tanstack/react-router";

export const AppTitle = () => {
  const navigate = useNavigate();
  return (
    <Typography.Title
      className={style.title}
      onClick={() => navigate({ to: "/" })}
      level={3}
    >
      Dqm<span className={style.version}>v2</span>
    </Typography.Title>
  );
};
