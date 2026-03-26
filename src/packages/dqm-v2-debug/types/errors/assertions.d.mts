import type { TryCatch, TryCatchSuccess } from "../utils/try-catch.mjs";
import { type DqmPluginErrorConstructorParams } from "./dqm-debug-error.mjs";
type AssertionExtra = Pick<DqmPluginErrorConstructorParams, "why" | "details">;
export declare function assertExists(v: any, extra: AssertionExtra): asserts v is object;
export declare function assertNever(extra: AssertionExtra): never;
export declare function assertTryCatchSuccess<T>(v: TryCatch<T>, extra: AssertionExtra): asserts v is TryCatchSuccess<T>;
export {};
//# sourceMappingURL=assertions.d.mts.map