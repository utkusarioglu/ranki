import type { CardFaces } from "./types/ranki.d.mts";
import type { WindowRankiConfig } from "./config/config.d.mjs";
import type { CollectionRenderFields } from "./types/collection.d.mts";

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

  summaryPromptPre: {
    name: "Summary-Prompt-Pre",
  },

  clozeText: {
    name: "Text",
  },

  clozeBackExtra: {
    name: "BackExtra",
  },
};

const assignments = {
  "FB-BF": {
    "Front > Back": {
      front: [
        // common.questionStartPre,
        common.frontPromptPre,
        // common.questionEndPre,
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
        // common.answerStartPre,
        common.frontPromptPre,
        // common.answerEndPre,
      ],
    },
  },

  FB: {
    "Front > Back": {
      front: [common.frontPromptPre],
      back: [common.backPromptPre],
    },
  },

  "FB-SB": {
    "Front > Back": {
      front: [common.frontPromptPre],
      back: [common.backPromptPre],
    },
    "Summary > Back": {
      front: [common.summaryPromptPre],
      back: [common.backPromptPre],
    },
  },

  C: {
    Cloze: {
      front: [common.clozeText],
      back: [common.clozeBackExtra],
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
    const aType = assignments[type.replace(ranki.tokens.cardTypesPrefix, "")];
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

    return face;
  }
}
