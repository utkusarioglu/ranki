import type { PropsWithChildren, FC } from "react";
import style from "./tab-button-container.module.css";

export const TabButtonContainer: FC<PropsWithChildren> = ({ children }) => (
  <div className={style.tabButtonContainer}>{children}</div>
);
