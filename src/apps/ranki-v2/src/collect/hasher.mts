export function hasher(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...items: any[]
): string {
  return djb2Hash(JSON.stringify(items)).toString();
}

function djb2Hash(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i); // h * 33 ^ c
  }
  return h >>> 0;
}
