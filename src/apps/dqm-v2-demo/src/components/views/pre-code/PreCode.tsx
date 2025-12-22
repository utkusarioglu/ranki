import type { FC, PropsWithChildren } from "react";
import style from "./PreCode.module.css";

interface PreCodeProps {
  className?: string;
  padded?: boolean;
}

export const PreCode: FC<PropsWithChildren<PreCodeProps>> = ({
  children,
  className,
  padded = true,
}) => {
  return (
    <pre
      className={[style.pre, className, padded && style.padded]
        .filter((v) => v)
        .join(" ")}
    >
      <code className={style.code}>{children}</code>
    </pre>
  );
};
