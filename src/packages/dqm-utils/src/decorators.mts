import { assertArrayNotEmpty } from "./assertions.mjs";
import { DqmUtilError } from "./util-error/util-error.mjs";

// ANKI this is the new decorator syntax
export function dependsOn(...properties: string[]) {
  return function <This extends any, Args extends any[], Return>(
    value: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<
      This,
      (this: This, ...args: Args) => Return
    >,
  ) {
    // assertMethodContext(context, { properties });

    const handler = function (this: This, ...args: Args): Return {
      properties.forEach((property) => {
        const val = (this as any)[property];
        if (val === undefined || val === null) {
          throw new DqmUtilError({
            code: "REQUIRED_VALUE_UNDEFINED",
            why: "A value required by the class method is undefined",
            cause: null,
            details: {
              key: context.name,
              property,
              properties,
            },
          });
        }
      });

      return value.apply(this, args);
    };

    Object.assign(handler, { value: handler });

    return handler;
  };
}

export function rejectValues(...values: any[]) {
  return function <This extends any, Args extends any[], Return>(
    value: (this: This, ...args: Args) => Return,
    _context: ClassMethodDecoratorContext<
      This,
      (this: This, ...args: Args) => Return
    >,
  ) {
    // assertMethodContext(context, {});
    assertArrayNotEmpty(values, {
      why: "rejectValues requires a non-empty array of values to know what to reject.",
    });
    // if (!values.length) {
    //   throw new DqmUtilError("EMPTY_ARRAY", {});
    // }

    const handler = function (this: This, ...args: Args): Return {
      const response = value.apply(this, args);
      if (values.some((v) => v === response)) {
        throw new DqmUtilError({
          code: "VALUE_REJECTED",
          why: "The method returned a value that it was required to reject",
          cause: null,
          details: {
            response,
            values,
          },
        });
      }
      return response;
    };
    Object.assign(handler, { value: handler });

    return handler;
  };
}

export function writeOnce(targetKey: string) {
  return function <This extends any, Args extends any[], Return>(
    value: (this: This, ...args: Args) => Return,
    _context: ClassMethodDecoratorContext<
      This,
      (this: This, ...args: Args) => Return
    >,
  ) {
    // assertMethodContext(context, {});
    const handler = function (this: This, ...args: Args): Return {
      if ((this as any)[targetKey] !== undefined) {
        throw new DqmUtilError({
          code: "ALREADY_DEFINED",
          why: "A method that can only be set once was called a second time",
          cause: null,
          details: { value },
        });
      }
      return value.apply(this, args);
    };
    Object.assign(handler, { value: handler });
    return handler;
  };
}
