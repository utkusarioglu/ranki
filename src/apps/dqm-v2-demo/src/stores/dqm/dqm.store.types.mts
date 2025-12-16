import type {
  DqmParseTheater,
  DqmParseInputString,
  DqmParseInputStructured,
  DqmConfigPack,
  IDqmPlugin,
} from "@dqm/package-dqm-api-v2";
import type { ArrangementTemplateGroup } from "../../components/menus/dqm-input-options/templates/arrangement-template/ArrangementTemplate.types.mts";
import type { SingleTemplateGroup } from "../../components/menus/dqm-input-options/templates/single-template/SingleTemplate.types.mts";
import type { ParseResult } from "./dqm.utils.types.mts";

export type DqmStore = DqmStoreState & DqmStoreActions;

export interface PluginMember {
  memberIndex: number;
  memberType: string;
  pluginIndex: number;
  name: string;
  description: string;
  enabled: boolean;
  member: IDqmPlugin[0];
}

export interface PluginData {
  pluginIndex: number;
  name: string;
  enabled: boolean;
  installed: boolean;
  members: PluginMember[];
}

export interface DqmStoreState {
  deferParsing: boolean;
  singleTemplates: SingleTemplateGroup[];
  arrangementTemplates: ArrangementTemplateGroup[];
  pluginSelection: PluginData[];
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

  setPluginMemberEnabled(
    pluginIndex: number,
    memberIndex: number,
    enabled: boolean,
  ): void;
  setPluginEnabled(pluginIndex: number, enabled: boolean): void;
  setPluginInstalled(pluginIndex: number, installed: boolean): void;
}

export type SetPluginMemberEnabled = DqmStoreActions["setPluginMemberEnabled"];

export type SetPluginEnabled = DqmStoreActions["setPluginEnabled"];

export type SetPluginInstalled = DqmStoreActions["setPluginInstalled"];

export type CreateDqmParseNeeded =
  | "autoUpdate"
  | "parsed"
  | "inputs"
  | "pluginSelection"
  | "configPack";
