import { type TryCatch } from "../../utils/try-catch.mjs";
export type ClassSanitizerUnion<T> = T extends any ? ClassSanitizer<T> : never;
export type ClassSanitizer<T> = {
    [K in keyof T]: T[K] extends (...args: infer A) => infer R ? (...args: A) => TryCatch<R> : TryCatch<T[K]>;
} & {
    original: T;
};
export declare function createSanitizedView<C extends object>(source: C): ClassSanitizer<C>;
//# sourceMappingURL=sanitizer.d.mts.map