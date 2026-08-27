export function getClassType(e: Element) {
  return e.className.split(" ").at(-1)!.trim(); // #1
}

export function getResourceType(e: Element) {
  return e.className.split(" ")[0].replace("r2-", "").trim(); // #1
}
