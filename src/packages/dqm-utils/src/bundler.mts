import fs from "node:fs";
import path from "node:path";

/**
 * Standardizes vite's bundling of the given ohm grammar and its versioning
 *
 * @param placeholderUp customizes the variable name:
 * __VITE_REPLACE_${placeholderUp}_GRAMMAR_VERSION__ and alike
 * @param version determines the version to look for in the root path
 * @param rootPath the path at which the version file is expected to be found
 * @returns
 */
export function bundleOhm(
  version: string,
  placeholderUp: string,
  rootPath: string,
) {
  const sourcePath = path.join(rootPath, [version, "ohm"].join("."));

  return {
    [`__VITE_REPLACE_${placeholderUp}_GRAMMAR_VERSION__`]:
      JSON.stringify(version),
    [`__VITE_REPLACE_${placeholderUp}_GRAMMAR_STRING__`]: JSON.stringify(
      fs.readFileSync(sourcePath).toString(),
    ),
  };
}
