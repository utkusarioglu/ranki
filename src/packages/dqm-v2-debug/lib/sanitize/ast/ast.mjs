// import { assertExists } from "_assertions";
import { createSanitizedView } from "./sanitizer.mjs";
import { tryCatch, tryCatchLeap, } from "../../utils/try-catch.mjs";
import { assertExists, assertTryCatchSuccess, } from "../../errors/assertions.mjs";
class AstSanitizedNarrowed {
    node;
    visible;
    constructor(sanitized, features) {
        this.node = sanitized;
        this.visible = features;
    }
    build() {
        const props = this.getProps();
        const children = this.getChildren();
        const stable = this.getStable();
        const hidden = this.getHidden();
        const fields = {
            props,
            children,
            stable,
            hidden,
        };
        return {
            // TODO this is very bad
            key: Date.now().toString(),
            // key: JSON.stringify([
            //   this.visible.children,
            //   this.visible.props,
            //   this.visible.stable,
            // ]),
            fields,
        };
    }
    getHidden() {
        const cpxUnique = tryCatch("getUnique", () => this.cpx(this.node).getUnique());
        const hidden = {
            cpxUnique,
        };
        return hidden;
    }
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
    getProps() {
        const props = {};
        this.visible.props.forEach((id) => {
            switch (id) {
                case "astUnique":
                    // !FIX doesn't work because your class sanitizer needs reflect api
                    props[id] = this.node.getUnique();
                    break;
                case "inlineDepth":
                    props[id] = this.node.getInlineDepth();
                    break;
                case "blockDepth":
                    props[id] = this.node.getBlockDepth();
                    break;
                case "childIndex":
                    props[id] = this.node.getChildIndex();
                    break;
                case "meaning":
                    props[id] = this.node.getMeaning();
                    break;
                case "constructorName":
                    props[id] = tryCatch("constructorName", () => this.node.constructor.name);
                    break;
                case "creationMethod":
                    props[id] = this.node.getCreationMethod();
                    break;
                case "ignoredCount":
                    props[id] = tryCatchLeap(this.node.getIgnoredNodes(), (o) => o.length);
                    break;
                case "kind":
                    props[id] = this.node.getKind();
                    break;
                case "subtreeCount":
                    props[id] = tryCatchLeap(this.node.getSubtreeNodes(), (o) => o.length);
                    break;
                case "childCount":
                    props[id] = tryCatchLeap(this.node.getChildrenNodes(), (o) => o.length);
                    break;
                case "cpxUnique": {
                    props[id] = tryCatch("getUnique", () => this.cpx(this.node).getUnique());
                    break;
                }
                case "creator":
                    props[id] = this.node.getCreator();
                    break;
                case "idListString": {
                    props[id] = tryCatch("getUnique", () => this.cpx(this.node).getIdListString());
                    break;
                }
                case "chainListString": {
                    props[id] = tryCatch("chainListString", () => this.cpx(this.node).getChainListString());
                    break;
                }
            }
        });
        return props;
    }
    recurse(list) {
        if (list.state === "fail") {
            return list;
        }
        const narrowed = list.value.map((n) => {
            const sanitized = createSanitizedView(n);
            return new AstSanitizedNarrowed(sanitized, this.visible).build();
        });
        if (narrowed.length) {
            return tryCatch("narrowed", () => narrowed);
        }
    }
    getChildren() {
        const children = {};
        this.visible.children.forEach((id) => {
            switch (id) {
                case "childrenNodes": {
                    const val = this.recurse(this.node.getChildrenNodes());
                    if (val)
                        children[id] = val;
                    break;
                }
                case "subtreeNodes": {
                    const val = this.recurse(this.node.getSubtreeNodes());
                    if (val)
                        children[id] = val;
                    break;
                }
                case "tokenNodes": {
                    const val = this.recurse(this.node.getTokenNodes());
                    if (val)
                        children[id] = val;
                    break;
                }
                case "spaceNodes": {
                    const val = this.recurse(this.node.getSpaceNodes());
                    if (val)
                        children[id] = val;
                    break;
                }
            }
        });
        return children;
    }
    getStable() {
        const stable = {};
        this.visible.stable.forEach((id) => {
            switch (id) {
                case "sourceString":
                    stable[id] = this.node.getSourceString();
                    break;
                default:
                    throw new Error(`Unrecognized sanitize feature: ${id}`);
            }
        });
        return stable;
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
export function createSanitizedAst(parsed, visible) {
    try {
        if (parsed.state !== "success") {
            return {
                state: "fail",
                error: parsed.error,
            };
        }
        const filteredIds = filterIds(visible);
        const sanitized = sanitizeAst(parsed.data.ast, filteredIds);
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
function filterIds(all) {
    // @ts-expect-error
    return Object.fromEntries(Object.entries(all).map(([k, v]) => {
        // @ts-expect-error
        const b = v.filter((l) => l.visible).map((v) => v.id);
        return [k, b];
    }));
}
