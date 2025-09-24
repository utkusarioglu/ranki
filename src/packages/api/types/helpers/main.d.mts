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
export declare function zipNodes<Context, ParseNode>(context: Context, alone: ohm.Node, one: ohm.Node, two: ohm.Node): Array<ParseNode>;
/**
 *
 */
export declare function joinNodes<Context, ParseNode>(context: Context, first: ohm.Node, rest: ohm.Node): Array<ParseNode>;
