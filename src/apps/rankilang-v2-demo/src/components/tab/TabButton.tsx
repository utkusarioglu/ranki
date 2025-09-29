import type { FC, SyntheticEvent, PropsWithChildren } from "react";
import style from "./tab-button.module.css";

interface TabButtonProps {
  isActive: boolean;
  onClick: (e: SyntheticEvent) => void;
}

export const TabButton: FC<PropsWithChildren<TabButtonProps>> = ({
  isActive,
  onClick,
  children,
}) => (
  <button
    className={[style.tabButton, isActive && style.tabButtonActive]
      .filter((v) => !!v)
      .join(" ")}
    onClick={onClick}
  >
    {children}
  </button>
);
