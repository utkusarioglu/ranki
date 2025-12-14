import type { FC } from "react";
import type { FallbackProps } from "react-error-boundary";
import style from "./ErrorFallback.module.css";

export const ErrorFallback: FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  const message = (error.stack || error.message || error || "Error") as string;

  const lines = message.split("\n");
  const first = lines[0];
  const stack = lines
    .slice(1)
    .map((v) => v.trim())
    .join("\n");
  const [errType, content] = first.split(":").map((v) => v.trim());

  return (
    <div role="alert" className={style.container}>
      <div className={style.scroller}>
        <div className={style.content}>
          <h1 className={style.title}>{errType}</h1>
          <pre className={style.message}>{content}</pre>
          <pre className={style.stack}>{stack}</pre>
          <button className={style.reset} onClick={() => resetErrorBoundary()}>
            Reset Error
          </button>
        </div>
      </div>
    </div>
  );
};
