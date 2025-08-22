export const CONFIGURATION_KEYS = {
  directive: {
    separator: {
      prefix: "DIRECTIVE_PREFIX_SEPARATOR_TYPE",
      param: "DIRECTIVE_PARAMETER_SEPARATOR_TYPE",
      content: "DIRECTIVE_CONTENT_SEPARATOR_TYPE",
    },
  },
  frame: {
    tag: {
      list: "FRAME_TAG_LIST",
    },
    level: "FRAME_LEVEL",
    specs: {
      type: "FRAME_SPECS_TYPE",
    },
    separator: {
      prefix: "FRAME_PREFIX_SEPARATOR_TYPE",
      attribute: "FRAME_ATTRIBUTE_SEPARATOR_TYPE",
      parameter: "FRAME_PARAMETER_SEPARATOR_TYPE",
    },
    // frameTagList: "FRAME_TAG_LIST",
    // frameLevel: "FRAME_LEVEL",
    // frameSpecsType: "FRAME_SPECS_TYPE",
    // frameSeparatorType: "FRAME_SEPARATOR_TYPE",
    // frameTagSeparatorType: "FRAME_TAG_SEPARATOR_TYPE",
    // frameParameterSeparatorType: "FRAME_PARAMETER_SEPARATOR_TYPE",
    // frameAttributeSeparatorType: "FRAME_ATTRIBUTE_SEPARATOR_TYPE",
  },
  line: {
    type: "LINE_TYPE",
    space: {
      pre: "LINE_SPACE_PRE",
      post: "LINE_SPACE_POST",
    },
    heading: {
      degree: "LINE_HEADING_DEGREE",
      space: "LINE_HEADING_TOKEN_SPACES",
    },
  },
};

export const CONFIGURATION_VALUES = {
  frame: {
    level: {
      inline: "inline",
      block: "block",
      empty: "empty",
    },
    specs: {
      type: {
        n: "n",
        p: "p",
        a: "a",
        e: "e",
      },
    },
  },
  line: {
    type: {
      h: "h",
      p: "p",
    },
  },
};

export const PARSE_TYPES = {
  spacePlus: "spacePlus",
  frameTagList: "frame_tag_list",
  frameTag: "frame_tag",
  document: "document",
  section: "section",
  nonemptyList: "non_empty_list",
  directive: "directive",
  iter: "iter",
  sw: "sw",
  wr: "wr",
  terminal: "terminal",
  frame: "frame",
  frameSpecs: "frame_specs",
  paragraph: "paragraph",
  heading: "heading",
  line: "line",
  word: "word",
  number: "number",
  boolean: "boolean",
  sep_multiline: "sep_multiline",
  sep_singleline: "sep_singleline",
  parameters: "parameters",
  parameter: "parameter",
  literalDoubleQuote: "literal_double_quote",
  literalSingleQuote: "literal_single_quote",
};

export const WARNINGS = {
  emptySpaceBefore: "EMPTY_SPACE_BEFORE",
  emptySpaceAfter: "EMPTY_SPACE_AFTER",
};

export const ERRORS = {
  allIsWrong: "ALL_IS_WRONG", // this is here to keep ts happy during designing
};
