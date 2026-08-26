import type { IDqmError } from "@dqm/package-dqm-api-v2";
import type { FC } from "react";
import type { FallbackProps } from "react-error-boundary";

import { Scroller } from "_views/scroller/Scroller";
import { YamlDisplay } from "_views/yaml-display/YamlDisplay";
import yaml from "yaml";

import style from "./ErrorFallback.module.css";

type Attempt = AttemptFail | AttemptSuccess;

interface AttemptFail {
  comment: string;
  error: any;
  method: string;
  raw: O;
  success: false;
}

interface AttemptSuccess {
  comment: string;
  method: string;
  raw: O;
  success: true;
  value: any;
}
type ErrorCall = {
  comment: string;
  error: () => O;
  method: string;
  stringify: (error: O) => string;
};

type O = object | string;

const attempt = (fn: ErrorCall): Attempt => {
  let raw: O = "(failed)";
  try {
    raw = fn.error();
    return {
      comment: fn.comment,
      method: fn.method,
      raw,
      success: true,
      value: fn.stringify(raw),
    };
  } catch (err) {
    return {
      comment: fn.comment,
      error: err,
      method: fn.method,
      raw,
      success: false,
    };
  }
};

export const ErrorFallback: FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  console.log("ERROR:", error);

  const customErr = error as IDqmError;
  const errorVisualizationAttempts: Attempt[] = [];

  const errorCalls: ErrorCall[] = [
    {
      comment: "Errors and their causes have successfully been parsed.",
      error: () => customErr.toExtendedJSON(),
      method: "toExtendedJSON",
      stringify: (e) => yaml.stringify(e),
    },
    {
      comment:
        "Extended error parsing has failed. Standard JSON parsing is utilized instead.",
      error: () => customErr.toJSON(),
      method: "toJSON",
      stringify: (e) => yaml.stringify(e),
    },
    {
      comment:
        "The error messages couldn't be parsed as JSON. You are viewing the string version of the error",
      error: () => customErr.toString(),
      method: "toString",
      stringify: (e) => e.toString(),
    },
  ];

  for (const fn of errorCalls) {
    errorVisualizationAttempts.push(attempt(fn));
  }

  const errorVisualization = errorVisualizationAttempts.find(
    (v) => v.success,
  ) || {
    comment: [
      "No visualization method succeeded in producing a serializable response.",
      "You are viewing the fallback method. Please consult the console for more details.",
    ].join(" "),
    value: errorVisualizationAttempts,
  };

  console.log("VISUALIZATIONS", errorVisualizationAttempts);

  return (
    <div className={style.container} role="alert">
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
