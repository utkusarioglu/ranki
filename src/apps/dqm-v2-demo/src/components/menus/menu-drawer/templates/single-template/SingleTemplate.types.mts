export interface SingleTemplate {
  description: string;
  id: string;
  label: string;
  raw: string;
}

export interface SingleTemplateGroup {
  description: string;
  group: string;
  label: string;
  list: SingleTemplate[];
}
export interface WithIndexSingleTemplate {
  active: string;
  index: number;
  previewOnClick: (raw: string) => void;
  useOnClick: (raw: string) => void;
}
