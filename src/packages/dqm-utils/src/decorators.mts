import { DqmError } from "./error/error.mjs";

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
        if ((this as any)[property] === undefined) {
          throw new DqmError("REQUIRED_VALUE_UNDEFINED", {
            // obj: this,
            key: context.name,
            property,
            properties,
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
    context: ClassMethodDecoratorContext<
      This,
      (this: This, ...args: Args) => Return
    >,
  ) {
    // assertMethodContext(context, {});
    if (!values.length) {
      throw new DqmError("EMPTY_ARRAY", {});
    }

    const handler = function (this: This, ...args: Args): Return {
      const response = value.apply(this, args);
      if (values.some((v) => v === response)) {
        throw new DqmError("UNDEFINED_VALUE", { context });
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
        throw new DqmError("ALREADY_DEFINED", { value });
      }
      return value.apply(this, args);
    };
    Object.assign(handler, { value: handler });
    return handler;
  };
}
