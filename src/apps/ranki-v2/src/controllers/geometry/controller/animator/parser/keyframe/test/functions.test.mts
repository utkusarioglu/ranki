import { expect, test } from "vitest";

import type { LegalUnitName } from "../keyframe-parser.types.mjs";

import { KeyframeParser } from "../keyframe-parser.mjs";

const UNIT_VALS = [0, 1, 0.5, 1.5, 3, 7, 11, 37, 100];
const INPUT_VALS = [0, 1, -1, 0.5, 1.5, 3, 7, 11, 37, 100];

const UNIT_NAMES = Object.keys(
  KeyframeParser.unitConversions,
) as LegalUnitName[];

// ANKI for IEEE 754 signed-zero behavior fix
/**
 * @dev
 *
 * #1 IEEE 754 signed-zero behavior fix. without this -1 * 0 would be -0
 */
function* parametrize() {
  for (const unitName of UNIT_NAMES) {
    for (const unitVal of UNIT_VALS) {
      for (const inputVal of INPUT_VALS) {
        const expected = unitVal * inputVal || 0; // #1
        const expression = `= ${unitName}(${inputVal})`;
        const name = `${expression} = ${expected} [${unitVal}]`;
        yield {
          expected,
          expression,
          name,
          unitName,
          unitVal,
        };
      }
    }
  }
}

/**
 * @dev
 * #1 This data is not used. for clarity, it's proper setup is skipped.
 */
for (const { expected, expression, name, unitName, unitVal } of parametrize()) {
  test(name, () => {
    KeyframeParser.UNIT_CONVERSIONS[unitName] = unitVal;
    const response = KeyframeParser.evalKeyframeValue(
      // @ts-expect-error #1
      {},
      //
      null,
      expression,
    );
    expect(response).toEqual(expected);
  });
}
