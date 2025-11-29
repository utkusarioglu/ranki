import { DqmError } from "@ranki/package-utils";

// ANKI this is the new decorator syntax
// export function requiresSpecs<This extends any, Args extends any[], Return>(
//   value: (this: This, ...args: Args) => Return,
//   context: ClassMethodDecoratorContext<
//     This,
//     (this: This, ...args: Args) => Return
//   >,
// ) {
//   if (context.kind !== "method") {
//     throw new DqmError("INCOMPATIBLE_DECORATOR", { context });
//   }

//   return function (this: This, ...args: Args): Return {
//     if ((this as any).specs === undefined) {
//       throw new DqmError("REQUIRED_VALUE_UNDEFINED", {
//         obj: this,
//         key: context.name,
//       });
//     }

//     return value.apply(this, args);
//   };
// }

// ANKI this is the new decorator syntax
export function dependsOn(...properties: string[]) {
  return function <This extends any, Args extends any[], Return>(
    value: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<
      This,
      (this: This, ...args: Args) => Return
    >,
  ) {
    if (context.kind !== "method") {
      throw new DqmError("INCOMPATIBLE_DECORATOR", { context });
    }

    return function (this: This, ...args: Args): Return {
      properties.forEach((property) => {
        if ((this as any)[property] === undefined) {
          throw new DqmError("REQUIRED_VALUE_UNDEFINED", {
            obj: this,
            key: context.name,
            property,
            properties,
          });
        }
      });

      return value.apply(this, args);
    };
  };
}

export function nonNullable<This extends any, Args extends any[], Return>(
  value: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<
    This,
    (this: This, ...args: Args) => Return
  >,
) {
  if (context.kind !== "method") {
    throw new DqmError("INCOMPATIBLE_DECORATOR", { context });
  }

  return function (this: This, ...args: Args): Return {
    const response = value.apply(this, args);
    if (response === undefined) {
      throw new DqmError("UNDEFINED_VALUE", { context });
    }
    return response;
  };
}

export function writeOnce(targetKey: string) {
  return function <This extends any, Args extends any[], Return>(
    value: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<
      This,
      (this: This, ...args: Args) => Return
    >,
  ) {
    if (context.kind !== "method") {
      throw new DqmError("INCOMPATIBLE_DECORATOR", { context });
    }

    return function (this: This, ...args: Args): Return {
      if ((this as any)[targetKey] !== undefined) {
        throw new DqmError("ALREADY_DEFINED", { value });
      }
      return value.apply(this, args);
    };
  };
}
