import type { RankiPluginParser, RankiPluginParserTransformFunc, RankiLangParseHandlerCommon, ValidationNode, TransformNode, RankiLangAstContext } from "@ranki/package-api-v2";
export declare class TransformerLibrary {
    private list;
    addPlugin(p: RankiPluginParser): void;
    getTransformer(name: string): RankiPluginParserTransformFunc;
    transform<T extends RankiLangParseHandlerCommon>(validation: ValidationNode, context: RankiLangAstContext<T>): TransformNode;
}
