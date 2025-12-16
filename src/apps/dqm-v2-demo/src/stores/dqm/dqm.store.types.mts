import type {
  DqmParseTheater,
  DqmParseInputString,
  DqmParseInputStructured,
  IDqmPlugin,
  DqmConfigPack,
} from "@dqm/package-dqm-api-v2";
import type { ArrangementTemplateGroup } from "../../components/menus/dqm-input-options/templates/arrangement-template/ArrangementTemplate.types.mts";
import type { SingleTemplateGroup } from "../../components/menus/dqm-input-options/templates/single-template/SingleTemplate.types.mts";
import type { ParseResult } from "./dqm.utils.types.mts";

export type DqmStore = DqmStoreState & DqmStoreActions;

export interface PluginStoreType {
  pluginIndex: number;
  pluginType: string;
  packageIndex: number;
  name: string;
  description: string;
  plugin: IDqmPlugin[0];

  installed: boolean;
  standard: boolean;
  requested: boolean;
}

export interface PluginStoreWrapper {
  packageIndex: number;
  name: string;
  plugins: PluginStoreType[];
  enabled: boolean;
}

export interface DqmStoreState {
  deferParsing: boolean;
  singleTemplates: SingleTemplateGroup[];
  arrangementTemplates: ArrangementTemplateGroup[];
  pluginSelection: PluginStoreWrapper[];
  configPack: DqmConfigPack;

  parsed: ParseResult;
  autoUpdate: boolean;
  inputs: DqmParseInputStructured;
}

export interface DqmStoreActions {
  setAllInputs: (inputs: DqmParseInputStructured) => void;
  setAutoUpdate: (update: boolean) => void;

  setTheaterDqmByIndex: (index: number, dqm: DqmParseInputString) => void;
  setTheaterNameByIndex: (index: number, theater: DqmParseTheater) => void;

  pushNewTheater: () => void;
  removeTheaterByIndex: (index: number) => void;

  setSingleTemplates: (lists: SingleTemplateGroup[]) => void;
  setArrangementTemplates: (list: ArrangementTemplateGroup[]) => void;
  parseInput: () => void;
  setDeferParsing: (defer: boolean) => void;

  // setPluginMemberEnabled(
  //   pluginIndex: number,
  //   memberIndex: number,
  //   enabled: boolean,
  // ): void;
  setPluginPackageAsEnabled(pluginIndex: number, enabled: boolean): void;

  setPluginAsInstalled(
    packageIndex: number,
    pluginIndex: number,
    standard: boolean,
  ): void;

  setPluginAsStandard(
    packageIndex: number,
    pluginIndex: number,
    standard: boolean,
  ): void;
  setPluginAsRequested(
    packageIndex: number,
    pluginIndex: number,
    requested: boolean,
  ): void;

  // parsePluginSelectionsConfig: () => void;

  // setPluginInstalled(pluginIndex: number, installed: boolean): void;
}

export type SetPluginAsInstalled = DqmStoreActions["setPluginAsInstalled"];

export type SetPluginPackageAsEnabled =
  DqmStoreActions["setPluginPackageAsEnabled"];
export type SetPluginAsStandard = DqmStoreActions["setPluginAsStandard"];
export type SetPluginAsRequested = DqmStoreActions["setPluginAsRequested"];

// export type SetPluginInstalled = DqmStoreActions["setPluginInstalled"];

export type CreateDqmParseNeeded =
  | "autoUpdate"
  | "parsed"
  | "inputs"
  | "pluginSelection"
  | "configPack";
