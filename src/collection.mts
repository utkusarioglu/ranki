import { type WindowRankiConfig, type CardFaces } from "./types/ranki.mjs";
import { type CollectionRenderFields } from "./types/collection.mjs";

const common = {
  questionStartPre: {
    name: "Question-Start-Pre",
  },

  frontPromptPre: {
    name: "Front-Prompt-Pre",
  },

  questionEndPre: {
    name: "Question-End-Pre",
  },

  answerStartPre: {
    name: "Answer-Start-Pre",
  },

  backPromptPre: {
    name: "Back-Prompt-Pre",
  },

  answerEndPre: {
    name: "Answer-End-Pre",
  },
};

const assignments = {
  "+Render-FB-BF": {
    "Front > Back": {
      front: [
        common.questionStartPre,
        common.frontPromptPre,
        common.questionEndPre,
      ],
      back: [
        //
        common.answerStartPre,
        common.backPromptPre,
        common.answerEndPre,
      ],
    },
    "Back > Front": {
      front: [
        common.questionStartPre,
        common.backPromptPre,
        common.questionEndPre,
      ],
      back: [
        //
        common.answerStartPre,
        common.frontPromptPre,
        common.answerEndPre,
      ],
    },
  },
  "+Render-FB": {
    "Front > Back": {
      front: [common.frontPromptPre],
      back: [common.backPromptPre],
    },
  },
};

export class Collection {
  static getFields(
    cardFace: CardFaces,
    ranki: WindowRankiConfig,
  ): CollectionRenderFields {
    const { type, card } = ranki.card;

    // @ts-expect-error
    const aType = assignments[type];
    if (!aType) {
      throw new Error(`Unrecognized anki type: ${type}`);
    }

    const bType = aType[card];
    if (!bType) {
      throw new Error(`Unrecognized anki card: ${card}`);
    }

    const face = bType[cardFace];
    if (!face) {
      throw new Error(`Unrecognized card face: ${cardFace}`);
    }

    console.log(type, card, cardFace);
    return face;
  }
}
