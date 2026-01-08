import type {
  DqmParseInputStructured,
  PluginUrn,
} from "../../export.types.mjs";

export interface IDqmPluginExample {
  title: string;
  description: string;
  inputs: DqmParseInputStructured;
}

export type IDqmPluginExamples = IDqmPluginExample[];

export type GroupedPluginExamples = Record<PluginUrn, IDqmPluginExamples>;
