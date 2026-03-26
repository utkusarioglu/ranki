/**
 *
 * @param key This is meant as an error id. can be removed if it doesn't
 * deliver the expected use.
 * @param callback
 * @returns
 */
export function tryCatch(key, callback) {
    try {
        return {
            key,
            state: "success",
            value: callback(),
        };
    }
    catch (e) {
        return {
            state: "fail",
            value: "(failed)",
            key,
            error: e,
        };
    }
}
export function tryCatchLeap(o, cb) {
    if (o.state === "fail") {
        return o;
    }
    else {
        return tryCatch("1", () => cb(o.value));
    }
}
