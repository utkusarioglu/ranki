export interface FrameV2GrammarConfig {
  tokens: {
    pause: string;
    opener: string;
    closer: string;
    separator: {
      param: string;
    };
  };
}
