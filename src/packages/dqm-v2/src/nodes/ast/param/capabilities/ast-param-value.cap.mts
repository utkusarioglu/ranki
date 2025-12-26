import type { AstSourceView } from "@dqm/package-dqm-api-v2";
// import { DqmAppError } from "../../../../errors/dqm-app-error/dqm-app-error.mjs";

export function astParamValueCapability<T>(self: T) {
  let values: AstSourceView[] = [];
  // TODO REMOVE THIS
  // let defaultValues: ParamDefaultValue[] = [];

  return {
    // TODO REMOVE THIS
    // setDefaultValues(valueSpec: ParamDefaultValue[]): T {
    //   defaultValues = valueSpec;
    //   return self;
    // },

    // // TODO REMOVE THIS
    // getDefaultValues(): ParamDefaultValue[] {
    //   return defaultValues;
    // },

    setValues(v: AstSourceView[]): T {
      values = v;
      return self;
    },

    getValues(): AstSourceView[] {
      return values;
    },

    // TODO REMOVE THIS
    // checkValues() {
    //   if (values.length > defaultValues.length) {
    //     throw new DqmAppError({
    //       code: "TOO_MANY_VALUES",
    //       why: "Params are tuples and cannot define larger arrays than their default values",
    //       cause: null,
    //       details: {
    //         values: values,
    //         defaults: defaultValues,
    //       },
    //     });
    //   }
    // },
  };
}
