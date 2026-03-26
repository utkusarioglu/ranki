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
export declare function tryCatch<T>(key: Key, callback: () => T): TryCatch<T>;
export declare function tryCatchLeap<T>(o: TryCatch<T>, cb: (n: any) => any): TryCatch<any>;
export {};
//# sourceMappingURL=try-catch.d.mts.map