export type DeepPartialSerializable<T> = T extends Primitive
  ? T
  : T extends readonly (infer U)[]
  ? readonly DeepPartialSerializable<U>[]
  : T extends object
  ? {
      [K in keyof T]?: DeepPartialSerializable<T[K]>;
    }
  : never;

type Primitive = boolean | null | number | string | undefined;
