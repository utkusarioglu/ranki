import type { FC, PropsWithChildren } from "react";
import style from "./PreCode.module.css";

interface PreCodeProps {
  className?: string;
}

export const PreCode: FC<PropsWithChildren<PreCodeProps>> = ({
  children,
  className,
}) => {
  return (
    <pre className={[style.pre, className].filter((v) => v).join(" ")}>
      <code className={style.code}>{children}</code>
    </pre>
  );
};
