// import type { RankiLangParseHandlerFunction } from "@ranki/package-api-v2";
// import { parseSettings } from "./params.mjs";

// export const handler: RankiLangParseHandlerFunction = ({
//   raw,
//   context,
//   // parser,
//   createParser,
//   component,
//   definition,
// }) =>
//   // theaterRaw,
//   // context,
//   // parser,
//   {
//     // const definition = parser.expandedDefinition;
//     // const parserDef = parser.expandedDefinition;
//     // if (definition.type !== "RankiFrameV2") {
//     //   throw new Error(`FRAME V2 HANDLER GIVEN NON-FRAME V2 COMPONENT`);
//     // }
//     // if (definition.chain.length > 1) {
//     //   throw new Error(`MULTI-LENGTH CHAINS NOT YET SUPPORTED`);
//     // }
//     // const component = context.getComponent(parserDef.type, parserDef.chain[0]);

//     const { config, settings } = parseSettings(
//       component.stages.ast.params,
//       context,
//     );

//     const parser = createParser(definition, context);

//     // const cloned = context.setParser(definition, [
//     //   {
//     //     plugins: {
//     //       standards: null,
//     //       requested: null,
//     //     },
//     //   },
//     //   component.stages.ast.directives,
//     //   directives,
//     // ]);

//     // const cloned = context.cloneLang([
//     //   {
//     //     plugins: {
//     //       standards: null,
//     //       requested: null,
//     //     },
//     //   },
//     //   component.stages.ast.directives,
//     //   directives,
//     // ]);
//     // const contextV2 = context.newChild("block");
//     // const contextV2Old: RankiLangAstContext = {
//     //   parser: context.parser,
//     //   astHash: "",
//     //   hooks: cloned.hooks,
//     //   blockDepth: context.blockDepth + 1,
//     //   inlineDepth: context.inlineDepth,
//     //   theater: context.theater,
//     //   role: context.role,
//     //   startRule: context.startRule,
//     // };

//     const merged = context.getMergedConfig();
//     const preprocessed = component.stages.preprocess(raw);

//     const theaterWithContent = [
//       merged.content.prefix,
//       preprocessed,
//       merged.content.suffix,
//     ].join("");

//     // const parsed = cloned.parseAst(theaterWithContent);
//     const ast = parser.callback(theaterWithContent);

//     return {
//       props: {
//         settings,
//         config,
//       },
//       ast,
//     };
//     // return {
//     //   props: {
//     //     settings,
//     //     directives,
//     //   },
//     //   ast: {
//     //     root: parsed.ast
//     //   },
//     //   // ast: parser.callback(theaterWithContent),
//     // };
//   };
