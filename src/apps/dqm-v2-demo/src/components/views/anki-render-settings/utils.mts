export function getAspect(a: string): number {
  const [n, d] = a.split(":").map((v) => +v) as [number, number];
  const f = n / d;
  return f;
}

export function getAspectText(a: string, f: number) {
  if (f > 1) {
    return "Landscape " + a;
  } else if (f < 1) {
    return "Portrait " + a;
  } else {
    return "Square";
  }
}
