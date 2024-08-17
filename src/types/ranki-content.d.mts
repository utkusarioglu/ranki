export interface RenderFB {
  type: "+Render-FB";
  "Front-Prompt-Pre": string;
  "Back-Prompt-Pre": string;
  "Question-Start-Pre": string;
  "Question-End-Pre": string;
  "Answer-Start-Pre": string;
  "Answer-End-Pre": string;
}

export type RankiContent = RenderFB;
