/**
 * @dev
 * #1 These values being populated by Vite.
 * This prevents actual grammar version drifting from the version reported by
 * the plugin
 */

// @ts-expect-error #1
export const version = __VITE_REPLACE_BASE_V2_GRAMMAR_VERSION__;

// @ts-expect-error #1
export const grammar = __VITE_REPLACE_BASE_V2_GRAMMAR_STRING__;
