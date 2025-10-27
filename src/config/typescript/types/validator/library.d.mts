import type { AstNode, RankiPluginParser, RankiPluginParserValidationFunc, RankiLangParseHandlerCommon, ValidationNode, RankiLangAstContext } from "@ranki/package-api-v2";
export declare class ValidatorLibrary {
    private list;
    addPlugin(plugin: RankiPluginParser): void;
    getValidator(name: string): RankiPluginParserValidationFunc;
    validate<T extends RankiLangParseHandlerCommon>(obj: AstNode, spec: RankiLangAstContext<T>): ValidationNode;
}
