import type { SanitizeSuccess, SanitizeFail } from "../../../export.mjs";

export type SanitizeModes<T extends object> = SanitizeSuccess<T> | SanitizeFail;
