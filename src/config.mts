import type { RankiDefaults } from "./types/ranki.d.mts";

export const rankiDefaults: RankiDefaults = {
  features: {},
  tokens: {
    frame: ":::",

    child: " ",
    terminator: ";",
    parameter: ",",

    assignment: ":",

    comment: "% ",
    heading: "# ",

    centeredText: "   ",

    deckSeparator: "::",
    tagSeparator: " ",

    tableHeads: "HEADS",
    tableHeadTags: "HEAD_TAGS",
    tableFoots: "FOOTS",
    tableFootTags: "FOOT_TAGS",
    tableBodyTags: "BODY_TAGS",

    listTags: "LI_TAGS",
    // listItem: "- ",
    listItemSeparator: "-",

    dlDtTags: "DT_TAGS",
    dlDdTags: "DD_TAGS",
  },
};
