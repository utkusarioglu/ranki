import type {
  ConfigEntryCode,
  DqmConfig,
  DqmConfigPackEntry,
  DqmParseInputString,
  DqmParseInputStructured,
  DqmParseTheater,
  IDqmPlugin,
} from "@dqm/package-dqm-api-v2";

import type { ArrangementTemplateGroup } from "../../components/menus/menu-drawer/templates/arrangement-template/ArrangementTemplate.types.mts";
import type { SingleTemplateGroup } from "../../components/menus/menu-drawer/templates/single-template/SingleTemplate.types.mts";
import type { SanitizedParseResult } from "./dqm.utils.types.mts";

export type ConfigInput = {
  configString: string;
} & DqmConfigPackEntry;

export type CreateDqmParseNeeded =
  | "autoUpdate"
  | "configPack"
  | "inputs"
  | "parsed"
  | "parseEpoch"
  | "pluginSelection";

export type DqmStore = DqmStoreActions & DqmStoreState;

export interface DqmStoreActions {
  parseInput: () => Promise<void>;
  pushNewConfig: () => void;

  pushNewTheater: () => void;
  removeConfigByIndex: (index: number) => void;

  removeTheaterByIndex: (index: number) => void;
  setAllConfig: (configPack: ConfigInput[]) => void;

  setAllInputs: (inputs: DqmParseInputStructured) => void;
  setArrangementTemplates: (list: ArrangementTemplateGroup[]) => void;
  setAutoUpdate: (update: boolean) => void;
  setConfigCodeByIndex: (index: number, code: ConfigEntryCode) => void;

  setConfigValueByIndex: (
    index: number,
    configStr: string,
    config: DqmConfig,
  ) => void;

  setDeferParsing: (defer: boolean) => void;

  setPluginAsInstalled(
    packageIndex: number,
    pluginIndex: number,
    standard: boolean,
  ): void;
  setPluginAsRequested(
    packageIndex: number,
    pluginIndex: number,
    requested: boolean,
  ): void;

  setPluginAsStandard(
    packageIndex: number,
    pluginIndex: number,
    standard: boolean,
  ): void;
  setPluginPackageAsEnabled(pluginIndex: number, enabled: boolean): void;

  setSingleTemplates: (lists: SingleTemplateGroup[]) => void;
  setTheaterDqmByIndex: (index: number, dqm: DqmParseInputString) => void;
  setTheaterNameByIndex: (index: number, theater: DqmParseTheater) => void;
}

export interface DqmStoreState {
  arrangementTemplates: ArrangementTemplateGroup[];
  autoUpdate: boolean;
  configPack: ConfigInput[];
  deferParsing: boolean;
  inputs: DqmParseInputStructured;

  parsed: SanitizedParseResult;
  parseEpoch: number;
  pluginSelection: PluginStoreWrapper[];
  singleTemplates: SingleTemplateGroup[];
}

export interface PluginStoreType {
  description: string;
  installed: boolean;
  name: string;
  packageIndex: number;
  plugin: IDqmPlugin[0];
  pluginIndex: number;

  pluginType: string;
  requested: boolean;
  standard: boolean;
}

export interface PluginStoreWrapper {
  enabled: boolean;
  name: string;
  packageIndex: number;
  plugins: PluginStoreType[];
}

export type SetPluginAsInstalled = DqmStoreActions["setPluginAsInstalled"];

export type SetPluginAsRequested = DqmStoreActions["setPluginAsRequested"];

export type SetPluginAsStandard = DqmStoreActions["setPluginAsStandard"];

export type SetPluginPackageAsEnabled =
  DqmStoreActions["setPluginPackageAsEnabled"];
