export function crawl(c: any, path?: string) {
  if (!path) {
    return c;
  }
  const splat = path.split(".");
  try {
    let current = c;
    while (splat.length) {
      const u = splat.shift();
      if (u && current[u] !== undefined) {
        current = current[u];
      } else {
        return {
          ...current,
        };
      }
    }
    return {
      [path]: current,
    };
  } catch (e) {
    return c;
  }
}
