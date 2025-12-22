export function tryCatch(cb: () => any) {
  try {
    return cb();
  } catch (e) {
    return "(failed)";
  }
}
