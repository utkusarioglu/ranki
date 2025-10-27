import type { RankiPluginParser } from "@ranki/package-api-v2";
export declare function expandDependencies(plugins: RankiPluginParser[]): void;
export declare function topologicalSort(plugins: RankiPluginParser[]): RankiPluginParser["meta"]["name"][];
