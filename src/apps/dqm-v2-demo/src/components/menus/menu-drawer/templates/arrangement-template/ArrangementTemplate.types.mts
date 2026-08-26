import type { DqmParseInputStructured } from "@dqm/package-dqm-api-v2";

export interface ArrangementTemplate {
  description: string;
  id: string;
  label: string;
  singles: ArrangementTemplateSingleRef[];
}

export interface ArrangementTemplateGroup {
  description: string;
  group: string;
  label: string;
  list: ArrangementTemplate[];
}

export interface ArrangementTemplateSingleRef {
  group: string;
  singleId: string;
  theater: string;
}

export interface WithIndexArrangementTemplates {
  active: string;
  index: number;
  previewOnClick: (inputs: DqmParseInputStructured) => void;
  useOnClick: (inputs: DqmParseInputStructured) => void;
}
