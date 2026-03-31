import type { DqmAstOutput } from "@dqm/package-dqm-api-v2";
import type { IAstNode } from "@dqm/package-dqm-api-v2";
import type { SanitizedParseResult } from "./dqm.utils.types.mts";
import type {
  SanitizedNodePartialNew,
  SanitizedAstNew,
  SanitizeResultNew,
  SanitizedAstNodeCalls,
  SanitizedAstNodePropKeys,
  SanitizedAstNodeViewMap,
  SanitizedNodePartialFields,
} from "./sanitized-ast-node.types.mts";
import {
  createSanitizedView,
  type ClassSanitizer,
} from "../class-sanitizer/sanitizer.mjs";
import {
  tryCatch,
  tryCatchLeap,
  type TryCatch,
} from "../../utils/try-catch.mjs";
import {
  assertExists,
  assertTryCatchSuccess,
} from "../../errors/assertions.mjs";

class AstSanitizedNarrowed {
  private node: ClassSanitizer<IAstNode>;
  private preferences: SanitizedAstNodeViewMap;
  private calls: SanitizedAstNodeCalls = {
    sourceString: () => this.node.getSourceString(),
    cpxUnique: () => {
      const cpxUnique = tryCatch("getUnique", () =>
        this.cpx(this.node).getUnique(),
      );
      return cpxUnique;
    },
    astUnique: () => this.node.getUnique(),
    inlineDepth: () => this.node.getInlineDepth(),
    blockDepth: () => this.node.getBlockDepth(),
    childIndex: () => this.node.getChildIndex(),
    meaning: () => this.node.getMeaning(),
    constructorName: () =>
      tryCatch("constructorName", () => this.node.constructor.name),
    creationMethod: () => this.node.getCreationMethod(),
    ignoredCount: () =>
      tryCatchLeap(this.node.getIgnoredNodes(), (o) => o.length),
    kind: () => this.node.getKind(),
    subtreeCount: () =>
      tryCatchLeap(this.node.getSubtreeNodes(), (o) => o.length),
    childCount: () =>
      tryCatchLeap(this.node.getChildrenNodes(), (o) => o.length),
    creator: () => this.node.getCreator(),
    idListString: () =>
      tryCatch("getUnique", () => this.cpx(this.node).getIdListString()),
    chainListString: () =>
      tryCatch("chainListString", () =>
        this.cpx(this.node).getChainListString(),
      ),
    childrenNodes: () => this.recurse(this.node.getChildrenNodes()),
    subtreeNodes: () => this.recurse(this.node.getSubtreeNodes()),
    tokenNodes: () => this.recurse(this.node.getTokenNodes()),
    spaceNodes: () => this.recurse(this.node.getSpaceNodes()),
  };

  constructor(
    sanitized: ClassSanitizer<IAstNode>,
    preferences: SanitizedAstNodeViewMap,
  ) {
    this.node = sanitized;
    this.preferences = preferences;
  }

  build(): SanitizedNodePartialNew {
    const fields = Object.fromEntries(
      Object.entries(this.preferences).map(([field, prefs]) => [
        field,
        this.getCalls(prefs),
      ]),
    ) as SanitizedNodePartialFields;
    return {
      key: Date.now().toString(),
      fields,
    };
  }

  private cpx(node: ClassSanitizer<IAstNode>) {
    const cpx = node.getCpx();
    assertTryCatchSuccess(cpx, {
      why: "Cpx is needed for many operations",
    });
    const value = cpx.value;
    assertExists(value, {
      why: "Cpx cannot be null for this request",
    });
    return value;
  }

  private getCalls(props: SanitizedAstNodePropKeys[]) {
    return Object.fromEntries(props.map((p) => [p, this.calls[p]!()]));
  }

  private recurse(list: TryCatch<IAstNode[]>) {
    if (list.state === "fail") {
      return list;
    }

    const narrowed = list.value.map((n) => {
      const sanitized = createSanitizedView<IAstNode>(n);
      return new AstSanitizedNarrowed(sanitized, this.preferences).build();
    });

    return tryCatch("narrowed", () => narrowed);
  }
}

function sanitizeAst(
  parsed: DqmAstOutput,
  features: SanitizedAstNodeViewMap,
): SanitizedAstNew[] {
  return parsed.map((p) => {
    const sanitized = createSanitizedView<IAstNode>(p.ast);
    return {
      theater: p.theater,
      sanitized: new AstSanitizedNarrowed(sanitized, features).build(),
    };
  });
}

export function createSanitizedAst(
  parsed: SanitizedParseResult,
  preferences: SanitizedAstNodeViewMap,
): SanitizeResultNew {
  try {
    if (parsed.state !== "success") {
      return {
        state: "fail",
        error: parsed.error,
      };
    }
    const sanitized = sanitizeAst(parsed.data.ast, preferences);
    return {
      state: "success",
      data: { sanitized },
    };
  } catch (e) {
    console.log(e);
    return {
      state: "fail",
      error: e as any,
    };
  }
}
