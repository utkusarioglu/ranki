import type { RankiLangAstContext } from "@ranki/package-api-v2";

export function stringifyContext(context: RankiLangAstContext): string {
  return [
    context.plugin.type,
    JSON.stringify(context.hooks.getConfig().merged),
  ].join("");
}

export function djb2Hash(str: string) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i); // h * 33 ^ c
  }
  return h >>> 0;
}
