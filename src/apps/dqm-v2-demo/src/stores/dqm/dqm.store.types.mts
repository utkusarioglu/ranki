import type {
  DqmParseTheater,
  DqmParseInputString,
  DqmParseInputStructured,
} from "@dqm/package-dqm-api-v2";
import type { ArrangementTemplateGroup } from "../../components/menu/dqm-input-options/templates/arrangement-template/ArrangementTemplate.types.mts";
import type { SingleTemplateGroup } from "../../components/menu/dqm-input-options/templates/single-template/SingleTemplate.types.mts";
import type { ParseResult } from "./dqm.utils.types.mts";

export type DqmStore = DqmStoreState & DqmStoreActions;

export interface DqmStoreState {
  deferParsing: boolean;
  singleTemplates: SingleTemplateGroup[];
  arrangementTemplates: ArrangementTemplateGroup[];

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
}

export type CreateDqmParseNeeded = "autoUpdate" | "parsed" | "inputs";
