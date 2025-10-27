import type * as ohm from "ohm-js";
import type { AstNode } from "@ranki/package-api-v2";
import type { ParseNodeFrameV1 } from "./types.mjs";
import type { ArgsAndParamsV1 } from "./types.mjs";
export declare const actions: {
    node: {
        [x: string]: ohm.Action<ParseNodeFrameV1> | ohm.Action<AstNode> | undefined;
        _iter?: ((this: ohm.IterationNode, ...children: ohm.Node[]) => ParseNodeFrameV1) | undefined;
        _nonterminal?: ((this: ohm.NonterminalNode, ...children: ohm.Node[]) => ParseNodeFrameV1) | undefined;
        _terminal?: ((this: ohm.TerminalNode) => ParseNodeFrameV1) | undefined;
        alnum?: ((this: ohm.NonterminalNode, arg0: ohm.NonterminalNode) => ParseNodeFrameV1) | undefined;
        letter?: ((this: ohm.NonterminalNode, arg0: ohm.NonterminalNode) => ParseNodeFrameV1) | undefined;
        digit?: ((this: ohm.NonterminalNode, arg0: ohm.TerminalNode) => ParseNodeFrameV1) | undefined;
        hexDigit?: ((this: ohm.NonterminalNode, arg0: ohm.NonterminalNode | ohm.TerminalNode) => ParseNodeFrameV1) | undefined;
        ListOf?: ((this: ohm.NonterminalNode, arg0: ohm.NonterminalNode) => ParseNodeFrameV1) | undefined;
        NonemptyListOf?: ((this: ohm.NonterminalNode, arg0: ohm.Node, arg1: ohm.IterationNode, arg2: ohm.IterationNode) => ParseNodeFrameV1) | undefined;
        EmptyListOf?: ((this: ohm.NonterminalNode) => ParseNodeFrameV1) | undefined;
        listOf?: ((this: ohm.NonterminalNode, arg0: ohm.NonterminalNode) => ParseNodeFrameV1) | undefined;
        nonemptyListOf?: ((this: ohm.NonterminalNode, arg0: ohm.Node, arg1: ohm.IterationNode, arg2: ohm.IterationNode) => ParseNodeFrameV1) | undefined;
        emptyListOf?: ((this: ohm.NonterminalNode) => ParseNodeFrameV1) | undefined;
        applySyntactic?: ((this: ohm.NonterminalNode, arg0: ohm.Node) => ParseNodeFrameV1) | undefined;
    };
    creatorName: ohm.ActionDict<string>;
    paramV1: ohm.ActionDict<string>;
    paramsV1: ohm.ActionDict<string[]>;
    shapeAndParamsV1: ohm.ActionDict<ArgsAndParamsV1>;
};
