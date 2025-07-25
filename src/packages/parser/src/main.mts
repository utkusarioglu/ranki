import * as ohm from "ohm-js";
import * as fs from "node:fs";

export function main(raw: string) {
  const grammar = ohm.grammar(
    fs.readFileSync("./assets/ohm/Ranki2-13.ohm").toString(),
  );
  // const raw = fs.readFileSync("./test/1.ranki").toString();

  const semantics = grammar.createSemantics().addOperation("eval", {
    document(_, section, __) {
      return section.eval();
    },
    nonemptyListOf(a, b, c) {
      return a.eval();
    },
    listOf(s) {
      return s.eval();
    },
    section(s) {
      return s.eval();
    },
    frame_block(a, b, c, d) {
      return [a.eval()];
    },
    frameSpecs(a) {
      return a.eval();
    },
    frameSpecs_n(a, b, c) {
      return [a.eval(), b.eval(), c.eval()];
    },
    sep_multiline(a, b, c) {
      return "sep";
    },
    wr(a, b, c) {
      return b.eval();
    },
    _iter() {
      return this.sourceString + "";
    },
    fr(_) {
      return "fr!";
    },
  });

  const result = grammar.match(raw);
  if (result.succeeded()) {
    const res = semantics(result).eval();
    // console.log(res);
    return res;
  } else {
    console.error(result.message);
    return result.message;
  }
}
