import type { RankiLangParseHandlerCommon, RankiLangParsedAst, RankiLangConsolidatedAstReport, RankiLangContextInstance } from "@ranki/package-api-v2";
export declare class AstLibrary {
    private static parsers;
    private static reports;
    parse<T extends RankiLangParseHandlerCommon>(theaterRaw: string, context: RankiLangContextInstance<T>): RankiLangParsedAst;
    private createParser;
    private createNewParser;
    getReports(): RankiLangConsolidatedAstReport;
}
