/**
 * FIX if anki maps are broken, it's likely because this polyfill isn't working
 * as expected.Be aware that any change in this may break otel tracing
 *
 * @dev
 * #1 used for convenience
 * */
if (typeof Map !== "undefined") {
  const orig = Map.prototype.values;

  if (!orig) {
    // @ts-expect-error #1
    Map.prototype.values = function () {
      // @ts-expect-error #1
      const out = [];
      this.forEach((v) => out.push(v));
      // @ts-expect-error #1
      return out;
    };
  }
}

/**
 * This version definitely works with anki windows
 */
// if (typeof Map !== "undefined") {
//   // @ts-expect-error
//   const orig = Map.prototype.values;
//   // @ts-expect-error
//   Map.prototype.values = function () {
//     // @ts-expect-error
//     const out = [];
//     this.forEach((v) => out.push(v));
//     // @ts-expect-error
//     return out;
//   };
// }
