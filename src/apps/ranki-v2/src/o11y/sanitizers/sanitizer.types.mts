export type SanitizerFunc = (v: unknown, seen?: WeakSet<object>) => unknown;
