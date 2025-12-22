import type { FC } from "react";
import type { FallbackProps } from "react-error-boundary";
import style from "./ErrorFallback.module.css";
import yaml from "yaml";
import type { IDqmError } from "@dqm/package-dqm-api-v2";
import { Scroller } from "_views/scroller/Scroller";
import { YamlDisplay } from "_views/yaml-display/YamlDisplay";

type Attempt = AttemptSuccess | AttemptFail;

type O = object | string;

interface AttemptSuccess {
  success: true;
  raw: O;
  method: string;
  value: any;
  comment: string;
}
interface AttemptFail {
  success: false;
  raw: O;
  method: string;
  error: any;
  comment: string;
}

type ErrorCall = {
  error: () => O;
  stringify: (error: O) => string;
  method: string;
  comment: string;
};

const attempt = (fn: ErrorCall): Attempt => {
  let raw: O = "(failed)";
  try {
    raw = fn.error();
    return {
      success: true,
      raw,
      value: fn.stringify(raw),
      method: fn.method,
      comment: fn.comment,
    };
  } catch (err) {
    return {
      success: false,
      raw,
      error: err,
      method: fn.method,
      comment: fn.comment,
    };
  }
};

export const ErrorFallback: FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  console.log("ERROR:", error);

  const customErr = error as IDqmError;
  let errorVisualizationAttempts: Attempt[] = [];

  const errorCalls: ErrorCall[] = [
    {
      error: () => customErr.toExtendedJSON(),
      stringify: (e) => yaml.stringify(e),
      method: "toExtendedJSON",
      comment: "Errors and their causes have successfully been parsed.",
    },
    {
      error: () => customErr.toJSON(),
      stringify: (e) => yaml.stringify(e),
      method: "toJSON",
      comment:
        "Extended error parsing has failed. Standard JSON parsing is utilized instead.",
    },
    {
      error: () => customErr.toString(),
      stringify: (e) => e.toString(),
      method: "toString",
      comment:
        "The error messages couldn't be parsed as JSON. You are viewing the string version of the error",
    },
  ];

  for (const fn of errorCalls) {
    errorVisualizationAttempts.push(attempt(fn));
  }

  const errorVisualization = errorVisualizationAttempts.find(
    (v) => v.success,
  ) || {
    value: errorVisualizationAttempts,
    comment: [
      "No visualization method succeeded in producing a serializable response.",
      "You are viewing the fallback method. Please consult the console for more details.",
    ].join(" "),
  };

  console.log("VISUALIZATIONS", errorVisualizationAttempts);

  return (
    <div role="alert" className={style.container}>
      <Scroller direction="vertical">
        <div className={style.content}>
          <h1 className={style.title}>Error</h1>
          {errorVisualization.comment ? (
            <p>{errorVisualization.comment}</p>
          ) : null}
          <YamlDisplay obj={errorVisualization.value} />
          <button className={style.reset} onClick={() => resetErrorBoundary()}>
            Reset Error
          </button>
        </div>
      </Scroller>
    </div>
  );
};
