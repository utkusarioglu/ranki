import type { FC, PropsWithChildren } from "react";

import style from "./ExceptionCard.module.css";

export const ExceptionCard: FC<PropsWithChildren> = ({ children }) => {
  return <div className={style.container}>{children}</div>;
};
