if (typeof Map !== "undefined") {
  // @ts-expect-error
  const orig = Map.prototype.values;
  // @ts-expect-error
  Map.prototype.values = function () {
    // @ts-expect-error
    const out = [];
    this.forEach((v) => out.push(v));
    // @ts-expect-error
    return out;
  };
}
