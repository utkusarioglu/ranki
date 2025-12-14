import type { DqmParseInputStructured } from "@dqm/package-dqm-api-v2";

export interface ArrangementTemplateSingleRef {
  theater: string;
  group: string;
  singleId: string;
}

export interface ArrangementTemplate {
  id: string;
  label: string;
  description: string;
  singles: ArrangementTemplateSingleRef[];
}

export interface ArrangementTemplateGroup {
  group: string;
  label: string;
  description: string;
  list: ArrangementTemplate[];
}

export interface WithIndexArrangementTemplates {
  useOnClick: (inputs: DqmParseInputStructured) => void;
  previewOnClick: (inputs: DqmParseInputStructured) => void;
  index: number;
  active: string;
}
