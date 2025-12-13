import type {
  DqmParseTheater,
  DqmParseInputString,
  DqmRecord,
  DqmParseInputStructured,
  DqmParseOutput,
} from "@dqm/package-dqm-api-v2";

export interface TemplateGroup {
  label: string;
  description: string;
  group: string;
}

export interface TemplateTextFetched {
  label: string;
  description: string;
  raw: string;
}

export type TemplateTextProcessed = TemplateTextFetched & {
  id: string;
};

export interface ArrangementTemplateRef {
  theater: string;
  group: string;
  index: number;
}

export interface Arrangement {
  label: string;
  description: string;
  templates: ArrangementTemplateRef[];
}

export type CodeStore = CodeStoreState & CodeStoreActions;

export interface CodeStoreState {
  deferParsing: boolean;
  templates: TemplateGroupWithList[];
  arrangements: Arrangement[];

  parsed: ParseResult;
  autoUpdate: boolean;
  inputs: DqmParseInputStructured;
}

interface SanitizeResultSuccess {
  state: "success";
  data: DqmParseOutput;
}

interface ParseResultFail {
  state: "fail";
  error: string;
}

export type ParseResult = SanitizeResultSuccess | ParseResultFail;

export interface CodeStoreActions {
  setAllInputs: (inputs: DqmRecord) => void;
  setAutoUpdate: (update: boolean) => void;

  setTheaterDqmByIndex: (index: number, dqm: DqmParseInputString) => void;
  setTheaterNameByIndex: (index: number, theater: DqmParseTheater) => void;

  pushNewTheater: () => void;
  removeTheaterByIndex: (index: number) => void;

  setTemplates: (lists: TemplateGroupWithList[]) => void;
  setArrangements: (list: Arrangement[]) => void;
  parseInput: () => void;
  setDeferParsing: (defer: boolean) => void;
}

export type TemplateGroupWithList = TemplateGroup & {
  list: TemplateTextProcessed[];
};
