import type * as ohm from "ohm-js";

/**
 * @dev
 * Outdated doc
 *
 * Similar to zipmap in python,
 * It's used with ohmjs methods such as nonemptyListOf, which return
 * 3 params : (<first item>, <all separators>, <all other items>)
 * It offers standardized behavior to merge <all separators> and <all other items>
 */
export function zipNodes<Context, ParseNode>(
  context: Context,
  alone: ohm.Node,
  // one: Array<Sep>,
  one: ohm.Node,
  // two: Array<Item>,
  two: ohm.Node,
): Array<ParseNode> {
  if (one.length !== two.length) {
    console.log(alone, one, two);
    throw new Error("UNEQUAL LENGTHS");
  }
  const aloneNode = alone.node(context) as ParseNode;
  const oneNode = one.iterNode(context) as ParseNode[];
  const twoNode = two.iterNode(context) as ParseNode[];
  return oneNode.reduce(
    (a, c, i) => {
      a.push(c);
      a.push(twoNode[i]);
      return a;
    },
    [aloneNode] as Array<ParseNode>,
  );
}

/**
 *
 */
export function joinNodes<Context, ParseNode>(
  context: Context,
  first: ohm.Node,
  rest: ohm.Node,
): Array<ParseNode> {
  return [first.node(context), ...rest.iterNode(context)];
}
