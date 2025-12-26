export interface ICpsParamValueItem {
  name: string;
  subtype?: string;
  type: string;
  value: any;
  defaultValue: any;
}

export type ICpsParamValue = ICpsParamValueItem[];
