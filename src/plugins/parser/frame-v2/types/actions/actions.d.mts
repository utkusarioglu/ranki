export declare const actions: {
    node: {
        [x: string]: import("ohm-js").Action<import("@ranki/package-api-v2").AstNode> | import("ohm-js").Action<import("../types/node.mjs").ParseNodeFrameV2> | undefined;
        _iter?: ((this: import("ohm-js").IterationNode, ...children: import("ohm-js").Node[]) => import("@ranki/package-api-v2").AstNode) | undefined;
        _nonterminal?: ((this: import("ohm-js").NonterminalNode, ...children: import("ohm-js").Node[]) => import("@ranki/package-api-v2").AstNode) | undefined;
        _terminal?: ((this: import("ohm-js").TerminalNode) => import("@ranki/package-api-v2").AstNode) | undefined;
        alnum?: ((this: import("ohm-js").NonterminalNode, arg0: import("ohm-js").NonterminalNode) => import("@ranki/package-api-v2").AstNode) | undefined;
        letter?: ((this: import("ohm-js").NonterminalNode, arg0: import("ohm-js").NonterminalNode) => import("@ranki/package-api-v2").AstNode) | undefined;
        digit?: ((this: import("ohm-js").NonterminalNode, arg0: import("ohm-js").TerminalNode) => import("@ranki/package-api-v2").AstNode) | undefined;
        hexDigit?: ((this: import("ohm-js").NonterminalNode, arg0: import("ohm-js").NonterminalNode | import("ohm-js").TerminalNode) => import("@ranki/package-api-v2").AstNode) | undefined;
        ListOf?: ((this: import("ohm-js").NonterminalNode, arg0: import("ohm-js").NonterminalNode) => import("@ranki/package-api-v2").AstNode) | undefined;
        NonemptyListOf?: ((this: import("ohm-js").NonterminalNode, arg0: import("ohm-js").Node, arg1: import("ohm-js").IterationNode, arg2: import("ohm-js").IterationNode) => import("@ranki/package-api-v2").AstNode) | undefined;
        EmptyListOf?: ((this: import("ohm-js").NonterminalNode) => import("@ranki/package-api-v2").AstNode) | undefined;
        listOf?: ((this: import("ohm-js").NonterminalNode, arg0: import("ohm-js").NonterminalNode) => import("@ranki/package-api-v2").AstNode) | undefined;
        nonemptyListOf?: ((this: import("ohm-js").NonterminalNode, arg0: import("ohm-js").Node, arg1: import("ohm-js").IterationNode, arg2: import("ohm-js").IterationNode) => import("@ranki/package-api-v2").AstNode) | undefined;
        emptyListOf?: ((this: import("ohm-js").NonterminalNode) => import("@ranki/package-api-v2").AstNode) | undefined;
        applySyntactic?: ((this: import("ohm-js").NonterminalNode, arg0: import("ohm-js").Node) => import("@ranki/package-api-v2").AstNode) | undefined;
    };
    v2FrameConfig: import("ohm-js").ActionDict<import("../types/args.mjs").NodeArgsFrameV2>;
    frameSpecV2: import("ohm-js").ActionDict<import("../types/args.mjs").FrameSpec[]>;
    creatorName: import("ohm-js").ActionDict<string>;
};
