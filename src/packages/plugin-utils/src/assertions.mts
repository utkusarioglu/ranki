import type * as ohm from "ohm-js";
import type {
  IDqmPluginErrorCode,
  IDqmErrorDetails,
  IDqmPluginError,
} from "@dqm/package-dqm-api-v2";

export function grabError(
  self: ohm.Node,
  code: IDqmPluginErrorCode,
  why: string,
  details?: IDqmErrorDetails,
): IDqmPluginError {
  return self.args.context.callbacks.error(code, why, details);
}

export function grabAssertExists<T>(
  self: ohm.Node,
  value: T,
  why: string,
  details?: IDqmErrorDetails,
): asserts value is NonNullable<T> {
  if (value === undefined) {
    throw grabError(self, "ASSERT_EXISTS", why, {
      value,
      ...details,
    });
  }
}

export function grabAssertNodeExists<T>(
  self: ohm.Node,
  node: any,
  nodeName: string,
  details?: IDqmErrorDetails,
): asserts node is NonNullable<T> {
  grabAssertExists(
    self,
    node,
    `Node ${nodeName} is expected to be present`,
    details,
  );
}
