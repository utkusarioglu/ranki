import { type WindowRankiConfig } from "./types/ranki.mjs"

export const rankiDefaults: Partial<WindowRankiConfig> = {
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
    listItem: "- ",

    dlDtTags: "DT_TAGS",
    dlDdTags: "DD_TAGS",
  },
}
