type TryCatchSuccess<T> = {
  state: "success";
  key: Key;
  value: T;
};

type TryCatchFail = {
  state: "fail";
  key: Key;
  value: "(failed)";
  error: unknown;
};

type Key = string | number | symbol;

export type TryCatch<T> = TryCatchSuccess<T> | TryCatchFail;

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
