import { createSanitizedView } from "./sanitizer.mjs";
import { tryCatch, tryCatchLeap, } from "../../utils/try-catch.mjs";
import { assertExists, assertTryCatchSuccess, } from "../../errors/assertions.mjs";
class AstSanitizedNarrowed {
    node;
    preferences;
    constructor(sanitized, preferences) {
        this.node = sanitized;
        this.preferences = preferences;
    }
    build() {
        const fields = Object.fromEntries(Object.entries(this.preferences).map(([k, p]) => [k, this.getThings(p)])); // TODO ANY;
        return {
            key: Date.now().toString(),
            fields,
        };
    }
    // DONE
    // private getHidden() {
    //   const cpxUnique = tryCatch("getUnique", () =>
    //     this.cpx(this.node).getUnique(),
    //   );
    //   const hidden: SanitizedNodePartialNew["fields"]["hidden"] = {
    //     cpxUnique,
    //   };
    //   return hidden;
    // }
    cpx(node) {
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
    // private getProps() {
    //   const props: SanitizedNodePartialNew["fields"]["props"] = {};
    //   this.preferences.props.forEach((id) => {
    //     switch (id) {
    //       // DONE
    //       case "astUnique":
    //         // !FIX doesn't work because your class sanitizer needs reflect api
    //         props[id] = this.node.getUnique();
    //         break;
    //       // DONE
    //       case "inlineDepth":
    //         props[id] = this.node.getInlineDepth();
    //         break;
    //       // DONE
    //       case "blockDepth":
    //         props[id] = this.node.getBlockDepth();
    //         break;
    //       // DONE
    //       case "childIndex":
    //         props[id] = this.node.getChildIndex();
    //         break;
    //       // DONE
    //       case "meaning":
    //         props[id] = this.node.getMeaning();
    //         break;
    //       // DONE
    //       case "constructorName":
    //         props[id] = tryCatch(
    //           "constructorName",
    //           () => this.node.constructor.name,
    //         );
    //         break;
    //       // DONE
    //       case "creationMethod":
    //         props[id] = this.node.getCreationMethod();
    //         break;
    //       // DONE
    //       case "ignoredCount":
    //         props[id] = tryCatchLeap(
    //           this.node.getIgnoredNodes(),
    //           (o) => o.length,
    //         );
    //         break;
    //       // DONE
    //       case "kind":
    //         props[id] = this.node.getKind();
    //         break;
    //       // DONE
    //       case "subtreeCount":
    //         props[id] = tryCatchLeap(
    //           this.node.getSubtreeNodes(),
    //           (o) => o.length,
    //         );
    //         break;
    //       // DONE
    //       case "childCount":
    //         props[id] = tryCatchLeap(
    //           this.node.getChildrenNodes(),
    //           (o) => o.length,
    //         );
    //         break;
    //       // DONE
    //       case "cpxUnique": {
    //         props[id] = tryCatch("getUnique", () =>
    //           this.cpx(this.node).getUnique(),
    //         );
    //         break;
    //       }
    //       // DONE
    //       case "creator":
    //         props[id] = this.node.getCreator();
    //         break;
    //       // DONE
    //       case "idListString": {
    //         props[id] = tryCatch("getUnique", () =>
    //           this.cpx(this.node).getIdListString(),
    //         );
    //         break;
    //       }
    //       // DONE
    //       case "chainListString": {
    //         props[id] = tryCatch("chainListString", () =>
    //           this.cpx(this.node).getChainListString(),
    //         );
    //         break;
    //       }
    //     }
    //   });
    //   return props;
    // }
    // private getChildren() {
    //   const children: SanitizedNodePartialNew["fields"]["children"] = {};
    //   this.preferences.children.forEach((id) => {
    //     switch (id) {
    //       // DONE
    //       case "childrenNodes": {
    //         const val = this.recurse(this.node.getChildrenNodes());
    //         if (val) children[id] = val;
    //         break;
    //       }
    //       // DONE
    //       case "subtreeNodes": {
    //         const val = this.recurse(this.node.getSubtreeNodes());
    //         if (val) children[id] = val;
    //         break;
    //       }
    //       // DONE
    //       case "tokenNodes": {
    //         const val = this.recurse(this.node.getTokenNodes());
    //         if (val) children[id] = val;
    //         break;
    //       }
    //       // DONE
    //       case "spaceNodes": {
    //         const val = this.recurse(this.node.getSpaceNodes());
    //         if (val) children[id] = val;
    //         break;
    //       }
    //     }
    //   });
    //   return children;
    // }
    calls = {
        sourceString: () => this.node.getSourceString(),
        cpxUnique: () => {
            const cpxUnique = tryCatch("getUnique", () => this.cpx(this.node).getUnique());
            return cpxUnique;
        },
        astUnique: () => this.node.getUnique(),
        inlineDepth: () => this.node.getInlineDepth(),
        blockDepth: () => this.node.getBlockDepth(),
        childIndex: () => this.node.getChildIndex(),
        meaning: () => this.node.getMeaning(),
        constructorName: () => tryCatch("constructorName", () => this.node.constructor.name),
        creationMethod: () => this.node.getCreationMethod(),
        ignoredCount: () => tryCatchLeap(this.node.getIgnoredNodes(), (o) => o.length),
        kind: () => this.node.getKind(),
        subtreeCount: () => tryCatchLeap(this.node.getSubtreeNodes(), (o) => o.length),
        childCount: () => tryCatchLeap(this.node.getChildrenNodes(), (o) => o.length),
        creator: () => this.node.getCreator(),
        idListString: () => tryCatch("getUnique", () => this.cpx(this.node).getIdListString()),
        chainListString: () => tryCatch("chainListString", () => this.cpx(this.node).getChainListString()),
        childrenNodes: () => this.recurse(this.node.getChildrenNodes()),
        subtreeNodes: () => this.recurse(this.node.getSubtreeNodes()),
        tokenNodes: () => this.recurse(this.node.getTokenNodes()),
        spaceNodes: () => this.recurse(this.node.getSpaceNodes()),
    };
    // private getStable() {
    //   const stable: SanitizedNodePartialNew["fields"]["stable"] = {};
    //   this.preferences.stable.forEach((id) => {
    //     switch (id) {
    //       case "sourceString":
    //         stable[id] = this.node.getSourceString();
    //         break;
    //       default:
    //         throw new Error(`Unrecognized sanitize feature: ${id}`);
    //     }
    //   });
    //   return stable;
    // }
    getThings(props) {
        return Object.fromEntries(props.map((p) => [p, this.calls[p]()]));
    }
    recurse(list) {
        if (list.state === "fail") {
            return list;
        }
        const narrowed = list.value.map((n) => {
            const sanitized = createSanitizedView(n);
            return new AstSanitizedNarrowed(sanitized, this.preferences).build();
        });
        return tryCatch("narrowed", () => narrowed);
        // FIX
        // if (narrowed.length) {
        //   return tryCatch("narrowed", () => narrowed);
        // }
    }
}
function sanitizeAst(parsed, features) {
    return parsed.map((p) => {
        const sanitized = createSanitizedView(p.ast);
        return {
            theater: p.theater,
            sanitized: new AstSanitizedNarrowed(sanitized, features).build(),
        };
    });
}
export function createSanitizedAst(parsed, preferences) {
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
            data: {
                // parsed: parsed.data,
                sanitized,
            },
        };
    }
    catch (e) {
        console.log(e);
        return {
            state: "fail",
            error: e,
        };
    }
}
