export type TryCatchSuccess<T> = {
  state: "success";
  key: Key;
  value: T;
};

export type TryCatchFail = {
  state: "fail";
  key: Key;
  value: "(failed)";
  error: unknown;
};

type Key = string | number | symbol;

export type TryCatch<T> = TryCatchSuccess<T> | TryCatchFail;

/**
 *
 * @param key This is meant as an error id. can be removed if it doesn't
 * deliver the expected use.
 * @param callback
 * @returns
 */
export function tryCatch<T>(key: Key, callback: () => T): TryCatch<T> {
  try {
    return {
      key,
      state: "success",
      value: callback() as T,
    };
  } catch (e) {
    return {
      state: "fail",
      value: "(failed)",
      key,
      error: e,
    };
  }
}

export function tryCatchLeap<T>(o: TryCatch<T>, cb: (n: any) => any) {
  if (o.state === "fail") {
    return o;
  } else {
    return tryCatch("1", () => cb(o.value));
  }
}
export type TryCatchRecord<T extends object> = {
  [K in keyof T]: T[K] extends any ? TryCatch<T[K]> : never;
};
export type TryCatchCall<T extends object> = {
  [K in keyof T]: () => TryCatch<T[K]>;
};
