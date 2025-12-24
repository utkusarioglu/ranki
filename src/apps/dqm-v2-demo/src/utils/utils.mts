type TryCatchSuccess<T> = {
  state: "success";
  value: T;
};

type TryCatchFail = {
  state: "fail";
  error: unknown;
};

type TryCatch<T> = TryCatchSuccess<T> | TryCatchFail;

export function tryCatch<T>(cb: () => T): TryCatch<T> {
  try {
    return {
      state: "success",
      value: cb() as T,
    };
  } catch (e) {
    return {
      state: "fail",
      error: e,
    };
  }
}
