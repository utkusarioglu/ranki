export interface PresetGroup {
  groupName: string;
  presets: Preset[];
}

export interface Preset {
  name: string;
  value: string;
}
