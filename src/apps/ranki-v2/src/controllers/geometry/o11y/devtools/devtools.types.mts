export interface DevtoolsLogDriver {
  log(value: O11yDevtoolsLogAttributes): void;
}

export interface DevtoolsPause {
  duration: number;
  props: Record<string, unknown>;
}

export interface O11yDevtoolsStaticConfig {
  enabled: boolean;
  sequencer?: {
    stutter?: number;
  };
}

export type O11yDevtoolsLogAttributes = Record<string, unknown>;
