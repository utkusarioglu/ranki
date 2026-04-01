import type { ErrorCodes } from "../errors/i-dqm-error.types.mjs";

export const DQM_PLUGIN_ERROR_CODES: ErrorCodes = {
  ASSERT_EXISTS: "Required value undefined",
  NEVER_EVENT: "NEVER_EVENT",

  UNDEFINED_MEANING: "Parameter operator's meaning value is unrecognized",

  PARENT_EXPECTED: "PARENT_EXPECTED",
  LEAF_EXPECTED: "LEAF_EXPECTED",
  VALUE_UNDEFINED: "VALUE_UNDEFINED",
};
