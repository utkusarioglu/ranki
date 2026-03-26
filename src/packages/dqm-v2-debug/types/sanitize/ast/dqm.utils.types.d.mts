import type { DqmParseOutput } from "@dqm/package-dqm-api-v2";
interface SanitizeResultSuccess {
    state: "success";
    data: DqmParseOutput;
}
interface ParseResultFail {
    state: "fail";
    error: string;
}
export type SanitizedParseResult = SanitizeResultSuccess | ParseResultFail;
export {};
//# sourceMappingURL=dqm.utils.types.d.mts.map