import type {
  DqmParseTheater,
  DqmParseInputString,
  DqmRecord,
  DqmParseInputStructured,
} from "@dqm/package-dqm-api-v2";
import type { TemplateGroupWithList } from "./utils.mts";
import type { AstSanitizationFeature } from "../../utils/dqm.utils.types.mts";

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
  templates: TemplateGroupWithList[];
  arrangements: Arrangement[];

  astDragProps: SanitizationProp[];
  astLineageProps: SanitizationProp[];
  astNoDragProps: SanitizationProp[];

  autoUpdate: boolean;
  inputs: DqmParseInputStructured;
  views: DqmParseInputStructured;
}

export interface CodeStoreActions {
  setAllInputs: (inputs: DqmRecord) => void;
  setAllViewsFromInputs: () => void;

  setAutoUpdate: (update: boolean) => void;

  setTheaterDqmByIndex: (index: number, dqm: DqmParseInputString) => void;
  setTheaterNameByIndex: (index: number, theater: DqmParseTheater) => void;

  pushNewTheater: () => void;
  removeTheaterByIndex: (index: number) => void;

  setDragFeatureList: (feature: SanitizationProp[]) => void;
  setLineageFeatureList: (feature: SanitizationProp[]) => void;
  setNoDragFeatureList: (feature: SanitizationProp[]) => void;

  setTemplates: (lists: TemplateGroupWithList[]) => void;
  setArrangements: (list: Arrangement[]) => void;
}

export type CreateDefaultsReturn = Pick<
  CodeStore,
  "astDragProps" | "astLineageProps" | "astNoDragProps" | "inputs" | "views"
>;

export interface SanitizationProp {
  id: AstSanitizationFeature;
  visible: boolean;
}
