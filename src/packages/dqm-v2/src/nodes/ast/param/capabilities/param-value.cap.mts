import type { AstSourceView, ParamDefaultValue } from "@dqm/package-dqm-api-v2";
import { DqmAppError } from "../../../../errors/dqm-app-error/dqm-app-error.mjs";

export function paramValueCapability<T>(self: T) {
  let values: AstSourceView[] = [];
  let defaultValues: ParamDefaultValue[] = [];

  return {
    setDefaultValues(valueSpec: ParamDefaultValue[]): T {
      defaultValues = valueSpec;
      return self;
    },

    getDefaultValues(): ParamDefaultValue[] {
      return defaultValues;
    },

    setValues(v: AstSourceView[]): T {
      values = v;
      return self;
    },

    getValues(): AstSourceView[] {
      return values;
    },

    checkValues() {
      if (values.length > defaultValues.length) {
        throw new DqmAppError({
          code: "TOO_MANY_VALUES",
          why: "Params are tuples and cannot define larger arrays than their default values",
          cause: null,
          details: {
            values: values,
            defaults: defaultValues,
          },
        });
      }
    },
  };
}
