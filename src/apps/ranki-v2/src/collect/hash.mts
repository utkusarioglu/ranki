function djb2Hash(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i); // h * 33 ^ c
  }
  return h >>> 0;
}

export function hash(str: string): string {
  return djb2Hash(str).toString();
}
