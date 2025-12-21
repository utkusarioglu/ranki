export interface SingleTemplateGroup {
  label: string;
  description: string;
  group: string;
  list: SingleTemplate[];
}

export interface SingleTemplate {
  id: string;
  label: string;
  description: string;
  raw: string;
}
export interface WithIndexSingleTemplate {
  useOnClick: (raw: string) => void;
  previewOnClick: (raw: string) => void;
  index: number;
  active: string;
}
