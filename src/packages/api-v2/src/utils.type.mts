// ANKI
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object
    ? T[K] extends Function
      ? T[K]
      : DeepPartial<T[K]>
    : T[K];
};

export type NoDot<S extends string = string> = S extends `${string}.${string}`
  ? never
  : S;

export type AlwaysDot<S extends string = string> =
  S extends `${infer Head}.${infer Tail}`
    ? Head extends "" | `${string}.${string}`
      ? never
      : AlwaysDot<Tail>
    : S extends "" | `${string}.${string}`
    ? never
    : S;
