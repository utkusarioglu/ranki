import { DqmDebugError, } from "./dqm-debug-error.mjs";
export function assertExists(v, extra) {
    if (v === undefined) {
        throw new DqmDebugError({
            code: "VALUE_UNDEFINED",
            cause: null,
            ...extra,
        });
    }
}
export function assertNever(extra) {
    throw new DqmDebugError({
        code: "NEVER_EVENT",
        cause: null,
        ...extra,
    });
}
export function assertTryCatchSuccess(v, extra) {
    if (v.state === "fail") {
        throw new DqmDebugError({
            code: "TRY_CATCH_FAIL",
            cause: v.error,
            ...extra,
        });
    }
}
