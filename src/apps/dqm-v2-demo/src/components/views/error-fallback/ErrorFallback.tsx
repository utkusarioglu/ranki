import type { FC } from "react";
import type { FallbackProps } from "react-error-boundary";
import style from "./ErrorFallback.module.css";
import yaml from "yaml";
import type { IDqmError } from "@dqm/package-dqm-api-v2";
import { Scroller } from "_views/scroller/Scroller";
import { YamlDisplay } from "_views/yaml-display/YamlDisplay";

export const ErrorFallback: FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  console.log("eee", error);
  // const message = (error.stack || error.message || error || "Error") as string;

  // const lines = message.split("\n");
  // const first = lines[0];
  // const stack = lines
  //   .slice(1)
  //   .map((v) => v.trim())
  //   .join("\n");
  // const [errType, content] = first.split(":").map((v) => v.trim());

  let j: {} = {};
  // @ts-ignore
  let e = "";
  try {
    j = (error as IDqmError).toExtendedJSON();
    e = yaml.stringify(j);
  } catch (rr) {
    e = error;
  }

  return (
    <div role="alert" className={style.container}>
      <Scroller direction="vertical">
        <div className={style.content}>
          <h1 className={style.title}>Error</h1>
          {/* <h1 className={style.title}>{errType}</h1>
          <pre className={style.message}>{content}</pre>
          <pre className={style.stack}>{stack}</pre> */}
          <YamlDisplay obj={j} />
          {/* <pre>{e}</pre> */}
          <button className={style.reset} onClick={() => resetErrorBoundary()}>
            Reset Error
          </button>
        </div>
      </Scroller>
    </div>
  );
};
