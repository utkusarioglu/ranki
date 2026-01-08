export function randomColor(scheme: "light" | "dark") {
  const h = Math.random() * 360;
  const s = 60 + Math.random() * 20; // avoid gray/muted
  const l =
    scheme === "dark"
      ? 20 + Math.random() * 20 // 20–40%
      : 65 + Math.random() * 20; // 65–85%

  return `hsl(${h} ${s}% ${l}%)`;
}
