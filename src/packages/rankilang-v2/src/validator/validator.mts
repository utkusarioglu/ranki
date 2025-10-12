import type {
  AstNode,
  RankiLangParseHandlerCommon,
  RankiLangParseSpecs,
} from "@ranki/package-api-v2";

export function validate<T extends RankiLangParseHandlerCommon>(
  obj: AstNode,
  spec: RankiLangParseSpecs<T>,
) {
  if (obj.kind === "parent") {
    return {
      validation: {
        warnings: {
          noValidator: true,
        },
        errors: {
          noValidator: true,
        },
      },
      ...obj,
      children: obj.children.map((c) => validate(c, spec)),
    };
  } else {
    return {
      validation: {
        warnings: {
          noValidator: true,
        },
        errors: {
          noValidator: true,
        },
      },
      ...obj,
    };
  }
}
