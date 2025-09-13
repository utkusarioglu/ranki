import * as fs from "node:fs";
import * as ohm from "ohm-js";
import * as path from "path";
import { zip } from "@ranki/package-api/helpers";
import type { ParseNode } from "./types.mjs";
import { ignoreAction } from "./ignore.action.mjs";
import { basicAction } from "./basic.action.mjs";
import { richTextAction } from "./rich-text.action.mjs";

export const LANGUAGE = "./assets/ohm/2.0.54";

function level(filename: string, opts) {
  const src = fs
    .readFileSync(path.join(LANGUAGE, `${filename}.ohm`))
    .toString();
  return ohm.grammar(src, opts);
}

export function parse(configSrc: string, raw: string) {
  const RankiConfig = ohm.grammar(configSrc);

  const RankiIgnore = level("2-ignore", { RankiConfig });
  const RankiBasic = level("3-basic", { RankiConfig, RankiIgnore });
  const RankiRichText = level("4-rich-text", {
    RankiConfig,
    RankiIgnore,
    RankiBasic,
  });

  const matcher = RankiRichText;

  const semantics = matcher
    .createSemantics()
    // .addOperation<ParseNode[]>("iter", {
    //   _iter(...children) {
    //     return children.map((c) => c.node());
    //   },
    // })

    // .addOperation<NodeLeafSource>("leafSource", {
    //   eNotation(sign, integer, dot, decimal, e, exponentSign, exponent) {
    //     // type: "eNotation";
    //     // sign: 1 | -1;
    //     // integer: number;
    //     // decimal: number;
    //     // exponentSign: 1 | -1;
    //     // exponent: number;
    //     return {
    //       type: "eNotation",
    //       sign: -1,
    //       integer: +integer.sourceString,
    //       decimal: +decimal.sourceString,
    //       exponentSign: -1,
    //       exponent: +exponent.sourceString,
    //     };
    //   },
    //   decimal(sign, integer, dot, decimal) {
    //     return {
    //       type: "decimal",
    //       sign: -1,
    //       integer: +integer.sourceString,
    //       decimal: +decimal.sourceString,
    //     };
    //   },
    //   complexInteger(integer, wi1, operator, wi2, complex, i) {
    //     return {
    //       type: "complexInteger",
    //       real: {
    //         sign: -1,
    //         integer: +integer.sourceString,
    //       },
    //       complex: {
    //         sign: operator.sourceString === "-" ? -1 : 1,
    //         integer: +complex.sourceString,
    //       },
    //     };
    //   },
    //   // lower(chars) {
    //   //   return {
    //   //     type: "lowercase",
    //   //     value: chars.sourceString,
    //   //   };
    //   // },
    //   // _iter(...children) {
    //   //   return {
    //   //     type: "lowercase",
    //   //     value: children.map((c) => c.sourceString).join(""),
    //   //   };
    //   // },
    // })

    .addOperation<ParseNode>("node", {
      ...ignoreAction,
      ...basicAction,
      ...richTextAction,
    });
  //   {
  //   /*
  // RANKI IGNORE
  // */
  //   /*
  // RANKI TEXT
  // */
  //   document_blocks(whitespace1, documentList, whitespace2) {
  //     return {
  //       kind: "parent",
  //       type: this.ctorName,
  //       args: [],
  //       // others: [],
  //       // contentTrimmed: documentList.sourceString.trim(),
  //       // content: documentList.sourceString,
  //       children: documentList.node().children,
  //     };
  //   },
  //   documentList(block, blockSep, block2) {
  //     // console.log(block.iter());
  //     return {
  //       kind: "parent",
  //       type: this.ctorName,
  //       args: [],
  //       // contentTrimmed: "",
  //       // content: "",
  //       // children: [block.eval(), ...block2.eval().map((b) => b.eval())],
  //       // children: [block.eval()],
  //       children: block.iter(),
  //     };
  //   },
  //   block(p) {
  //     return p.node();
  //     // return {
  //     //   kind: "parent",
  //     //   type: "block",
  //     //   children: p.node(),
  //     // };
  //     // return p.eval();
  //   },
  //   p(pLine, nl, pLine2) {
  //     return {
  //       kind: "parent",
  //       type: this.ctorName,
  //       args: [],
  //       children: zip(pLine.node(), nl.iter(), pLine2.iter()),
  //       // ...pLine2.iter().map((p) => p.node())
  //     };
  //   },
  //   pLine(
  //     indentation,
  //     pAlignment,
  //     pHeading,
  //     pContent,
  //     clearance,
  //     pContent2,
  //     wi,
  //   ) {
  //     return {
  //       kind: "parent",
  //       type: this.ctorName,
  //       args: [],
  //       children: [
  //         indentation.node(),
  //         ...zip(pContent.node(), clearance.iter(), pContent2.iter()),
  //         wi.node(),
  //       ],
  //     };
  //   },

  //   pProse(pDecoration, clearance, pDecoration2) {
  //     return {
  //       kind: "parent",
  //       type: this.ctorName,
  //       args: [],
  //       children: zip(
  //         pDecoration.node(),
  //         clearance.iter(),
  //         pDecoration2.iter(),
  //       ),
  //     };
  //   },
  //   pText(pWord, clearance, pWord2) {
  //     return {
  //       kind: "parent",
  //       type: this.ctorName,
  //       args: [],
  //       children: zip(pWord.node(), clearance.iter(), pWord2.iter()),
  //     };
  //   },
  //   pWordNumber_complexInteger(w, letterPlus, terminator) {
  //     return {
  //       kind: "leaf",
  //       type: this.ctorName,
  //       args: [],
  //       source: letterPlus.leafSource(),
  //       // w.sourceString,
  //     };
  //   },
  //   pWordNumber_eNotation(w, letterPlus, terminator) {
  //     return {
  //       kind: "leaf",
  //       type: this.ctorName,
  //       args: [],
  //       source: letterPlus.leafSource(),
  //       // w.sourceString,
  //     };
  //   },
  //   pWordNumber_decimal(w, letterPlus, terminator) {
  //     return {
  //       kind: "leaf",
  //       type: this.ctorName,
  //       args: [],
  //       source: letterPlus.leafSource(),
  //     };
  //   },
  //   pWordNumber_integer(w, letterPlus, terminator) {
  //     return {
  //       kind: "leaf",
  //       type: this.ctorName,
  //       args: [],
  //       source: letterPlus.leafSource(),
  //     };
  //   },
  //   // pWord_number(w, letterPlus, terminator) {
  //   //   return {
  //   //     kind: "leaf",
  //   //     type: this.ctorName,
  //   //     args: [],
  //   //     source: letterPlus.leafSource(),
  //   //   };
  //   // },
  //   pWordText_uppercase(w, letterPlus, terminator) {
  //     return {
  //       kind: "leaf",
  //       type: this.ctorName,
  //       args: [],
  //       // source: letterPlus.leafSource(),
  //       source: {
  //         type: "uppercase",
  //         value: letterPlus.sourceString,
  //       },
  //     };
  //   },
  //   pWordText_lowercase(w, letterPlus, terminator) {
  //     return {
  //       kind: "leaf",
  //       type: this.ctorName,
  //       args: [],
  //       source: {
  //         type: "lowercase",
  //         value: letterPlus.sourceString,
  //       },
  //     };
  //   },
  //   pWordText_text(w, letterPlus, terminator) {
  //     return {
  //       kind: "leaf",
  //       type: this.ctorName,
  //       args: [],
  //       // source: letterPlus.leafSource(),
  //       source: {
  //         type: "text",
  //         value: letterPlus.sourceString,
  //       },
  //     };
  //   },
  //   pWord_mixed(pChar, terminator) {
  //     return {
  //       kind: "leaf",
  //       type: this.ctorName,
  //       args: [],
  //       // source: pChar.leafSource(),
  //       source: {
  //         type: "text",
  //         value: pChar.sourceString,
  //       },
  //     };
  //   },
  //   clearance(spacePlus) {
  //     return {
  //       kind: "leaf",
  //       type: this.ctorName,
  //       args: [],
  //       source: {
  //         type: "mixed", // don't like this
  //         value: spacePlus.sourceString,
  //       },
  //     };
  //   },
  //   indentation(spaces) {
  //     return {
  //       kind: "leaf",
  //       type: this.ctorName,
  //       args: [],
  //       source: {
  //         type: "mixed", // don't like this
  //         value: spaces.sourceString,
  //       },
  //     };
  //   },
  //   wi(spaces) {
  //     return {
  //       kind: "leaf",
  //       type: this.ctorName,
  //       args: [],
  //       source: {
  //         type: "mixed", // don't like this
  //         value: spaces.sourceString,
  //       },
  //     };
  //   },

  //   /*
  // BLOCK V1
  // */
  //   // block_v1(indentation, v1Block, wi) {
  //   //   return {
  //   //     type: "block_v1",
  //   //     children: v1Block.eval(),
  //   //   };
  //   // },
  //   // v1Block_p(
  //   //   frameV1_1,
  //   //   wi1,
  //   //   v2Type,
  //   //   wi2,
  //   //   sepRight,
  //   //   wi3,
  //   //   nl,
  //   //   v1Payload,
  //   //   frameV1_2,
  //   // ) {
  //   //   return {
  //   //     type: "v1Block",
  //   //     // contentTrimmed: v1Payload.sourceString.trim()
  //   //     content: v1Payload.sourceString,
  //   //   };
  //   // },
  // });

  const matched = matcher.match(raw, "document");

  return semantics(matched).node();
}
