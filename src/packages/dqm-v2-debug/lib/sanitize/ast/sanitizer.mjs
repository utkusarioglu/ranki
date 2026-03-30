import { tryCatch } from "../../utils/try-catch.mjs";
// ANKI
function getAllMethodKeys(obj) {
    const keys = new Set();
    let cur = obj;
    while (cur && cur !== Object.prototype) {
        for (const k of Reflect.ownKeys(cur)) {
            if (k !== "constructor")
                keys.add(k);
        }
        cur = Object.getPrototypeOf(cur);
    }
    return [...keys];
}
// ANKI
function wrapWithTryCatch(instance, consume) {
    const out = Object.create(Object.getPrototypeOf(instance));
    for (const k of getAllMethodKeys(instance)) {
        const desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(instance), k) ??
            Object.getOwnPropertyDescriptor(instance, k);
        if (!desc)
            continue;
        if (typeof desc.value === "function") {
            Object.defineProperty(out, k, {
                ...desc,
                value: (...args) => consume(k, () => desc.value.apply(instance, args)),
            });
        }
        else {
            Object.defineProperty(out, k, desc);
        }
    }
    return out;
}
export function createSanitizedView(source) {
    const sanitized = wrapWithTryCatch(source, tryCatch);
    return Object.assign(sanitized, {
        original: source,
    });
}
