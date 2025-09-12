/**
 * Similar to zipmap in python,
 * It's used with ohmjs methods such as nonemptyListOf, which return
 * 3 params : (<first item>, <all separators>, <all other items>)
 * It offers standardized behavior to merge <all separators> and <all other items>
 */
export function zip<Sep, Item>(
  first: Item,
  one: Array<Sep>,
  two: Array<Item>,
): Array<Sep | Item> {
  if (one.length !== two.length) {
    console.log(first, one, two);
    throw new Error("UNEQUAL LENGTHS");
  }
  return one.reduce(
    (a, c, i) => {
      a.push(c);
      a.push(two[i]);
      return a;
    },
    [first] as Array<Sep | Item>,
  );
}
